const proofSections = `
<section class="section" id="testimoniale">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">Păreri verificate</div>
      <h2>Experiențele clienților, spuse de ei.</h2>
      <p>Publicăm doar feedback real, redat fidel și cu acordul persoanelor care l-au oferit.</p>
    </div>
    <div class="testimonials">
      <article class="testimonial-note">
        <div class="testimonial-status">În curs de colectare</div>
        <h3>Primele testimoniale verificate vor apărea aici.</h3>
        <p>Nu afișăm citate inventate sau recomandări fără permisiune. Dacă am discutat împreună și vrei să împărtășești experiența ta, îmi poți scrie un mesaj.</p>
        <a class="testimonial-cta" href="mailto:sergiu.alexe@agentiemetropolitanlife.ro?subject=Feedback%20pentru%20pagina">Trimite feedback ↗</a>
      </article>
      <article class="testimonial-note">
        <div class="testimonial-status">Publicare cu acord</div>
        <h3>Confidențialitatea rămâne importantă.</h3>
        <p>Înainte de publicare, confirmăm textul și modul de identificare. Numele sau alte detalii personale apar numai cu acordul explicit al autorului.</p>
      </article>
    </div>
  </div>
</section>
<section class="section white" id="distribuie">
  <div class="wrap">
    <div class="share-panel">
      <div>
        <div class="eyebrow">Distribuie pagina</div>
        <h3>Scanează codul QR pentru a ajunge la site.</h3>
        <p>Poți descărca imaginea și o poți trimite mai departe sau o poți folosi pe materiale tipărite.</p>
        <div class="qr-actions">
          <a class="btn" href="https://alexe-sergium-consultantul-tau-fina.vercel.app/" target="_blank" rel="noopener">Deschide pagina ↗</a>
          <a class="qr-download" href="https://api.qrserver.com/v1/create-qr-code/?size=600x600&amp;data=https%3A%2F%2Falexe-sergium-consultantul-tau-fina.vercel.app%2F" download="cod-qr-planuri-cu-sens.png">Descarcă codul QR ↓</a>
        </div>
      </div>
      <img class="qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&amp;data=https%3A%2F%2Falexe-sergium-consultantul-tau-fina.vercel.app%2F" alt="Cod QR către pagina Planuri cu sens">
    </div>
  </div>
</section>`;

document.querySelector('#solutii')?.insertAdjacentHTML('afterend', proofSections);
document.querySelector('.nav')?.insertAdjacentHTML('beforeend', '<a href="#testimoniale">Testimoniale</a><a href="#distribuie">Distribuie</a>');
