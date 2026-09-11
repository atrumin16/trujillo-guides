import { mergeGuideFeed } from '../../lib/feed.js';
import { readJsonArray } from '../../lib/community.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type'
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=30',
      ...CORS
    }
  });
}

async function fallbackFromAssets(context) {
  try {
    const assets = context.env && context.env.ASSETS;
    if (!assets) return [];
    const res = await assets.fetch(new URL('/community-index.json', context.request.url));
    if (!res || !res.ok) return [];
    const data = await res.json();
    return (data && (data.guides || data.items)) || [];
  } catch (e) {
    return [];
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  let kvItems = await readJsonArray(kv, 'guide:public');
  if (!kvItems.length) {
    const fromAssets = await fallbackFromAssets(context);
    if (fromAssets.length) kvItems = fromAssets;
  }
  const guides = mergeGuideFeed(kvItems);
  return json({ ok: true, success: true, count: guides.length, guides: guides });
}

export async function onRequestHead(context) {
  const res = await onRequestGet(context);
  return new Response(null, { status: res.status, headers: res.headers });
}
