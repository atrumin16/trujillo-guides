import { mergeGuideFeed, STATIC_SLUGS } from './feed.js';

const GUIDES_ORIGIN = 'https://guides.trujillomingorance.com';

export function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function srcdocEsc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/<\/iframe/gi, '&lt;/iframe');
}

function slugifyHandle(value) {
  return String(value || '')
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '')
    .slice(0, 24);
}

function slugifySlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function parseCommunityPath(raw) {
  const parts = (Array.isArray(raw) ? raw : String(raw || '').split('/'))
    .map((p) => String(p || '').trim())
    .filter(Boolean);
  if (!parts.length) return { kind: 'global' };
  const handle = slugifyHandle(parts[0]);
  if (!handle) return { kind: 'missing' };
  if (parts[1]) {
    const slug = slugifySlug(parts[1]);
    return slug ? { kind: 'item', handle, slug } : { kind: 'missing' };
  }
  return { kind: 'author', handle };
}

export async function readJsonArray(kv, key) {
  if (!kv) return [];
  const raw = await kv.get(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export async function loadGuideRecord(kv, handle, slug) {
  if (!kv || !handle || !slug) return null;
  const raw = await kv.get('guide:' + handle + ':' + slug);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

export async function loadGuideBySlug(kv, slug) {
  if (!kv || !slug) return null;
  const ptrRaw = await kv.get('pub:guide:' + slug);
  if (ptrRaw) {
    try {
      const ptr = JSON.parse(ptrRaw);
      if (ptr && ptr.handle) return loadGuideRecord(kv, ptr.handle, slug);
    } catch (e) {}
  }
  return null;
}

function inlineMd(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
  s = s.replace(/(^|[\s(])\$([A-Z]{1,6}(?:-[A-Z]{1,4})?)\b/g, (m, pre, sym) => pre + tickerHtml(sym));
  return s;
}

function stripMatchingH1(md, title) {
  const t = String(title || '').trim().toLowerCase();
  if (!t) return md;
  return String(md || '').replace(/^#\s+(.+)\s*\n+/, (all, h) => String(h || '').trim().toLowerCase() === t ? '' : all);
}

export function renderMarkdown(md) {
  const src = String(md || '').replace(/\r\n/g, '\n');
  const parts = src.split(/```/);
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      const nl = parts[i].indexOf('\n');
      const code = nl === -1 ? parts[i] : parts[i].slice(nl + 1);
      html += '<pre><code>' + esc(code.replace(/\n$/, '')) + '</code></pre>';
      continue;
    }
    const lines = parts[i].split('\n');
    let buf = [];
    let inTable = false;
    const flush = () => {
      const t = buf.join(' ').trim();
      buf = [];
      if (t) html += '<p>' + inlineMd(t) + '</p>';
    };
    const closeTable = () => {
      if (!inTable) return;
      html += '</tbody></table></div>';
      inTable = false;
    };
    for (const line of lines) {
      const tv = line.match(/^<(?:TradingViewWidget|tradingview)\s+symbol=["']([^"']+)["'](?:\s+interval=["']([^"']+)["'])?[^>]*\/?>$/i)
        || line.match(/^:::tradingview\s+(\S+)(?:\s+(\S+))?/);
      if (tv) {
        flush();
        closeTable();
        html += tvEmbed(tv[1], tv[2]);
        continue;
      }
      if (/^\s*\|.+\|\s*$/.test(line)) {
        flush();
        const cells = line.split('|').slice(1, -1).map((c) => c.trim());
        if (/^\s*\|?\s*:?-{3,}/.test(line)) continue;
        if (!inTable) {
          html += '<div class="overflow-x-auto my-6 border border-neutral-800 rounded-lg table-wrap"><table class="w-full text-left text-sm border-collapse"><thead><tr>' + cells.map((c) => '<th>' + inlineMd(c) + '</th>').join('') + '</tr></thead><tbody>';
          inTable = true;
        } else {
          html += '<tr>' + cells.map((c) => '<td>' + inlineMd(c) + '</td>').join('') + '</tr>';
        }
        continue;
      }
      closeTable();
      const h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) {
        flush();
        html += '<h' + h[1].length + '>' + inlineMd(h[2]) + '</h' + h[1].length + '>';
        continue;
      }
      if (/^[-*]\s+/.test(line)) {
        flush();
        html += '<li>' + inlineMd(line.replace(/^[-*]\s+\[([ xX])\]\s+/, '').replace(/^[-*]\s+/, '')) + '</li>';
        continue;
      }
      if (!line.trim()) { flush(); continue; }
      buf.push(line.trim());
    }
    flush();
    closeTable();
  }
  return html.replace(/(?:<li>[\s\S]*?<\/li>)+/g, (b) => '<ul>' + b + '</ul>');
}

function csvTable(text) {
  const rows = String(text || '').trim().split(/\r?\n/).filter(Boolean);
  if (!rows.length) return '<p>CSV vacío</p>';
  const parseRow = (line) => line.split(',').map((cell) => esc(cell.trim()));
  const head = parseRow(rows[0]);
  const body = rows.slice(1).map(parseRow);
  let html = '<table class="tbl"><thead><tr>' + head.map((c) => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>';
  body.forEach((r) => { html += '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>'; });
  html += '</tbody></table>';
  return html;
}

function detectKind(lang, content) {
  const l = String(lang || '').toLowerCase().trim();
  const map = { html: 'html', markdown: 'markdown', md: 'markdown', plaintext: 'plaintext', text: 'plaintext', json: 'json', csv: 'csv', svg: 'svg', mermaid: 'mermaid', code: 'code', javascript: 'javascript', python: 'python' };
  if (map[l]) return map[l];
  const c = String(content || '').trim();
  if (/^<svg[\s>]/i.test(c)) return 'svg';
  if (/^<!doctype html/i.test(c) || /^<html[\s>]/i.test(c)) return 'html';
  if (/^(graph|flowchart|sequenceDiagram)\b/m.test(c)) return 'mermaid';
  return 'markdown';
}

function prettyJson(text) {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch (e) { return text; }
}

function shell(title, inner) {
  return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ATM Docs</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#080c14">
<link rel="icon" href="/favicon.ico">
<script src="/js/theme-boot.js?v=shell1"></script>
<link rel="stylesheet" href="/css/tokens.css?v=shell1">
<link rel="stylesheet" href="/style.css?v=shell1">
<link rel="stylesheet" href="/css/community.css?v=c6">
</head>
<body class="docs-body community-body">
<header class="docs-topbar">
  <a href="/" class="brand">
    <img src="/avatar.png" alt="" class="brand-avatar" width="28" height="28">
    <span>ATM Docs</span>
  </a>
  <div class="topbar-actions">
    <button type="button" class="theme-toggle-btn" id="theme-btn" title="Cambiar tema" aria-label="Cambiar tema">Tema</button>
    <a class="hub-link" href="https://ai.trujillomingorance.com" rel="noopener">Studio</a>
  </div>
</header>
${inner}
<script src="/js/marked.min.js"></script>
<script src="/js/guides.js?v=c6"></script>
<script src="/js/community.js?v=c6"></script>
</body>
</html>`;
}

function tickerHtml(sym) {
  const s = String(sym || '').toUpperCase();
  return `<a class="ticker" href="https://www.tradingview.com/symbols/${esc(s)}/" rel="noopener" target="_blank">$${esc(s)}</a>`;
}

function tvEmbed(symbol, interval) {
  const sym = encodeURIComponent(String(symbol || 'NASDAQ:AAPL').toUpperCase());
  const iv = encodeURIComponent(interval || 'D');
  return `<div class="tv-wrap"><iframe src="https://s.tradingview.com/widgetembed/?symbol=${sym}&interval=${iv}&hidesidetoolbar=1&theme=dark&style=1&locale=es&hideideas=1" title="TradingView" loading="lazy"></iframe></div>`;
}

function formatPubDate(item) {
  const raw = item && (item.date || item.updatedAt || item.createdAt);
  if (!raw) return '';
  try {
    const d = typeof raw === 'number' || /^\d+$/.test(String(raw)) ? new Date(Number(raw)) : new Date(raw);
    if (Number.isNaN(d.getTime())) return String(raw);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return '';
  }
}

function poster(item) {
  const handle = String((item && item.handle) || 'atrumin16').replace(/^@/, '');
  const name = (item && item.authorName) || 'Alberto Trujillo Mingorance';
  const pic = (item && item.authorPicture) || '/avatar.png';
  const title = (item && item.title) || '';
  const category = (item && item.category) || 'Guides';
  const when = formatPubDate(item);
  return `<header class="article-head">
  ${title ? `<h1 class="page-title">${esc(title)}</h1>` : ''}
  <div class="meta-bar">
    <img class="by-logo" src="${esc(pic)}" alt="" width="28" height="28">
    <p class="meta-line"><strong>${esc(name)}</strong> · @${esc(handle)} · <span class="guide-badge">${esc(category)}</span>${when ? ' · ' + esc(when) : ''}</p>
    <button type="button" class="copy-link" id="copy-link">Copiar enlace</button>
  </div>
</header>`;
}

export function renderGuidePage(item) {
  const kind = detectKind(item.lang, item.content);
  const raw = item.content || '';
  let stage = '';
  if (kind === 'html') {
    stage = `<div class="stage"><iframe class="frame" sandbox="allow-scripts allow-forms" srcdoc="${srcdocEsc(raw)}" title="Guía"></iframe></div>`;
  } else if (kind === 'svg') {
    stage = `<div class="stage pad"><div class="svgwrap"><img alt="" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}"></div></div>`;
  } else if (kind === 'mermaid') {
    stage = `<div class="stage pad"><pre class="mermaid">${esc(raw)}</pre></div>`;
  } else if (kind === 'csv') {
    stage = `<article class="doc">${csvTable(raw)}</article>`;
  } else if (kind === 'json') {
    stage = `<pre class="code">${esc(prettyJson(raw))}</pre>`;
  } else if (kind === 'plaintext') {
    stage = `<article class="doc"><p class="prewrap">${esc(raw)}</p></article>`;
  } else if (kind === 'markdown') {
    stage = `<article class="doc">${renderMarkdown(stripMatchingH1(raw, item.title))}</article>`;
  } else {
    stage = `<pre class="code">${esc(raw)}</pre>`;
  }
  const inner = poster(item) + `<main class="community-main">${stage}</main>` + extrasHtml(item) + payloadScript(item);
  return shell(item.title || 'Guía', inner);
}

function payloadScript(item) {
  const extra = (item && item.extras) || {};
  const data = {
    title: (item && item.title) || '',
    date: (item && item.date) || '',
    attachments: Array.isArray(extra.attachments) ? extra.attachments : [],
    widgets: Array.isArray(extra.widgets) ? extra.widgets : []
  };
  return '<script type="application/json" id="guide-payload">' +
    JSON.stringify(data).replace(/</g, '\\u003c') +
    '</script><aside id="guide-attachments" class="attach-list" hidden></aside>';
}

function extrasHtml(item) {
  const extra = (item && item.extras) || {};
  const sources = Array.isArray(extra.sources) ? extra.sources : [];
  const resources = Array.isArray(extra.resources) ? extra.resources : [];
  const widgets = Array.isArray(extra.widgets) ? extra.widgets : [];
  const attachments = Array.isArray(extra.attachments) ? extra.attachments : [];
  if (!sources.length && !resources.length && !widgets.length && !attachments.length) return '';
  let html = '<aside class="extras"><div class="extras-grid">';
  if (sources.length) {
    html += '<div><h2>Fuentes</h2>' + sources.map((s) =>
      s.url ? `<p><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title || s.url)}</a></p>` : `<p>${esc(s.title || '')}</p>`
    ).join('') + '</div>';
  }
  if (resources.length) {
    html += '<div><h2>Recursos</h2>' + resources.map((s) => {
      const note = s.note ? ` — ${esc(s.note)}` : '';
      return s.url
        ? `<p><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title || s.url)}</a>${note}</p>`
        : `<p>${esc(s.title || '')}${note}</p>`;
    }).join('') + '</div>';
  }
  if (attachments.length) {
    html += '<div><h2>Adjuntos</h2>' + attachments.map((a) => {
      if (!a || !a.url) return '';
      const ext = String(a.ext || '').toUpperCase();
      return `<a class="attach-card" href="${esc(a.url)}" rel="noopener" download><span class="attach-badge">${esc(ext)}</span><span class="attach-meta"><strong>${esc(a.name || a.url)}</strong></span><span class="attach-dl">Descargar</span></a>`;
    }).join('') + '</div>';
  }
  if (widgets.length) {
    html += '<div><h2>Widgets</h2>' + widgets.map((w) => {
      if ((w.type === 'quote' || w.type === 'chart') && w.symbol) {
        return `<div class="widget"><p>${esc(w.label || w.symbol)}</p><p><a href="https://www.tradingview.com/symbols/${esc(w.symbol)}/" rel="noopener" target="_blank">$${esc(w.symbol)}</a></p></div>`;
      }
      if (w.type === 'embed' && w.url) {
        return `<div class="widget"><iframe sandbox="allow-scripts allow-forms" src="${esc(w.url)}" title="${esc(w.label || 'widget')}"></iframe></div>`;
      }
      if (w.url) return `<div class="widget"><a href="${esc(w.url)}" rel="noopener" target="_blank">${esc(w.label || w.url)}</a></div>`;
      if (w.text) return `<div class="widget"><p>${esc(w.text)}</p></div>`;
      return '';
    }).join('') + '</div>';
  }
  html += '</div></aside>';
  return html;
}

export function renderGuideIndex(items, opts) {
  const handle = opts && opts.handle;
  const merged = mergeGuideFeed(items);
  const list = handle
    ? merged.filter((it) => it.static || it.handle === handle)
    : merged;
  const cards = list.map((it) => {
    const h = it.handle || handle || '';
    const pic = it.authorPicture || '/avatar.png';
    const href = it.href || (it.static ? '/guides/' + it.slug + '/' : '/g/' + encodeURIComponent(it.slug));
    const by = h ? `<div class="card-by"><img src="${esc(pic)}" alt=""><span>@${esc(h)}</span></div>` : '';
    return `<a class="guide-card community-card" href="${href}">${by}<h2>${esc(it.title || it.slug)}</h2><p>${esc(it.static ? '/guides/' + it.slug + '/' : '/g/' + it.slug)}</p></a>`;
  }).join('');
  const heading = handle ? '@' + handle : 'Comunidad';
  const lede = handle
    ? 'Guías publicadas por esta cuenta. El contenido editorial de ATM Docs vive en /guides y no se mezcla aquí.'
    : 'Tableros de cuentas registradas. Cada guía lleva by @usuario. Las guías oficiales están en el índice.';
  const posterHtml = handle
    ? poster({ handle, authorName: (opts && opts.authorName) || handle, authorPicture: (opts && opts.authorPicture) || '/avatar.png' })
    : '';
  const grid = cards
    ? `<div class="guides-grid">${cards}</div>`
    : `<p class="lede">Las guías oficiales están en el índice.</p>`;
  const inner = posterHtml + `<main class="docs-main community-main"><section class="hero"><p class="kicker">ATM Docs · foro de cuentas</p><h1>${esc(heading)}</h1><p class="lede">${lede}</p></section>${grid}</main>`;
  return shell(heading, inner);
}

export function renderGuideMissing() {
  return shell('No encontrada', `<main class="docs-main community-main"><section class="hero"><h1>Esta guía no existe</h1><p class="lede">Se despublicó, es de otra cuenta o el enlace es incorrecto.</p><p><a class="hub-link" href="/u">Comunidad</a> · <a class="hub-link" href="/">Guías oficiales</a></p></section></main>`);
}

export function staticGuideRedirect(slug) {
  const g = STATIC_SLUGS[slug];
  if (!g) return null;
  return Response.redirect(GUIDES_ORIGIN + (g.href || ('/guides/' + slug + '/')), 302);
}

export { GUIDES_ORIGIN, STATIC_SLUGS };
