/* ═════════════════════════════════════════════════════════════════════
   BIPLOV SINGH — MINIMALIST PORTFOLIO SCRIPT
   biplovsingh.dev
   ═════════════════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM Selectors ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═════════════════════════════════════════════════════════════════════
   THEME TOGGLE (Dark / Light)
   ═════════════════════════════════════════════════════════════════════ */
(function initTheme() {
  const root = document.documentElement;
  const btn = $('#themeToggle');
  const icon = $('#themeIcon');
  const STORAGE_KEY = 'portfolio-theme';

  const savedTheme = localStorage.getItem(STORAGE_KEY) ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  applyTheme(savedTheme);

  btn?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  });

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
})();

/* ═════════════════════════════════════════════════════════════════════
   NAVBAR & SECTION HIGHLIGHTING
   ═════════════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  const onScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);

    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.id;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ═════════════════════════════════════════════════════════════════════
   MOBILE NAVIGATION MENU
   ═════════════════════════════════════════════════════════════════════ */
(function initHamburger() {
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('.nav-link, .nav-links .btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ═════════════════════════════════════════════════════════════════════
   BACK TO TOP BUTTON
   ═════════════════════════════════════════════════════════════════════ */
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

/* ═════════════════════════════════════════════════════════════════════
   CONTACT FORM VALIDATION & SUBMISSION
   ═════════════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const formSuccess = $('#formSuccess');
  if (formSuccess) {
    formSuccess.hidden = true;
    formSuccess.style.display = 'none';
  }

  const fields = {
    name: {
      el: $('#name'),
      error: $('#nameError'),
      validate: v => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.'
    },
    email: {
      el: $('#email'),
      error: $('#emailError'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.'
    },
    subject: {
      el: $('#subject'),
      error: $('#subjectError'),
      validate: v => v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.'
    },
    message: {
      el: $('#message'),
      error: $('#messageError'),
      validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'
    }
  };

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

    let isValid = true;
    Object.values(fields).forEach(({ el, error, validate }) => {
      const msg = validate(el?.value ?? '');
      if (error) error.textContent = msg;
      el?.classList.toggle('error', !!msg);
      if (msg) isValid = false;
    });

    if (!isValid) return;

    const submitBtn = $('#submitBtn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');

    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoading) btnLoading.hidden = false;

    try {
      const formData = new FormData(form);
      const res = await fetch('https://formspree.io/f/mlgojawz', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (btnText) btnText.hidden = false;
      if (btnLoading) btnLoading.hidden = true;
      if (submitBtn) submitBtn.disabled = false;

      if (res.ok) {
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.style.display = 'flex';
          form.reset();
          setTimeout(() => {
            formSuccess.hidden = true;
            formSuccess.style.display = 'none';
          }, 6000);
        }
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      if (btnText) btnText.hidden = false;
      if (btnLoading) btnLoading.hidden = true;
      if (submitBtn) submitBtn.disabled = false;
      alert('An error occurred while sending the message. Please try again.');
    }
  });
})();

/* ═════════════════════════════════════════════════════════════════════
   FOOTER YEAR
   ═════════════════════════════════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
