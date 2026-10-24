import { getDatabase, isAllowedOrigin, json } from '../lib/database.js';

export default {
async fetch(request) {
  if (request.method === 'GET') {
    try {
      const sql = await getDatabase();
      const rows = await sql`SELECT metric, total FROM site_metrics WHERE metric IN ('views', 'clicks')`;
      const totals = Object.fromEntries(rows.map(({ metric, total }) => [metric, Number(total)]));
      return json({ views: totals.views || 0, clicks: totals.clicks || 0 });
    } catch (error) {
      console.error('Metric read failed:', error instanceof Error ? error.message : 'unknown error');
      return json({ error: 'Statisticile nu sunt disponibile acum.' }, 503);
    }
  }

  if (request.method !== 'POST') return json({ error: 'Metodă neacceptată.' }, 405);
  if (!isAllowedOrigin(request)) return json({ error: 'Solicitare neacceptată.' }, 403);

  let event;
  try {
    const body = await request.json();
    event = body.event;
  } catch {
    return json({ error: 'Formatul solicitării nu este valid.' }, 400);
  }
  const metric = event === 'page_view' ? 'views' : event === 'click' ? 'clicks' : null;
  if (!metric) return json({ error: 'Eveniment necunoscut.' }, 400);

  try {
    const sql = await getDatabase();
    await sql`INSERT INTO site_metrics (metric, total) VALUES (${metric}, 1)
      ON CONFLICT (metric) DO UPDATE SET total = site_metrics.total + 1`;
    return json({ ok: true }, 202);
  } catch (error) {
    console.error('Metric write failed:', error instanceof Error ? error.message : 'unknown error');
    return json({ error: 'Statistica nu a putut fi actualizată.' }, 503);
  }
}
};
