(function () {
  'use strict';

  var KINDS = [
    { id: 'guide', label: 'Guía' },
    { id: 'post', label: 'Post' },
    { id: 'opinion', label: 'Opinión' },
    { id: 'analysis', label: 'Análisis' },
    { id: 'brief', label: 'Brief' },
    { id: 'note', label: 'Nota' },
    { id: 'research', label: 'Research' },
    { id: 'changelog', label: 'Changelog' }
  ];
  var attachments = [];
  var EXT_LANG = {
    md: 'markdown', markdown: 'markdown', html: 'html', htm: 'html', txt: 'plaintext',
    json: 'json', csv: 'csv', tsv: 'csv', svg: 'svg', mmd: 'mermaid', mermaid: 'mermaid',
    js: 'javascript', mjs: 'javascript', ts: 'javascript', py: 'python',
    yml: 'yaml', yaml: 'yaml', sql: 'sql', xml: 'xml', css: 'css', toml: 'code',
    go: 'code', rs: 'code', java: 'code'
  };
  var TEXT_EXT = /^(md|markdown|html|htm|txt|json|csv|tsv|svg|xml|ya?ml|js|mjs|ts|py|sql|css|mmd|toml|go|rs|java)$/i;

  function t(key) {
    return typeof window.atmT === 'function' ? window.atmT(key) : key;
  }
  async function confirmModal(msg) {
    return typeof window.confirmModal === 'function' ? await window.confirmModal(msg) : window.confirm(msg);
  }
  function token() {
    try {
      var tok = localStorage.getItem('trujillo_ai_token') ||
        localStorage.getItem('auth_token') ||
        localStorage.getItem('session_token') || '';
      if (!tok) {
        var m = document.cookie.match(/(?:^|;\s*)(?:auth_token|ta_session|session_token|token)=([^;]+)/);
        if (m) tok = decodeURIComponent(m[1]);
      }
      return tok;
    } catch (e) { return ''; }
  }
  function headers() {
    var h = { 'Content-Type': 'application/json' };
    var tok = token();
    if (tok) h.Authorization = 'Bearer ' + tok;
    return h;
  }
  function slugFromQuery() {
    try { return (new URLSearchParams(location.search).get('slug') || '').toLowerCase(); } catch (e) { return ''; }
  }
  function status(msg, ok) {
    var el = document.getElementById('write-status');
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg || '';
    el.classList.toggle('ok', !!ok);
  }
  function needLogin() {
    if (typeof window.atmOpenAuth === 'function') window.atmOpenAuth();
    status(t('needStudio'));
  }
  function studioUrl(title) {
    var ret = encodeURIComponent(location.origin + '/write' + (slugFromQuery() ? '?slug=' + slugFromQuery() : ''));
    var u = 'https://ai.trujillomingorance.com/?intent=guide&redirect_to=' + ret + '&return=' + ret;
    if (title) u += '&title=' + encodeURIComponent(title);
    return u;
  }
  function fileToData(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result || '')); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }
  function setKind(id) {
    var input = document.getElementById('write-kind');
    if (input) input.value = id;
    document.querySelectorAll('.kind-chip').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-kind') === id);
    });
  }
  function paintKinds(current) {
    var box = document.getElementById('kind-chips');
    if (!box) return;
    box.innerHTML = KINDS.map(function (k) {
      return '<button type="button" class="kind-chip" data-kind="' + k.id + '">' + t('kind-' + k.id) + '</button>';
    }).join('');
    setKind(current || 'guide');
  }
  function paintAttach() {
    var box = document.getElementById('attach-list');
    if (!box) return;
    box.innerHTML = attachments.map(function (a, i) {
      var thumb = '';
      if (a.data && /^data:image\//.test(a.data)) thumb = '<img src="' + a.data + '" alt="">';
      else if (a.url && /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(a.url || a.name || '')) thumb = '<img src="' + a.url + '" alt="">';
      return '<li>' + thumb + '<span>' + (a.name || 'archivo') + '</span>' +
        ' <button type="button" data-drop-att="' + i + '">✕</button></li>';
    }).join('');
  }
  function addFiles(files, asBody) {
    var form = document.getElementById('write-form');
    Array.prototype.forEach.call(files, function (file) {
      var ext = (file.name.split('.').pop() || '').toLowerCase();
      if (asBody && TEXT_EXT.test(ext)) {
        var reader = new FileReader();
        reader.onload = function () {
          form.content.value = String(reader.result || '');
          if (form.lang && EXT_LANG[ext]) form.lang.value = EXT_LANG[ext];
          if (!form.title.value) form.title.value = file.name.replace(/\.[^.]+$/, '');
        };
        reader.readAsText(file);
        return;
      }
      if (file.size > 900000) { status(t('fileTooBig')); return; }
      fileToData(file).then(function (data) {
        attachments.push({
          name: file.name,
          ext: ext,
          type: file.type,
          size: file.size,
          data: data
        });
        paintAttach();
      });
    });
  }

  async function load() {
    paintKinds('guide');
    var slug = slugFromQuery();
    var form = document.getElementById('write-form');
    var del = document.getElementById('delete-guide');
    var heading = document.getElementById('write-heading');
    var ai = document.getElementById('open-ai');
    if (!slug) {
      try {
        var savedDraft = JSON.parse(localStorage.getItem('atm_write_draft') || '{}');
        if (savedDraft && (savedDraft.title || savedDraft.content)) {
          if (!form.title.value && savedDraft.title) form.title.value = savedDraft.title;
          if (form.summary && !form.summary.value && savedDraft.summary) form.summary.value = savedDraft.summary;
          if (!form.content.value && savedDraft.content) form.content.value = savedDraft.content;
          if (savedDraft.kind) paintKinds(savedDraft.kind);
          if (ai) ai.href = studioUrl(form.title.value || '');
        }
      } catch (e) {}
      return;
    }
    var res = await fetch('/api/guides/write?slug=' + encodeURIComponent(slug), {
      headers: headers(),
      credentials: 'same-origin'
    });
    var data = await res.json().catch(function () { return {}; });
    if (res.status === 401) { needLogin(); return; }
    if (!res.ok) { status(data.error || t('fileError')); return; }
    form.title.value = data.title || '';
    if (form.summary) form.summary.value = data.summary || '';
    form.content.value = data.content || '';
    if (data.lang && form.lang) form.lang.value = data.lang;
    paintKinds(data.kind || data.category || 'guide');
    attachments = Array.isArray(data.attachments) ? data.attachments.slice() : [];
    paintAttach();
    if (heading) heading.textContent = t('editGuide');
    if (del) del.hidden = false;
    if (ai) ai.href = studioUrl(data.title || '');
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.kind-chip');
    if (chip) { setKind(chip.getAttribute('data-kind')); return; }
    var drop = e.target.closest('[data-drop-att]');
    if (drop) {
      attachments.splice(Number(drop.getAttribute('data-drop-att')), 1);
      paintAttach();
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.id === 'import-file' && e.target.files && e.target.files[0]) {
      addFiles(e.target.files, true);
      e.target.value = '';
      return;
    }
    if (e.target.id === 'attach-files' && e.target.files && e.target.files.length) {
      addFiles(e.target.files, false);
      e.target.value = '';
    }
  });

  document.addEventListener('dragover', function (e) {
    if (!e.target.closest('#write-drop, #write-form')) return;
    e.preventDefault();
    var z = document.getElementById('write-drop');
    if (z) z.classList.add('is-over');
  });
  document.addEventListener('dragleave', function (e) {
    if (e.target.id === 'write-drop') e.target.classList.remove('is-over');
  });
  document.addEventListener('drop', function (e) {
    var z = document.getElementById('write-drop');
    if (z) z.classList.remove('is-over');
    if (!e.target.closest('#write-drop, #write-form')) return;
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      var first = e.dataTransfer.files[0];
      var ext = (first.name.split('.').pop() || '');
      addFiles(e.dataTransfer.files, TEXT_EXT.test(ext) && e.dataTransfer.files.length === 1);
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('#write-form');
    if (!form) return;
    e.preventDefault();
    var me = window.__taMe;
    if (!(me && (me.handle || me.owner))) { needLogin(); return; }
    status(t('publishing'));
    fetch('/api/guides/write', {
      method: 'POST',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify({
        slug: slugFromQuery(),
        title: form.title.value.trim(),
        summary: form.summary ? form.summary.value.trim() : '',
        content: form.content.value,
        lang: form.lang ? form.lang.value : 'markdown',
        kind: (document.getElementById('write-kind') || {}).value || 'guide',
        attachments: attachments
      })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, d: d }; }); })
      .then(function (res) {
        if (res.status === 401) { needLogin(); return; }
        if (!res.ok) { status(res.d.error || t('fileError')); return; }
        status(t('published'), true);
        try { localStorage.removeItem('atm_write_draft'); } catch (e) {}
        if (res.d.url) setTimeout(function () { location.href = res.d.url; }, 500);
      }).catch(function () { status(t('fileError')); });
  });

  document.addEventListener('click', async function (e) {
    if (!e.target.closest('#delete-guide')) return;
    e.preventDefault();
    if (!await confirmModal(t('confirmDelete'))) return;
    fetch('/api/guides/write', {
      method: 'DELETE',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify({ slug: slugFromQuery() })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) { status(res.d.error || t('fileError')); return; }
        try { localStorage.removeItem('atm_write_draft'); } catch (e) {}
        location.href = '/';
      });
  });

  document.addEventListener('input', function (e) {
    var form = document.getElementById('write-form');
    if (form && !slugFromQuery()) {
      try {
        localStorage.setItem('atm_write_draft', JSON.stringify({
          title: form.title.value || '',
          summary: form.summary ? form.summary.value : '',
          content: form.content.value || '',
          kind: (document.getElementById('write-kind') || {}).value || 'guide'
        }));
      } catch (err) {}
    }
    if (e.target.name === 'title') {
      var ai = document.getElementById('open-ai');
      if (ai) ai.href = studioUrl(e.target.value);
    }
  });

  document.addEventListener('atm:me', function () {
    var me = window.__taMe;
    if (!(me && (me.handle || me.owner))) needLogin();
  });
  document.addEventListener('atm:lang', function () { paintKinds((document.getElementById('write-kind') || {}).value); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
