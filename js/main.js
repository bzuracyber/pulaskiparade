/* ============================================================
   pulaskiparade.org — Main JavaScript
   ============================================================ */

/* --- Hamburger / Mobile Nav -------------------------------- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', function () {
    this.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
})();

/* --- Countdown Timer --------------------------------------- */
(function () {
  const el = document.getElementById('countdown');
  if (!el) return;

  const target = new Date('2026-10-04T12:30:00'); // Parade start

  function update() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      el.innerHTML = '<span class="countdown-num" style="font-size:1.25rem;">Parade Day!</span>';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');

    document.getElementById('cd-days')    && (document.getElementById('cd-days').textContent    = pad(days));
    document.getElementById('cd-hours')   && (document.getElementById('cd-hours').textContent   = pad(hours));
    document.getElementById('cd-minutes') && (document.getElementById('cd-minutes').textContent = pad(minutes));
    document.getElementById('cd-seconds') && (document.getElementById('cd-seconds').textContent = pad(seconds));
  }

  update();
  setInterval(update, 1000);
})();

/* --- Scroll To Top ----------------------------------------- */
(function () {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* --- Tabs -------------------------------------------------- */
(function () {
  document.querySelectorAll('[data-tabs]').forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels  = container.querySelectorAll('.tab-panel');

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        panels[i] && panels[i].classList.add('active');
      });
    });
  });
})();

/* --- Accordion --------------------------------------------- */
(function () {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', function () {
      const body = this.nextElementSibling;
      const isOpen = this.classList.contains('open');

      // Optionally close siblings
      const parent = this.closest('[data-accordion]');
      if (parent) {
        parent.querySelectorAll('.accordion-trigger.open').forEach(t => {
          if (t !== this) {
            t.classList.remove('open');
            t.nextElementSibling.classList.remove('open');
          }
        });
      }

      this.classList.toggle('open', !isOpen);
      body.classList.toggle('open', !isOpen);
    });
  });
})();

/* --- Sticky Nav Active State ------------------------------- */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* --- Smooth Appear on Scroll ------------------------------- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .55s ease, transform .55s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card, .event-row, .form-card, .stat, .timeline-item, .contingent-card, .honor-row, .contact-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();

/* --- Gallery Lightbox (simple) ----------------------------- */
(function () {
  const items = document.querySelectorAll('.gallery-item[data-src]');
  if (!items.length) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = `
    display:none;position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:9999;
    align-items:center;justify-content:center;padding:1rem;cursor:pointer;
  `;
  overlay.innerHTML = `
    <img id="lightbox-img" style="max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.5);" />
    <button id="lightbox-close" style="position:absolute;top:1.5rem;right:1.5rem;background:rgba(255,255,255,.15);
      border:1px solid rgba(255,255,255,.3);color:#fff;width:40px;height:40px;border-radius:50%;font-size:1.25rem;cursor:pointer;">✕</button>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector('#lightbox-img');

  items.forEach(item => {
    item.addEventListener('click', () => {
      img.src = item.dataset.src;
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.id === 'lightbox-close') {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      img.src = '';
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      img.src = '';
    }
  });
})();
