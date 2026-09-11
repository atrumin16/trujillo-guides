(function () {
  'use strict';

  function wrapTables(root) {
    if (!root) return;
    root.querySelectorAll('table').forEach(function (table) {
      if (table.parentElement && table.parentElement.classList.contains('overflow-x-auto')) return;
      if (table.parentElement && table.parentElement.classList.contains('table-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'overflow-x-auto my-6 border border-neutral-800 rounded-lg table-wrap';
      table.classList.add('w-full', 'text-left', 'text-sm');
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function renderMarkdownBlocks() {
    if (!window.marked) return;
    if (typeof marked.setOptions === 'function') {
      marked.setOptions({ gfm: true, breaks: true });
    }
    document.querySelectorAll('[data-markdown], .md-body').forEach(function (el) {
      var src = el.getAttribute('data-markdown') || el.textContent || '';
      if (!src.trim()) return;
      el.innerHTML = marked.parse(src);
      wrapTables(el);
    });
  }

  function bindCopy() {
    var btn = document.getElementById('copy-link') || document.getElementById('doc-copy-btn');
    if (!btn || btn.getAttribute('data-bound')) return;
    btn.setAttribute('data-bound', '1');
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(location.href).then(function () {
        var label = btn.querySelector('span') || btn;
        var prev = label.textContent;
        label.textContent = 'Copiado';
        setTimeout(function () { label.textContent = prev || 'Copiar enlace'; }, 1600);
      }).catch(function () {});
    });
  }

  function boot() {
    renderMarkdownBlocks();
    wrapTables(document.querySelector('article.doc') || document.querySelector('.guide-container') || document.body);
    bindCopy();
  }

  function loadMarked(cb) {
    if (window.marked) { cb(); return; }
    var s = document.createElement('script');
    s.src = '/js/marked.min.js';
    s.onload = cb;
    s.onerror = function () {
      var cdn = document.createElement('script');
      cdn.src = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js';
      cdn.onload = cb;
      cdn.onerror = cb;
      document.head.appendChild(cdn);
    };
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { loadMarked(boot); });
  } else {
    loadMarked(boot);
  }
})();
