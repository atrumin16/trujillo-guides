import { readSession, clientVoterId } from '../../lib/social.js';
import { readJsonArray } from '../../lib/community.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id'
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
  });
}

function listKey(voter) {
  return 'guide:following:' + voter;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const session = await readSession(context.request, context.env);
  const voter = clientVoterId(context.request, session);
  if (!voter) return json({ ok: true, following: [] });
  const following = await readJsonArray(context.env.BOT_MEMORY, listKey(voter));
  return json({ ok: true, following });
}

export async function onRequestPost(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const session = await readSession(context.request, context.env);
  const voter = clientVoterId(context.request, session);
  if (!voter) return json({ error: 'client_id' }, 400);
  const body = await context.request.json().catch(() => null);
  const handle = String((body && body.handle) || '').replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24);
  if (!handle) return json({ error: 'handle' }, 400);
  let following = await readJsonArray(kv, listKey(voter));
  const has = following.indexOf(handle) !== -1;
  following = has ? following.filter((h) => h !== handle) : [handle].concat(following);
  await kv.put(listKey(voter), JSON.stringify(following.slice(0, 200)));
  return json({ ok: true, handle, following: !has, list: following });
}
