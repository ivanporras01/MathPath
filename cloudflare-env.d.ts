declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    TEACHER_EMAIL?: string;
    TEACHER_CODE_SHA256?: string;
  }
}
