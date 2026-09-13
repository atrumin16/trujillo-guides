import { loadStats, saveStats, readSession, clientVoterId, voteValue, tallyVotes } from '../../lib/social.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id',
  'Access-Control-Allow-Credentials': 'true'
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const body = await context.request.json().catch(() => null);
  const slug = String((body && body.slug) || '').toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 48);
  if (!slug) return json({ error: 'slug' }, 400);
  const session = await readSession(context.request, context.env);
  const voter = clientVoterId(context.request, session);
  if (!voter) return json({ error: 'client_id' }, 400);
  const dir = body && (body.dir === 'down' || body.dir === -1) ? -1 : 1;
  const stats = await loadStats(kv, slug);
  const prev = voteValue(stats.voters[voter]);
  if (prev === dir) delete stats.voters[voter];
  else stats.voters[voter] = dir;
  await saveStats(kv, slug, stats);
  const t = tallyVotes(stats.voters);
  const mine = voteValue(stats.voters[voter]);
  return json({
    ok: true,
    slug,
    likes: t.likes,
    up: t.up,
    down: t.down,
    score: t.score,
    liked: mine === 1,
    disliked: mine === -1,
    pinned: !!stats.pinned
  });
}
