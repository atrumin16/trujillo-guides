(function () {
  'use strict';

  var STATIC_CATALOG = [
    {
      slug: 'berkshire-analysis',
      title: 'Desglose Financiero y Posiciones de Berkshire Hathaway ($BRK.B)',
      href: '/guides/crypto-telemetry/',
      handle: 'atrumin16',
      authorName: 'Alberto Trujillo Mingorance',
      authorPicture: '/avatar.png',
      category: 'Análisis',
      kind: 'analysis',
      readTime: '16 min',
      likes: 54,
      up: 54,
      pinned: true,
      fixada: true,
      summary: 'Estructura de capital, tesorería récord y análisis de participadas en ($BRK.B).',
      date: '12 sep 2026',
      updatedAt: 1789100000000,
      static: true
    },
    {
      slug: 'edge-ai-architecture',
      title: 'Inferencia multimodal sub-100ms en Groq LPU y Cloudflare',
      href: '/guides/edge-ai-architecture/',
      handle: 'atrumin16',
      authorName: 'Alberto Trujillo Mingorance',
      authorPicture: '/avatar.png',
      category: 'Análisis',
      kind: 'analysis',
      readTime: '14 min',
      likes: 47,
      up: 47,
      pinned: true,
      fixada: true,
      summary: 'Streaming de ultra-baja latencia con Workers Edge y aceleración de hardware en Groq.',
      date: '11 sep 2026',
      updatedAt: 1788700000000,
      static: true
    },
    {
      slug: 'enterprise-email',
      title: 'Arquitectura de Correo Empresarial a Coste 0 €',
      href: '/guides/enterprise-email/',
      handle: 'atrumin16',
      authorName: 'Alberto Trujillo Mingorance',
      authorPicture: '/avatar.png',
      category: 'Runbook',
      kind: 'runbook',
      readTime: '18 min',
      likes: 42,
      up: 42,
      pinned: true,
      fixada: true,
      summary: 'Infraestructura de correo corporativo e identidad para startups sin Google Workspace.',
      date: '11 sep 2026',
      updatedAt: 1789000000000,
      static: true
    },
    {
      slug: 'it-glossary',
      title: 'Glosario Interactivo de Sistemas e Informática',
      href: '/guides/it-glossary/',
      handle: 'atrumin16',
      authorName: 'Alberto Trujillo Mingorance',
      authorPicture: '/avatar.png',
      category: 'Guía',
      kind: 'guide',
      readTime: '12 min',
      likes: 38,
      up: 38,
      pinned: true,
      fixada: true,
      summary: 'Términos, protocolos, arquitecturas y herramientas esenciales de DevOps y SRE.',
      date: '11 sep 2026',
      updatedAt: 1788900000000,
      static: true
    },
    {
      slug: 'japan-sogo-shosha',
      title: 'Sogo Shosha: Inversión en Trading Houses Japonesas ($8058, $8001)',
      href: '/guides/edge-ai-architecture/',
      handle: 'atrumin16',
      authorName: 'Alberto Trujillo Mingorance',
      authorPicture: '/avatar.png',
      category: 'Research',
      kind: 'research',
      readTime: '13 min',
      likes: 49,
      up: 49,
      pinned: false,
      fixada: false,
      summary: 'Análisis fundamental de Mitsubishi Corp ($8058) e Itochu ($8001).',
      date: '11 sep 2026',
      updatedAt: 1789050000000,
      static: true
    },
    {
      slug: 'open-sentinel',
      title: 'Telemetría Host y Detección de Intrusión (Open-Sentinel)',
      href: '/guides/open-sentinel/',
      handle: 'atrumin16',
      authorName: 'Alberto Trujillo Mingorance',
      authorPicture: '/avatar.png',
      category: 'Runbook',
      kind: 'runbook',
      readTime: '15 min',
      likes: 35,
      up: 35,
      pinned: false,
      fixada: false,
      summary: 'Agente de auditoría forense y monitorización de seguridad con alertado en tiempo real.',
      date: '10 sep 2026',
      updatedAt: 1788800000000,
      static: true
    },
    {
      slug: 'crypto-telemetry',
      title: 'Telemetría On-Chain y Mempool (BitPulse)',
      href: '/guides/crypto-telemetry/',
      handle: 'atrumin16',
      authorName: 'Alberto Trujillo Mingorance',
      authorPicture: '/avatar.png',
      category: 'Research',
      kind: 'research',
      readTime: '10 min',
      likes: 31,
      up: 31,
      pinned: false,
      fixada: false,
      summary: 'Monitorización de transacciones no confirmadas, comisiones de gas y dinámica de bloques.',
      date: '08 sep 2026',
      updatedAt: 1788500000000,
      static: true
    },
    {
      slug: 'dns-zero-trust',
      title: 'Filtrado DNS DoH y Zero-Trust (AdShield)',
      href: '/guides/dns-zero-trust/',
      handle: 'atrumin16',
      authorName: 'Alberto Trujillo Mingorance',
      authorPicture: '/avatar.png',
      category: 'Guía',
      kind: 'guide',
      readTime: '11 min',
      likes: 29,
      up: 29,
      pinned: false,
      fixada: false,
      summary: 'Resolución DNS cifrada con listas de bloqueo de telemetría y publicidad invasiva.',
      date: '09 sep 2026',
      updatedAt: 1788600000000,
      static: true
    }
  ];

  var allGuides = STATIC_CATALOG.slice();
  var featuredGuides = STATIC_CATALOG.filter(function (g) { return g.pinned || g.fixada; });

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Universal Ticker Parser regex: catches ($TICKER), $TICKER, ($BRK.B), $8058, $8001, $8031, $8053, etc.
  function formatTitleTickers(text) {
    if (!text) return '';
    const tickerRegex = /\(?\$([A-Z0-9]+(?:\.[A-Z0-9]+)?)\)?/g;
    return text.replace(tickerRegex, (match, ticker) => {
      return `<span class="ticker-badge" style="display: inline-flex; align-items: center; padding: 0.12rem 0.45rem; border-radius: 6px; font-size: 0.85em; font-family: monospace; font-weight: 700; background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); margin: 0 0.2rem; vertical-align: middle;">$${ticker}</span>`;
    });
  }
  window.formatTitleTickers = formatTitleTickers;
  window.formatTickerTitle = formatTitleTickers;

  function hrefOf(g) {
    return g.href || (g.static ? '/guides/' + g.slug + '/' : '/g/' + g.slug);
  }

  function t(key) {
    return typeof window.atmT === 'function' ? window.atmT(key) : key;
  }

  function isPinnedGuide(g) {
    return !!(g && (g.pinned || g.fixada || (g.extras && (g.extras.pinned || g.extras.fixada))));
  }

  function getKindLabel(g) {
    var raw = String(g.kind || g.category || 'guide').toLowerCase();
    if (raw === 'runbook') return 'Runbook';
    if (raw === 'analysis' || raw === 'análisis') return 'Análisis';
    if (raw === 'post') return 'Post';
    if (raw === 'opinion' || raw === 'opinión') return 'Opinión';
    if (raw === 'brief') return 'Brief';
    if (raw === 'note' || raw === 'nota') return 'Nota';
    if (raw === 'research') return 'Research';
    if (raw === 'changelog') return 'Changelog';
    return 'Guía';
  }

  function getReadTime(g) {
    if (g.readTime) return g.readTime;
    if (g.readingTime) return g.readingTime;
    var raw = String(g.slug || '').toLowerCase();
    if (raw.indexOf('email') !== -1) return '18 min';
    if (raw.indexOf('glossary') !== -1) return '12 min';
    if (raw.indexOf('sentinel') !== -1) return '15 min';
    if (raw.indexOf('edge') !== -1 || raw.indexOf('ai') !== -1) return '14 min';
    if (raw.indexOf('dns') !== -1) return '11 min';
    if (raw.indexOf('crypto') !== -1) return '10 min';
    return '5 min';
  }

  function syncScopeFromUrl() {
    var sel = document.getElementById('filter-scope');
    if (!sel) return 'totes';
    var urlParams = new URLSearchParams(window.location.search);
    var viewParam = (urlParams.get('filtre') || urlParams.get('view') || urlParams.get('scope') || 'totes').toLowerCase();
    if (viewParam === 'destacades' || viewParam === 'featured') {
      sel.value = 'destacades';
      return 'destacades';
    }
    // Default to 'totes' (show all guides immediately)
    sel.value = 'totes';
    return 'totes';
  }

  function updateUrlViewParam(scopeValue) {
    try {
      var params = new URLSearchParams(window.location.search);
      if (scopeValue === 'destacades') {
        params.set('view', 'destacades');
      } else {
        // 'totes' is default, keep url clean or preserve view=totes
        params.set('view', 'totes');
      }
      var qs = params.toString();
      var newUrl = window.location.pathname + (qs ? '?' + qs : '');
      window.history.replaceState({}, '', newUrl);
    } catch (e) {}
  }

  function filters() {
    var scopeEl = document.getElementById('filter-scope');
    var currentScope = scopeEl ? scopeEl.value.toLowerCase() : 'totes';
    if (currentScope === 'all') currentScope = 'totes';
    if (currentScope === 'featured') currentScope = 'destacades';

    return {
      q: ((document.getElementById('guide-search') || {}).value || '').trim().toLowerCase(),
      kind: ((document.getElementById('filter-kind') || {}).value || '').toLowerCase(),
      author: ((document.getElementById('filter-author') || {}).value || '').toLowerCase(),
      sort: ((document.getElementById('filter-sort') || {}).value || 'likes'),
      pinned: !!(document.getElementById('filter-pinned') && document.getElementById('filter-pinned').checked),
      saved: !!(document.getElementById('filter-saved') && document.getElementById('filter-saved').checked),
      following: !!(document.getElementById('filter-following') && document.getElementById('filter-following').checked),
      scope: currentScope
    };
  }

  function card(g) {
    var a = document.createElement('a');
    var pinned = isPinnedGuide(g);
    a.className = 'guide-card' + (pinned ? ' is-pinned' : '');
    a.href = hrefOf(g);

    var img = document.createElement('img');
    img.className = 'guide-card-avatar';
    img.src = g.authorPicture || '/avatar.png';
    img.alt = '';
    img.width = 40;
    img.height = 40;

    var body = document.createElement('div');
    body.className = 'guide-card-body';

    // Title with universal ticker parser
    var h3 = document.createElement('h3');
    h3.className = 'guide-card-title';
    h3.innerHTML = formatTitleTickers(g.title || g.slug);
    body.appendChild(h3);

    // Standardized bottom metadata row:
    // [Badge Tipo: Guia/Runbook] · [Autor: @atrumin16] · [Tiempo de lectura] · [↑ Votos]
    var meta = document.createElement('div');
    meta.className = 'guide-card-meta';
    meta.setAttribute('data-notranslate', '');

    var kindLabel = getKindLabel(g);
    var handle = g.handle ? '@' + String(g.handle).replace(/^@/, '') : '@atrumin16';
    var readTime = getReadTime(g);
    var votes = g.up || g.likes || 0;

    var metaHtml = '<span class="meta-badge-kind">' + esc(kindLabel) + '</span>';
    if (pinned) {
      metaHtml += '<span class="meta-badge-pinned">📌 Fixada</span>';
    }
    metaHtml += '<span class="meta-author">Autor: ' + esc(handle) + '</span>' +
      '<span class="meta-sep">·</span>' +
      '<span class="meta-read-time">' + esc(readTime) + '</span>' +
      '<span class="meta-sep">·</span>' +
      '<span class="meta-votes">↑ ' + esc(votes) + '</span>';

    meta.innerHTML = metaHtml;
    body.appendChild(meta);

    a.appendChild(img);
    a.appendChild(body);
    return a;
  }

  function listFrom(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.guides || data.items || data.featured || [];
  }

  function applyFilters() {
    var f = filters();
    var isDestacades = f.scope === 'destacades';

    // If 'destacades', filter only pinned/featured guides.
    // If 'totes' (default), show all guides!
    var pool = isDestacades ? (featuredGuides.length ? featuredGuides : allGuides.filter(isPinnedGuide)) : allGuides;
    if (!pool.length) pool = allGuides;

    var shown = pool.filter(function (g) {
      if (!g || !(g.slug || g.title)) return false;
      if (f.pinned && !isPinnedGuide(g)) return false;
      if (f.saved) {
        var saved = [];
        try { saved = JSON.parse(localStorage.getItem('atm_saved') || '[]'); } catch (e) {}
        if (saved.indexOf(g.slug) === -1) return false;
      }
      if (f.following) {
        var fol = window.__taFollowing || [];
        if (fol.indexOf(String(g.handle || '').toLowerCase()) === -1) return false;
      }
      if (f.kind) {
        var cat = String(g.kind || g.category || 'guide').toLowerCase();
        if (f.kind === 'guide') {
          if (cat !== 'guide' && cat !== 'guides' && cat !== 'guía') return false;
        } else if (cat !== f.kind) return false;
      }
      if (f.author && String(g.handle || '').toLowerCase() !== f.author) return false;
      if (!f.q) return true;
      return String(g.title || '').toLowerCase().indexOf(f.q) !== -1 ||
        String(g.handle || '').toLowerCase().indexOf(f.q) !== -1 ||
        String(g.authorName || '').toLowerCase().indexOf(f.q) !== -1;
    });

    // In 'totes' view, pinned guides (fixada: true) always float to the top
    shown.sort(function (a, b) {
      if (!isDestacades) {
        var aPin = isPinnedGuide(a) ? 1 : 0;
        var bPin = isPinnedGuide(b) ? 1 : 0;
        if (aPin !== bPin) return bPin - aPin;
      }

      if (f.sort === 'title') {
        return String(a.title || '').localeCompare(String(b.title || ''));
      }
      if (f.sort === 'recent') {
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      }
      // Default: 'likes'
      var aVotes = a.up || a.likes || 0;
      var bVotes = b.up || b.likes || 0;
      if (bVotes !== aVotes) return bVotes - aVotes;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

    return shown;
  }

  function fillAuthors() {
    var sel = document.getElementById('filter-author');
    if (!sel) return;
    var current = sel.value;
    var seen = Object.create(null);
    sel.innerHTML = '<option value="">' + t('filterAuthor') + '</option>';
    allGuides.forEach(function (g) {
      var h = String(g.handle || '').replace(/^@/, '');
      if (!h || seen[h]) return;
      seen[h] = 1;
      var opt = document.createElement('option');
      opt.value = h.toLowerCase();
      opt.textContent = '@' + h;
      sel.appendChild(opt);
    });
    if (current) sel.value = current;
  }

  function render() {
    var mount = document.getElementById('guides-feed') || document.getElementById('community-feed');
    var label = document.getElementById('home-label');
    if (!mount) return;
    mount.innerHTML = '';
    var f = filters();
    var shown = applyFilters();

    if (label) {
      var key = f.q ? 'results' : (f.scope === 'destacades' ? 'featured' : 'all');
      label.setAttribute('data-i18n', key);
      label.textContent = f.scope === 'destacades' ? t('featured') : (f.q ? t('results') : 'Todas las guías');
    }

    if (!shown.length) {
      var empty = document.createElement('p');
      empty.className = 'lede';
      empty.setAttribute('data-i18n', f.q ? 'empty' : 'emptyHome');
      empty.textContent = t(f.q ? 'empty' : 'emptyHome');
      mount.appendChild(empty);
      return;
    }

    shown.forEach(function (g) {
      mount.appendChild(card(g));
    });
    document.dispatchEvent(new CustomEvent('atm:content'));
  }

  function paintComposer() {
    var bar = document.querySelector('.home-filters');
    if (!bar || document.getElementById('new-guide-btn')) return;
    var btn = document.createElement('a');
    btn.id = 'new-guide-btn';
    btn.className = 'new-guide-btn';
    btn.href = '/write';
    btn.setAttribute('data-i18n', 'newGuide');
    btn.textContent = t('newGuide');
    btn.addEventListener('click', function (e) {
      var me = window.__taMe;
      if (!(me && (me.handle || me.owner))) {
        e.preventDefault();
        if (typeof window.atmOpenAuth === 'function') window.atmOpenAuth();
      }
    });
    bar.appendChild(btn);
  }

  function bindFilters() {
    ['guide-search', 'filter-author', 'filter-kind', 'filter-sort', 'filter-pinned', 'filter-saved', 'filter-following', 'filter-scope'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.getAttribute('data-bound')) return;
      el.setAttribute('data-bound', '1');
      el.addEventListener(el.type === 'search' || (el.tagName === 'INPUT' && el.type !== 'checkbox') ? 'input' : 'change', function () {
        if (id === 'filter-scope') {
          updateUrlViewParam(el.value);
        }
        render();
      });
    });
  }

  function load() {
    var mount = document.getElementById('guides-feed') || document.getElementById('community-feed');
    if (!mount) return;

    // 1. Initialize view filter from URL (defaults to 'totes')
    syncScopeFromUrl();
    bindFilters();
    paintComposer();
    fillAuthors();

    // 2. Render immediately from in-memory catalog (0 latency, 0 worker requests)
    render();

    // 3. Static CDN refresh: fetch /data.json or fallback to /community-index.json
    // Both are served as purely static assets by Cloudflare Pages CDN (zero workers invoked)
    fetch('/data.json', { cache: 'default' })
      .then(function (r) {
        if (!r.ok) throw new Error('data.json status ' + r.status);
        return r.json();
      })
      .catch(function () {
        return fetch('/community-index.json', { cache: 'default' }).then(function (r) {
          if (!r.ok) throw new Error('community-index status ' + r.status);
          return r.json();
        });
      })
      .then(function (data) {
        var items = listFrom(data);
        if (items && items.length) {
          allGuides = items;
          featuredGuides = items.filter(isPinnedGuide);
          fillAuthors();
          render();
          document.dispatchEvent(new CustomEvent('atm:feedLoaded', { detail: data }));
        }
      })
      .catch(function () {
        // In-memory catalog is already rendered; zero degradation
      });
  }

  document.addEventListener('atm:lang', function () {
    if (!document.getElementById('guides-feed')) return;
    fillAuthors();
    render();
  });

  document.addEventListener('atm:me', function () {
    paintComposer();
    render();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
