(function () {
  'use strict';

  // 1. Inyectar estilos CSS globales para anular community.css y fijar tipografía y tablas
  var style = document.createElement('style');
  style.id = 'clean-guides-styles';
  style.textContent = `
    /* Ocultar definitivamente el poster azul roto y el h1 duplicado */
    .poster, h1.page-title {
      display: none !important;
    }

    /* Título con estilo serif editorial */
    article.doc h1:first-of-type {
      font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif !important;
      font-size: 2.5rem !important;
      font-weight: 700 !important;
      letter-spacing: -0.03em !important;
      line-height: 1.15 !important;
      color: #f8fafc !important;
      margin: 1.5rem 0 0.75rem 0 !important;
    }

    article.doc h1:first-of-type code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
      font-size: 0.85em !important;
      background: rgba(30, 41, 59, 0.7) !important;
      padding: 0.15em 0.4em !important;
      border-radius: 6px !important;
      border: 1px solid rgba(148, 163, 184, 0.2) !important;
    }

    /* Barra de autor minimalista */
    #doc-author-line {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      flex-wrap: wrap !important;
      gap: 12px !important;
      margin: 0 0 2rem 0 !important;
      padding: 0.75rem 0 !important;
      border-top: 1px solid rgba(148, 163, 184, 0.1) !important;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1) !important;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
      font-size: 0.8rem !important;
    }

    /* Tabla formateada limpia */
    .table-responsive-wrap {
      overflow-x: auto !important;
      margin: 1.75rem 0 !important;
      border: 1px solid #1e293b !important;
      border-radius: 8px !important;
      background: rgba(15, 23, 42, 0.6) !important;
    }

    .table-responsive-wrap table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 0.85rem !important;
      text-align: left !important;
    }

    .table-responsive-wrap th {
      background: #0f172a !important;
      color: #94a3b8 !important;
      padding: 10px 16px !important;
      font-weight: 600 !important;
      font-size: 0.72rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      border-bottom: 1px solid #334155 !important;
    }

    .table-responsive-wrap td {
      padding: 10px 16px !important;
      color: #cbd5e1 !important;
      border-bottom: 1px solid rgba(51, 65, 85, 0.3) !important;
    }

    .table-responsive-wrap tr:hover td {
      background: rgba(30, 41, 59, 0.3) !important;
    }
  `;
  document.head.appendChild(style);

  function fixDOM() {
    var article = document.querySelector('article.doc');
    if (!article) return;

    // 2. Inserción de la línea de autor
    var h1 = article.querySelector('h1');
    if (h1 && !document.getElementById('doc-author-line')) {
      var bar = document.createElement('div');
      bar.id = 'doc-author-line';
      bar.innerHTML = `
        <div style="display:inline-flex; align-items:center; gap:8px;">
          <img src="https://lh3.googleusercontent.com/a/ACg8ocLdgZZbUW1KzSg11REPuHungATAR_SeG52Na5yDYfOOXhpkXzs=s96-c" alt="Avatar" style="width:22px; height:22px; border-radius:50%; object-fit:cover; display:block; border:1px solid rgba(255,255,255,0.15);">
          <span style="color:#f8fafc; font-weight:600;">Alberto Trujillo</span>
          <span style="color:#475569;">·</span>
          <span style="color:#38bdf8;">@atrumin16</span>
          <span style="color:#475569;">·</span>
          <span style="background:rgba(56,189,248,0.12); color:#38bdf8; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:600;">GUIDE</span>
        </div>
        <div style="display:inline-flex; align-items:center; gap:12px;">
          <span style="color:#64748b; font-size:12px;">10 sep 2026</span>
          <span style="color:#475569;">·</span>
          <button id="copy-action-btn" type="button" style="background:rgba(30,41,59,0.7); color:#cbd5e1; border:1px solid rgba(148,163,184,0.2); border-radius:5px; padding:3px 8px; font-size:11px; cursor:pointer; font-family:inherit;">
            <span id="copy-label">Copiar enlace</span>
          </button>
        </div>
      `;
      h1.insertAdjacentElement('afterend', bar);

      var btn = document.getElementById('copy-action-btn');
      var label = document.getElementById('copy-label');
      if (btn && label) {
        btn.onclick = function() {
          navigator.clipboard.writeText(window.location.href);
          label.textContent = '¡Copiado!';
          btn.style.color = '#38bdf8';
          setTimeout(function() {
            label.textContent = 'Copiar enlace';
            btn.style.color = '#cbd5e1';
          }, 1500);
        };
      }
    }

    // 3. Conversión de tabla en párrafo colapsado
    article.querySelectorAll('p').forEach(function (p) {
      var html = p.innerHTML;
      if (html.indexOf('| Valor |') !== -1 || html.indexOf('| :---') !== -1) {
        var rawTokens = html.split('|').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
        var tokens = rawTokens.filter(function(s) { return !/^:?-+:?$/.test(s); });

        var cols = 4;
        var thead = '<tr>' + tokens.slice(0, cols).map(function (th) { return '<th>' + th + '</th>'; }).join('') + '</tr>';

        var tbody = '';
        for (var i = cols; i < tokens.length; i += cols) {
          var row = tokens.slice(i, i + cols);
          if (row.length === cols) {
            tbody += '<tr>' + row.map(function (td) { return '<td>' + td + '</td>'; }).join('') + '</tr>';
          }
        }

        var wrapper = document.createElement('div');
        wrapper.className = 'table-responsive-wrap';
        wrapper.innerHTML = '<table><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table>';

        p.replaceWith(wrapper);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixDOM);
  } else {
    fixDOM();
  }

  var observer = new MutationObserver(function() { fixDOM(); });
  observer.observe(document.body, { childList: true, subtree: true });
})();
