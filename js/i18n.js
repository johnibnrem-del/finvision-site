const I18n = (() => {
  let current = 'ru';
  let data = {};

  function get(key) {
    return key.split('.').reduce((o, k) => o?.[k], data) ?? key;
  }

  function apply() {
    document.documentElement.lang = current;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = get(el.dataset.i18n);
      if (val !== el.dataset.i18n) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = get(el.dataset.i18nHtml);
      if (val !== el.dataset.i18nHtml) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = get(el.dataset.i18nPlaceholder);
      if (val !== el.dataset.i18nPlaceholder) el.placeholder = val;
    });
    // Update active lang button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === current);
    });
  }

  async function load(lang) {
    try {
      const res = await fetch(`locales/${lang}.json?v=3`);
      data = await res.json();
      current = lang;
      localStorage.setItem('fv_lang', lang);
      apply();
    } catch (e) {
      console.warn('i18n load failed:', lang, e);
    }
  }

  function detect() {
    const saved = localStorage.getItem('fv_lang');
    if (saved) return saved;
    const browser = navigator.language?.slice(0, 2);
    return browser === 'ru' ? 'ru' : 'en';
  }

  function init() {
    load(detect());
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => load(btn.dataset.lang));
    });
  }

  return { init, load, get };
})();
