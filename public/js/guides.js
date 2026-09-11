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

  function metaBarHtml() {
    return (
      '<div id="guide-meta-bar" class="meta-bar">' +
        '<img class="by-logo" src="/avatar.png" alt="" width="28" height="28">' +
        '<p class="meta-line"><strong>Alberto Trujillo Mingorance</strong> · @atrumin16 · <span class="guide-badge">Guides</span></p>' +
        '<button type="button" class="copy-link" id="doc-copy-btn"><span>Copiar enlace</span></button>' +
      '</div>'
    );
  }

  function isMetaNode(el) {
    if (!el || !el.classList) return false;
    return el.classList.contains('meta-bar') ||
      el.classList.contains('guide-meta-bar') ||
      el.classList.contains('guide-meta-line') ||
      el.id === 'guide-meta-bar';
  }

  function bindCopy(btn) {
    if (!btn || btn.getAttribute('data-bound')) return;
    btn.setAttribute('data-bound', '1');
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(window.location.href).then(function () {
        var span = btn.querySelector('span') || btn;
        var prev = span.textContent;
        span.textContent = 'Copiado';
        setTimeout(function () { span.textContent = prev || 'Copiar enlace'; }, 1600);
      }).catch(function () {});
    });
  }

  function isGuidePage() {
    if (document.getElementById('community-feed')) return false;
    return !!(
      document.querySelector('.guide-container') ||
      document.querySelector('article.doc') ||
      document.querySelector('article.guide-content')
    );
  }

  function placeMetaBars() {
    if (document.querySelector('.article-head .meta-bar')) return;
    var titles = document.querySelectorAll('h1.page-title, h1.guide-title');
    if (!titles.length) return;
    titles.forEach(function (h1) {
      if (isMetaNode(h1.nextElementSibling)) return;
      var parent = h1.parentElement;
      if (!parent) return;
      var existing = Array.prototype.find.call(parent.children, isMetaNode);
      if (existing) {
        h1.insertAdjacentElement('afterend', existing);
        return;
      }
      h1.insertAdjacentHTML('afterend', metaBarHtml());
    });
    document.querySelectorAll('#copy-link, #doc-copy-btn, .copy-link').forEach(bindCopy);
  }

  function initGuideElements() {
    if (!isGuidePage()) return;
    placeMetaBars();
    wrapTables(document.querySelector('article.doc') || document.querySelector('.guide-container') || document.querySelector('article.guide-content') || document.body);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGuideElements);
  else initGuideElements();
})();
