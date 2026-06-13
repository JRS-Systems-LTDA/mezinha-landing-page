(function () {
  const STORAGE_KEY = 'mezinha.theme';

  function readStoredTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value === 'light' || value === 'dark') return value;
    } catch (_) {
      /* ignore */
    }
    return null;
  }

  function systemTheme() {
    if (typeof window.matchMedia !== 'function') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(mode, persist) {
    document.documentElement.setAttribute('data-theme', mode);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const isDark = mode === 'dark';
      toggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
      toggle.setAttribute('title', isDark ? 'Tema claro' : 'Tema escuro');
      toggle.textContent = isDark ? '☀️' : '🌙';
    }
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch (_) {
        /* ignore */
      }
    }
  }

  function initTheme() {
    applyTheme(readStoredTheme() ?? systemTheme(), false);
  }

  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  }

  function initFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const business = String(data.get('business') || '').trim();
      const message = String(data.get('message') || '').trim();

      const subject = encodeURIComponent('Contato Mezinha — ' + (business || name || 'Site'));
      const body = encodeURIComponent(
        ['Nome: ' + name, 'E-mail: ' + email, 'Estabelecimento: ' + business, '', message].join('\n')
      );

      window.location.href = 'mailto:contato@mezinha.com.br?subject=' + subject + '&body=' + body;
    });
  }

  function wireAppLinks() {
    const appUrl = (window.MEZINHA && window.MEZINHA.appUrl) || 'https://app.mezinha.com.br';
    document.querySelectorAll('[data-app-path]').forEach((el) => {
      const path = el.getAttribute('data-app-path');
      if (path) el.setAttribute('href', appUrl.replace(/\/$/, '') + path);
    });
  }

  initTheme();
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initFooterYear();
    initContactForm();
    wireAppLinks();
  });
})();
