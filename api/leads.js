import { getDatabase, isAllowedOrigin, json } from '../lib/database.js';

const interests = new Set([
  'Protecția familiei',
  'Asigurare de viață',
  'Asigurare de sănătate',
  'Plan de investiții',
  'Vreau să discut opțiunile',
]);

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

async function sendLeadNotification({ name, phone, interest, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const recipient = process.env.LEAD_NOTIFICATION_EMAIL || 'sergiu8606@gmail.com';
  const safe = {
    name: escapeHtml(name),
    phone: escapeHtml(phone),
    interest: escapeHtml(interest),
    message: escapeHtml(message || '—').replace(/\n/g, '<br>'),
  };
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM || 'Planuri cu sens <onboarding@resend.dev>',
      to: [recipient],
      subject: `Solicitare nouă: ${interest}`,
      html: `<h2>Solicitare nouă de pe site</h2><p><b>Nume:</b> ${safe.name}</p><p><b>Telefon:</b> ${safe.phone}</p><p><b>Interes:</b> ${safe.interest}</p><p><b>Mesaj:</b><br>${safe.message}</p>`,
      text: `Solicitare nouă de pe site\nNume: ${name}\nTelefon: ${phone}\nInteres: ${interest}\nMesaj: ${message || '—'}`,
    }),
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend returned ${response.status}: ${details.slice(0, 300)}`);
  }
  return true;
}

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
  } catch (error) {
    console.error('Lead storage failed:', error instanceof Error ? error.message : 'unknown error');
    return json({ error: 'Solicitarea nu a putut fi salvată acum. Te rog încearcă din nou sau contactează-mă telefonic.' }, 503);
  }

  try {
    const emailSent = await sendLeadNotification({ name, phone, interest, message });
    return json({ ok: true, emailSent }, 201);
  } catch (error) {
    console.error('Lead notification failed:', error instanceof Error ? error.message : 'unknown error');
    return json({ ok: true, emailSent: false }, 201);
  }
}
};
