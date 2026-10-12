import { DurableObject } from 'cloudflare:workers';
import { createHandlers } from './server';
import { schema } from './schema';

interface Env {
  CLASSROOM: DurableObjectNamespace<MathClassroom>;
  ASSETS: Fetcher;
  TEACHER_CODE_SHA256?: string;
}

class Statement {
  constructor(private storage: DurableObjectStorage, private sql: string, private params: (string | number | null)[] = []) {}
  bind(...params: (string | number | null)[]) { return new Statement(this.storage, this.sql, params); }
  async first<T = Record<string, unknown>>(column?: string): Promise<T | null> {
    const row = this.storage.sql.exec(this.sql, ...this.params).toArray()[0];
    return (column ? row?.[column] : row) as T ?? null;
  }
  async all() {
    return this.execute();
  }
  async run() { return this.execute(); }
  execute() {
    const cursor = this.storage.sql.exec(this.sql, ...this.params);
    const results = cursor.toArray();
    return { results, success: true, meta: { changes: cursor.rowsWritten } };
  }
}

export class MathClassroom extends DurableObject<Env> {
  private queue: Promise<unknown> = Promise.resolve();
  private handlers: ReturnType<typeof createHandlers>;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.storage.transactionSync(() => {
      ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS schema_versions (version INTEGER PRIMARY KEY)');
      if (!ctx.storage.sql.exec('SELECT version FROM schema_versions WHERE version=1').toArray().length) {
        for (const statement of schema.split(';').map(s => s.trim()).filter(Boolean)) ctx.storage.sql.exec(statement);
        ctx.storage.sql.exec('INSERT INTO schema_versions (version) VALUES (1)');
      }
    });
    const DB = {
      prepare: (sql: string) => new Statement(ctx.storage, sql),
      batch: async (statements: Statement[]) => ctx.storage.transactionSync(() => statements.map(s => s.execute())),
    } as unknown as Pick<D1Database, 'prepare' | 'batch'>;
    this.handlers = createHandlers({ DB, TEACHER_CODE_SHA256: env.TEACHER_CODE_SHA256 });
  }

  async fetch(request: Request): Promise<Response> {
    const run = this.queue.then(async () => {
      const action = new URL(request.url).pathname.slice('/api/'.length);
      if (action === 'health') return Response.json({ ok: true, name: 'MathHub', teacherConfigured: !!this.env.TEACHER_CODE_SHA256 }, { headers: { 'Cache-Control': 'no-store' } });
      if (request.method === 'GET') return this.handlers.handleGet(request, action);
      if (request.method === 'POST') return this.handlers.handlePost(request, action);
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, POST' } });
    });
    this.queue = run.catch(() => undefined);
    return run;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const headers = new Headers(request.headers);
      for (const key of Array.from(headers.keys())) if (key.startsWith('oai-')) headers.delete(key);
      return env.CLASSROOM.get(env.CLASSROOM.idFromName('mr-porras-math-classroom')).fetch(new Request(request, { headers }));
    }
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'same-origin');
    headers.set('X-Frame-Options', 'DENY');
    if (headers.get('Content-Type')?.includes('text/html')) headers.set('Cache-Control', 'no-cache');
    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;
