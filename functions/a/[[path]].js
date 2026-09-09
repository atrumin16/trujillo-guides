export async function onRequestGet(context) {
  const raw = context.params.path;
  const slug = Array.isArray(raw) ? raw.filter(Boolean).join('/') : String(raw || '');
  const dest = slug
    ? 'https://ai.trujillomingorance.com/artifact/' + encodeURIComponent(slug)
    : 'https://ai.trujillomingorance.com/artifact';
  return Response.redirect(dest, 301);
}
