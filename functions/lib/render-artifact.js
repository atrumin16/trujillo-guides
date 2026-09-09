const GUIDES = [
  { href: '/', label: 'Índice' },
  { href: '/a/', label: 'Publicados' },
  { href: '/guides/enterprise-email/', label: 'Correo empresarial 0 €' },
  { href: '/guides/it-glossary/', label: 'Glosario de sistemas' },
  { href: '/guides/open-sentinel/', label: 'Open-Sentinel' },
  { href: '/guides/edge-ai-architecture/', label: 'Edge AI' },
  { href: '/guides/dns-zero-trust/', label: 'DNS Zero-Trust' },
  { href: '/guides/crypto-telemetry/', label: 'Telemetría on-chain' }
];

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeUrl(href) {
  const u = String(href || '').trim();
  if (/^https:\/\//i.test(u) || u.startsWith('/')) return u;
  return '';
}

export function renderMarkdown(md) {
  const src = String(md || '').replace(/\r\n/g, '\n');
  const parts = src.split(/```/);
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      const nl = parts[i].indexOf('\n');
      const lang = nl === -1 ? '' : parts[i].slice(0, nl).trim();
      const code = nl === -1 ? parts[i] : parts[i].slice(nl + 1);
      html += '<pre class="code-block"><code>' + escapeHtml(code.replace(/\n$/, '')) + '</code></pre>';
      continue;
    }
    const lines = parts[i].split('\n');
    let buf = [];
    function flushP() {
      if (!buf.length) return;
      const text = buf.join(' ').trim();
      buf = [];
      if (text) html += '<p>' + inline(text) + '</p>';
    }
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      const h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) {
        flushP();
        const tag = 'h' + h[1].length;
        html += '<' + tag + '>' + inline(h[2]) + '</' + tag + '>';
        continue;
      }
      if (/^[-*]\s+/.test(line)) {
        flushP();
        html += '<li>' + inline(line.replace(/^[-*]\s+/, '')) + '</li>';
        continue;
      }
      if (!line.trim()) {
        flushP();
        continue;
      }
      buf.push(line.trim());
    }
    flushP();
  }
  return html.replace(/(?:<li>[\s\S]*?<\/li>)+/g, function (block) {
    return '<ul>' + block + '</ul>';
  });
}

function inline(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
    const url = safeUrl(href);
    if (!url) return label;
    return '<a href="' + escapeHtml(url) + '" rel="noopener">' + label + '</a>';
  });
  return s;
}

function chrome(title, mainInner, activeHref) {
  const nav = GUIDES.map(function (item) {
    const active = item.href === activeHref ? ' class="active"' : '';
    return '<a href="' + item.href + '"' + active + '>' + escapeHtml(item.label) + '</a>';
  }).join('');
  return '<!DOCTYPE html>\n<html lang="es" data-theme="dark">\n<head>\n'
    + '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    + '<title>' + escapeHtml(title) + ' · ATM Docs</title>\n'
    + '<meta name="theme-color" content="#080c14">\n'
    + '<link rel="icon" type="image/x-icon" href="/favicon.ico">\n'
    + '<script src="/js/theme-boot.js?v=art1"></script>\n'
    + '<link rel="stylesheet" href="/css/tokens.css?v=art1">\n'
    + '<link rel="stylesheet" href="/style.css?v=art1">\n'
    + '</head>\n<body class="docs-body">\n'
    + '<header class="docs-topbar"><a href="/" class="brand">'
    + '<img src="/avatar.png" alt="" class="brand-avatar" width="28" height="28"><span>ATM Docs</span></a>'
    + '<div class="topbar-actions">'
    + '<button type="button" class="theme-toggle-btn" id="theme-btn" title="Cambiar tema" aria-label="Cambiar tema"></button>'
    + '<a class="hub-link" href="https://ai.trujillomingorance.com" rel="noopener">AI</a>'
    + '<a class="hub-link" href="https://labs.trujillomingorance.com" rel="noopener">Labs Hub</a>'
    + '</div></header>\n'
    + '<div class="docs-shell"><aside class="docs-sidebar"><span class="sidebar-label">Guías</span>'
    + '<nav class="sidebar-nav" aria-label="Guías">' + nav + '</nav>'
    + '<p class="sidebar-note">Publicado desde Trujillo AI. Cache en el Edge.</p></aside>'
    + '<main class="docs-main">' + mainInner + '</main></div>\n'
    + '<script src="/js/guides.js?v=art1"></script>\n</body></html>';
}

export function pageForArtifact(item) {
  const isCode = item.lang && !/^(md|markdown|text|txt)$/i.test(item.lang);
  const body = isCode
    ? '<pre class="code-block"><code>' + escapeHtml(item.content) + '</code></pre>'
    : renderMarkdown(item.content);
  const inner = '<section class="hero">'
    + '<p class="kicker">Publicado · guides.trujillomingorance.com/a/' + escapeHtml(item.slug) + '</p>'
    + '<h1>' + escapeHtml(item.title) + '</h1>'
    + (item.description ? '<p class="lede">' + escapeHtml(item.description) + '</p>' : '')
    + '</section><article class="guide-content">' + body + '</article>';
  return chrome(item.title, inner, '/a/' + item.slug);
}

export function pageForIndex(items) {
  const cards = (items || []).map(function (item) {
    return '<a class="guide-card" href="/a/' + encodeURIComponent(item.slug) + '">'
      + '<h2>' + escapeHtml(item.title) + '</h2>'
      + '<p>' + escapeHtml(item.slug) + '</p></a>';
  }).join('');
  const inner = '<section class="hero">'
    + '<p class="kicker">Trujillo AI · publicaciones</p>'
    + '<h1>Guías y artefactos publicados</h1>'
    + '<p class="lede">Páginas generadas desde el estudio, con el chrome de ATM Docs y cache en el Edge.</p>'
    + '</section><div class="guides-grid">'
    + (cards || '<p class="lede">Aún no hay publicaciones.</p>')
    + '</div>';
  return chrome('Publicados', inner, '/a/');
}

export function notFoundPage() {
  const inner = '<section class="hero"><p class="kicker">HTTP 404</p><h1>Publicación no encontrada</h1>'
    + '<p class="lede">Ese slug no existe o se ha retirado.</p>'
    + '<p><a class="hub-link" href="/a/">Ver publicados</a></p></section>';
  return chrome('No encontrado', inner, '/a/');
}
