# Planuri cu sens

Pagină statică de prezentare pentru servicii de asigurare de viață, sănătate și planuri de investiții.

## Fișiere

- `index.html` — pagină și interacțiuni
- `sergiu-alexe.jpg` — portret optimizat pentru pagină; metadatele fotografiei originale au fost eliminate
- `api/leads.js` — validarea și stocarea cererilor de contact
- `api/metrics.js` — contorizarea agregată a vizualizărilor și accesărilor
- `lib/database.js` — inițializarea tabelelor Postgres

## Configurare pentru Vercel

1. Conectează proiectul Vercel la o bază de date Postgres din Marketplace (de exemplu Neon) și verifică planul și costurile înainte de activare. Integrarea trebuie să furnizeze `DATABASE_URL` proiectului.
2. Configurează variabila `ALLOWED_ORIGIN` cu originea exactă a site-ului, de exemplu `https://alexe-sergium-consultantul-tau-fina.vercel.app`.
3. Configurează `CRON_SECRET` cu un secret aleator de cel puțin 16 caractere pentru autorizarea curățării automate.
4. Publică proiectul pe Vercel. Funcțiile API creează automat tabelele `leads` și `site_metrics` la prima solicitare.

Formularul salvează numele, telefonul, interesul, mesajul opțional, acordul și momentul solicitării în `leads`. O funcție Vercel Cron rulează zilnic și șterge solicitările mai vechi de un an; `CRON_SECRET` protejează endpoint-ul de curățare. Vizualizările și accesările sunt doar totaluri agregate în `site_metrics`; nu se stochează IP-uri sau identificatori de vizitator. Lead-urile pot fi consultate în consola bazei de date. Nu există notificare automată prin email sau interfață de administrare.

Pentru o previzualizare statică locală, pagina se poate deschide direct, însă endpoint-urile `/api/*` funcționează doar după configurarea unui mediu Vercel cu baza de date.
