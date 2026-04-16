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
  const target = new Date('2026-10-04T12:30:00');
  function update() {
    const now  = new Date();
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
      const body   = this.nextElementSibling;
      const isOpen = this.classList.contains('open');
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

/* --- Scroll-Reveal with Stagger ---------------------------- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const REVEAL_SELECTORS = [
    '.section-heading', '.section-subheading', '.gold-rule',
    '.card', '.event-row', '.stat', '.timeline-item',
    '.contingent-card', '.honor-row', '.contact-card',
    '.form-card', '.sponsor-tier', '.sponsor-card',
    '.membership-card', '.program-card',
  ].join(',');

  const STAGGER_PARENTS = [
    '.grid-3', '.grid-2', '.events-list',
    '.stats-strip .stats-grid', '.contingents-grid', '.sponsor-grid',
  ].join(',');

  /* Assign d1–d6 delay classes to .reveal children of stagger parents */
  document.querySelectorAll(STAGGER_PARENTS).forEach(parent => {
    const children = Array.from(parent.querySelectorAll('.reveal'));
    children.forEach((child, i) => {
      const cls = 'd' + Math.min(i + 1, 6);
      child.classList.add(cls);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(REVEAL_SELECTORS).forEach(el => {
    /* Skip elements already animated by CSS keyframes in hero sections */
    if (el.closest('.hero, .page-hero')) return;
    el.classList.add('reveal');
    observer.observe(el);
  });
})();

/* --- Hero Parallax ----------------------------------------- */
(function () {
  const bgs = document.querySelectorAll('.hero-bg');
  if (!bgs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      bgs.forEach(bg => {
        bg.style.transform = 'translateY(' + (y * 0.38) + 'px)';
      });
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* --- Stats Count-Up & Fade-In ------------------------------ */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutQuad(t) { return t * (2 - t); }

  function animateCount(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOutQuad(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Count-up numeric stats */
  const numObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) { numObserver.unobserve(el); return; }
      if (reduce) {
        el.textContent = target;
      } else {
        animateCount(el, target, 1400);
      }
      numObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    numObserver.observe(el);
  });

  /* Fade-in all .stats-strip .stat blocks (including "5th Ave") */
  const stats = document.querySelectorAll('.stats-strip .stat');
  if (!stats.length) return;
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  stats.forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
    fadeObserver.observe(el);
  });
})();

/* --- Lazy Image Loading (IntersectionObserver, 200px margin) */
(function () {
  if (!('IntersectionObserver' in window)) return;
  // Handles <img data-src="..."> — browser native loading="lazy" handles the rest
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if (!lazyImgs.length) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      obs.unobserve(img);
    });
  }, { rootMargin: '200px' });
  lazyImgs.forEach(img => io.observe(img));
})();

/* --- Gallery Lightbox (event delegation — works after Load More) */
(function () {
  if (!document.querySelector('.gallery-item[data-src]')) return;

  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'background:rgba(0,0,0,.92)',
    'z-index:9999',
    'align-items:center',
    'justify-content:center',
    'padding:1rem',
  ].join(';');
  overlay.innerHTML = `
    <img id="lightbox-img" alt=""
      style="max-width:90vw;max-height:90vh;border-radius:8px;
        box-shadow:0 20px 60px rgba(0,0,0,.5);cursor:default;" />
    <button id="lightbox-close" aria-label="Close lightbox"
      style="position:absolute;top:1.5rem;right:1.5rem;background:rgba(255,255,255,.15);
        border:1px solid rgba(255,255,255,.3);color:#fff;width:40px;height:40px;
        border-radius:50%;font-size:1.25rem;cursor:pointer;line-height:1;">&#x2715;</button>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector('#lightbox-img');

  document.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item[data-src]');
    if (!item) return;
    img.src  = item.dataset.src;
    img.alt  = item.dataset.alt || '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  function closeLightbox() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    img.src = '';
  }

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.id === 'lightbox-close') closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') closeLightbox();
  });
})();

/* --- Load More Photos (gallery tabs) ----------------------- */
function loadMorePhotos(gridId, btnId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const hidden = grid.querySelectorAll('.gallery-hidden');
  let count = 0;
  hidden.forEach(el => {
    if (count < 24) { el.classList.remove('gallery-hidden'); count++; }
  });
  if (grid.querySelectorAll('.gallery-hidden').length === 0) {
    const btn = document.getElementById(btnId);
    if (btn) btn.parentElement.style.display = 'none';
  }
}
