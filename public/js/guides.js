(function () {
  'use strict';

  var TABLE_WRAP = 'overflow-x-auto my-6 border border-neutral-800 rounded-lg bg-neutral-950/40 table-wrap';
  var ATTACH_EXT = /^(pdf|docx|doc|xlsx|xls|csv|zip)$/i;
  var SKIP_TICKER = { PRE: 1, CODE: 1, A: 1, SCRIPT: 1, TEXTAREA: 1, SVG: 1 };

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function readMarkdown() {
    var block = document.getElementById('guide-markdown');
    if (block && block.textContent.trim()) return block.textContent;
    var el = $('[data-markdown]');
    if (el) return el.getAttribute('data-markdown') || el.textContent || '';
    return '';
  }

  function readPayload() {
    var el = document.getElementById('guide-payload');
    if (!el) return {};
    try { return JSON.parse(el.textContent || '{}') || {}; } catch (e) { return {}; }
  }

  function preprocess(md) {
    return String(md || '').replace(/\r\n/g, '\n')
      .replace(/^<(?:TradingViewWidget|tradingview)\s+symbol=["']([^"']+)["'](?:\s+interval=["']([^"']+)["'])?[^>]*\/?\s*>$/gim,
        function (_, sym, iv) {
          return '<div data-widget="tradingview" data-symbol="' + sym + '" data-interval="' + (iv || 'D') + '"></div>\n';
        })
      .replace(/^:::tradingview\s+(\S+)(?:\s+(\S+))?.*$/gm, function (_, sym, iv) {
        return '<div data-widget="tradingview" data-symbol="' + sym + '" data-interval="' + (iv || 'D') + '"></div>\n';
      });
  }

  function configureMarked() {
    if (!window.marked) return false;
    if (typeof marked.setOptions === 'function') {
      marked.setOptions({ gfm: true, breaks: true });
    }
    if (typeof marked.use === 'function') {
      marked.use({
        gfm: true,
        breaks: true,
        renderer: {
          table: function (header, body) {
            if (header && typeof header === 'object') return false;
            return '<div class="' + TABLE_WRAP + '"><table class="w-full text-left text-sm border-collapse"><thead>' +
              header + '</thead><tbody>' + body + '</tbody></table></div>\n';
          }
        }
      });
    }
    return true;
  }

  function wrapTables(root) {
    if (!root) return;
    root.querySelectorAll('table').forEach(function (table) {
      var parent = table.parentElement;
      if (parent && (parent.classList.contains('overflow-x-auto') || parent.classList.contains('table-wrap'))) {
        parent.className = TABLE_WRAP;
        table.classList.add('w-full', 'text-left', 'text-sm');
        return;
      }
      var wrap = document.createElement('div');
      wrap.className = TABLE_WRAP;
      table.classList.add('w-full', 'text-left', 'text-sm');
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function linkifyTickers(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentElement;
        if (!p || SKIP_TICKER[p.tagName]) return NodeFilter.FILTER_REJECT;
        if (!/\$[A-Z]{1,6}/.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      var re = /(^|[\s(])\$([A-Z]{1,6}(?:-[A-Z]{1,4})?)\b/g;
      var text = node.nodeValue;
      var last = 0;
      var m;
      while ((m = re.exec(text))) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        frag.appendChild(document.createTextNode(m[1]));
        var a = document.createElement('a');
        a.className = 'ticker';
        a.href = 'https://www.tradingview.com/symbols/' + encodeURIComponent(m[2]) + '/';
        a.rel = 'noopener';
        a.target = '_blank';
        a.textContent = '$' + m[2];
        frag.appendChild(a);
        last = m.index + m[0].length;
      }
      if (!last) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  function mountTradingView(root) {
    if (!root) return;
    root.querySelectorAll('[data-widget="tradingview"]').forEach(function (el) {
      if (el.getAttribute('data-mounted')) return;
      el.setAttribute('data-mounted', '1');
      el.classList.add('tv-wrap');
      var symbol = encodeURIComponent(el.getAttribute('data-symbol') || 'NASDAQ:AAPL');
      var interval = encodeURIComponent(el.getAttribute('data-interval') || 'D');
      var iframe = document.createElement('iframe');
      iframe.loading = 'lazy';
      iframe.title = 'TradingView ' + (el.getAttribute('data-symbol') || '');
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.src = 'https://s.tradingview.com/widgetembed/?symbol=' + symbol +
        '&interval=' + interval + '&hidesidetoolbar=1&theme=dark&style=1&locale=es&hideideas=1';
      el.appendChild(iframe);
    });
  }

  function formatSize(n) {
    n = Number(n) || 0;
    if (n <= 0) return '';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1).replace(/\.0$/, '') + ' KB';
    return (n / 1048576).toFixed(1).replace(/\.0$/, '') + ' MB';
  }

  function renderAttachments(list, mount) {
    mount = mount || document.getElementById('guide-attachments');
    if (!mount) return;
    var items = (Array.isArray(list) ? list : []).filter(function (a) {
      if (!a || !a.url) return false;
      var ext = String(a.ext || (String(a.name || a.url).split('.').pop() || '')).toLowerCase();
      return ATTACH_EXT.test(ext) && (String(a.url).indexOf('https://') === 0 || String(a.url).charAt(0) === '/');
    });
    if (!items.length) {
      mount.hidden = true;
      mount.innerHTML = '';
      return;
    }
    mount.hidden = false;
    mount.innerHTML = '<h2>Adjuntos</h2>' + items.map(function (a) {
      var ext = String(a.ext || (String(a.name || '').split('.').pop() || '')).toLowerCase();
      var size = formatSize(a.size);
      return '<a class="attach-card" href="' + esc(a.url) + '" rel="noopener" download>' +
        '<span class="attach-badge">' + esc(ext) + '</span>' +
        '<span class="attach-meta"><strong>' + esc(a.name || 'archivo.' + ext) + '</strong>' +
        (size ? '<span>' + esc(size) + '</span>' : '') + '</span>' +
        '<span class="attach-dl">Descargar</span></a>';
    }).join('');
  }

  function bindCopy(btn) {
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

  function isMetaNode(el) {
    return !!(el && el.classList && (
      el.classList.contains('meta-bar') ||
      el.classList.contains('guide-meta-bar') ||
      el.classList.contains('guide-meta-line') ||
      el.id === 'guide-meta-bar'
    ));
  }

  function isGuidePage() {
    if (document.getElementById('community-feed')) return false;
    return !!(
      document.querySelector('.guide-container') ||
      document.querySelector('article.doc') ||
      document.querySelector('article.guide-content') ||
      document.getElementById('guide-body')
    );
  }

  function placeMetaBar() {
    if (document.querySelector('.article-head .meta-bar')) {
      document.querySelectorAll('#copy-link, #doc-copy-btn, .copy-link').forEach(bindCopy);
      return;
    }
    var titles = document.querySelectorAll('h1.page-title, h1.guide-title');
    titles.forEach(function (h1) {
      if (isMetaNode(h1.nextElementSibling)) {
        h1.nextElementSibling.classList.add('border-b', 'border-neutral-800', 'pb-4', 'mb-8');
        return;
      }
      var parent = h1.parentElement;
      if (!parent) return;
      var existing = Array.prototype.find.call(parent.children, isMetaNode);
      if (existing) {
        h1.insertAdjacentElement('afterend', existing);
        existing.classList.add('border-b', 'border-neutral-800', 'pb-4', 'mb-8');
        return;
      }
      var dateEl = document.querySelector('time');
      var when = dateEl ? dateEl.textContent : '';
      h1.insertAdjacentHTML('afterend',
        '<div id="guide-meta-bar" class="meta-bar border-b border-neutral-800 pb-4 mb-8">' +
          '<img class="by-logo" src="/avatar.png" alt="" width="28" height="28">' +
          '<p class="meta-line"><strong>Alberto Trujillo Mingorance</strong> · @atrumin16 · <span class="guide-badge">Guides</span>' +
          (when ? ' · ' + esc(when) : '') + '</p>' +
          '<button type="button" class="copy-link" id="doc-copy-btn"><span>Copiar enlace</span></button>' +
        '</div>'
      );
    });
    document.querySelectorAll('#copy-link, #doc-copy-btn, .copy-link').forEach(bindCopy);
  }

  function renderMarkdown(root) {
    var src = readMarkdown();
    if (!src.trim() || !window.marked) {
      wrapTables(root);
      return;
    }
    configureMarked();
    var html = marked.parse(preprocess(src));
    var target = document.getElementById('guide-body') || $('[data-markdown]') || root;
    if (target.getAttribute && target.getAttribute('data-markdown') !== null) {
      target.removeAttribute('data-markdown');
    }
    target.innerHTML = html;
    wrapTables(target);
  }

  function enhance(root) {
    linkifyTickers(root);
    mountTradingView(root);
    var payload = readPayload();
    if (!document.querySelector('.attach-list .attach-card')) {
      renderAttachments(payload.attachments, document.getElementById('guide-attachments'));
    }
    (payload.widgets || []).forEach(function (w) {
      if (!w || (w.type !== 'chart' && w.type !== 'tradingview') || !w.symbol) return;
      if (root.querySelector('[data-symbol="' + w.symbol + '"]')) return;
      var el = document.createElement('div');
      el.setAttribute('data-widget', 'tradingview');
      el.setAttribute('data-symbol', w.symbol);
      el.setAttribute('data-interval', w.interval || 'D');
      (document.getElementById('guide-body') || root).appendChild(el);
    });
    mountTradingView(root);
  }

  function boot() {
    if (!isGuidePage()) return;
    placeMetaBar();
    var root = document.getElementById('guide-body') ||
      document.querySelector('article.doc') ||
      document.querySelector('.guide-container') ||
      document.querySelector('article.guide-content') ||
      document.body;
    renderMarkdown(root);
    enhance(root);
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
