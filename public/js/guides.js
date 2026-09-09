(function () {
  'use strict';

  var GUIDES = [
    { href: '/', label: 'Índice' },
    { href: '/guides/enterprise-email/', label: 'Correo empresarial 0 €' },
    { href: '/guides/it-glossary/', label: 'Glosario de sistemas' },
    { href: '/guides/open-sentinel/', label: 'Open-Sentinel' },
    { href: '/guides/edge-ai-architecture/', label: 'Edge AI' },
    { href: '/guides/dns-zero-trust/', label: 'DNS Zero-Trust' },
    { href: '/guides/crypto-telemetry/', label: 'Telemetría on-chain' }
  ];

  function $(id) { return document.getElementById(id); }

  function h(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null && text !== '') n.textContent = text;
    return n;
  }

  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function svgIcon(paths, extra) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    if (extra) svg.setAttribute('class', extra);
    paths.forEach(function (p) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', p.tag);
      Object.keys(p.attrs).forEach(function (k) { el.setAttribute(k, p.attrs[k]); });
      svg.appendChild(el);
    });
    return svg;
  }

  function iconSun() {
    return svgIcon([
      { tag: 'circle', attrs: { cx: '12', cy: '12', r: '5' } },
      { tag: 'line', attrs: { x1: '12', y1: '1', x2: '12', y2: '3' } },
      { tag: 'line', attrs: { x1: '12', y1: '21', x2: '12', y2: '23' } },
      { tag: 'line', attrs: { x1: '4.22', y1: '4.22', x2: '5.64', y2: '5.64' } },
      { tag: 'line', attrs: { x1: '18.36', y1: '18.36', x2: '19.78', y2: '19.78' } },
      { tag: 'line', attrs: { x1: '1', y1: '12', x2: '3', y2: '12' } },
      { tag: 'line', attrs: { x1: '21', y1: '12', x2: '23', y2: '12' } },
      { tag: 'line', attrs: { x1: '4.22', y1: '19.78', x2: '5.64', y2: '18.36' } },
      { tag: 'line', attrs: { x1: '18.36', y1: '5.64', x2: '19.78', y2: '4.22' } }
    ], 'sun-icon');
  }

  function iconMoon() {
    return svgIcon([
      { tag: 'path', attrs: { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' } }
    ], 'moon-icon');
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    var next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('trujillo_theme', next); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#ffffff' : '#080c14');
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', next === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
      btn.title = next === 'light' ? 'Modo oscuro' : 'Modo claro';
    });
  }

  function fillThemeButton(btn) {
    if (!btn) return;
    btn.type = 'button';
    btn.classList.add('theme-toggle-btn');
    btn.id = btn.id || 'theme-btn';
    clearNode(btn);
    btn.appendChild(iconSun());
    btn.appendChild(iconMoon());
    applyTheme(currentTheme());
    if (!btn.getAttribute('data-bound')) {
      btn.setAttribute('data-bound', '1');
      btn.addEventListener('click', function () {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      });
    }
  }

  function buildTopbar() {
    var header = h('header', 'docs-topbar');
    header.id = 'docs-topbar';
    var brand = h('a', 'brand');
    brand.href = '/';
    var img = document.createElement('img');
    img.src = '/avatar.png';
    img.alt = '';
    img.className = 'brand-avatar';
    img.width = 28;
    img.height = 28;
    brand.appendChild(img);
    brand.appendChild(h('span', null, 'ATM Docs'));
    var actions = h('div', 'topbar-actions');
    var themeBtn = h('button', 'theme-toggle-btn');
    fillThemeButton(themeBtn);
    var hub = h('a', 'hub-link', 'Labs Hub');
    hub.href = 'https://labs.trujillomingorance.com';
    hub.rel = 'noopener';
    actions.appendChild(themeBtn);
    actions.appendChild(hub);
    header.appendChild(brand);
    header.appendChild(actions);
    return header;
  }

  function buildShell() {
    var shell = h('div', 'docs-shell');
    var aside = h('aside', 'docs-sidebar');
    var label = h('span', 'sidebar-label', 'Guías');
    var nav = h('nav', 'sidebar-nav');
    nav.setAttribute('aria-label', 'Guías');
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    GUIDES.forEach(function (item) {
      var a = h('a', null, item.label);
      a.href = item.href;
      var target = item.href.replace(/\/+$/, '') || '/';
      if (target === '/' && path === '/') a.classList.add('active');
      else if (target !== '/' && (path === target || path.indexOf(target) === 0)) a.classList.add('active');
      nav.appendChild(a);
    });
    aside.appendChild(label);
    if (document.querySelector('.guide-card')) {
      var searchWrap = h('label', 'sidebar-search');
      searchWrap.appendChild(h('span', 'sidebar-label', 'Buscar'));
      var input = document.createElement('input');
      input.type = 'search';
      input.id = 'guide-search';
      input.placeholder = 'Buscar guías…';
      input.autocomplete = 'off';
      input.spellcheck = false;
      searchWrap.appendChild(input);
      aside.insertBefore(searchWrap, nav);
    }
    aside.appendChild(nav);
    aside.appendChild(h('p', 'sidebar-note', 'Mismo formato en todo el hub.'));
    var main = h('main', 'docs-main');
    shell.appendChild(aside);
    shell.appendChild(main);
    return shell;
  }

  function ensureChrome() {
    document.body.classList.add('docs-body');
    var topbar = document.querySelector('.docs-topbar');
    if (!topbar) {
      topbar = buildTopbar();
      document.body.insertBefore(topbar, document.body.firstChild);
    } else {
      var existing = topbar.querySelector('.theme-toggle-btn, #theme-btn, #theme-toggle-btn');
      if (existing) fillThemeButton(existing);
      else {
        var actions = topbar.querySelector('.topbar-actions') || topbar;
        var btn = h('button', 'theme-toggle-btn');
        fillThemeButton(btn);
        actions.insertBefore(btn, actions.firstChild);
      }
    }

    var hasShell = !!document.querySelector('.docs-shell');
    if (!hasShell) {
      var shell = buildShell();
      var main = shell.querySelector('.docs-main');
      var move = [];
      Array.prototype.forEach.call(document.body.childNodes, function (n) {
        if (n === topbar || n === shell) return;
        if (n.nodeType === 1 && (n.tagName === 'SCRIPT' || n.id === 'userModal' || n.id === 'docs-topbar' || n.id === 'progress-bar' || n.id === 'back-to-top' || n.classList.contains('docs-topbar'))) return;
        move.push(n);
      });
      document.body.appendChild(shell);
      move.forEach(function (n) { main.appendChild(n); });
    }

    document.querySelectorAll('.theme-toggle-btn, #theme-btn, #theme-toggle-btn').forEach(fillThemeButton);

    var glossaryTheme = $('darkModeToggle') || $('darkModeToggleBind');
    if (glossaryTheme) glossaryTheme.classList.add('hidden');

    var actions = topbar.querySelector('.topbar-actions');
    var langEs = $('lang-btn-es');
    var langEn = $('lang-btn-en');
    if (actions && langEs && langEn && !topbar.querySelector('#lang-btn-es')) {
      actions.insertBefore(langEn, actions.firstChild);
      actions.insertBefore(langEs, actions.firstChild);
    }
  }

  function attachCopyButtons() {
    document.querySelectorAll('pre, .code-box').forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;
      var wrap = h('div', 'code-block');
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
        var code = container.querySelector('code, pre, .code-box');
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

  function bindSearch() {
    var search = $('guide-search');
    if (!search) return;
    search.addEventListener('input', function () {
      var q = (search.value || '').trim().toLowerCase();
      document.querySelectorAll('.guide-card').forEach(function (card) {
        var blob = (card.textContent || '').toLowerCase();
        card.classList.toggle('is-filtered-out', q && blob.indexOf(q) === -1);
      });
    });
  }

  function bindLang() {
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
  }

  function boot() {
    try {
      applyTheme(localStorage.getItem('trujillo_theme') || currentTheme());
    } catch (e) {
      applyTheme('dark');
    }
    ensureChrome();
    attachCopyButtons();
    bindSearch();
    bindLang();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
