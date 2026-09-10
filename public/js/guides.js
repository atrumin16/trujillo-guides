(function () {
  'use strict';

  function applyCleanThemeAndTables() {
    // 1. Eliminar el bloque 'poster' superior y el page-title huérfano
    var poster = document.querySelector('.poster');
    if (poster) poster.remove();

    var pageTitle = document.querySelector('h1.page-title');
    if (pageTitle) pageTitle.remove();

    var article = document.querySelector('article.doc') || document.querySelector('main');
    if (!article) return;

    // 2. Línea sutil minimalista debajo del H1 real
    var h1 = article.querySelector('h1');
    if (h1 && !document.getElementById('doc-meta-line')) {
      var meta = document.createElement('div');
      meta.id = 'doc-meta-line';
      meta.style.cssText = 'display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-family: monospace; color: #94a3b8; margin: 8px 0 24px 0; padding-bottom: 12px; border-bottom: 1px solid rgba(51, 65, 85, 0.4);';
      meta.innerHTML = '<span style="color: #f1f5f9; font-weight: 500;">Alberto Trujillo</span>' +
                       '<span>·</span>' +
                       '<span style="color: #38bdf8;">@atrumin16</span>' +
                       '<span>·</span>' +
                       '<span>Guides</span>' +
                       '<span>·</span>' +
                       '<button id="doc-copy-btn" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:0;font:inherit;" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'#94a3b8\'">Copiar enlace</button>';
      
      h1.insertAdjacentElement('afterend', meta);

      var btn = document.getElementById('doc-copy-btn');
      if (btn) {
        btn.onclick = function () {
          navigator.clipboard.writeText(window.location.href);
          btn.textContent = '¡Copiado!';
          setTimeout(function () { btn.textContent = 'Copiar enlace'; }, 1500);
        };
      }
    }

    // 3. Convertir el párrafo de la tabla en un <table> real
    article.querySelectorAll('p').forEach(function (p) {
      var txt = p.innerHTML;
      if (txt.includes('| Valor |') || txt.includes('| :---: |')) {
        var rawCells = txt.split('|').map(function (c) { return c.trim(); }).filter(function (c) { return c.length > 0; });
        var cells = rawCells.filter(function (c) { return !/^:?-+:?$/.test(c); });

        var cols = 4;
        var thead = '<tr>' + cells.slice(0, cols).map(function (th) {
          return '<th style="padding: 10px 14px; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(15, 23, 42, 0.8); color: #cbd5e1; border-bottom: 1px solid rgba(51, 65, 85, 0.6);">' + th + '</th>';
        }).join('') + '</tr>';

        var tbody = '';
        for (var i = cols; i < cells.length; i += cols) {
          var row = cells.slice(i, i + cols);
          if (row.length === cols) {
            tbody += '<tr style="border-bottom: 1px solid rgba(30, 41, 59, 0.6);">' + row.map(function (td) {
              return '<td style="padding: 10px 14px; font-size: 0.85rem; color: #cbd5e1;">' + td + '</td>';
            }).join('') + '</tr>';
          }
        }

        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'overflow-x: auto; margin: 24px 0; border: 1px solid rgba(51, 65, 85, 0.4); border-radius: 8px; background: rgba(15, 23, 42, 0.4);';
        wrapper.innerHTML = '<table style="width: 100%; border-collapse: collapse;"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table>';

        p.replaceWith(wrapper);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCleanThemeAndTables);
  } else {
    applyCleanThemeAndTables();
  }

  var observer = new MutationObserver(function () { applyCleanThemeAndTables(); });
  observer.observe(document.body, { childList: true, subtree: true });
})();
