(function () {
  'use strict';

  var FALLBACK = '/community-index.json';
  var allGuides = [];
  var featuredGuides = [];

  function hrefOf(g) {
    return g.href || (g.static ? '/guides/' + g.slug + '/' : '/g/' + g.slug);
  }

  function t(key) {
    return typeof window.atmT === 'function' ? window.atmT(key) : key;
  }

  function filters() {
    return {
      q: ((document.getElementById('guide-search') || {}).value || '').trim().toLowerCase(),
      kind: ((document.getElementById('filter-kind') || {}).value || '').toLowerCase(),
      author: ((document.getElementById('filter-author') || {}).value || '').toLowerCase(),
      sort: ((document.getElementById('filter-sort') || {}).value || 'likes'),
      pinned: !!(document.getElementById('filter-pinned') && document.getElementById('filter-pinned').checked),
      saved: !!(document.getElementById('filter-saved') && document.getElementById('filter-saved').checked),
      following: !!(document.getElementById('filter-following') && document.getElementById('filter-following').checked),
      scope: ((document.getElementById('filter-scope') || {}).value || 'featured')
    };
  }

  function card(g) {
    var a = document.createElement('a');
    a.className = 'guide-card';
    a.href = hrefOf(g);
    var img = document.createElement('img');
    img.className = 'guide-card-avatar';
    img.src = g.authorPicture || '/avatar.png';
    img.alt = '';
    img.width = 36;
    img.height = 36;
    var body = document.createElement('div');
    body.className = 'guide-card-body';
    var h2 = document.createElement('h2');
    h2.textContent = g.title || g.slug;
    var p = document.createElement('p');
    p.setAttribute('data-notranslate', '');
    var handle = g.handle ? '@' + String(g.handle).replace(/^@/, '') : '';
    var bits = [];
    var kind = String(g.category || 'guide').toLowerCase();
    if (kind && kind !== 'guides') bits.push(t('kind-' + kind) !== ('kind-' + kind) ? t('kind-' + kind) : kind);
    if (g.authorName) bits.push(g.authorName);
    if (handle) bits.push(handle);
    if (g.pinned) bits.push(t('pinned'));
    bits.push('↑ ' + (g.up || g.likes || 0));
    p.textContent = bits.join(' · ');
    body.appendChild(h2);
    body.appendChild(p);
    a.appendChild(img);
    a.appendChild(body);
    return a;
  }

  function listFrom(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.guides || data.featured || data.items || [];
  }

  function applyFilters() {
    var f = filters();
    var pool = f.scope === 'all' || f.q || f.author || f.pinned || f.saved || f.following ? allGuides : featuredGuides;
    if (!pool.length) pool = allGuides;
    var shown = pool.filter(function (g) {
      if (!g || !(g.slug || g.title)) return false;
      if (f.pinned && !g.pinned) return false;
      if (f.saved) {
        var saved = [];
        try { saved = JSON.parse(localStorage.getItem('atm_saved') || '[]'); } catch (e) {}
        if (saved.indexOf(g.slug) === -1) return false;
      }
      if (f.following) {
        var fol = window.__taFollowing || [];
        if (fol.indexOf(String(g.handle || '').toLowerCase()) === -1) return false;
      }
      if (f.kind) {
        var cat = String(g.category || 'guide').toLowerCase();
        if (f.kind === 'guide') {
          if (cat !== 'guide' && cat !== 'guides') return false;
        } else if (cat !== f.kind) return false;
      }
      if (f.author && String(g.handle || '').toLowerCase() !== f.author) return false;
      if (!f.q) return true;
      return String(g.title || '').toLowerCase().indexOf(f.q) !== -1 ||
        String(g.handle || '').toLowerCase().indexOf(f.q) !== -1 ||
        String(g.authorName || '').toLowerCase().indexOf(f.q) !== -1;
    });
    shown.sort(function (a, b) {
      if (f.sort === 'title') return String(a.title || '').localeCompare(String(b.title || ''));
      if (f.sort === 'recent') return (b.updatedAt || 0) - (a.updatedAt || 0);
      return (b.likes || 0) - (a.likes || 0) || (b.updatedAt || 0) - (a.updatedAt || 0);
    });
    return shown;
  }

  function fillAuthors() {
    var sel = document.getElementById('filter-author');
    if (!sel) return;
    var current = sel.value;
    var seen = Object.create(null);
    sel.innerHTML = '<option value="">' + t('filterAuthor') + '</option>';
    allGuides.forEach(function (g) {
      var h = String(g.handle || '').replace(/^@/, '');
      if (!h || seen[h]) return;
      seen[h] = 1;
      var opt = document.createElement('option');
      opt.value = h.toLowerCase();
      opt.textContent = '@' + h;
      sel.appendChild(opt);
    });
    if (current) sel.value = current;
  }

  function render() {
    var mount = document.getElementById('guides-feed') || document.getElementById('community-feed');
    var label = document.getElementById('home-label');
    if (!mount) return;
    mount.innerHTML = '';
    var f = filters();
    var shown = applyFilters();
    if (label) {
      var key = f.q ? 'results' : (f.scope === 'all' ? 'all' : (shown.some(function (g) { return g.pinned; }) ? 'featured' : 'voted'));
      label.setAttribute('data-i18n', key);
      label.textContent = t(key);
    }
    if (!shown.length) {
      var empty = document.createElement('p');
      empty.className = 'lede';
      empty.setAttribute('data-i18n', f.q ? 'empty' : 'emptyHome');
      empty.textContent = t(f.q ? 'empty' : 'emptyHome');
      mount.appendChild(empty);
      return;
    }
    shown.forEach(function (g) { mount.appendChild(card(g)); });
    document.dispatchEvent(new CustomEvent('atm:content'));
  }

  function paintComposer() {
    var bar = document.querySelector('.home-filters');
    if (!bar || document.getElementById('new-guide-btn')) return;
    var btn = document.createElement('a');
    btn.id = 'new-guide-btn';
    btn.className = 'new-guide-btn';
    btn.href = '/write';
    btn.setAttribute('data-i18n', 'newGuide');
    btn.textContent = t('newGuide');
    btn.addEventListener('click', function (e) {
      var me = window.__taMe;
      if (!(me && (me.handle || me.owner))) {
        e.preventDefault();
        if (typeof window.atmOpenAuth === 'function') window.atmOpenAuth();
      }
    });
    bar.appendChild(btn);
  }

  function bindFilters() {
    ['guide-search', 'filter-author', 'filter-kind', 'filter-sort', 'filter-pinned', 'filter-saved', 'filter-following', 'filter-scope'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.getAttribute('data-bound')) return;
      el.setAttribute('data-bound', '1');
      el.addEventListener(el.type === 'search' || el.tagName === 'INPUT' && el.type !== 'checkbox' ? 'input' : 'change', render);
    });
  }

  function fetchJson(url) {
    return fetch(url, { headers: { 'Accept': 'application/json', 'X-Client-Id': (function () {
      try { return localStorage.getItem('ta_client') || ''; } catch (e) { return ''; }
    })() }, credentials: 'same-origin' }).then(function (r) {
      var type = (r.headers.get('Content-Type') || '').toLowerCase();
      if (!r.ok || type.indexOf('json') === -1) return Promise.reject();
      return r.json();
    });
  }

  function load() {
    var mount = document.getElementById('guides-feed') || document.getElementById('community-feed');
    if (!mount) return;
    bindFilters();
    paintComposer();
    fetchJson('/api/guides?view=all')
      .then(function (data) {
        window.__taFeedCache = data;
        featuredGuides = data.featured || listFrom(data);
        allGuides = listFrom(data);
        fillAuthors();
        render();
        document.dispatchEvent(new CustomEvent('atm:feedLoaded', { detail: data }));
      })
      .catch(function () {
        return fetchJson(FALLBACK).then(function (fb) {
          allGuides = listFrom(fb);
          featuredGuides = allGuides;
          fillAuthors();
          render();
        });
      })
      .catch(function () {});
  }

  document.addEventListener('atm:lang', function () {
    if (!document.getElementById('guides-feed')) return;
    if (!featuredGuides.length && !allGuides.length) return;
    fillAuthors();
    render();
  });
  document.addEventListener('atm:me', function () {
    paintComposer();
    if (allGuides.length || featuredGuides.length) render();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
