(function () {
  'use strict';

  // ── Apply theme immediately (before paint) ──────────────────────
  var savedTheme = localStorage.getItem('trujillo_theme') || localStorage.getItem('atm_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : 'dark');

  // ── DOM ready ───────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {

    // ── Language toggle ─────────────────────────────────────────────
    var UI = {
      es: {
        'sidebar-status-title': 'Sistemas en Línea',
        'sidebar-status-meta':  'Runbook Verificado · Producción',
        'sidebar-role':         'DevOps & Ingeniería de Sistemas',
        'toc-title':            'Capítulos',
        'breadcrumb-title':     'Correo Empresarial',
        'footer-text':          '© 2026 ATM Software Labs · Documentación Técnica y Runbooks',
        'footer-index':         '← Índice de Guías'
      },
      en: {
        'sidebar-status-title': 'Systems Online',
        'sidebar-status-meta':  'Verified Runbook · Production',
        'sidebar-role':         'DevOps & Systems Engineering',
        'toc-title':            'Chapters',
        'breadcrumb-title':     'Enterprise Email',
        'footer-text':          '© 2026 ATM Software Labs · Technical Documentation & Runbooks',
        'footer-index':         '← Guide Index'
      }
    };

    window.setLanguage = function (lang) {
      // Show/hide content
      var enDiv = document.querySelector('.content-en');
      var esDiv = document.querySelector('.content-es');
      if (enDiv) enDiv.classList.toggle('hidden', lang !== 'en');
      if (esDiv) esDiv.classList.toggle('hidden', lang !== 'es');

      // Show/hide TOC
      var tocEn = document.getElementById('toc-en');
      var tocEs = document.getElementById('toc-es');
      if (tocEn) tocEn.classList.toggle('hidden', lang !== 'en');
      if (tocEs) tocEs.classList.toggle('hidden', lang !== 'es');

      // Active button state
      var btnEs = document.getElementById('lang-btn-es');
      var btnEn = document.getElementById('lang-btn-en');
      if (btnEs) btnEs.classList.toggle('active', lang === 'es');
      if (btnEn) btnEn.classList.toggle('active', lang === 'en');

      // HTML lang
      document.documentElement.lang = lang;

      // Translate UI labels
      Object.keys(UI[lang] || {}).forEach(function (id) {
        var node = document.getElementById(id);
        if (node) node.textContent = UI[lang][id];
      });

      localStorage.setItem('atm_lang', lang);
    };

    // Init language
    window.setLanguage(localStorage.getItem('atm_lang') || 'es');

    // ── Progress bar ────────────────────────────────────────────────
    var bar = document.getElementById('progress-bar');
    if (bar) {
      window.addEventListener('scroll', function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.value = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      }, { passive: true });
    }

    // ── Back to top ─────────────────────────────────────────────────
    var btt = document.getElementById('back-to-top');
    if (btt) {
      window.addEventListener('scroll', function () {
        btt.classList.toggle('visible', window.scrollY > 500);
      }, { passive: true });
    }

    // ── TOC scroll spy ──────────────────────────────────────────────
    var tocLinks = Array.from(document.querySelectorAll('.toc-link'));
    var sections = tocLinks
      .map(function (l) { return { link: l, el: document.getElementById((l.getAttribute('href') || '').replace('#', '')) }; })
      .filter(function (s) { return s.el; });

    if (sections.length) {
      window.addEventListener('scroll', function () {
        var top = window.scrollY + 120;
        var active = sections[0];
        sections.forEach(function (s) { if (s.el.offsetTop <= top) active = s; });
        tocLinks.forEach(function (l) { l.classList.remove('active'); });
        if (active) active.link.classList.add('active');
      }, { passive: true });
    }

    // ── Copy buttons ────────────────────────────────────────────────
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.copy-btn, .dns-quick-copy');
      if (!btn) return;

      var text = btn.getAttribute('data-copy') || '';
      if (!text) {
        var container = btn.closest('.code-container');
        if (container) {
          var code = container.querySelector('code');
          if (code) text = code.textContent.trim();
        }
      }
      if (!text) return;

      var orig = btn.textContent;
      function done() {
        btn.textContent = 'Copiado';
        setTimeout(function () { btn.textContent = orig; }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.className = 'offscreen-copy';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
        done();
      }
    });

    // ── DNS Simulator ───────────────────────────────────────────────
    var simBusy = {};
    window.testDnsProtocol = function (type, lang) {
      var key = type + '-' + lang;
      if (simBusy[key]) return;
      simBusy[key] = true;

      var statusEl = document.getElementById('sim-status-' + key);
      var outEl    = document.getElementById('sim-out-'    + key);
      if (!statusEl) return;

      statusEl.textContent = lang === 'es' ? 'Verificando…' : 'Testing…';
      statusEl.classList.remove('sim-ok');
      statusEl.classList.add('sim-wait');

      setTimeout(function () {
        var msgs = {
          spf: {
            es: '✓ PASS — SPF alineado al 100%. Todos los servidores autorizados verificados.',
            en: '✓ PASS — SPF 100% aligned. All authorized send servers matched and verified.'
          },
          dkim: {
            es: '✓ PASS — Firma RSA-SHA256 2048-bit verificada por Google Edge MX.',
            en: '✓ PASS — RSA-SHA256 2048-bit signature verified by Google Edge MX.'
          },
          dmarc: {
            es: '✓ PASS — Política p=reject aplicada. Intentos de suplantación bloqueados.',
            en: '✓ PASS — p=reject policy enforced. Identity spoofing attempts blocked.'
          }
        };
        statusEl.textContent = 'PASS';
        statusEl.classList.remove('sim-wait');
        statusEl.classList.add('sim-ok');
        if (outEl) outEl.textContent = (msgs[type] || {})[lang] || (msgs[type] || {}).en || '✓ OK';
      }, 1200);
    };

    // ── Checklist items (click to mark done) ────────────────────────
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.checklist-item');
      if (!item) return;
      item.classList.toggle('done');

      // Update progress for this lang block
      var block = item.closest('.content-en, .content-es');
      if (!block) return;
      var lang = block.classList.contains('content-en') ? 'en' : 'es';
      var suffix = '-' + lang;
      var allItems = block.querySelectorAll('.checklist-item');
      var doneItems = block.querySelectorAll('.checklist-item.done');
      var pct = allItems.length ? Math.round((doneItems.length / allItems.length) * 100) : 0;

      var countEl = document.getElementById('checklist-count' + suffix);
      var pctEl   = document.getElementById('checklist-percent' + suffix);
      var fillEl  = document.getElementById('checklist-fill' + suffix);
      var banner  = document.getElementById('checklist-banner' + suffix);

      if (countEl) countEl.textContent = doneItems.length + '/' + allItems.length;
      if (pctEl)   pctEl.textContent   = pct + '%';
      if (fillEl)  fillEl.value = pct;
      if (banner)  banner.classList.toggle('hidden', pct !== 100);
    });

    // Legacy onclick bridge (HTML has onclick="toggleChecklistStep(n)")
    window.toggleChecklistStep = function (n) {
      var item = document.querySelector('.checklist-item[data-step="' + n + '"]');
      if (item) item.click();
    };

    // ── Savings Calculator ──────────────────────────────────────────
    var planRates = {
      en: 12,
      es: 11.50
    };

    function updateCalc(lang) {
      var sfx = '-' + lang;
      var sliderEl = document.getElementById('calc-team-slider' + sfx);
      var wsEl     = document.getElementById('calc-ws-annual'   + sfx);
      var netEl    = document.getElementById('calc-net-annual'  + sfx);
      var fiveEl   = document.getElementById('calc-5yr-savings' + sfx);
      var dispEl   = document.getElementById('calc-team-display'+ sfx);

      if (!sliderEl) return;

      var users  = parseInt(sliderEl.value, 10) || 4;
      var price  = planRates[lang] || (lang === 'es' ? 11.50 : 12);
      var wsYear = users * price * 12;
      var fiveYr = wsYear * 5;

      if (dispEl) {
        dispEl.textContent = (lang === 'es' ? users + (users === 1 ? ' persona' : ' personas') : users + (users === 1 ? ' founder' : ' founders'));
      }
      if (wsEl) {
        wsEl.textContent = (lang === 'es' ? wsYear.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' € / año' : '$' + wsYear.toLocaleString() + ' / yr');
      }
      if (netEl) {
        netEl.textContent = (lang === 'es' ? wsYear.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' € / año' : '$' + wsYear.toLocaleString() + ' / yr');
      }
      if (fiveEl) {
        fiveEl.textContent = (lang === 'es' ? 'Ahorro a 5 años: ' + fiveYr.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €' : '5-Year Savings: $' + fiveYr.toLocaleString());
      }
    }

    // Wire sliders and plan selector buttons
    ['en', 'es'].forEach(function (lang) {
      var slider = document.getElementById('calc-team-slider-' + lang);
      if (slider) {
        slider.addEventListener('input', function () { updateCalc(lang); });
      }

      var planContainer = document.getElementById('calc-plans-' + lang);
      if (planContainer) {
        var buttons = planContainer.querySelectorAll('.calc-plan-btn');
        buttons.forEach(function (btn) {
          btn.addEventListener('click', function () {
            buttons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            planRates[lang] = parseFloat(btn.getAttribute('data-rate')) || (lang === 'es' ? 11.50 : 12);
            updateCalc(lang);
          });
        });
      }

      updateCalc(lang);
    });

    // Legacy bridge
    window.calcSavings = function (lang) { updateCalc(lang); };

    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { window.setLanguage(btn.getAttribute('data-lang')); });
    });
    document.querySelectorAll('[data-dns]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.testDnsProtocol(btn.getAttribute('data-dns'), btn.getAttribute('data-dns-lang') || 'es');
      });
    });
    document.querySelectorAll('[data-step]').forEach(function (el) {
      el.addEventListener('click', function () {
        window.toggleChecklistStep(Number(el.getAttribute('data-step')));
      });
    });
    var backTop = document.getElementById('back-to-top');
    if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  }); // end DOMContentLoaded
})();
