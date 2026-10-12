import { env } from 'cloudflare:workers';
import { isCorrect, parseAnswer, topicById } from './curriculum';
import { generateQuestion } from './question-engine';
import { authenticateTeacher, loginTeacher, logoutTeacher } from './teacher-auth';
const DAY=86400000;
const cookieName='mathhub_student';
function db(){if(!env.DB)throw new Error('Progress storage is not available. Please try again shortly.');return env.DB;}
function json(data:unknown,status=200,headers:Record<string,string>={}){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});}
function fail(message:string,status=400){return json({error:message},status);}
function cookie(value:string,age=30*86400){return `${cookieName}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;}
async function hash(value:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');}
async function identity(req:Request){const raw=(req.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(!raw)return null;return db().prepare('SELECT s.* FROM students s JOIN sessions se ON se.student_id=s.id WHERE se.token_hash=? AND se.expires_at>?').bind(await hash(raw),Date.now()).first<any>();}
function teacherError(req:Request){return fail('Enter your private teacher code to open this dashboard.',req.headers.get('oai-authenticated-user-id')?403:401);}
async function progressFor(id:string){const results=await db().batch([
 db().prepare('SELECT topic_id, learned, guided, updated_at FROM progress WHERE student_id=?').bind(id),
 db().prepare('SELECT topic_id, SUM(attempts) attempts, SUM(correct) correct, SUM(independent) independent, SUM(hint_used) hints, MAX(updated_at) updated_at FROM questions WHERE student_id=? GROUP BY topic_id').bind(id)
]);const map:Record<string,any>={};for(const row of results[0].results as any[]){map[row.topic_id]={topicId:row.topic_id,learned:!!row.learned,guided:!!row.guided,attempts:0,correct:0,independent:0,hints:0,updatedAt:row.updated_at};}for(const row of results[1].results as any[]){map[row.topic_id]={learned:false,guided:false,...map[row.topic_id],topicId:row.topic_id,attempts:row.attempts||0,correct:row.correct||0,independent:row.independent||0,hints:row.hints||0,updatedAt:row.updated_at};}return map;}
function studentView(s:any){return{id:s.id,firstName:s.first_name,lastName:s.last_name,grade:s.grade,currentTopic:s.current_topic,currentStage:s.current_stage,helpRequested:!!s.help_requested,helpTopic:s.help_topic};}
function publicQuestion(row:any){const q=generateQuestion(row.topic_id,row.seed,row.level);return{id:row.id,prompt:q.prompt,expression:q.expression,unit:q.unit,note:q.note,level:row.level,attempts:row.attempts,hint:row.hint_used?q.hint:undefined,correct:!!row.correct,revealed:!!row.revealed,steps:row.correct||row.revealed?q.steps:undefined};}
export async function handleGet(req:Request,action:string):Promise<Response>{try{

 if(action==='auth-options')return json({accountLogin:true});
 if(action==='health')return json({ok:true,name:'MathHub',courses:6,teacherConfigured:!!env.TEACHER_CODE_SHA256});
 if(action==='session'){const s=await identity(req);return json(s?{student:studentView(s),progress:await progressFor(s.id)}:{student:null,progress:{}});}
 if(action==='teacher'){
  if(!await authenticateTeacher(req))return teacherError(req);
  const [roster,totals,lessons]=await db().batch([
   db().prepare('SELECT id,first_name,last_name,grade,current_topic,current_stage,help_requested,help_topic,last_seen,joined_at FROM students ORDER BY last_seen DESC LIMIT 2000'),
   db().prepare('SELECT student_id,topic_id,SUM(attempts) attempts,SUM(correct) correct,SUM(independent) independent,SUM(hint_used) hints,MAX(updated_at) updated_at FROM questions GROUP BY student_id,topic_id'),
   db().prepare('SELECT student_id,topic_id,learned,guided FROM progress')
  ]);
  const by:Record<string,Record<string,any>>={};
  for(const p of lessons.results as any[]){(by[p.student_id]??={})[p.topic_id]={learned:!!p.learned,guided:!!p.guided,attempts:0,correct:0,independent:0,hints:0};}
  for(const p of totals.results as any[]){const m=by[p.student_id]??={};m[p.topic_id]={...m[p.topic_id],attempts:p.attempts||0,correct:p.correct||0,independent:p.independent||0,hints:p.hints||0,updatedAt:p.updated_at};}
  return json({students:(roster.results as any[]).map(s=>({...studentView(s),lastSeen:s.last_seen,joinedAt:s.joined_at,progress:by[s.id]||{}})),updatedAt:Date.now()});
 }
 return fail('Page not found.',404);
 }catch(e){console.error('MathHub GET failed',e);return fail('Unable to load progress right now. Please try again.',503);}}
export async function handlePost(req:Request,action:string):Promise<Response>{try{
 const origin=req.headers.get('Origin');if(origin!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return fail('Please use the portal to submit this request.',403);
 if(!req.headers.get('content-type')?.includes('application/json'))return fail('Expected a JSON request.',415);
 const raw=await req.text();if(raw.length>4096)return fail('Request is too large.',413);
 let body:any;try{body=JSON.parse(raw);}catch{return fail('Invalid request.');}if(!body||typeof body!=='object'||Array.isArray(body))return fail('Invalid request.');
 if(action==='teacher-login'||action==='teacher-logout'){
  if(origin!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')return fail('Please use the teacher dashboard to submit this request.',403);
  return action==='teacher-login'?await loginTeacher(req,body):await logoutTeacher(req);
 }
 if(action==='join'){
  const clean=(v:unknown)=>typeof v==='string'?v.trim().replace(/\s+/g,' ').normalize('NFKC'):'';
  const first=clean(body.firstName),last=clean(body.lastName),valid=(n:string)=>n.length>=1&&n.length<=50&&/^[\p{L}\p{M} .’'\-]+$/u.test(n)&&/\p{L}/u.test(n);
  if(!valid(first)||!valid(last))return fail('Enter your first and last name using letters, spaces, hyphens, or apostrophes.');
  const now=Date.now(),key=(first+'|'+last).toLocaleLowerCase('en-US'),grade=[6,7,8,9,10,11].includes(body.grade)?body.grade:6;
  await db().prepare('INSERT INTO students (id,name_key,first_name,last_name,grade,joined_at,last_seen) VALUES (?,?,?,?,?,?,?) ON CONFLICT(name_key) DO UPDATE SET last_seen=excluded.last_seen').bind(crypto.randomUUID(),key,first,last,grade,now,now).run();
  const student=await db().prepare('SELECT * FROM students WHERE name_key=?').bind(key).first<any>();
  const token=crypto.randomUUID()+crypto.randomUUID();await db().prepare('INSERT INTO sessions(token_hash,student_id,expires_at) VALUES (?,?,?)').bind(await hash(token),student.id,now+30*DAY).run();
  await db().prepare('DELETE FROM sessions WHERE expires_at<?').bind(now).run();
  return json({student:studentView(student),progress:await progressFor(student.id)},200,{'Set-Cookie':cookie(token)});
 }
 if(action==='logout'){const rawToken=(req.headers.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(rawToken)await db().prepare('DELETE FROM sessions WHERE token_hash=?').bind(await hash(rawToken)).run();return json({ok:true},200,{'Set-Cookie':cookie('',0)});}
 if(action==='remove-student'){
  if(!await authenticateTeacher(req))return teacherError(req);
  if(typeof body.studentId!=='string')return fail('Choose a student.');
  const target=await db().prepare('SELECT id FROM students WHERE id=?').bind(body.studentId).first();
  if(!target)return fail('Student not found.',404);
  await db().batch([
   db().prepare('DELETE FROM sessions WHERE student_id=?').bind(body.studentId),
   db().prepare('DELETE FROM questions WHERE student_id=?').bind(body.studentId),
   db().prepare('DELETE FROM progress WHERE student_id=?').bind(body.studentId),
   db().prepare('DELETE FROM students WHERE id=?').bind(body.studentId)
  ]);return json({ok:true});
 }
 if(action==='resolve-help'){
  if(!await authenticateTeacher(req))return teacherError(req);if(typeof body.studentId!=='string')return fail('Choose a student.');
  await db().prepare('UPDATE students SET help_requested=0,help_topic=NULL WHERE id=?').bind(body.studentId).run();return json({ok:true});
 }
 const s=await identity(req);if(!s)return fail('Please enter your name to continue.',401);
 const now=Date.now();
 if(action==='activity'){
  const topic=typeof body.topicId==='string'?topicById(body.topicId):undefined,stage=['explore','learn','guided','practice','progress'].includes(body.stage)?body.stage:'explore',grade=[6,7,8,9,10,11].includes(body.grade)?body.grade:s.grade;
  await db().prepare('UPDATE students SET current_topic=?,current_stage=?,grade=?,last_seen=? WHERE id=?').bind(topic?.id||null,stage,grade,now,s.id).run();return json({ok:true});
 }
 if(action==='help'){await db().prepare('UPDATE students SET help_requested=?,help_topic=?,last_seen=? WHERE id=?').bind(body.requested===false?0:1,body.requested===false?null:(topicById(body.topicId)?.id||s.current_topic),now,s.id).run();return json({ok:true});}
 if(action==='lesson'){
  const topic=topicById(body.topicId);if(!topic)return fail('Choose a valid topic.');const learned=body.stage==='learn'?1:0,guided=body.stage==='guided'?1:0;if(!learned&&!guided)return fail('Choose a lesson stage.');
  await db().prepare('INSERT INTO progress(id,student_id,topic_id,learned,guided,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(student_id,topic_id) DO UPDATE SET learned=MAX(progress.learned,excluded.learned),guided=MAX(progress.guided,excluded.guided),updated_at=excluded.updated_at').bind(crypto.randomUUID(),s.id,topic.id,learned,guided,now).run();
  return json({progress:await progressFor(s.id)});
 }
 if(action==='question'){
  const topic=topicById(body.topicId);if(!topic)return fail('Choose a valid topic.');
  if(!body.fresh){const active=await db().prepare('SELECT * FROM questions WHERE student_id=? AND topic_id=? AND correct=0 AND revealed=0 ORDER BY created_at DESC LIMIT 1').bind(s.id,topic.id).first<any>();if(active)return json({question:publicQuestion(active)});}
  const recent=await db().prepare('SELECT COUNT(*) count FROM questions WHERE student_id=? AND created_at>?').bind(s.id,now-60000).first<any>();if(recent.count>=40)return fail('Take a moment with your current question, then try again.',429);
  const tally=await db().prepare('SELECT SUM(independent) count FROM questions WHERE student_id=? AND topic_id=?').bind(s.id,topic.id).first<any>();
  const level=Math.min(3,1+Math.floor((tally?.count||0)/2)),seed=crypto.getRandomValues(new Uint32Array(1))[0],id=crypto.randomUUID();
  await db().prepare('INSERT INTO questions(id,student_id,topic_id,seed,level,created_at,updated_at) VALUES (?,?,?,?,?,?,?)').bind(id,s.id,topic.id,seed,level,now,now).run();
  return json({question:publicQuestion({id,topic_id:topic.id,seed,level,attempts:0,hint_used:0,correct:0,revealed:0})});
 }
 if(['answer','hint','solution'].includes(action)){
  const row=await db().prepare('SELECT * FROM questions WHERE id=? AND student_id=?').bind(typeof body.questionId==='string'?body.questionId:'',s.id).first<any>();if(!row)return fail('This question was not found. Please load another question.',404);
  const q=generateQuestion(row.topic_id,row.seed,row.level);
  if(action==='hint'){await db().prepare('UPDATE questions SET hint_used=1,updated_at=? WHERE id=? AND correct=0 AND revealed=0').bind(now,row.id).run();return json({hint:q.hint});}
  if(action==='solution'){await db().prepare('UPDATE questions SET revealed=1,updated_at=? WHERE id=? AND correct=0').bind(now,row.id).run();return json({steps:q.steps,answer:q.answer,progress:await progressFor(s.id)});}
  if(row.correct)return json({correct:true,independent:!!row.independent,steps:q.steps,progress:await progressFor(s.id)});
  if(row.revealed)return fail('You have reviewed this solution. Try a fresh question to practice on your own.');
  if(typeof body.answer!=='string'||parseAnswer(body.answer)===null)return fail('Enter a number, decimal, or fraction, such as −3, 0.5, or 1/2.');
  const correct=isCorrect(body.answer,q.answer);
  const updated=await db().prepare('UPDATE questions SET attempts=attempts+1,correct=?,independent=CASE WHEN attempts=0 AND hint_used=0 AND revealed=0 THEN ? ELSE 0 END,last_answer=?,updated_at=? WHERE id=? AND student_id=? AND correct=0 AND revealed=0 RETURNING *').bind(correct?1:0,correct?1:0,body.answer.slice(0,80),now,row.id,s.id).first<any>();
  if(!updated)return fail('This question has already been checked. Load a fresh question.');
  await db().prepare('UPDATE students SET last_seen=?,current_topic=?,current_stage=? WHERE id=?').bind(now,row.topic_id,'practice',s.id).run();
  return json({correct,independent:!!updated.independent,attempts:updated.attempts,steps:correct?q.steps:undefined,message:correct?'You got it!':`Not quite yet. ${updated.attempts>1?q.hint:'Check the operation and try again. You can also ask for a hint.'}`,progress:await progressFor(s.id)});
 }
 return fail('Action not found.',404);
 }catch(e){console.error('MathHub POST failed',e);return fail('We could not save that just now. Your answer is still on screen; please try again.',503);}}
