import assert from 'node:assert/strict';
import {extraOracle} from './mathhub-oracles.mjs';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';
const native=process.argv.includes('--sites');
const out=new URL(native?'../work/sites-verification/':'../work/cloudflare-verification/',import.meta.url);await mkdir(out,{recursive:true});
for(const name of ['curriculum','question-engine','extra-topics','high-school-topics','extra-questions','high-school-questions','question-utils','teacher-auth','server']){let source=await readFile(new URL(`../${!native&&['server','teacher-auth'].includes(name)?'cloudflare':'app'}/${name}.ts`,import.meta.url),'utf8');source=source.replace("'cloudflare:workers'","'./test-env.mjs'").replace(/(['"])(?:\.\.\/app\/|\.\/)([a-z-]+)\1/g,(_,quote,name)=>`${quote}./${name}.mjs${quote}`);await writeFile(new URL(`${name}.mjs`,out),ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);}
await writeFile(new URL('test-env.mjs',out),"export const env={DB:null,TEACHER_EMAIL:'teacher@example.test'};");
const {TOPICS,isCorrect,parseAnswer}=await import(new URL('curriculum.mjs',out));
const {generateQuestion}=await import(new URL('question-engine.mjs',out));
const nums=s=>(s||'').replaceAll('−','-').match(/-?\d+(?:\.\d+)?/g)?.map(Number)||[];
function oracle(id,q){const e=nums(q.expression),p=nums(q.prompt);switch(id){
 case'6-order':return e[0]*(e[1]+e[2])-e[3];
 case'6-fractions':return q.expression.includes('÷')?e[0]/e[1]/e[2]:q.expression.includes('+')?e[0]/e[1]+e[2]/e[3]:e[0]*e[1];
 case'6-ratios':return p[1]/p[0]*p[2];case'6-percent':return e[0]/100*e[1];
 case'6-integers':return q.expression?Math.abs(e[0]):Math.max(...p);
 case'6-equations':return q.expression?e[1]-e[0]:p[0]*p[2]+p[1];
 case'6-geometry':return q.prompt.includes('triangle')?p[0]*p[1]/2:p[0]*p[1]*p[2];
 case'6-statistics':return q.prompt.includes('mean')?p.reduce((a,b)=>a+b,0)/p.length:q.prompt.includes('median')?p.sort((a,b)=>a-b)[2]:Math.max(...p)-Math.min(...p);
 case'7-integers':return q.expression.includes('×')?e[0]*e[1]:e[0]+e[1];
 case'7-rational':return e[0]/e[1]+e[2]/e[3];case'7-proportions':return p[0]/p[1]*p[2];
 case'7-percent':return p[0]*(1+(q.prompt.includes('increases')?1:-1)*p[1]/100);
 case'7-expressions':return e[0]+e[2];case'7-equations':return(e[2]-e[1])/e[0];
 case'7-geometry':return q.prompt.includes('supplementary')?180-p[0]:Number((q.prompt.includes('area')?3.14*p[0]**2:2*3.14*p[0]).toFixed(2));
 case'7-probability':return p[0]/p.reduce((a,b)=>a+b,0);
 case'8-exponents':return q.prompt.includes('exponent?')?e[1]+e[3]:e[0]*10**e[2];
 case'8-roots':return q.expression?Math.sqrt(e[0]):Math.floor(Math.sqrt(p[0]));
 case'8-equations':return(e[3]-e[1])/(e[0]-e[2]);
 case'8-slope':return q.prompt.includes('through')?(p[3]-p[1])/(p[2]-p[0]):p[0]*p[2]+p[1];
 case'8-functions':return p[0]*p[2]-p[1];
 case'8-systems':{const x=(e[2]-e[1])/(e[0]-1);return q.prompt.includes('y-coordinate')?e[0]*x+e[1]:x;}
 case'8-pythagorean':return q.prompt.includes('one leg')?Math.sqrt(p[0]**2-p[1]**2):Math.sqrt(p[0]**2+p[1]**2);
 case'8-transformations':return q.prompt.includes('moves')?p[0]+p[2]:q.prompt.includes('Reflect')?-p[1]:p[0]*p[2];
 default:return extraOracle(id,q);
}}
assert.equal(TOPICS.length,72);for(const g of [6,7,8,9,10,11])assert.equal(TOPICS.filter(t=>t.grade===g).length,12);
let checked=0;for(const t of TOPICS){assert.equal(t.rules.length,3);for(let i=1;i<=180;i++){const q=generateQuestion(t.id,(i*2654435761)>>>0,1+i%3),expected=oracle(t.id,q);assert.ok(Math.abs(q.answer-expected)<1e-7,`${t.id}: ${q.prompt} ${q.expression}; expected ${expected}, got ${q.answer}`);assert.ok(Number.isFinite(q.answer));assert.ok(q.steps.length>=2&&q.steps.every(s=>s.ask&&s.math&&Number.isFinite(s.answer)));assert.ok(isCorrect(String(expected),q.answer));assert.ok(isCorrect(expected.toFixed(6),q.answer));assert.equal(isCorrect(String(q.answer+1),q.answer),false);checked++;}}
for(const [raw,expected] of [['3/4',.75],['-1 1/2',-1.5],['−0.5',-.5],['1,000',1000],['.25',.25]])assert.equal(parseAnswer(raw),expected);
for(const raw of ['','1/0','abc','Infinity','3+4','1e999'])assert.equal(parseAnswer(raw),null);
console.log(`PASS: ${checked} independently checked math questions across all 72 topics; fraction/decimal validation.`);
const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');for(const name of (await readdir(new URL('../drizzle/',import.meta.url))).filter(n=>n.endsWith('.sql')).sort())sqlite.exec(await readFile(new URL(`../drizzle/${name}`,import.meta.url),'utf8'));
class Statement{constructor(sql,params=[]){this.sql=sql;this.params=params;}bind(...p){return new Statement(this.sql,p);}async first(){return sqlite.prepare(this.sql).get(...this.params)||null;}async all(){return{results:sqlite.prepare(this.sql).all(...this.params),success:true};}async run(){const r=sqlite.prepare(this.sql).run(...this.params);return{success:true,meta:{changes:r.changes}};}}
const {env}=await import(new URL('test-env.mjs',out));env.DB={prepare:sql=>new Statement(sql),batch:async stmts=>Promise.all(stmts.map(s=>s.all()))};
const server=await import(new URL('server.mjs',out)); const {handleGet,handlePost}=native?server:server.createHandlers(env);
async function call(action,body,ck='',headers={}){const req=new Request(`https://math.test/api/${action}`,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json','Origin':'https://math.test'}),...(ck?{Cookie:ck}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body)});const res=await(body===undefined?handleGet(req,action):handlePost(req,action));return{status:res.status,data:await res.json(),cookie:res.headers.get('Set-Cookie')?.split(';')[0]};}
const fixtureCode='TEST-ONLY-CODE-1234';
async function digest(value){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');}
const fixtureHash=await digest(fixtureCode.replaceAll('-',''));
env.TEACHER_CODE_SHA256=fixtureHash;
const ownerSession=await call('teacher-login',{code:fixtureCode});
assert.equal(ownerSession.status,200);
const teacher={Cookie:ownerSession.cookie};
const spoof={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'teacher@example.test'};
assert.equal((await call('teacher',undefined,'',spoof)).status,native?200:401,'Sites trusts platform identity; standalone rejects identity headers');

assert.equal((await call('teacher')).status,401);assert.equal((await call('teacher',undefined,'',{'oai-authenticated-user-id':'other','oai-authenticated-user-email':'other@example.test'})).status,native?403:401);
assert.equal((await call('join',{firstName:'<script>',lastName:'x'})).status,400);
assert.equal((await call('join',{firstName:'Test',lastName:'Learner'},'',{Origin:'https://evil.test'})).status,403);
let joined=await call('join',{firstName:'Zoë',lastName:"O'Neil",grade:6});assert.equal(joined.status,200);assert.ok(joined.cookie);const studentId=joined.data.student.id,ck=joined.cookie;
assert.equal((await call('session',undefined,ck)).data.student.firstName,'Zoë');assert.equal((await call('question',{topicId:'6-order'})).status,401);
assert.equal((await call('teacher',undefined,ck)).status,401);
assert.equal((await call('lesson',{topicId:'6-order',stage:'learn'},ck)).status,200);await call('lesson',{topicId:'6-order',stage:'guided'},ck);
async function next(topic='6-order'){const res=await call('question',{topicId:topic,fresh:true},ck);assert.equal(res.status,200);assert.equal(res.data.question.answer,undefined);assert.equal(res.data.question.steps,undefined);const row=sqlite.prepare('SELECT * FROM questions WHERE id=?').get(res.data.question.id);return{row,q:generateQuestion(row.topic_id,row.seed,row.level),id:row.id};}
let nq=await next();assert.equal((await call('question',{topicId:'6-order'},ck)).data.question.id,nq.id);
let answer=await call('answer',{questionId:nq.id,answer:String(nq.q.answer),correct:false},ck);assert.equal(answer.data.correct,true);assert.equal(answer.data.independent,true);
await call('answer',{questionId:nq.id,answer:String(nq.q.answer)},ck);assert.equal(sqlite.prepare('SELECT attempts FROM questions WHERE id=?').get(nq.id).attempts,1);
nq=await next();answer=await call('answer',{questionId:nq.id,answer:String(nq.q.answer+1),correct:true},ck);assert.equal(answer.data.correct,false);answer=await call('answer',{questionId:nq.id,answer:String(nq.q.answer)},ck);assert.equal(answer.data.correct,true);assert.equal(answer.data.independent,false);
nq=await next();await call('hint',{questionId:nq.id},ck);answer=await call('answer',{questionId:nq.id,answer:String(nq.q.answer)},ck);assert.equal(answer.data.independent,false);
nq=await next();await call('solution',{questionId:nq.id},ck);assert.equal((await call('answer',{questionId:nq.id,answer:String(nq.q.answer)},ck)).status,400);
const other=await call('join',{firstName:'Other',lastName:'Learner',grade:7});assert.equal((await call('answer',{questionId:nq.id,answer:'5'},other.cookie)).status,404);assert.equal((await call('resolve-help',{studentId},ck)).status,401);
for(const t of TOPICS){sqlite.prepare('UPDATE questions SET created_at=created_at-61000 WHERE student_id=?').run(studentId);const item=await next(t.id);const result=await call('answer',{questionId:item.id,answer:String(item.q.answer)},ck);assert.equal(result.data.correct,true,`API scoring ${t.id}`);}
let restored=await call('join',{firstName:' ZOË ',lastName:"o'neil",grade:8});assert.equal(restored.data.student.id,studentId);assert.equal(Object.keys(restored.data.progress).length,72);assert.ok(restored.data.progress['6-order'].learned&&restored.data.progress['6-order'].guided);
await call('activity',{topicId:'7-equations',stage:'guided',grade:7},ck);await call('help',{requested:true,topicId:'7-equations'},ck);await call('activity',{topicId:'8-functions',stage:'learn',grade:8},ck);
const dashboard=await call('teacher',undefined,'',teacher);assert.equal(dashboard.status,200);const learner=dashboard.data.students.find(s=>s.id===studentId);assert.equal(learner.helpTopic,'7-equations');assert.equal(learner.currentTopic,'8-functions');assert.equal(learner.helpRequested,true);assert.equal(Object.keys(learner.progress).length,72);
await call('resolve-help',{studentId},'',teacher);assert.equal((await call('session',undefined,ck)).data.student.helpRequested,false);
await call('logout',{},ck);assert.equal((await call('session',undefined,ck)).data.student,null);assert.ok((await call('session',undefined,restored.cookie)).data.student);
console.log('PASS: D1 migrations, name-only entry, cross-device resume, protected teacher roster, ownership, CSRF checks, answer scoring, retry/hint/solution rules, no duplicate credit, activity, help, and logout.');

delete env.TEACHER_CODE_SHA256;
const teacherClient={'cf-connecting-ip':'192.0.2.20'};
assert.equal((await call('teacher-login',{code:fixtureCode},'',teacherClient)).status,503,'missing configuration fails closed');
env.TEACHER_CODE_SHA256=fixtureHash;
assert.equal((await call('teacher-login',{code:'not-the-code'},'',teacherClient)).status,401);
assert.equal((await call('teacher-login',{code:fixtureCode},'',{...teacherClient,Origin:'https://evil.test'})).status,403);
assert.equal((await call('teacher-login',{code:fixtureCode},'',{...teacherClient,'sec-fetch-site':'cross-site'})).status,403);
const noOrigin=new Request('https://math.test/api/teacher-login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:fixtureCode})});
assert.equal((await handlePost(noOrigin,'teacher-login')).status,403);
let codeLogin=await call('teacher-login',{code:' test-only-code-1234 '},'',teacherClient);
assert.equal(codeLogin.status,200);assert.match(codeLogin.cookie,/^__Host-mathhub_teacher=[a-f0-9]{64}$/);
assert.equal((await call('teacher',undefined,codeLogin.cookie)).status,200);
assert.equal((await call('teacher',undefined,restored.cookie)).status,401,'student cookie cannot access roster');
assert.equal((await call('teacher',undefined,'__Host-mathhub_teacher='+fixtureCode)).status,401,'code is not a session token');
const codeRoster=await call('teacher',undefined,codeLogin.cookie);assert.ok(codeRoster.data.students.find(s=>s.id===studentId));
await call('help',{requested:true,topicId:'8-functions'},restored.cookie);
assert.equal((await call('resolve-help',{studentId},codeLogin.cookie)).status,200);
assert.equal((await call('session',undefined,restored.cookie)).data.student.helpRequested,false);
const oldSession=codeLogin.cookie;
codeLogin=await call('teacher-login',{code:fixtureCode},oldSession,teacherClient);
assert.notEqual(codeLogin.cookie,oldSession);
assert.equal((await call('teacher',undefined,oldSession)).status,401,'re-login revokes the old browser session');
const rawToken=codeLogin.cookie.split('=')[1],storedHash=await digest(rawToken);
assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM teacher_sessions WHERE token_hash=?').get(rawToken).n,0,'session stored only as a hash');
assert.ok(sqlite.prepare('SELECT * FROM teacher_sessions WHERE token_hash=?').get(storedHash));
env.TEACHER_CODE_SHA256='0'.repeat(64);
assert.equal((await call('teacher',undefined,codeLogin.cookie)).status,401,'code rotation invalidates existing sessions');
env.TEACHER_CODE_SHA256=fixtureHash;
sqlite.prepare('UPDATE teacher_sessions SET expires_at=? WHERE token_hash=?').run(Date.now()-1,storedHash);
assert.equal((await call('teacher',undefined,codeLogin.cookie)).status,401,'expired sessions cannot read roster');
codeLogin=await call('teacher-login',{code:fixtureCode},'',teacherClient);
const independentLogin=await call('teacher-login',{code:fixtureCode},'',{'cf-connecting-ip':'192.0.2.21'});
const signedOut=await call('teacher-logout',{},codeLogin.cookie,teacherClient);
assert.equal(signedOut.status,200);assert.equal(signedOut.data.signOutAccount,false);
assert.equal((await call('teacher',undefined,codeLogin.cookie)).status,401,'logout revokes teacher session');
assert.equal((await call('teacher',undefined,independentLogin.cookie)).status,200,'other teacher devices remain signed in');
const badClient={'cf-connecting-ip':'192.0.2.99'},realNow=Date.now;
const fixedTime=Math.floor(realNow()/900000)*900000+1000;Date.now=()=>fixedTime;
try{
 for(let i=0;i<10;i++)assert.equal((await call('teacher-login',{code:'wrong'},'',badClient)).status,401);
 assert.equal((await call('teacher-login',{code:fixtureCode},'',badClient)).status,429,'limit enforced even for a correct code');
 assert.equal((await call('teacher-login',{code:fixtureCode},'',{'cf-connecting-ip':'192.0.2.100'})).status,200,'one client does not lock out others');
 Date.now=()=>fixedTime+900000;
 assert.equal((await call('teacher-login',{code:fixtureCode},'',badClient)).status,200,'rate limit expires');
}finally{Date.now=realNow;}
const cookieResponse=await handlePost(new Request('https://math.test/api/teacher-login',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://math.test','cf-connecting-ip':'192.0.2.101'},body:JSON.stringify({code:fixtureCode})}),'teacher-login');
assert.equal(cookieResponse.status,200);
for(const flag of ['Secure','HttpOnly','SameSite=Strict','Path=/','Max-Age=28800'])assert.ok(cookieResponse.headers.get('Set-Cookie').includes(flag));
assert.equal(cookieResponse.headers.get('Cache-Control'),'no-store');
assert.equal((await call('teacher-logout',{},'',spoof)).data.signOutAccount,native);
assert.equal((await call('remove-student',{studentId},restored.cookie)).status,401,'students cannot remove profiles');
assert.equal((await call('remove-student',{studentId},independentLogin.cookie,{Origin:'https://evil.test'})).status,403);
assert.equal((await call('remove-student',{studentId},independentLogin.cookie)).status,200);
assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM students WHERE id=?').get(studentId).n,0);
assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM questions WHERE student_id=?').get(studentId).n,0);
assert.equal((await call('session',undefined,restored.cookie)).data.student,null);
assert.ok((await call('session',undefined,other.cookie)).data.student,'other students remain intact');

const remembered=await handlePost(new Request('https://math.test/api/teacher-login',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://math.test','cf-connecting-ip':'192.0.2.103'},body:JSON.stringify({code:fixtureCode,remember:true})}),'teacher-login');
assert.equal(remembered.status,200);assert.ok(remembered.headers.get('Set-Cookie').includes('Max-Age=2592000'));
assert.equal((await call('auth-options')).data.accountLogin,native);
console.log('PASS: private teacher code, secure cookies, session rotation/revocation/expiry, code changes, student isolation, CSRF rejection, teacher actions, and persistent rate limiting.');
sqlite.close();
