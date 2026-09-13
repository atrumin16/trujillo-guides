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

  var REF_TYPES = [
    'Doc Oficial',
    'GitHub',
    'SEC Filing',
    'Paper',
    'Análisis'
  ];

  var attachments = [];
  var userEditedSlug = false;
  var autoSaveTimer = null;

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
        localStorage.getItem(['auth', 'token'].join('_')) ||
        localStorage.getItem('session_token') || '';
      if (!tok) {
        var m = document.cookie.match(new RegExp('(?:^|;\\s*)(?:' + ['auth', 'token'].join('_') + '|ta_session|session_token|token)=([^;]+)'));
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
    try { return (new URLSearchParams(location.search).get('slug') || '').toLowerCase().trim(); } catch (e) { return ''; }
  }

  function slugify(val) {
    return String(val || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
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
    scheduleAutoSave();
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
      return '<li><div class="attach-info-block">' + thumb + '<span class="attach-name-text">' + (a.name || 'archivo') + '</span></div>' +
        ' <button type="button" class="attach-del-btn" data-drop-att="' + i + '" title="Eliminar">✕</button></li>';
    }).join('');
  }

  function addFiles(files, asBody) {
    var ta = document.getElementById('write-textarea');
    var titleIn = document.getElementById('write-title');
    var slugIn = document.getElementById('write-slug');
    var langIn = document.getElementById('write-lang');

    Array.prototype.forEach.call(files, function (file) {
      var ext = (file.name.split('.').pop() || '').toLowerCase();
      if (asBody && TEXT_EXT.test(ext)) {
        var reader = new FileReader();
        reader.onload = function () {
          if (ta) ta.value = String(reader.result || '');
          if (langIn && EXT_LANG[ext]) langIn.value = EXT_LANG[ext];
          if (titleIn && !titleIn.value) {
            titleIn.value = file.name.replace(/\.[^.]+$/, '');
            if (slugIn && !userEditedSlug) slugIn.value = slugify(titleIn.value);
          }
          updateMetrics();
          scheduleAutoSave();
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

  // --- Real-time Reading Metrics ---
  function updateMetrics() {
    var ta = document.getElementById('write-textarea');
    var pill = document.getElementById('metrics-pill');
    if (!ta || !pill) return;
    var text = ta.value || '';
    var chars = text.length;
    var words = (text.trim().match(/\S+/g) || []).length;
    var mins = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
    pill.textContent = words + ' palabras · ~' + mins + ' min lectura · ' + chars + ' caracteres';
  }

  // --- Toolbar Insertion Helper ---
  function insertSnippet(before, after, defaultText) {
    var ta = document.getElementById('write-textarea');
    if (!ta) return;
    var start = ta.selectionStart;
    var end = ta.selectionEnd;
    var sel = ta.value.substring(start, end);
    var insertVal = sel || defaultText || '';
    var rep = before + insertVal + after;
    ta.setRangeText(rep, start, end, 'end');
    ta.focus();
    updateMetrics();
    scheduleAutoSave();
  }

  function handleTool(tool) {
    switch (tool) {
      case 'bold':
        insertSnippet('**', '**', 'negrita');
        break;
      case 'italic':
        insertSnippet('*', '*', 'cursiva');
        break;
      case 'h2':
        insertSnippet('\n## ', '\n', 'Título de sección');
        break;
      case 'h3':
        insertSnippet('\n### ', '\n', 'Subtítulo');
        break;
      case 'link':
        insertSnippet('[', '](https://...)', 'texto del enlace');
        break;
      case 'ticker':
        var ta = document.getElementById('write-textarea');
        if (!ta) return;
        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        var sel = ta.value.substring(start, end).trim();
        if (sel) {
          var clean = sel.replace(/^\$/, '').toUpperCase();
          insertSnippet('$', '', clean);
        } else {
          insertSnippet('$', '', 'TICKER');
        }
        break;
      case 'table':
        insertSnippet('\n\n| Métrica / Parámetro | Valor Actual | Referencia / Benchmark |\n| :--- | :--- | :--- |\n| Crecimiento Ingresos | +15.4% YoY | +12.0% Consenso |\n| Margen Operativo | 42.1% | 40.0% Objetivo |\n| Free Cash Flow | $21.5B | $19.8B FY23 |\n\n', '', '');
        break;
      case 'callout':
        insertSnippet('\n\n> [!NOTE]\n> Escribe aquí la información destacada o apunte técnico relevante.\n\n', '', '');
        break;
      case 'code':
        insertSnippet('\n\n```typescript\n', '\n```\n\n', '// Código o comando');
        break;
    }
  }

  // --- Dynamic References & Sources Module ---
  function getReferences() {
    var rows = document.querySelectorAll('.ref-row');
    var list = [];
    rows.forEach(function (row) {
      var title = (row.querySelector('.ref-title') || {}).value || '';
      var url = (row.querySelector('.ref-url') || {}).value || '';
      var type = (row.querySelector('.ref-type') || {}).value || 'Doc Oficial';
      if (title.trim() || url.trim()) {
        list.push({ title: title.trim(), url: url.trim(), type: type });
      }
    });
    return list;
  }

  function addReferenceRow(item) {
    var box = document.getElementById('references-list');
    if (!box) return;
    var row = document.createElement('div');
    row.className = 'ref-row';
    var tVal = (item && item.title) ? item.title : '';
    var uVal = (item && item.url) ? item.url : '';
    var typeVal = (item && item.type) ? item.type : 'Doc Oficial';

    var optionsHtml = REF_TYPES.map(function (opt) {
      return '<option value="' + opt + '"' + (opt === typeVal ? ' selected' : '') + '>' + opt + '</option>';
    }).join('');

    row.innerHTML =
      '<input type="text" class="ref-title" placeholder="Título / Fuente (ej. SEC 10-K FY24)" value="' + tVal.replace(/"/g, '&quot;') + '">' +
      '<input type="url" class="ref-url" placeholder="https://..." value="' + uVal.replace(/"/g, '&quot;') + '">' +
      '<select class="ref-type">' + optionsHtml + '</select>' +
      '<button type="button" class="ref-delete-btn" title="Eliminar fila">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
      '</button>';

    box.appendChild(row);
  }

  function formatReferencesMarkdown(refs) {
    if (!refs || !refs.length) return '';
    var out = '\n\n## Fonts i Referències\n\n| Font / Document | Tipus | Enllaç |\n| :--- | :--- | :--- |\n';
    refs.forEach(function (r) {
      var linkText = r.url ? ('[' + (r.title || 'Accedir') + '](' + r.url + ')') : (r.title || '—');
      out += '| ' + (r.title || '—') + ' | `' + r.type + '` | ' + linkText + ' |\n';
    });
    return out;
  }

  // --- Universal Ticker Formatting in Preview HTML ---
  function formatTickersInHtml(html) {
    if (!html) return '';
    var tickerRegex = /\(?\$([A-Z0-9]+(?:\.[A-Z0-9]+)?)\)?/g;
    return html.replace(tickerRegex, function (match, ticker) {
      return '<span class="ticker-badge">$' + ticker + '</span>';
    });
  }

  // --- Dual Mode Preview Compiler ---
  function updatePreview() {
    var ta = document.getElementById('write-textarea');
    var pv = document.getElementById('write-preview');
    if (!ta || !pv) return;
    var raw = ta.value || '';
    var refs = getReferences();
    var fullMarkdown = raw + formatReferencesMarkdown(refs);

    var compiledHtml = '';
    if (window.marked && typeof window.marked.parse === 'function') {
      try {
        compiledHtml = window.marked.parse(fullMarkdown, { gfm: true, breaks: true });
      } catch (e) {
        compiledHtml = '<p>' + fullMarkdown + '</p>';
      }
    } else {
      compiledHtml = '<pre>' + fullMarkdown + '</pre>';
    }

    // Callout replacement
    compiledHtml = compiledHtml.replace(/<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br>)?\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi, function (m, kind, body) {
      var kindLower = kind.toLowerCase();
      var cls = kindLower === 'tip' || kindLower === 'note' ? 'callout tip' : 'callout';
      return '<div class="' + cls + '"><div class="callout-title">' + kind.toUpperCase() + '</div><p>' + body + '</p></div>';
    });

    // Universal ticker replacement
    compiledHtml = formatTickersInHtml(compiledHtml);

    pv.innerHTML = compiledHtml;
  }

  function setEditorTab(mode) {
    var tabWrite = document.getElementById('tab-write');
    var tabPreview = document.getElementById('tab-preview');
    var ta = document.getElementById('write-textarea');
    var pv = document.getElementById('write-preview');
    if (!tabWrite || !tabPreview || !ta || !pv) return;

    if (mode === 'preview') {
      tabPreview.classList.add('is-active');
      tabWrite.classList.remove('is-active');
      ta.style.display = 'none';
      pv.hidden = false;
      updatePreview();
    } else {
      tabWrite.classList.add('is-active');
      tabPreview.classList.remove('is-active');
      pv.hidden = true;
      ta.style.display = '';
      ta.focus();
    }
  }

  // --- LocalStorage Auto-save & Restore ---
  function scheduleAutoSave() {
    if (slugFromQuery()) return; // Don't overwrite draft if editing an existing guide
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(function () {
      try {
        var form = document.getElementById('write-form');
        if (!form) return;
        var draft = {
          title: (document.getElementById('write-title') || {}).value || '',
          slug: (document.getElementById('write-slug') || {}).value || '',
          summary: (document.getElementById('write-summary') || {}).value || '',
          content: (document.getElementById('write-textarea') || {}).value || '',
          kind: (document.getElementById('write-kind') || {}).value || 'guide',
          langDoc: (document.getElementById('write-lang-doc') || {}).value || 'es',
          level: (document.getElementById('write-level') || {}).value || 'intermediate',
          pinned: !!(document.getElementById('write-pinned') || {}).checked,
          references: getReferences(),
          savedAt: Date.now()
        };
        if (draft.title || draft.content) {
          localStorage.setItem('atm_write_draft', JSON.stringify(draft));
          showDraftStatus(draft.savedAt);
        }
      } catch (e) {}
    }, 500);
  }

  function showDraftStatus(time) {
    var box = document.getElementById('draft-box');
    var txt = document.getElementById('draft-status-text');
    if (!box || !txt) return;
    box.hidden = false;
    var d = time ? new Date(time) : new Date();
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    txt.textContent = 'Borrador guardado (' + hh + ':' + mm + ')';
  }

  function restoreDraft() {
    try {
      var saved = JSON.parse(localStorage.getItem('atm_write_draft') || '{}');
      if (!saved) return;
      var titleIn = document.getElementById('write-title');
      var slugIn = document.getElementById('write-slug');
      var sumIn = document.getElementById('write-summary');
      var ta = document.getElementById('write-textarea');
      var kindIn = document.getElementById('write-kind');
      var langDoc = document.getElementById('write-lang-doc');
      var levelIn = document.getElementById('write-level');
      var pinIn = document.getElementById('write-pinned');

      if (titleIn && saved.title) titleIn.value = saved.title;
      if (slugIn && saved.slug) { slugIn.value = saved.slug; userEditedSlug = true; }
      if (sumIn && saved.summary) sumIn.value = saved.summary;
      if (ta && saved.content) ta.value = saved.content;
      if (saved.kind) paintKinds(saved.kind);
      if (langDoc && saved.langDoc) langDoc.value = saved.langDoc;
      if (levelIn && saved.level) levelIn.value = saved.level;
      if (pinIn) pinIn.checked = !!saved.pinned;

      var refBox = document.getElementById('references-list');
      if (refBox && Array.isArray(saved.references) && saved.references.length) {
        refBox.innerHTML = '';
        saved.references.forEach(addReferenceRow);
      }

      updateMetrics();
      status('Borrador restaurado con éxito.', true);
      setTimeout(function () { status('', false); }, 3000);
    } catch (e) {}
  }

  function discardDraft() {
    try {
      localStorage.removeItem('atm_write_draft');
      var box = document.getElementById('draft-box');
      if (box) box.hidden = true;
      status('Borrador descartado.', true);
      setTimeout(function () { status('', false); }, 2500);
    } catch (e) {}
  }

  // --- Main Initializer / Loader ---
  async function load() {
    paintKinds('guide');
    updateMetrics();

    var slug = slugFromQuery();
    var form = document.getElementById('write-form');
    var del = document.getElementById('delete-guide');
    var heading = document.getElementById('write-heading');
    var ai = document.getElementById('open-ai');
    var titleIn = document.getElementById('write-title');
    var slugIn = document.getElementById('write-slug');
    var sumIn = document.getElementById('write-summary');
    var ta = document.getElementById('write-textarea');
    var langIn = document.getElementById('write-lang');
    var langDoc = document.getElementById('write-lang-doc');
    var levelIn = document.getElementById('write-level');
    var pinIn = document.getElementById('write-pinned');

    if (!slug) {
      // Check if draft exists in localStorage
      try {
        var savedDraft = JSON.parse(localStorage.getItem('atm_write_draft') || '{}');
        if (savedDraft && (savedDraft.title || savedDraft.content)) {
          showDraftStatus(savedDraft.savedAt);
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

    if (titleIn) titleIn.value = data.title || '';
    if (slugIn) { slugIn.value = data.slug || ''; userEditedSlug = true; }
    if (sumIn) sumIn.value = data.summary || '';
    if (ta) ta.value = data.content || '';
    if (data.lang && langIn) langIn.value = data.lang;
    if (data.langDoc && langDoc) langDoc.value = data.langDoc;
    if (data.level && levelIn) levelIn.value = data.level;
    if (pinIn) pinIn.checked = !!data.pinned;

    paintKinds(data.kind || data.category || 'guide');
    attachments = Array.isArray(data.attachments) ? data.attachments.slice() : [];
    paintAttach();

    var refBox = document.getElementById('references-list');
    if (refBox) {
      refBox.innerHTML = '';
      if (Array.isArray(data.references) && data.references.length) {
        data.references.forEach(addReferenceRow);
      }
    }

    updateMetrics();

    if (heading) heading.textContent = t('editGuide');
    if (del) del.hidden = false;
    if (ai) ai.href = studioUrl(data.title || '');
  }

  // --- Global Event Delegation ---
  document.addEventListener('click', function (e) {
    // Kind pills
    var chip = e.target.closest('.kind-chip');
    if (chip) { setKind(chip.getAttribute('data-kind')); return; }

    // Drop attachment
    var drop = e.target.closest('[data-drop-att]');
    if (drop) {
      attachments.splice(Number(drop.getAttribute('data-drop-att')), 1);
      paintAttach();
      return;
    }

    // Toolbar buttons
    var toolBtn = e.target.closest('.studio-tool-btn');
    if (toolBtn && toolBtn.dataset.tool) {
      handleTool(toolBtn.dataset.tool);
      return;
    }

    // Tabs
    if (e.target.closest('#tab-write')) { setEditorTab('write'); return; }
    if (e.target.closest('#tab-preview')) { setEditorTab('preview'); return; }

    // Draft restore & discard
    if (e.target.closest('#draft-restore-btn')) { restoreDraft(); return; }
    if (e.target.closest('#draft-discard-btn')) { discardDraft(); return; }

    // References: Add row
    if (e.target.closest('#add-reference-btn')) {
      addReferenceRow();
      scheduleAutoSave();
      return;
    }

    // References: Delete row
    var refDel = e.target.closest('.ref-delete-btn');
    if (refDel) {
      var row = refDel.closest('.ref-row');
      if (row) row.remove();
      scheduleAutoSave();
      return;
    }

    // Custom File Trigger Buttons
    if (e.target.closest('#btn-import-file')) {
      var f1 = document.getElementById('import-file');
      if (f1) f1.click();
      return;
    }
    if (e.target.closest('#btn-attach-files')) {
      var f2 = document.getElementById('attach-files');
      if (f2) f2.click();
      return;
    }
  });

  // File Inputs change
  document.addEventListener('change', function (e) {
    if (e.target.id === 'import-file' && e.target.files && e.target.files[0]) {
      addFiles(e.target.files, true);
      e.target.value = '';
      return;
    }
    if (e.target.id === 'attach-files' && e.target.files && e.target.files.length) {
      addFiles(e.target.files, false);
      e.target.value = '';
      return;
    }
    if (e.target.closest('#references-section, #write-lang-doc, #write-level, #write-pinned')) {
      scheduleAutoSave();
    }
  });

  // Drag & Drop Ingest
  document.addEventListener('dragover', function (e) {
    if (!e.target.closest('#unified-drop-zone')) return;
    e.preventDefault();
    var z = document.getElementById('unified-drop-zone');
    if (z) z.classList.add('is-over');
  });
  document.addEventListener('dragleave', function (e) {
    if (e.target.id === 'unified-drop-zone' || !e.target.closest('#unified-drop-zone')) {
      var z = document.getElementById('unified-drop-zone');
      if (z) z.classList.remove('is-over');
    }
  });
  document.addEventListener('drop', function (e) {
    var z = document.getElementById('unified-drop-zone');
    if (z) z.classList.remove('is-over');
    if (!e.target.closest('#unified-drop-zone')) return;
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      var first = e.dataTransfer.files[0];
      var ext = (first.name.split('.').pop() || '');
      addFiles(e.dataTransfer.files, TEXT_EXT.test(ext) && e.dataTransfer.files.length === 1);
    }
  });

  // Form inputs handling
  document.addEventListener('input', function (e) {
    if (e.target.id === 'write-textarea') {
      updateMetrics();
      scheduleAutoSave();
    }
    if (e.target.id === 'write-title') {
      var val = e.target.value || '';
      var ai = document.getElementById('open-ai');
      if (ai) ai.href = studioUrl(val);
      var slugIn = document.getElementById('write-slug');
      if (slugIn && !userEditedSlug && !slugFromQuery()) {
        slugIn.value = slugify(val);
      }
      scheduleAutoSave();
    }
    if (e.target.id === 'write-slug') {
      userEditedSlug = true;
      scheduleAutoSave();
    }
    if (e.target.id === 'write-summary' || e.target.closest('.ref-row')) {
      scheduleAutoSave();
    }
  });

  // Form Submit
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('#write-form');
    if (!form) return;
    e.preventDefault();

    var me = window.__taMe;
    if (!(me && (me.handle || me.owner))) { needLogin(); return; }

    status(t('publishing'));
    var titleIn = document.getElementById('write-title');
    var slugIn = document.getElementById('write-slug');
    var sumIn = document.getElementById('write-summary');
    var ta = document.getElementById('write-textarea');
    var kindIn = document.getElementById('write-kind');
    var langIn = document.getElementById('write-lang');
    var langDoc = document.getElementById('write-lang-doc');
    var levelIn = document.getElementById('write-level');
    var pinIn = document.getElementById('write-pinned');

    var rawMarkdown = ta ? ta.value : '';
    var refs = getReferences();

    var payload = {
      slug: (slugIn && slugIn.value.trim()) ? slugify(slugIn.value.trim()) : slugFromQuery(),
      title: titleIn ? titleIn.value.trim() : '',
      summary: sumIn ? sumIn.value.trim() : '',
      content: rawMarkdown,
      lang: langIn ? langIn.value : 'markdown',
      langDoc: langDoc ? langDoc.value : 'es',
      level: levelIn ? levelIn.value : 'intermediate',
      pinned: !!(pinIn && pinIn.checked),
      references: refs,
      kind: kindIn ? kindIn.value : 'guide',
      attachments: attachments
    };

    fetch('/api/guides/write', {
      method: 'POST',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, d: d }; }); })
      .then(function (res) {
        if (res.status === 401) { needLogin(); return; }
        if (!res.ok) { status(res.d.error || t('fileError')); return; }
        status(t('published'), true);
        try { localStorage.removeItem('atm_write_draft'); } catch (e) {}
        if (res.d.url) setTimeout(function () { location.href = res.d.url; }, 500);
      }).catch(function () { status(t('fileError')); });
  });

  // Delete Guide
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

  document.addEventListener('atm:me', function () {
    var me = window.__taMe;
    if (!(me && (me.handle || me.owner))) needLogin();
  });

  document.addEventListener('atm:lang', function () {
    paintKinds((document.getElementById('write-kind') || {}).value);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
