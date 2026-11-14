/* =====================================================================
   Kulturwerk — main.js
   ===================================================================== */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Nav: scroll state, progress, burger ---------- */
  var nav = $('.nav'), bar = $('.progress');
  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (bar) {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  var burger = $('.burger'), menu = $('.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var revealEls = $$('.reveal, .rise, .img-reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // Failsafe: Page-Hero-Überschrift/Lead immer sichtbar machen
    setTimeout(function () { $$('.page-hero .rise, .page-hero .reveal').forEach(function (el) { el.classList.add('in'); }); }, 700);
  }

  /* ---------- Count-up ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count),
        dec = parseInt(el.dataset.decimals || '0', 10),
        pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    function fmt(v) { return pre + v.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; }
    if (reduce) { el.textContent = fmt(target); return; }
    var dur = 1500, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counts = $$('[data-count]');
  if (counts.length) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Hero splatter dots ---------- */
  var splat = $('.hero-splatter');
  var COLORS = ['#E8541E', '#8A2FA0', '#2A46C8', '#ECB81C'];
  if (splat) {
    var N = window.innerWidth < 700 ? 14 : 26;
    for (var i = 0; i < N; i++) {
      var s = document.createElement('span');
      var ang = Math.random() * Math.PI * 2;
      var dist = (window.innerWidth < 700 ? 130 : 230) + Math.random() * (window.innerWidth < 700 ? 180 : 420);
      var sz = 6 + Math.random() * 30;
      s.style.left = '50%'; s.style.top = '42%';
      s.style.width = sz + 'px'; s.style.height = (sz * (0.7 + Math.random() * 0.6)) + 'px';
      s.style.marginLeft = (-sz / 2) + 'px'; s.style.marginTop = (-sz / 2) + 'px';
      s.style.background = COLORS[i % COLORS.length];
      s.dataset.x = Math.cos(ang) * dist;
      s.dataset.y = Math.sin(ang) * dist;
      splat.appendChild(s);
    }
  }

  /* ---------- Hero intro timeline (GSAP) ---------- */
  var html = document.documentElement;
  var hero = $('.hero');
  var heroTl = null, heroFinished = false;
  function heroDone() {
    if (heroFinished) return;
    heroFinished = true;
    html.classList.remove('intro');
    if (heroTl) { try { heroTl.progress(1, false); } catch (e) {} }
    if (window.gsap) {
      gsap.set('.hero-cream', { display: 'none', opacity: 0 });
      gsap.set('.hero-splatter span', { opacity: 0 });
      gsap.set('.hero-media', { clipPath: 'none' });
      gsap.set('.hero-shade', { opacity: 1 });
      gsap.set(['.hero-logo', '.hero-tag', '.hero .btns', '.hero-foot', '.nav', '.hero-in'], { clearProps: 'opacity,transform' });
    }
    var c = $('.hero-cream'); if (c) c.style.display = 'none';
  }

  if (hero && window.gsap && !reduce && html.classList.contains('intro')) {
    var g = window.gsap;
    g.set('.hero-media', { clipPath: 'circle(0% at 50% 42%)' });
    g.set('.hero-media .img-1', { scale: 1.35 });
    g.set('.hero-shade', { opacity: 0 });
    g.set('.hero-in', { opacity: 1 });
    g.set(['.hero-logo', '.hero-tag', '.hero .btns', '.hero-foot'], { opacity: 0 });
    g.set('.nav', { opacity: 0, y: -14 });
    html.classList.remove('intro');

    var tl = g.timeline({ defaults: { ease: 'power3.out' }, onComplete: heroDone });
    heroTl = tl;
    tl.fromTo('.hero-cream img', { opacity: 0, scale: 0.86, rotate: -6 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: 'expo.out' }, 0)
      .to('.hero-media', { clipPath: 'circle(150% at 50% 42%)', duration: 2.0, ease: 'expo.inOut' }, 0.8)
      .to('.hero-media .img-1', { scale: 1.08, duration: 2.6, ease: 'expo.out' }, 0.8)
      .to('.hero-cream img', { scale: 3.2, opacity: 0, rotate: 10, duration: 1.3, ease: 'expo.in' }, 0.95)
      .to('.hero-cream', { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, 1.15)
      .set('.hero-cream', { display: 'none' })
      .fromTo('.hero-splatter span', { x: 0, y: 0, scale: 0, opacity: 1 },
        { x: function (i, t) { return +t.dataset.x; }, y: function (i, t) { return +t.dataset.y; }, scale: 1, rotate: function (i) { return i * 23; }, duration: 1.4, ease: 'expo.out', stagger: { each: 0.012 } }, 1.0)
      .to('.hero-splatter span', { opacity: 0, duration: 1.1, ease: 'power2.in' }, 2.0)
      .fromTo('.hero-shade', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 1.7)
      .fromTo('.hero-logo', { opacity: 0, y: 46, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' }, 1.95)
      .fromTo('.hero-tag', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 2.2)
      .fromTo('.hero .btns', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 2.34)
      .fromTo('.nav', { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 2.0)
      .fromTo('.hero-foot', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 2.45);

    // Ungeduld wird belohnt
    var sped = false;
    function speed() { if (!sped) { sped = true; tl.timeScale(5); } }
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) {
      addEventListener(ev, speed, { once: true, passive: true });
    });
    // Sicherheitsnetz
    setTimeout(heroDone, 6000);
  } else {
    heroDone();
  }

  /* ---------- Parallax auf Page-Hero-Bild ---------- */
  var phbg = $('.page-hero .ph-bg');
  if (phbg && !reduce) {
    addEventListener('scroll', function () {
      phbg.style.transform = 'translateY(' + (window.scrollY * 0.18) + 'px)';
    }, { passive: true });
  }

  /* ---------- Contact form (Formspree) ---------- */
  var form = $('#contact-form');
  if (form) {
    var status = $('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) { status.className = 'form-status'; status.textContent = 'Wird gesendet …'; }
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { form.reset(); if (status) { status.className = 'form-status ok'; status.textContent = 'Vielen Dank — Ihre Nachricht ist eingegangen.'; } }
          else if (status) { status.className = 'form-status err'; status.textContent = 'Es ist ein Fehler aufgetreten. Bitte später erneut versuchen.'; }
        })
        .catch(function () { if (status) { status.className = 'form-status err'; status.textContent = 'Verbindung fehlgeschlagen.'; } });
    });
  }

  /* ---------- Jahr, Icons ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if (window.lucide) window.lucide.createIcons();
})();
