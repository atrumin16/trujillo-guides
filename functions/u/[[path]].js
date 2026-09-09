import {
  loadGuideRecord,
  parseCommunityPath,
  readJsonArray,
  renderGuideIndex,
  renderGuideMissing,
  renderGuidePage
} from '../lib/community.js';

const CSP = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

function html(body, status) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': status === 200 ? 'public, max-age=30, s-maxage=120' : 'no-store',
      'Content-Security-Policy': CSP,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  });
}

export async function onRequestGet(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  const parsed = parseCommunityPath(context.params.path);
  if (!parsed || parsed.kind === 'missing') return html(renderGuideMissing(), 404);
  if (parsed.kind === 'global') {
    const index = await readJsonArray(kv, 'guide:public');
    return html(renderGuideIndex(index), 200);
  }
  if (parsed.kind === 'author') {
    const index = await readJsonArray(kv, 'guide:index:' + parsed.handle);
    const meta = index[0] || { handle: parsed.handle };
    return html(renderGuideIndex(index, {
      handle: parsed.handle,
      authorName: meta.authorName,
      authorPicture: meta.authorPicture
    }), 200);
  }
  const record = await loadGuideRecord(kv, parsed.handle, parsed.slug);
  if (!record) return html(renderGuideMissing(), 404);
  record.handle = record.handle || parsed.handle;
  record.dest = 'guide';
  return html(renderGuidePage(record), 200);
}
