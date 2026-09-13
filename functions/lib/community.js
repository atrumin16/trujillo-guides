import { mergeGuideFeed, STATIC_SLUGS, HIDDEN_KEY, hiddenSlugSet } from './feed.js';

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
  const cleanSlug = String(slug).toLowerCase().trim().replace(/[^a-z0-9-]+/g, '');
  if (!cleanSlug) return null;

  // 1. Try pointer pub:guide:cleanSlug
  try {
    const ptrRaw = await kv.get('pub:guide:' + cleanSlug);
    if (ptrRaw) {
      const ptr = JSON.parse(ptrRaw);
      const h = ptr && ptr.handle ? String(ptr.handle).replace(/^@/, '') : '';
      if (h) {
        const rec = (await loadGuideRecord(kv, h, ptr.slug || cleanSlug)) || (await loadGuideRecord(kv, '@' + h, ptr.slug || cleanSlug));
        if (rec) return rec;
      }
    }
  } catch (e) {}

  // 2. Try direct handle guide:atrumin16:cleanSlug
  try {
    const direct = (await loadGuideRecord(kv, 'atrumin16', cleanSlug)) || (await loadGuideRecord(kv, '@atrumin16', cleanSlug));
    if (direct) return direct;
  } catch (e) {}

  // 3. Try searching guide:public
  try {
    const pubList = await readJsonArray(kv, 'guide:public');
    const matched = pubList.find((it) => it && String(it.slug || '').toLowerCase() === cleanSlug);
    if (matched) {
      if (matched.content) return matched;
      const h = matched.handle ? String(matched.handle).replace(/^@/, '') : 'atrumin16';
      const rec = (await loadGuideRecord(kv, h, matched.slug || cleanSlug)) || (await loadGuideRecord(kv, '@' + h, matched.slug || cleanSlug));
      if (rec) return rec;
      return matched;
    }
  } catch (e) {}

  // 4. Try searching guide:index:atrumin16
  try {
    const userIndex = (await readJsonArray(kv, 'guide:index:atrumin16')) || (await readJsonArray(kv, 'guide:index:@atrumin16'));
    const matched = userIndex.find((it) => it && String(it.slug || '').toLowerCase() === cleanSlug);
    if (matched) {
      const rec = (await loadGuideRecord(kv, 'atrumin16', matched.slug || cleanSlug)) || (await loadGuideRecord(kv, '@atrumin16', matched.slug || cleanSlug));
      if (rec) return rec;
      return matched;
    }
  } catch (e) {}

  return null;
}

function inlineMd(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
  s = s.replace(/(^|[\s()])\\?\$([A-Z]{1,6}(?:[.-][A-Z]{1,4})?|\d{4,5})\b/g, (m, pre, sym) => pre + tickerHtml(sym));
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
      const fence = (nl === -1 ? '' : parts[i].slice(0, nl)).trim().toLowerCase();
      const code = (nl === -1 ? parts[i] : parts[i].slice(nl + 1)).replace(/\n$/, '');
      if (fence === 'mermaid') {
        html += '<pre class="mermaid">' + esc(code) + '</pre>';
      } else {
        const langTag = fence ? fence.toUpperCase() : 'TXT';
        html += '<div class="code-block-wrap"><div class="code-header"><span class="code-lang">' + esc(langTag) + '</span><button type="button" class="copy-code-btn" title="Copiar código" aria-label="Copiar código"><svg class="tool-ic" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copiar</span></button></div><pre><code' + (fence ? ' class="lang-' + esc(fence) + '"' : '') + '>' + esc(code) + '</code></pre></div>';
      }
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
    let inScriptOrStyle = false;
    for (const line of lines) {
      if (inScriptOrStyle) {
        html += line + '\n';
        if (/<\/(?:script|style)>/i.test(line)) {
          inScriptOrStyle = false;
        }
        continue;
      }
      if (/^\s*<(?:script|style)\b/i.test(line)) {
        flush();
        closeTable();
        html += line + '\n';
        if (!/<\/(?:script|style)>/i.test(line)) {
          inScriptOrStyle = true;
        }
        continue;
      }
      if (/^\s*<\/?(?:div|section|article|aside|p|form|button|input|textarea|select|option|label|table|tbody|thead|tr|td|th|svg|canvas|iframe|details|summary|figure|figcaption)\b/i.test(line)) {
        flush();
        closeTable();
        html += line + '\n';
        continue;
      }
      const tv = line.match(/^<(?:TradingViewWidget|tradingview)\s+symbol=["']([^"']+)["'](?:\s+interval=["']([^"']+)["'])?[^>]*\/?>$/i)
        || line.match(/^:::tradingview\s+(\S+)(?:\s+(\S+))?/);
      if (tv) {
        flush();
        closeTable();
        html += tvEmbed(tv[1], tv[2]);
        continue;
      }
      if (/^\s*(?:---|\*\*\*|___)\s*$/.test(line)) {
        flush();
        closeTable();
        html += '<hr class="divider">';
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
  const delim = rows[0].indexOf('\t') !== -1 && (rows[0].split('\t').length > rows[0].split(',').length) ? '\t' : ',';
  const parseRow = (line) => line.split(delim).map((cell) => esc(cell.trim()));
  const head = parseRow(rows[0]);
  const body = rows.slice(1).map(parseRow);
  let html = '<table class="tbl"><thead><tr>' + head.map((c) => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>';
  body.forEach((r) => { html += '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>'; });
  html += '</tbody></table>';
  return html;
}

export const LANG_MAP = {
  html: 'html', htm: 'html',
  markdown: 'markdown', md: 'markdown',
  plaintext: 'plaintext', text: 'plaintext', txt: 'plaintext',
  json: 'json', csv: 'csv', tsv: 'csv',
  svg: 'svg', mermaid: 'mermaid', mmd: 'mermaid',
  javascript: 'javascript', js: 'javascript', mjs: 'javascript', cjs: 'javascript',
  typescript: 'javascript', ts: 'javascript',
  python: 'python', py: 'python',
  yaml: 'code', yml: 'code', xml: 'code', sql: 'code', toml: 'code',
  css: 'code', scss: 'code', go: 'code', rs: 'code', rust: 'code',
  java: 'code', c: 'code', h: 'code', cpp: 'code', cs: 'code',
  php: 'code', rb: 'code', sh: 'code', bash: 'code', shell: 'code',
  code: 'code'
};

export function detectKind(lang, content) {
  const l = String(lang || '').toLowerCase().trim();
  if (LANG_MAP[l]) return LANG_MAP[l];
  const c = String(content || '').trim();
  if (/^<svg[\s>]/i.test(c)) return 'svg';
  if (/^<!doctype html/i.test(c) || /^<html[\s>]/i.test(c)) return 'html';
  if (/^(graph|flowchart|sequenceDiagram|classDiagram|erDiagram|journey|pie|gantt)\b/m.test(c)) return 'mermaid';
  if (/^[\s]*[{\[]/.test(c)) {
    try { JSON.parse(c); return 'json'; } catch (e) {}
  }
  if (/^[^,\n]+,[^,\n]+,/m.test(c) && (c.match(/\n/g) || []).length >= 1) return 'csv';
  if (/^#\s|^\*\*|^\-\s|```/m.test(c)) return 'markdown';
  return 'markdown';
}

function prettyJson(text) {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch (e) { return text; }
}

function injectOledTheme(html) {
  const oledCss = `<style>
    :root, html, body {
      background-color: #030712 !important;
      color: #f8fafc !important;
      color-scheme: dark !important;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif !important;
      margin: 0 !important;
      padding: 16px !important;
    }
    table {
      background: #080c14 !important;
      border: 1px solid #1e293b !important;
      border-collapse: collapse !important;
      width: 100% !important;
      margin: 16px 0 !important;
    }
    th {
      background: #0f172a !important;
      color: #94a3b8 !important;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
      text-transform: uppercase !important;
      font-size: 11px !important;
      letter-spacing: 0.06em !important;
      border-bottom: 1px solid #1e293b !important;
      padding: 10px 14px !important;
      text-align: left !important;
    }
    td {
      padding: 10px 14px !important;
      border-bottom: 1px solid #1e293b !important;
      color: #cbd5e1 !important;
      font-size: 13px !important;
    }
    tr:hover td { background: rgba(255, 255, 255, 0.02) !important; }
    a { color: #38bdf8 !important; }
  </style>
  <script>
    function sendH(){
      var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.parent.postMessage({ type: 'FRAME_RESIZE', height: h }, '*');
    }
    window.addEventListener('load', sendH);
    window.addEventListener('resize', sendH);
    if (window.ResizeObserver) { new ResizeObserver(sendH).observe(document.body); }
  </script>`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, '$&' + oledCss);
  }
  return oledCss + html;
}

function shell(title, inner, opts) {
  const share = !!(opts && opts.share);
  const docTitle = share ? 'Documento' : (esc(title) + ' · ATM Docs');
  return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${docTitle}</title>
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="referrer" content="no-referrer">
<meta name="theme-color" content="#030712">
<link rel="icon" href="/favicon.ico">
<script src="/js/theme-boot.js?v=pub2"></script>
<link rel="stylesheet" href="/css/tokens.css?v=pub2">
<link rel="stylesheet" href="/style.css?v=pub2">
<link rel="stylesheet" href="/css/community.css?v=pub2">
</head>
<body class="docs-body community-body"${share ? ' data-share="1"' : ''}>
<header class="docs-topbar"></header>
${inner}
<footer class="docs-footer" id="docs-footer"></footer>
<script src="/js/i18n.js?v=pub2"></script>
<script src="/js/chrome.js?v=pub2"></script>
<script src="/js/social.js?v=pub2"></script>
<script src="/js/marked.min.js"></script>
<script src="/js/guides.js?v=pub2"></script>
<script src="/js/community.js?v=pub2"></script>
<script src="/js/forum.js?v=pub2"></script>
<script src="/js/translate.js?v=pub2"></script>
</body>
</html>`;
}

function htmlToArticle(raw, title) {
  let html = String(raw || '');
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (body) html = body[1];
  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<\/?font[^>]*>/gi, '')
    .replace(/<(header|footer|nav)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|form)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|input|button)[^>]*\/?>/gi, '')
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/\s(bgcolor|color|background|align)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\shref\s*=\s*(['"])javascript:[^'"]*\1/gi, ' href="#"');
  const t = String(title || '').trim().toLowerCase();
  if (t) {
    html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, function (all) {
      const inner = all.replace(/<[^>]+>/g, '').trim().toLowerCase();
      return inner === t || inner.indexOf(t.slice(0, 24)) === 0 ? '' : all;
    });
  }
  return html.trim();
}

function tickerHtml(sym) {
  return `<a class="ticker" href="https://www.tradingview.com/symbols/${esc(sym)}/" rel="noopener" target="_blank">$${esc(sym)}</a>`;
}

function tvEmbed(sym, iv) {
  return `<div class="tv-wrap"><iframe src="https://s.tradingview.com/widgetembed/?symbol=${sym}&interval=${iv || 'D'}&hidesidetoolbar=1&theme=dark&style=1&locale=es&hideideas=1" title="TradingView" loading="lazy"></iframe></div>`;
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
  const name = (item && item.authorName) || 'Alberto Trujillo';
  const title = (item && item.title) || '';
  const slug = String((item && item.slug) || '');
  const when = formatPubDate(item) || '11 sep 2026';
  const kind = String((item && item.category) || (item && item.extras && item.extras.kind) || 'guide');
  const kindLabel = ({ guide: 'Guía', post: 'Post', opinion: 'Opinión', analysis: 'Análisis', brief: 'Brief', note: 'Nota', research: 'Research', changelog: 'Changelog' })[kind] || 'Guía';
  const summary = (item && item.extras && item.extras.summary) || item.summary || '';
  return `<header class="article-head doc-header">
  <a href="/" class="back-nav">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    Volver al Hub de Guías
  </a>
  ${title ? `<h1 class="page-title">${esc(title)}</h1>` : ''}
  ${summary ? `<p class="lede">${esc(summary)}</p>` : ''}
  <div class="poster meta-bar poster-bar" data-slug="${esc(slug)}">
    <div class="poster-author">
      <span class="poster-avatar">AT</span>
      <span class="poster-name">${esc(name)}</span>
      <a class="poster-handle" href="/u/@${esc(handle)}">@${esc(handle)}</a>
      <span class="guide-badge">${esc(kindLabel)}</span>
    </div>
    <div class="poster-right">
      <time class="poster-date meta-chip">${esc(when)}</time>
      <button type="button" class="copy-link poster-copy meta-chip" id="copy-link" data-slug="${esc(slug)}">
        <svg class="tool-ic" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <span>Copiar enlace</span>
      </button>
    </div>
  </div>
  <div class="social-bar" data-slug="${esc(slug)}" data-handle="${esc(handle)}">
    <button type="button" class="vote-btn" data-vote="up" data-i18n-title="like" title="Me gusta" aria-label="Me gusta"><svg class="vote-ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v8a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2z"/><path d="M7 11V8a3 3 0 0 1 3-3h1v6h6.2a1.8 1.8 0 0 1 1.76 2.17l-1.05 5.1A1.8 1.8 0 0 1 16.15 20H9a2 2 0 0 1-2-2v-7z"/></svg> <span data-up-count>0</span></button>
    <button type="button" class="vote-btn" data-vote="down" data-i18n-title="dislike" title="No me gusta" aria-label="No me gusta"><svg class="vote-ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 13V5a1 1 0 0 1 1-1h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2z"/><path d="M17 13v3a3 3 0 0 1-3 3h-1v-6H6.8a1.8 1.8 0 0 1-1.76-2.17l1.05-5.1A1.8 1.8 0 0 1 7.85 4H15a2 2 0 0 1 2 2v7z"/></svg> <span data-down-count>0</span></button>
    <button type="button" class="tool-btn" data-share data-i18n-title="share" title="Compartir" aria-label="Compartir"><svg class="tool-ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
    <button type="button" class="tool-btn" data-save data-i18n-title="save" title="Guardar" aria-label="Guardar"><svg class="tool-ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
    <button type="button" class="tool-btn" data-edit data-i18n-title="edit" title="Editar" aria-label="Editar" hidden>
      <svg class="tool-ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>
    <button type="button" class="tool-btn" data-follow data-i18n-title="follow" title="Seguir" aria-label="Seguir"><svg class="tool-ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></button>
    <button type="button" class="pin-btn" data-pin data-i18n-title="pin" title="Fijar" aria-label="Fijar" hidden><svg class="tool-ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.89A2 2 0 0 0 5 15.24z"/></svg></button>
  </div>
</header>`;
}

export function renderGuidePage(item) {
  const kind = detectKind(item.lang, item.content);
  const raw = item.content || '';
  let stage = '';
  if (kind === 'html') {
    const article = htmlToArticle(raw, item.title);
    stage = article
      ? `<article class="doc html-doc">${article}</article>`
      : `<div class="stage"><iframe class="frame" sandbox="allow-scripts allow-forms" srcdoc="${srcdocEsc(injectOledTheme(raw))}" title="Guía" allowtransparency="true"></iframe></div>`;
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
  const inner = `<div class="guide-container doc-page has-toc-sidebar">` +
    poster(item) +
    `<div class="doc-layout">` +
      `<aside class="doc-sidebar"></aside>` +
      `<div class="doc-content">` +
        `<main class="community-main">${stage}</main>` +
        extrasHtml(item) +
      `</div>` +
    `</div>` +
    payloadScript(item) +
  `</div>`;
  return shell(item.title || 'Guía', inner, { share: !!(item && item.share) });
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
      const ext = String(a.ext || '').toLowerCase();
      if (/^(png|jpe?g|jpg|webp|gif|avif|svg)$/i.test(ext)) {
        return `<figure class="attach-figure"><img src="${esc(a.url)}" alt="${esc(a.name || '')}"><figcaption>${esc(a.name || '')}</figcaption></figure>`;
      }
      return `<a class="attach-card" href="${esc(a.url)}" rel="noopener"><span class="attach-badge">${esc(ext.toUpperCase())}</span><span class="attach-meta"><strong>${esc(a.name || a.url)}</strong></span><span class="attach-dl">Abrir</span></a>`;
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
  const merged = opts && opts.skipMerge ? (items || []) : mergeGuideFeed(items, opts && opts.hidden);
  const list = handle
    ? merged.filter((it) => String(it.handle || '').toLowerCase() === handle)
    : merged;
  const cards = list.map((it) => {
    const h = it.handle || handle || '';
    const href = it.href || (it.static ? '/guides/' + it.slug + '/' : '/g/' + encodeURIComponent(it.slug));
    const likes = Number(it.likes) || 0;
    const pin = it.pinned ? '<span class="pin-flag">Fijada</span>' : '';
    return `<a class="guide-row" href="${href}"><span class="guide-row-title">${esc(it.title || it.slug)}</span><span class="guide-row-meta">${esc(h ? '@' + h : '')}${pin} ↑ ${likes}</span></a>`;
  }).join('');
  const name = (opts && opts.authorName) || handle || 'Perfil';
  const pic = (opts && opts.authorPicture) || '/avatar.png';
  const heading = handle ? '@' + handle : 'Guías';
  const profile = handle
    ? `<header class="profile-head">
        <img class="profile-avatar" src="${esc(pic)}" alt="" width="56" height="56">
        <div><h1>${esc(name)}</h1><p class="lede">@${esc(handle)} · ${list.length} ${list.length === 1 ? 'guía' : 'guías'}</p></div>
      </header>`
    : `<section class="hero"><h1>Guías</h1></section>`;
  const grid = cards
    ? `<div class="guides-list" id="guides-feed">${cards}</div>`
    : `<p class="lede">Esta cuenta aún no ha publicado.</p>`;
  const inner = `<main class="home-main">${profile}${grid}</main>`;
  return shell(heading, inner);
}

export function renderGuideMissing() {
  return shell('No encontrada', `<main class="home-main"><h1>Esta guía no existe</h1><p class="lede">Se despublicó o el enlace es incorrecto.</p><p><a class="hub-link" href="/">Volver al índice</a></p></main>`);
}

export function staticGuideRedirect(slug, hidden) {
  const g = STATIC_SLUGS[slug];
  if (!g) return null;
  if (hiddenSlugSet(hidden)[slug]) return null;
  return Response.redirect(GUIDES_ORIGIN + (g.href || ('/guides/' + slug + '/')), 302);
}

export function isHiddenSlug(hidden, slug) {
  return !!hiddenSlugSet(hidden)[slug];
}

export { GUIDES_ORIGIN, STATIC_SLUGS, HIDDEN_KEY };
