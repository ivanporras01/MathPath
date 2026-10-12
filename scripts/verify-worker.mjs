import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
const require = createRequire(realpathSync(new URL('../node_modules/wrangler/package.json',import.meta.url)));
const {Miniflare} = require('miniflare');
const fixtureCode = 'TEST-ONLY-CODE-1234';
const mf = new Miniflare({
  modules:true,scriptPath:new URL('../work/worker/worker.js',import.meta.url).pathname,
  compatibilityDate:'2026-05-15',
  durableObjects:{CLASSROOM:{className:'MathClassroom',useSQLite:true}},
  bindings:{TEACHER_CODE_SHA256:createHash('sha256').update(fixtureCode.replaceAll('-','')).digest('hex')},
  serviceBindings:{ASSETS:()=>new Response('MathHub')},
});
async function call(action,body,cookie='',extra={}) {
  const response=await mf.dispatchFetch('https://math.test/api/'+action,{
    method:body===undefined?'GET':'POST',
    headers:{...(body===undefined?{}:{'Content-Type':'application/json',Origin:'https://math.test'}),...(cookie?{Cookie:cookie}:{}),...extra},
    body:body===undefined?undefined:JSON.stringify(body),
  });
  return {status:response.status,data:await response.json(),cookie:response.headers.get('Set-Cookie')?.split(';')[0]};
}
try {
  assert.equal((await call('health')).data.ok,true);
  assert.equal((await call('teacher')).status,401);
  assert.equal((await call('teacher',undefined,'',{'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'teacher@example.test'})).status,401);
  const student=await call('join',{firstName:' Test ',lastName:' Student ',grade:7});
  assert.equal(student.status,200);
  await call('lesson',{topicId:'7-equations',stage:'learn'},student.cookie);
  const q=await call('question',{topicId:'7-equations'},student.cookie);
  assert.equal(q.status,200);
  const n=q.data.question.expression.replaceAll('−','-').match(/-?\d+(?:\.\d+)?/g).map(Number);
  const result=await call('answer',{questionId:q.data.question.id,answer:String((n[2]-n[1])/n[0])},student.cookie);
  assert.equal(result.data.correct,true);
  await call('logout',{},student.cookie);
  assert.equal((await call('session',undefined,student.cookie)).data.student,null);
  const restored=await call('join',{firstName:'TEST',lastName:'student',grade:6});
  assert.equal(restored.data.student.id,student.data.student.id);
  assert.equal(restored.data.progress['7-equations'].correct,1);
  assert.equal(restored.data.progress['7-equations'].learned,true);
  await call('activity',{topicId:'7-equations',stage:'practice',grade:7},restored.cookie);
  const teacher=await call('teacher-login',{code:fixtureCode});
  assert.equal(teacher.status,200);
  const roster=await call('teacher',undefined,teacher.cookie);
  assert.equal(roster.status,200);
  assert.equal(roster.data.students.length,1);
  assert.equal(roster.data.students[0].currentTopic,'7-equations');
  assert.equal((await call('remove-student',{studentId:student.data.student.id},restored.cookie)).status,401);
  assert.equal((await call('remove-student',{studentId:student.data.student.id},teacher.cookie)).status,200);
  assert.equal((await call('teacher',undefined,teacher.cookie)).data.students.length,0);
  assert.equal((await call('session',undefined,restored.cookie)).data.student,null);
  await call('teacher-logout',{},teacher.cookie);
  assert.equal((await call('teacher',undefined,teacher.cookie)).status,401);
  console.log('PASS: deployed Worker bundle with real Cloudflare SQLite Durable Object: registration, returning student, scoring, saved progress, protected dashboard, activity, removal, and logout.');
} finally {await mf.dispose();}
