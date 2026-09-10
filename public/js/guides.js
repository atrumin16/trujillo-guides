(function () {
  'use strict';

  function applyCleanThemeAndTables() {
    // 1. Ocultar el bloque poster viejo y el h1 huérfano de la shell
    var poster = document.querySelector('.poster');
    if (poster) poster.style.display = 'none';

    var pageTitle = document.querySelector('h1.page-title');
    if (pageTitle) pageTitle.style.display = 'none';

    var article = document.querySelector('article.doc') || document.querySelector('main');
    if (!article) return;

    // 2. Cabecera profesional integrada con avatar justo debajo del H1 real
    var h1 = article.querySelector('h1');
    if (h1 && !document.getElementById('doc-meta-line')) {
      h1.style.letterSpacing = '-0.025em';
      h1.style.marginBottom = '12px';

      var meta = document.createElement('div');
      meta.id = 'doc-meta-line';
      meta.style.cssText = 'display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin: 0 0 32px 0; padding: 12px 0; border-top: 1px solid rgba(148, 163, 184, 0.08); border-bottom: 1px solid rgba(148, 163, 184, 0.08); font-size: 0.8125rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;';
      
      meta.innerHTML = 
        '<div style="display: flex; align-items: center; gap: 10px;">' +
          '<img src="https://lh3.googleusercontent.com/a/ACg8ocLdgZZbUW1KzSg11REPuHungATAR_SeG52Na5yDYfOOXhpkXzs=s96-c" alt="Alberto Trujillo" style="width: 26px; height: 26px; border-radius: 9999px; object-fit: cover; border: 1px solid rgba(148, 163, 184, 0.2);">' +
          '<span style="color: #f8fafc; font-weight: 500;">Alberto Trujillo</span>' +
          '<span style="color: #475569;">·</span>' +
          '<span style="color: #38bdf8;">@atrumin16</span>' +
          '<span style="color: #475569;">·</span>' +
          '<span style="background: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 1px 7px; border-radius: 4px; font-size: 0.7rem; font-weight: 500; border: 1px solid rgba(56, 189, 248, 0.2);">GUIDE</span>' +
        '</div>' +
        '<div style="display: flex; align-items: center; gap: 12px;">' +
          '<span style="color: #64748b;">10 sep 2026</span>' +
          '<span style="color: #475569;">·</span>' +
          '<button id="doc-copy-btn" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(30, 41, 59, 0.6); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.15); border-radius: 6px; padding: 3px 10px; font-size: 0.75rem; font-family: inherit; cursor: pointer; transition: all 0.15s ease;" onmouseover="this.style.background=\'rgba(51, 65, 85, 0.8)\'; this.style.color=\'#fff\';" onmouseout="this.style.background=\'rgba(30, 41, 59, 0.6)\'; this.style.color=\'#94a3b8\';">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
            '<span id="copy-text">Copiar enlace</span>' +
          '</button>' +
        '</div>';
      
      h1.insertAdjacentElement('afterend', meta);

      var btn = document.getElementById('doc-copy-btn');
      var label = document.getElementById('copy-text');
      if (btn && label) {
        btn.onclick = function () {
          navigator.clipboard.writeText(window.location.href);
          label.textContent = '¡Copiado!';
          btn.style.color = '#38bdf8';
          btn.style.borderColor = 'rgba(56, 189, 248, 0.4)';
          setTimeout(function () { 
            label.textContent = 'Copiar enlace'; 
            btn.style.color = '#94a3b8';
            btn.style.borderColor = 'rgba(148, 163, 184, 0.15)';
          }, 1800);
        };
      }
    }

    // 3. Renderizado de tablas con diseño técnico oscuro
    article.querySelectorAll('p').forEach(function (p) {
      var txt = p.innerHTML;
      if (txt.includes('| Valor |') || txt.includes('| :---: |')) {
        var rawCells = txt.split('|').map(function (c) { return c.trim(); }).filter(function (c) { return c.length > 0; });
        var cells = rawCells.filter(function (c) { return !/^:?-+:?$/.test(c); });

        var cols = 4;
        var thead = '<tr>' + cells.slice(0, cols).map(function (th) {
          return '<th style="padding: 10px 16px; text-align: left; font-size: 0.72rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; background: #0f172a; color: #94a3b8; border-bottom: 1px solid #334155;">' + th + '</th>';
        }).join('') + '</tr>';

        var tbody = '';
        for (var i = cols; i < cells.length; i += cols) {
          var row = cells.slice(i, i + cols);
          if (row.length === cols) {
            tbody += '<tr style="border-bottom: 1px solid rgba(51, 65, 85, 0.35); transition: background 0.15s ease;" onmouseover="this.style.background=\'rgba(30, 41, 59, 0.4)\'" onmouseout="this.style.background=\'transparent\'">' + row.map(function (td) {
              return '<td style="padding: 11px 16px; font-size: 0.84rem; color: #cbd5e1;">' + td + '</td>';
            }).join('') + '</tr>';
          }
        }

        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'overflow-x: auto; margin: 28px 0; border: 1px solid #1e293b; border-radius: 10px; background: rgba(15, 23, 42, 0.6); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);';
        wrapper.innerHTML = '<table style="width: 100%; border-collapse: collapse; text-align: left;"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table>';

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
