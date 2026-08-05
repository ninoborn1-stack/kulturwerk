/* =========================================================================
   Kulturwerk der deutschen Schriftsteller*innen e.V. — main.js
   Alle Interaktionen & Scroll-Animationen
   ========================================================================= */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ----- Nav: scroll state + burger ------------------------------------ */
  const nav = $('.nav');
  const onScrollNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  const burger = $('.burger');
  const links  = $('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      links.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open'); links.classList.remove('open'); document.body.style.overflow = '';
    }));
  }

  /* ----- Reading progress bar ------------------------------------------ */
  const bar = $('.progress');
  const onProgress = () => {
    if (!bar) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  };
  onProgress();
  window.addEventListener('scroll', onProgress, { passive: true });

  /* ----- Reveal on scroll ---------------------------------------------- */
  const revealEls = $$('.reveal, .ink-divider');
  if (reduce) {
    revealEls.forEach(el => el.classList.add('in'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ----- Count-up numbers ---------------------------------------------- */
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dec    = parseInt(el.dataset.decimals || '0', 10);
    if (reduce) { el.textContent = prefix + target.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix; return; }
    const dur = 1500; let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const val = target * easeOutCubic(p);
      el.textContent = prefix + val.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counts = $$('[data-count]');
  if (counts.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counts.forEach(el => cio.observe(el));
  }

  /* ----- SVG draw-in (hero illustration) ------------------------------- */
  const drawGroup = $('.hero-art svg');
  if (drawGroup && !reduce) {
    const paths = $$('.draw', drawGroup);
    paths.forEach((p, i) => {
      try {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.transition = `stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.12}s`;
      } catch (e) {}
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      paths.forEach(p => {
        p.style.strokeDashoffset = '0';
        // Nach dem Zeichnen den Dash entfernen — sonst zeigt Chromium
        // Pfade mit non-scaling-stroke + voller dasharray nicht an.
        p.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'stroke-dashoffset') p.style.strokeDasharray = 'none';
        }, { once: true });
      });
      $$('.draw-fill', drawGroup).forEach((f, i) => { f.style.transitionDelay = (0.9 + i * 0.15) + 's'; f.style.opacity = 1; });
    }));
    // Sicherheits-Fallback: Dash in jedem Fall lösen
    setTimeout(() => paths.forEach(p => { p.style.strokeDasharray = 'none'; }), 3400);
  }

  /* ----- Hero mask-reveal trigger -------------------------------------- */
  const hero = $('.hero');
  if (hero) {
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('ready')));
    // Fallback: Hero-Inhalt darf nie verborgen bleiben (z. B. wenn rAF gedrosselt ist)
    setTimeout(() => hero.classList.add('ready'), 1400);
  }

  /* ----- Parallax (watermark / hero art) ------------------------------- */
  const paraEls = $$('[data-parallax]');
  if (paraEls.length && !reduce) {
    const onPara = () => {
      const y = window.scrollY;
      paraEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = (el.dataset.base || '') + ` translateY(${y * speed}px)`;
      });
    };
    onPara();
    window.addEventListener('scroll', onPara, { passive: true });
  }

  /* ----- 3D tilt on cards ---------------------------------------------- */
  if (window.matchMedia('(hover:hover)').matches && !reduce) {
    $$('.tilt').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', (px * 6) + 'deg');
        card.style.setProperty('--rx', (-py * 6) + 'deg');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ----- Timeline fill -------------------------------------------------- */
  const tl = $('.timeline');
  const fill = $('.timeline-fill');
  if (tl && fill) {
    const onTl = () => {
      const r = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height;
      const progressed = Math.min(Math.max(vh * 0.6 - r.top, 0), total);
      fill.style.height = progressed + 'px';
    };
    onTl();
    window.addEventListener('scroll', onTl, { passive: true });
    window.addEventListener('resize', onTl);
  }

  /* ----- Hero particles (canvas) --------------------------------------- */
  const canvas = $('canvas.particles');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let w, h, parts;
    const seed = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const n = Math.min(30, Math.floor(w / 46));
      parts = Array.from({ length: n }, (_, i) => ({
        x: ((i * 97) % w),
        y: ((i * 53) % h),
        r: 0.6 + (i % 4) * 0.35,
        vx: (((i % 5) - 2) * 0.04) || 0.03,
        vy: -0.10 - (i % 3) * 0.04,
        a: 0.10 + (i % 5) * 0.04
      }));
    };
    seed();
    window.addEventListener('resize', seed);
    (function loop() {
      ctx.clearRect(0, 0, w, h);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -8) { p.y = h + 8; p.x = (p.x + 40) % w; }
        if (p.x < -8) p.x = w + 8; if (p.x > w + 8) p.x = -8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(166,136,79,${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ----- Contact form (Formspree) -------------------------------------- */
  const form = $('#contact-form');
  if (form) {
    const status = $('.form-status', form.parentNode) || $('.form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (status) { status.className = 'form-status'; status.textContent = 'Wird gesendet …'; }
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          if (status) { status.className = 'form-status ok'; status.textContent = 'Vielen Dank — Ihre Nachricht ist eingegangen.'; }
        } else {
          if (status) { status.className = 'form-status err'; status.textContent = 'Es ist ein Fehler aufgetreten. Bitte später erneut versuchen.'; }
        }
      } catch (err) {
        if (status) { status.className = 'form-status err'; status.textContent = 'Verbindung fehlgeschlagen. Bitte später erneut versuchen.'; }
      }
    });
  }

  /* ----- Footer year ---------------------------------------------------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ----- Lucide icons --------------------------------------------------- */
  if (window.lucide) window.lucide.createIcons();
})();
