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

function inlineMd(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
  return s;
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
    const flush = () => {
      const t = buf.join(' ').trim();
      buf = [];
      if (t) html += '<p>' + inlineMd(t) + '</p>';
    };
    for (const line of lines) {
      const h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) {
        flush();
        html += '<h' + h[1].length + '>' + inlineMd(h[2]) + '</h' + h[1].length + '>';
        continue;
      }
      if (/^[-*]\s+/.test(line)) {
        flush();
        html += '<li>' + inlineMd(line.replace(/^[-*]\s+/, '')) + '</li>';
        continue;
      }
      if (!line.trim()) { flush(); continue; }
      buf.push(line.trim());
    }
    flush();
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
<link rel="stylesheet" href="/css/community.css?v=c1">
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
<script src="/js/guides.js?v=shell1"></script>
<script src="/js/community.js?v=c1"></script>
</body>
</html>`;
}

function poster(item) {
  const handle = String((item && item.handle) || '').replace(/^@/, '');
  if (!handle && !(item && item.authorName)) return '';
  const name = (item && item.authorName) || handle;
  const pic = (item && item.authorPicture) || '/avatar.png';
  const board = handle ? '/u/@' + esc(handle) : '/u';
  return `<div class="poster">
  <img class="by-logo" src="${esc(pic)}" alt="" width="40" height="40">
  <div class="by-meta">
    <div class="by-name">${esc(name)}</div>
    <div class="by-handle">by ${handle ? `<a href="${board}">@${esc(handle)}</a>` : 'autor'} · Guides</div>
  </div>
  <button type="button" class="copy-link" id="copy-link">Copiar enlace</button>
</div>`;
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
    stage = `<article class="doc">${renderMarkdown(raw)}</article>`;
  } else {
    stage = `<pre class="code">${esc(raw)}</pre>`;
  }
  const inner = poster(item) + `<main class="community-main">${stage}</main>`;
  return shell(item.title || 'Guía', inner);
}

export function renderGuideIndex(items, opts) {
  const handle = opts && opts.handle;
  const cards = (items || []).map((it) => {
    const h = it.handle || handle || '';
    const pic = it.authorPicture || '/avatar.png';
    const href = h ? '/u/@' + encodeURIComponent(h) + '/' + encodeURIComponent(it.slug) : '/u';
    const by = h ? `<div class="card-by"><img src="${esc(pic)}" alt=""><span>@${esc(h)}</span></div>` : '';
    return `<a class="guide-card community-card" href="${href}">${by}<h2>${esc(it.title || it.slug)}</h2><p>/u/@${esc(h)}/${esc(it.slug)}</p></a>`;
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
    : `<p class="lede">${handle ? 'Esta cuenta aún no ha publicado guías.' : 'Publica una guía desde Trujillo AI con una cuenta registrada.'}</p>`;
  const inner = posterHtml + `<main class="docs-main community-main"><section class="hero"><p class="kicker">ATM Docs · foro de cuentas</p><h1>${esc(heading)}</h1><p class="lede">${lede}</p></section>${grid}</main>`;
  return shell(heading, inner);
}

export function renderGuideMissing() {
  return shell('No encontrada', `<main class="docs-main community-main"><section class="hero"><h1>Esta guía no existe</h1><p class="lede">Se despublicó, es de otra cuenta o el enlace es incorrecto.</p><p><a class="hub-link" href="/u">Comunidad</a> · <a class="hub-link" href="/">Guías oficiales</a></p></section></main>`);
}

export { GUIDES_ORIGIN };
