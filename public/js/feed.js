(function () {
  'use strict';

  var FALLBACK = '/community-index.json';

  function card(g) {
    var a = document.createElement('a');
    a.className = 'guide-card';
    a.href = g.href || (g.static ? '/guides/' + g.slug + '/' : '/g/' + g.slug);
    var h2 = document.createElement('h2');
    h2.textContent = g.title || g.slug;
    var p = document.createElement('p');
    var who = g.authorName || '';
    var handle = g.handle ? '@' + String(g.handle).replace(/^@/, '') : '';
    p.textContent = [who, handle, g.category || 'Guides'].filter(Boolean).join(' · ');
    a.appendChild(h2);
    a.appendChild(p);
    return a;
  }

  function listFrom(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.guides || data.items || data.posts || [];
  }

  function render(list, mount) {
    if (!mount) return;
    mount.innerHTML = '';
    (list || []).forEach(function (g) {
      if (!g || !(g.slug || g.href || g.title)) return;
      mount.appendChild(card(g));
    });
  }

  function fetchJson(url) {
    return fetch(url, { headers: { 'Accept': 'application/json' } }).then(function (r) {
      var type = (r.headers.get('Content-Type') || '').toLowerCase();
      if (!r.ok || type.indexOf('json') === -1) return Promise.reject();
      return r.json();
    });
  }

  function load() {
    var mount = document.getElementById('community-feed');
    if (!mount) return;
    fetchJson('/api/guides')
      .catch(function () { return fetchJson(FALLBACK); })
      .then(function (data) {
        var list = listFrom(data);
        if (list.length) {
          render(list, mount);
          return;
        }
        return fetchJson(FALLBACK).then(function (fb) {
          render(listFrom(fb), mount);
        });
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
