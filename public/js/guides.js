(function () {
  'use strict';

  function h(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null && text !== '') n.textContent = text;
    return n;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('trujillo_theme', theme); } catch (e) {}
  }

  try {
    applyTheme(localStorage.getItem('trujillo_theme') || document.documentElement.getAttribute('data-theme') || 'dark');
  } catch (e) {
    applyTheme('dark');
  }

  var themeBtn = document.getElementById('theme-btn') || document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  function attachCopyButtons() {
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;
      var wrap = document.createElement('div');
      wrap.className = 'code-block';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var btn = h('button', 'copy-btn', 'Copiar');
      btn.type = 'button';
      wrap.appendChild(btn);
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.copy-btn, .dns-quick-copy') : null;
    if (!btn) return;
    var text = btn.getAttribute('data-copy') || '';
    if (!text) {
      var container = btn.closest('.code-block, .code-container');
      if (container) {
        var code = container.querySelector('code, pre');
        if (code) text = code.textContent.trim();
      }
    }
    if (!text) return;
    var orig = btn.textContent;
    function done() {
      btn.textContent = 'Copiado';
      setTimeout(function () { btn.textContent = orig; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {});
    }
  });

  if (document.querySelector('pre')) attachCopyButtons();

  var search = document.getElementById('guide-search');
  if (search) {
    search.addEventListener('input', function () {
      var q = (search.value || '').trim().toLowerCase();
      document.querySelectorAll('.guide-card').forEach(function (card) {
        var blob = (card.textContent || '').toLowerCase();
        card.classList.toggle('is-filtered-out', q && blob.indexOf(q) === -1);
      });
    });
  }

  var langBtns = document.querySelectorAll('[data-lang]');
  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      document.documentElement.lang = lang;
      try { localStorage.setItem('atm_lang', lang); } catch (e) {}
      langBtns.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        var map = window.GUIDE_STRINGS && window.GUIDE_STRINGS[lang];
        if (map && map[key]) el.textContent = map[key];
      });
    });
  });
})();
