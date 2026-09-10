(function () {
  'use strict';

  function applyGuideLayout() {
    var doc = document.querySelector('article.doc');
    if (!doc) return;

    // 1. Eliminar por completo el bloque del cuadro azul superior
    document.querySelectorAll('.poster, .page-title').forEach(function(el) {
      el.remove();
    });

    // 2. Estilizar el H1 con la tipografía serif editorial de ATM Docs
    var h1 = doc.querySelector('h1');
    if (h1) {
      h1.setAttribute('style', 'font-family: "Newsreader", Georgia, Cambria, "Times New Roman", serif !important; font-size: 2.35rem !important; font-weight: 700 !important; letter-spacing: -0.025em !important; line-height: 1.15 !important; color: #ffffff !important; margin: 0 0 16px 0 !important;');
      
      var codeInH1 = h1.querySelector('code');
      if (codeInH1) {
        codeInH1.setAttribute('style', 'font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important; font-size: 0.85em !important; background: rgba(30, 41, 59, 0.7) !important; padding: 2px 8px !important; border-radius: 6px !important; border: 1px solid rgba(148, 163, 184, 0.2) !important; font-weight: 500 !important;');
      }
    }

    // 3. Barra de autor minimalista (una sola línea)
    if (h1 && !document.getElementById('guide-meta-line')) {
      var meta = document.createElement('div');
      meta.id = 'guide-meta-line';
      meta.setAttribute('style', 'display: flex !important; align-items: center !important; justify-content: space-between !important; flex-wrap: wrap; gap: 12px; margin: 0 0 36px 0 !important; padding: 12px 0 !important; border-top: 1px solid rgba(148, 163, 184, 0.12) !important; border-bottom: 1px solid rgba(148, 163, 184, 0.12) !important; font-family: ui-monospace, SFMono-Regular, monospace !important; font-size: 13px !important; line-height: 1 !important;');

      meta.innerHTML = 
        '<div style="display: inline-flex; align-items: center; gap: 8px;">' +
          '<img src="https://lh3.googleusercontent.com/a/ACg8ocLdgZZbUW1KzSg11REPuHungATAR_SeG52Na5yDYfOOXhpkXzs=s96-c" alt="Avatar" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; display: block; border: 1px solid rgba(255, 255, 255, 0.15);">' +
          '<span style="color: #f8fafc; font-weight: 600;">Alberto Trujillo</span>' +
          '<span style="color: #475569;">·</span>' +
          '<span style="color: #38bdf8;">@atrumin16</span>' +
          '<span style="color: #475569;">·</span>' +
          '<span style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; border: 1px solid rgba(56, 189, 248, 0.25);">GUIDE</span>' +
        '</div>' +
        '<div style="display: inline-flex; align-items: center; gap: 12px;">' +
          '<span style="color: #64748b; font-size: 12px;">10 sep 2026</span>' +
          '<span style="color: #475569;">·</span>' +
          '<button id="doc-copy-btn" type="button" style="background: rgba(30, 41, 59, 0.7); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 5px; padding: 4px 10px; font-size: 11px; cursor: pointer; font-family: inherit;">' +
            '<span id="copy-status">Copiar enlace</span>' +
          '</button>' +
        '</div>';

      h1.insertAdjacentElement('afterend', meta);

      var btn = document.getElementById('doc-copy-btn');
      var status = document.getElementById('copy-status');
      if (btn && status) {
        btn.onclick = function () {
          navigator.clipboard.writeText(window.location.href);
          status.textContent = '¡Copiado!';
          btn.style.color = '#38bdf8';
          btn.style.borderColor = 'rgba(56, 189, 248, 0.5)';
          setTimeout(function () {
            status.textContent = 'Copiar enlace';
            btn.style.color = '#cbd5e1';
            btn.style.borderColor = 'rgba(148, 163, 184, 0.2)';
          }, 1800);
        };
      }
    }

    // 4. Parser para la tabla Markdown colapsada en <p>
    doc.querySelectorAll('p').forEach(function (p) {
      var html = p.innerHTML;
      if (html.indexOf('| Valor |') !== -1 || html.indexOf('| :---') !== -1) {
        var rawTokens = html.split('|').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
        var tokens = rawTokens.filter(function(s) { return !/^:?-+:?$/.test(s); });

        var cols = 4;
        var thead = '<tr>' + tokens.slice(0, cols).map(function (th) {
          return '<th style="padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; background: #0f172a; color: #94a3b8; border-bottom: 1px solid #334155;">' + th + '</th>';
        }).join('') + '</tr>';

        var tbody = '';
        for (var i = cols; i < tokens.length; i += cols) {
          var row = tokens.slice(i, i + cols);
          if (row.length === cols) {
            tbody += '<tr style="border-bottom: 1px solid rgba(51, 65, 85, 0.3);">' + row.map(function (td) {
              return '<td style="padding: 10px 14px; font-size: 13px; color: #cbd5e1;">' + td + '</td>';
            }).join('') + '</tr>';
          }
        }

        var wrapper = document.createElement('div');
        wrapper.setAttribute('style', 'overflow-x: auto; margin: 24px 0; border: 1px solid #1e293b; border-radius: 8px; background: #0b1120;');
        wrapper.innerHTML = '<table style="width: 100%; border-collapse: collapse; text-align: left;"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table>';

        p.replaceWith(wrapper);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGuideLayout);
  } else {
    applyGuideLayout();
  }

  var observer = new MutationObserver(function () { applyGuideLayout(); });
  observer.observe(document.body, { childList: true, subtree: true });
})();
