/* ═══════════════════════════════════════════════
   BIPLOV SINGH — PORTFOLIO SCRIPT
   biplovsingh.dev
══════════════════════════════════════════════ */

'use strict';

/* ── Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════
   THEME TOGGLE (dark / light)
══════════════════════════════════════════ */
(function initTheme() {
  const root    = document.documentElement;
  const btn     = $('#themeToggle');
  const icon    = $('#themeIcon');
  const STORAGE = 'portfolio-theme';

  const saved = localStorage.getItem(STORAGE) ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  applyTheme(saved);

  btn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE, next);
    btn.classList.add('spin');
    setTimeout(() => btn.classList.remove('spin'), 400);
  });

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
})();

/* ══════════════════════════════════════════
   NAVBAR — scroll / active link
══════════════════════════════════════════ */
(function initNavbar() {
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  const onScroll = () => {
    // Scrolled class for blur background
    navbar?.classList.toggle('scrolled', window.scrollY > 20);

    // Active link highlight
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const h   = sec.offsetHeight;
      const id  = sec.id;
      if (scrollY >= top && scrollY < top + h) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ══════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════ */
(function initHamburger() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  $$('.nav-link, .nav-links .btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ══════════════════════════════════════════
   TYPEWRITER EFFECT
══════════════════════════════════════════ */
(function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const phrases = [
    'ML Pipelines',
    'Deep Learning Models',
    'Data Pipelines',
    'Intelligent Solutions',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  const TYPING_SPEED  = 75;
  const DELETING_SPEED= 40;
  const PAUSE_AFTER   = 1800;
  const PAUSE_BEFORE  = 350;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting && charIdx <= current.length) {
      el.textContent = current.slice(0, charIdx);
      charIdx++;
      if (charIdx > current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; tick(); }, PAUSE_AFTER);
        return;
      }
    } else if (deleting && charIdx >= 0) {
      el.textContent = current.slice(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(() => { charIdx = 0; tick(); }, PAUSE_BEFORE);
        return;
      }
    }

    if (!paused) {
      setTimeout(tick, deleting ? DELETING_SPEED : TYPING_SPEED);
    }
  }

  tick();
})();

/* ══════════════════════════════════════════
   SCROLL ANIMATIONS (lightweight AOS)
══════════════════════════════════════════ */
(function initScrollAnim() {
  const elements = $$('[data-aos]');
  if (!elements.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════
   BACK TO TOP BUTTON
══════════════════════════════════════════ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════
   CONTACT FORM (validation + submit)
══════════════════════════════════════════ */
(function initContactForm() {
  const form    = $('#contactForm');
  if (!form) return;

  const fields = {
    name:    { el: $('#name'),    error: $('#nameError'),    validate: v => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.' },
    email:   { el: $('#email'),   error: $('#emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    message: { el: $('#message'), error: $('#messageError'), validate: v => v.trim().length >= 15 ? '' : 'Message must be at least 15 characters.' },
  };

  // Live validation on blur
  Object.values(fields).forEach(({ el, error, validate }) => {
    el?.addEventListener('blur', () => {
      const msg = validate(el.value);
      if (error) error.textContent = msg;
      el.classList.toggle('error', !!msg);
    });
    el?.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const msg = validate(el.value);
        if (error) error.textContent = msg;
        el.classList.toggle('error', !!msg);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all
    let isValid = true;
    Object.values(fields).forEach(({ el, error, validate }) => {
      const msg = validate(el?.value ?? '');
      if (error) error.textContent = msg;
      el?.classList.toggle('error', !!msg);
      if (msg) isValid = false;
    });

    if (!isValid) return;

    // Simulate async submit (replace with real endpoint)
    const submitBtn    = $('#submitBtn');
    const btnText      = submitBtn?.querySelector('.btn-text');
    const btnLoading   = submitBtn?.querySelector('.btn-loading');
    const formSuccess  = $('#formSuccess');

    if (submitBtn)  submitBtn.disabled = true;
    if (btnText)    btnText.hidden     = true;
    if (btnLoading) btnLoading.hidden  = false;

    await new Promise(r => setTimeout(r, 1400));

    if (btnText)    btnText.hidden     = false;
    if (btnLoading) btnLoading.hidden  = true;
    if (submitBtn)  submitBtn.disabled = false;

    // Show success
    if (formSuccess) {
      formSuccess.hidden = false;
      form.reset();
      setTimeout(() => { formSuccess.hidden = true; }, 6000);
    }

    /*
      TO CONNECT A REAL BACKEND:

      const data = new FormData(form);
      const res  = await fetch('https://formspree.io/f/YOUR_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) { ... show success ... }
    */
  });
})();

/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════
   SMOOTH ANCHOR CLICKS (extra safety)
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════════════════════════════════════
   CURSOR GLOW EFFECT (desktop only)
══════════════════════════════════════════ */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,255,0.045) 0%, transparent 65%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0; left: 0;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let raf;
  let cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    glow.style.opacity = '1';
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
    });
  });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
})();
