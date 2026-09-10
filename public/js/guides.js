(function () {
  'use strict';

  function initGuideElements() {
    var doc = document.querySelector('article.doc');
    if (!doc) return;

    // Inserción de barra de autor bajo el H1
    var h1 = doc.querySelector('h1');
    if (h1 && !document.getElementById('guide-meta-bar')) {
      var bar = document.createElement('div');
      bar.id = 'guide-meta-bar';
      bar.className = 'guide-meta-bar';
      bar.innerHTML = 
        '<div class="guide-meta-left">' +
          '<img class="guide-avatar" src="https://lh3.googleusercontent.com/a/ACg8ocLdgZZbUW1KzSg11REPuHungATAR_SeG52Na5yDYfOOXhpkXzs=s96-c" alt="Alberto Trujillo">' +
          '<span style="color:#f8fafc; font-weight:600;">Alberto Trujillo</span>' +
          '<span style="color:#475569;">·</span>' +
          '<span style="color:#38bdf8;">@atrumin16</span>' +
          '<span style="color:#475569;">·</span>' +
          '<span class="guide-badge">GUIDE</span>' +
        '</div>' +
        '<div class="guide-meta-right">' +
          '<span style="color:#64748b; font-size:12px;">10 sep 2026</span>' +
          '<span style="color:#475569;">·</span>' +
          '<button id="doc-copy-btn" type="button" class="guide-copy-btn">' +
            '<span id="copy-status">Copiar enlace</span>' +
          '</button>' +
        '</div>';

      h1.insertAdjacentElement('afterend', bar);

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

    // Parser de tablas en párrafos colapsados
    doc.querySelectorAll('p').forEach(function (p) {
      var html = p.innerHTML;
      if (html.indexOf('| Valor |') !== -1 || html.indexOf('| :---') !== -1) {
        var rawTokens = html.split('|').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
        var tokens = rawTokens.filter(function (s) { return !/^:?-+:?$/.test(s); });

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
        wrapper.className = 'table-wrapper';
        wrapper.innerHTML = '<table><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table>';

        p.replaceWith(wrapper);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuideElements);
  } else {
    initGuideElements();
  }

  var observer = new MutationObserver(function () { initGuideElements(); });
  observer.observe(document.body, { childList: true, subtree: true });
})();
