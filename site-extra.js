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
`;

document.querySelector('#solutii')?.insertAdjacentHTML('afterend', proofSections);
document.querySelector('.nav')?.insertAdjacentHTML('beforeend', '<a href="#testimoniale">Testimoniale</a>');
