import { readSession, clientVoterId } from '../../lib/social.js';
import { readJsonArray } from '../../lib/community.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id',
  'Access-Control-Allow-Credentials': 'true'
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const session = await readSession(context.request, context.env);
  const voter = clientVoterId(context.request, session);
  const following = voter ? await readJsonArray(context.env.BOT_MEMORY, 'guide:following:' + voter) : [];
  return new Response(JSON.stringify({
    ok: true,
    me: session ? {
      handle: session.handle || '',
      name: session.name || '',
      picture: session.picture || '',
      owner: !!session.owner,
      following: following
    } : { following: following }
  }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
  });
}
