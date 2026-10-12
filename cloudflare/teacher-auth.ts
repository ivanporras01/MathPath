import type { RuntimeEnv } from './types';
export function createTeacherAuth(env: RuntimeEnv) {

const COOKIE = '__Host-mathhub_teacher';
const SESSION_SECONDS = 8 * 60 * 60;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function db() {
  if (!env.DB) throw new Error('Teacher storage is unavailable.');
  return env.DB;
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function equalHashes(a: string, b: string) {
  if (a.length !== 64 || b.length !== 64) return false;
  let difference = 0;
  for (let i = 0; i < 64; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function tokenFrom(req: Request) {
  const value = (req.headers.get('Cookie') || '').split(';').map(part => part.trim())
    .find(part => part.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}

function sessionCookie(token: string, age = SESSION_SECONDS) {
  return `${COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${age}`;
}

async function authenticateTeacher(req: Request): Promise<boolean> {
  const token = tokenFrom(req);
  if (token && env.TEACHER_CODE_SHA256) {
    const session = await db().prepare(
      'SELECT token_hash FROM teacher_sessions WHERE token_hash=? AND code_hash=? AND expires_at>?'
    ).bind(await sha256(token), env.TEACHER_CODE_SHA256, Date.now()).first();
    if (session) return true;
  }
  // Public Workers must never trust caller-supplied identity headers.
  return false;
}

async function loginTeacher(req: Request, body: { code?: unknown; remember?: unknown }) {
  const expected = env.TEACHER_CODE_SHA256;
  if (!expected || !/^[a-f0-9]{64}$/.test(expected)) {
    return json({ error: 'Professor access needs setup. Please contact Mr. Porras.' }, 503);
  }
  const now = Date.now();
  const duration = body.remember === true ? 30 * 24 * 60 * 60 : SESSION_SECONDS;
  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  // Cloudflare supplies this header; store only its hash, never the address.
  const bucket = await sha256('teacher-login|' + (req.headers.get('cf-connecting-ip') || 'unknown'));
  const attempt = await db().prepare(
    'INSERT INTO teacher_login_attempts (bucket_key,window_start,attempts) VALUES (?,?,1) '
    + 'ON CONFLICT(bucket_key) DO UPDATE SET attempts=CASE WHEN window_start=excluded.window_start '
    + 'THEN teacher_login_attempts.attempts+1 ELSE 1 END,window_start=excluded.window_start RETURNING attempts'
  ).bind(bucket, windowStart).first<{ attempts: number }>();
  if (!attempt || attempt.attempts > MAX_ATTEMPTS) {
    const seconds = Math.max(1, Math.ceil((windowStart + WINDOW_MS - now) / 1000));
    return json({ error: 'Too many attempts. Please wait up to 15 minutes, then try again.' }, 429, { 'Retry-After': String(seconds) });
  }
  const code = typeof body.code === 'string' && body.code.length <= 64
    ? body.code.toUpperCase().replace(/[\s-]/g, '') : '';
  const received = await sha256(code);
  if (!/^[A-Z0-9]{12,64}$/.test(code) || !equalHashes(received, expected)) {
    return json({ error: 'That access phrase is not correct. Check the words and numbers, then try again.' }, 401);
  }
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  const oldToken = tokenFrom(req);
  const statements = [
    db().prepare('INSERT INTO teacher_sessions (token_hash,code_hash,expires_at) VALUES (?,?,?)')
      .bind(await sha256(token), expected, now + duration * 1000),
    db().prepare('DELETE FROM teacher_sessions WHERE expires_at<=? OR code_hash<>?').bind(now, expected),
    db().prepare('DELETE FROM teacher_login_attempts WHERE bucket_key=? OR window_start<?').bind(bucket, windowStart),
  ];
  if (oldToken) statements.push(db().prepare('DELETE FROM teacher_sessions WHERE token_hash=?').bind(await sha256(oldToken)));
  await db().batch(statements);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token, duration) });
}

async function logoutTeacher(req: Request) {
  const token = tokenFrom(req);
  if (token) await db().prepare('DELETE FROM teacher_sessions WHERE token_hash=?').bind(await sha256(token)).run();
  return json({ ok: true, signOutAccount: false }, 200, { 'Set-Cookie': sessionCookie('', 0) });
}

return {authenticateTeacher,loginTeacher,logoutTeacher};
}
