/* ============================================================
   pulaskiparade.org — Animation System (Phase 4)
   Vanilla JS only. No external dependencies.
   ============================================================ */
(function () {
  'use strict';

  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH  = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ── Easing ─────────────────────────────────────────────── */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* ── 1. Scroll progress bar ─────────────────────────────── */
  (function () {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);

    function update() {
      const max  = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ── 2. Hero parallax ───────────────────────────────────── */
  (function () {
    if (REDUCE || TOUCH) return;
    const wrap = document.querySelector('.hero-video-wrap');
    if (!wrap) return;
    wrap.style.willChange = 'transform';

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      requestAnimationFrame(function () {
        wrap.style.transform = 'translateY(' + (window.scrollY * 0.3) + 'px)';
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  })();

  /* ── 3. Gold-rule draw-in ───────────────────────────────── */
  (function () {
    if (!('IntersectionObserver' in window)) return;

    const rules = document.querySelectorAll('.gold-rule');
    if (!rules.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('gr-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.8 });

    rules.forEach(function (el) {
      if (el.closest('.hero')) return;
      el.classList.add('gr-init');
      io.observe(el);
    });
  })();

  /* ── 4. Section-title word reveal ───────────────────────── */
  (function () {
    if (!('IntersectionObserver' in window)) return;

    const titles = document.querySelectorAll('.section-title');
    if (!titles.length) return;

    function splitWords(el) {
      const text = el.textContent;
      const words = text.split(/(\s+)/);
      el.innerHTML = words.map(function (chunk) {
        if (/^\s+$/.test(chunk)) return chunk;
        return '<span class="wr-word"><span class="wr-inner">' + chunk + '</span></span>';
      }).join('');
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const inners = el.querySelectorAll('.wr-inner');
        inners.forEach(function (inner, i) {
          inner.style.transitionDelay = (i * 0.06) + 's';
        });
        el.classList.add('wr-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.4 });

    titles.forEach(function (el) {
      if (el.closest('.hero')) return;
      splitWords(el);
      io.observe(el);
    });
  })();

  /* ── 5. Gallery stagger by grid position ────────────────── */
  (function () {
    if (!('IntersectionObserver' in window)) return;

    const items = document.querySelectorAll('.lp-gallery-item');
    if (!items.length) return;

    const COLS = 3;
    items.forEach(function (item, i) {
      const col = i % COLS;
      item.style.transitionDelay = (col * 0.07 + Math.floor(i / COLS) * 0.04) + 's';
    });
  })();

  /* ── 6. Event card cascade ───────────────────────────────── */
  (function () {
    if (!('IntersectionObserver' in window)) return;

    const cards = document.querySelectorAll('.event-card');
    if (!cards.length) return;

    cards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.09) + 's';
    });
  })();

  /* ── 7. Active nav via IntersectionObserver ─────────────── */
  (function () {
    if (!('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header-nav a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    function setActive(id) {
      navLinks.forEach(function (a) {
        const href = a.getAttribute('href');
        a.classList.toggle('active', href === '#' + id);
      });
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(function (sec) { io.observe(sec); });
  })();

  /* ── 8. Custom smooth scroll ─────────────────────────────── */
  (function () {
    const header   = document.querySelector('.site-header');
    const mobileNav  = document.getElementById('mobileNav');
    const hamburger  = document.getElementById('hamburger');

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();

        const navH  = header ? header.offsetHeight : 80;
        const start = window.scrollY;
        const end   = target.getBoundingClientRect().top + start - navH;
        const dist  = end - start;
        const dur   = REDUCE ? 0 : 900;
        const t0    = performance.now();

        if (dist === 0) return;

        if (dur === 0) {
          window.scrollTo(0, end);
          history.replaceState(null, '', href);
          return;
        }

        function step(now) {
          const elapsed  = now - t0;
          const progress = Math.min(elapsed / dur, 1);
          window.scrollTo(0, start + dist * easeInOutCubic(progress));
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            history.replaceState(null, '', href);
          }
        }
        requestAnimationFrame(step);

        if (mobileNav && mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
          if (hamburger) hamburger.classList.remove('open');
        }
      });
    });
  })();

})();
