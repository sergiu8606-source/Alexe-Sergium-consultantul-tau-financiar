import { neon } from '@neondatabase/serverless';

let ready;
let initializedFor;

export async function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  const sql = neon(process.env.DATABASE_URL);
  if (!ready || initializedFor !== process.env.DATABASE_URL) {
    initializedFor = process.env.DATABASE_URL;
    ready = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS leads (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(25) NOT NULL,
        interest VARCHAR(80) NOT NULL,
        message VARCHAR(1500) NOT NULL DEFAULT '',
        consent BOOLEAN NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS site_metrics (
        metric VARCHAR(20) PRIMARY KEY,
        total BIGINT NOT NULL DEFAULT 0
      )`;
      await sql`INSERT INTO site_metrics (metric, total) VALUES ('views', 0), ('clicks', 0)
        ON CONFLICT (metric) DO NOTHING`;
    })().catch((error) => {
      ready = undefined;
      initializedFor = undefined;
      throw error;
    });
  }
  await ready;
  return sql;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

export function isAllowedOrigin(request) {
  const configured = process.env.ALLOWED_ORIGIN;
  const origin = request.headers.get('origin');
  if (!configured || !origin) return false;
  return origin === configured;
}
