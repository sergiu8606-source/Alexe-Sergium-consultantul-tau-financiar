import { getDatabase, json } from '../lib/database.js';

export default {
  async fetch(request) {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
      return json({ error: 'Neautorizat.' }, 401);
    }
    if (request.method !== 'GET') return json({ error: 'Metodă neacceptată.' }, 405);

    try {
      const sql = await getDatabase();
      const deleted = await sql`DELETE FROM leads
        WHERE created_at <= NOW() - INTERVAL '1 year' RETURNING id`;
      return json({ ok: true, deleted: deleted.length });
    } catch (error) {
      console.error('Lead retention cleanup failed:', error instanceof Error ? error.message : 'unknown error');
      return json({ error: 'Curățarea automată nu a putut fi efectuată.' }, 503);
    }
  },
};
