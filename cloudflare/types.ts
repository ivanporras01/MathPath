export type RuntimeEnv = {
  DB: Pick<D1Database, 'prepare' | 'batch'>;
  TEACHER_CODE_SHA256?: string;
};
