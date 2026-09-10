(function () {
  'use strict';

  function parseMarkdownTables() {
    var doc = document.querySelector('article.doc');
    if (!doc) return;

    doc.querySelectorAll('p').forEach(function (p) {
      var html = p.innerHTML;
      if (html.indexOf('| Valor |') !== -1 || html.indexOf('| :---') !== -1) {
        var rawTokens = html.split('|').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
        var tokens = rawTokens.filter(function(s) { return !/^:?-+:?$/.test(s); });

        var cols = 4;
        var thead = '<tr>' + tokens.slice(0, cols).map(function (th) {
          return '<th>' + th + '</th>';
        }).join('') + '</tr>';

        var tbody = '';
        for (var i = cols; i < tokens.length; i += cols) {
          var row = tokens.slice(i, i + cols);
          if (row.length === cols) {
            tbody += '<tr>' + row.map(function (td) {
              return '<td>' + td + '</td>';
            }).join('') + '</tr>';
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
    document.addEventListener('DOMContentLoaded', parseMarkdownTables);
  } else {
    parseMarkdownTables();
  }
})();
