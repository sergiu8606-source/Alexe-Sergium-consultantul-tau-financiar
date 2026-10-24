import { getDatabase, isAllowedOrigin, json } from '../lib/database.js';

const interests = new Set([
  'Protecția familiei',
  'Asigurare de viață',
  'Asigurare de sănătate',
  'Plan de investiții',
  'Vreau să discut opțiunile',
]);

export default {
async fetch(request) {
  if (request.method !== 'POST') return json({ error: 'Metodă neacceptată.' }, 405);
  if (!isAllowedOrigin(request)) return json({ error: 'Solicitare neacceptată.' }, 403);
  if (Number(request.headers.get('content-length') || 0) > 8192) {
    return json({ error: 'Solicitarea este prea mare.' }, 413);
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 8192) return json({ error: 'Solicitarea este prea mare.' }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Formatul solicitării nu este valid.' }, 400);
  }

  // Câmp-capcană pentru roboți. Solicitările lor primesc răspuns neutru și nu se stochează.
  if (typeof body.website === 'string' && body.website.trim()) return json({ ok: true }, 201);

  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const interest = typeof body.interest === 'string' ? body.interest : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const consent = body.consent === true;

  if (name.length < 2 || name.length > 120) return json({ error: 'Introdu un nume valid.' }, 400);
  if (!/^[+()\d\s.-]{7,25}$/.test(phone)) return json({ error: 'Introdu un număr de telefon valid.' }, 400);
  if (!interests.has(interest)) return json({ error: 'Alege o opțiune din listă.' }, 400);
  if (message.length > 1500) return json({ error: 'Mesajul este prea lung.' }, 400);
  if (!consent) return json({ error: 'Este necesar acordul pentru a răspunde solicitării.' }, 400);

  try {
    const sql = await getDatabase();
    await sql`INSERT INTO leads (name, phone, interest, message, consent)
      VALUES (${name}, ${phone}, ${interest}, ${message}, ${consent})`;
    return json({ ok: true }, 201);
  } catch (error) {
    console.error('Lead storage failed:', error instanceof Error ? error.message : 'unknown error');
    return json({ error: 'Solicitarea nu a putut fi salvată acum. Te rog încearcă din nou sau contactează-mă telefonic.' }, 503);
  }
}
};
