(function () {
  'use strict';

  var SUN = '<svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var MOON = '<svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function themeNow() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(next) {
    next = next === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('trujillo_theme', next);
      localStorage.setItem('atm_theme', next);
    } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#ffffff' : '#080c14');
  }

  function themeButtonHtml() {
    var t = typeof window.atmT === 'function' ? window.atmT : function (k) { return k; };
    return '<button type="button" class="theme-toggle-btn" id="theme-btn" data-i18n-title="theme" title="' + t('theme') + '" aria-label="' + t('theme') + '">' +
      SUN + MOON + '</button>';
  }

  function langPickerHtml() {
    var current = (typeof window.atmLang === 'function' && window.atmLang()) || 'es';
    var langs = window.ATM_LANGS || [];
    var meta = langs.filter(function (l) { return l.id === current; })[0] || { id: 'es', flag: '🇪🇸', name: 'Español' };
    var opts = langs.map(function (l) {
      return '<button type="button" class="lang-option' + (l.id === current ? ' active' : '') +
        '" data-lang="' + l.id + '" role="option"><span class="flag">' + l.flag +
        '</span><span>' + l.name + '</span></button>';
    }).join('');
    return '<div class="lang-picker" id="lang-picker">' +
      '<button type="button" class="lang-flag-btn" id="lang-flag-btn" aria-haspopup="listbox" title="' + meta.name + '">' +
      '<span class="flag">' + meta.flag + '</span><span class="lang-code">' + meta.id.toUpperCase() + '</span></button>' +
      '<div class="lang-menu" id="lang-menu" role="listbox" hidden>' + opts + '</div></div>';
  }

  function isShare() {
    return document.body && document.body.getAttribute('data-share') === '1';
  }

  function guestName() {
    try { return (localStorage.getItem('atm_guest_name') || '').trim(); } catch (e) { return ''; }
  }

  function setGuestName(name) {
    name = String(name || '').trim().slice(0, 40);
    try { if (name) localStorage.setItem('atm_guest_name', name); } catch (e) {}
    return name;
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function firstName(full) {
    var s = String(full || '').trim();
    if (!s) return '';
    if (s.charAt(0) === '@') s = s.slice(1);
    if (s.indexOf('@') !== -1 && s.indexOf(' ') === -1) s = s.split('@')[0];
    return s.split(/\s+/)[0];
  }

  function initials(name) {
    var n = firstName(name) || '?';
    return n.slice(0, 1).toUpperCase();
  }

  function avatarHtml(src, name) {
    if (src) return '<img class="account-photo" src="' + esc(src) + '" alt="" width="28" height="28">';
    return '<span class="account-photo account-initials" aria-hidden="true">' + esc(initials(name)) + '</span>';
  }

  function accountHtml() {
    var t = typeof window.atmT === 'function' ? window.atmT : function (k) { return k; };
    var me = window.__taMe;
    if (me && me.handle) {
      var label = firstName(me.name) || firstName(me.handle);
      return '<div class="account-menu-wrap" id="account-menu-wrap" data-notranslate>' +
        '<button type="button" class="account-chip" id="account-btn" aria-haspopup="menu" aria-expanded="false" title="' + esc(me.name || me.handle) + '">' +
        avatarHtml(me.picture, me.name || me.handle) +
        (label ? '<span class="account-first">' + esc(label) + '</span>' : '') +
        '</button>' +
        '<div class="account-menu" id="account-menu" hidden role="menu">' +
        '<a href="/write" role="menuitem" data-i18n="newGuide">' + t('newGuide') + '</a>' +
        '<a href="/u/@' + encodeURIComponent(me.handle) + '" role="menuitem" data-i18n="profile">' + t('profile') + '</a>' +
        '<button type="button" role="menuitem" data-logout data-i18n="logout">' + t('logout') + '</button>' +
        '</div></div>';
    }
    var g = guestName();
    if (g) {
      var gFirst = firstName(g);
      return '<div class="account-menu-wrap" id="account-menu-wrap" data-notranslate>' +
        '<button type="button" class="account-chip" id="account-btn" aria-haspopup="menu" aria-expanded="false" title="' + esc(g) + '">' +
        avatarHtml('', g) +
        (gFirst ? '<span class="account-first">' + esc(gFirst) + '</span>' : '') +
        '</button>' +
        '<div class="account-menu" id="account-menu" hidden role="menu">' +
        '<button type="button" role="menuitem" data-open-auth data-i18n="changeName">' + t('changeName') + '</button>' +
        '<button type="button" role="menuitem" data-logout data-i18n="logout">' + t('logout') + '</button>' +
        '</div></div>';
    }
    return '<button type="button" class="account-chip account-login" id="auth-open" data-open-auth data-i18n="login">' +
      t('login') + '</button>';
  }

  function paintAccount() {
    var actions = document.querySelector('.docs-topbar .topbar-actions');
    if (!actions) return;
    actions.querySelectorAll('#account-menu-wrap, #me-profile, #guest-chip, #auth-open, .account-chip').forEach(function (el) {
      el.remove();
    });
    actions.insertAdjacentHTML('beforeend', accountHtml());
  }

  function closeAccountMenu() {
    var menu = document.getElementById('account-menu');
    var btn = document.getElementById('account-btn');
    if (menu) menu.hidden = true;
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function setSharedCookie(name, val, maxAge) {
    var host = location.hostname;
    var domain = '';
    if (host.indexOf('trujillomingorance.com') !== -1) {
      domain = '; domain=.trujillomingorance.com';
    } else if (host.indexOf('pages.dev') !== -1) {
      domain = '; domain=' + host;
    }
    var exp = typeof maxAge === 'number' ? '; Max-Age=' + maxAge : '';
    document.cookie = name + '=' + encodeURIComponent(val) + '; Path=/; SameSite=Lax; Secure' + domain + exp;
  }

  function getSharedCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function studioLoginUrl(popup) {
    var redirect = encodeURIComponent(window.location.href);
    return 'https://ai.trujillomingorance.com/login?redirect_to=' + redirect +
      '&return=' + redirect + (popup ? '&popup=1' : '');
  }

  function openStudioLogin() {
    var w = 520;
    var h = 680;
    var y = Math.max(0, Math.round(((window.top.outerHeight || window.innerHeight) - h) / 2 + (window.top.screenY || window.screenY || 0)));
    var x = Math.max(0, Math.round(((window.top.outerWidth || window.innerWidth) - w) / 2 + (window.top.screenX || window.screenX || 0)));
    var popup = window.open(
      studioLoginUrl(true),
      'trujillo_ai_login',
      'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=' + w + ',height=' + h + ',top=' + y + ',left=' + x
    );
    if (popup) {
      popup.focus();
    } else {
      location.href = studioLoginUrl(false);
    }
  }

  function logout() {
    try {
      localStorage.removeItem('trujillo_ai_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('atm_guest_name');
    } catch (e) {}
    window.__taMe = null;
    setSharedCookie('ta_session', '', 0);
    setSharedCookie('auth_token', '', 0);
    setSharedCookie('session_active', '', 0);
    fetch('/api/guides/logout', { method: 'POST', credentials: 'same-origin' }).catch(function () {});
    closeAccountMenu();
    paintAccount();
    document.dispatchEvent(new CustomEvent('atm:logout'));
    var nameInput = document.querySelector('#guide-forum [name="name"]');
    if (nameInput) {
      nameInput.value = '';
      nameInput.hidden = false;
    }
  }

  function setSharedToken(tok, user) {
    if (!tok) return;
    try {
      localStorage.setItem('trujillo_ai_token', tok);
      localStorage.setItem('auth_token', tok);
      localStorage.setItem('trujillo_auth_token', tok);
      if (user) {
        localStorage.setItem('trujillo_ai_user', JSON.stringify(user));
        localStorage.setItem('auth_user', JSON.stringify(user));
        if (user.name) localStorage.setItem('atm_guest_name', user.name);
      }
    } catch (e) {}
    setSharedCookie('ta_session', tok);
    setSharedCookie('auth_token', tok);
    setSharedCookie('session_active', '1');
  }

  function mountGoogleInGuides() {
    var slot = document.getElementById('google-guides-btn');
    if (!slot) return;
    if (slot.getAttribute('data-ready')) return;

    function renderGoogle() {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
      var curSlot = document.getElementById('google-guides-btn');
      if (!curSlot) return;
      try {
        window.google.accounts.id.initialize({
          client_id: '161745150528-5pb84k9upvamvlvnc7lg6nr1ku74vc4a.apps.googleusercontent.com',
          callback: async function (res) {
            try {
              var r = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: res.credential })
              });
              var d = await r.json();
              if (r.ok && (d.ok || d.token)) {
                setSharedToken(d.token, d.user);
                closeAuth();
                location.reload();
              } else {
                alert(d.error || 'No se pudo iniciar sesión con Google.');
              }
            } catch (err) {
              alert('Error al conectar con Google.');
            }
          },
          auto_select: false,
          ux_mode: 'popup'
        });
        window.google.accounts.id.renderButton(curSlot, {
          type: 'standard',
          theme: (document.documentElement.getAttribute('data-theme') === 'light' ? 'outline' : 'filled_black'),
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: 280
        });
        curSlot.setAttribute('data-ready', 'true');
      } catch (e) {}
    }

    if (window.google && window.google.accounts && window.google.accounts.id) {
      setTimeout(renderGoogle, 50);
    } else {
      var existing = document.getElementById('google-gsi-script');
      if (!existing) {
        var s = document.createElement('script');
        s.id = 'google-gsi-script';
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.defer = true;
        s.onload = function () { setTimeout(renderGoogle, 50); };
        document.head.appendChild(s);
      } else {
        var interval = setInterval(function () {
          if (window.google && window.google.accounts && window.google.accounts.id) {
            clearInterval(interval);
            renderGoogle();
          }
        }, 150);
        setTimeout(function () { clearInterval(interval); }, 5000);
      }
    }
  }

  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'AUTH_SUCCESS' && event.data.token) {
      setSharedToken(event.data.token, event.data.user);
      closeAuth();
      location.reload();
    }
  });

  function bindGuidesEmailForm() {
    var form = document.getElementById('guides-email-form');
    if (!form || form.getAttribute('data-bound')) return;
    form.setAttribute('data-bound', 'true');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var emailEl = document.getElementById('guides-login-email');
      var passEl = document.getElementById('guides-login-password');
      var errEl = document.getElementById('guides-email-error');
      var btn = document.getElementById('btn-guides-email-submit');
      if (!emailEl || !passEl) return;
      if (errEl) errEl.style.display = 'none';
      if (btn) { btn.disabled = true; btn.textContent = 'Accediendo...'; }
      try {
        var res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailEl.value.trim().toLowerCase(), password: passEl.value })
        });
        var data = await res.json();
        if (res.ok && data.token) {
          setSharedToken(data.token, data.user);
          closeAuth();
          location.reload();
        } else {
          if (errEl) {
            errEl.textContent = data.error || 'Credenciales incorrectas';
            errEl.style.display = 'block';
          }
        }
      } catch (err) {
        if (errEl) {
          errEl.textContent = 'Error de conexión';
          errEl.style.display = 'block';
        }
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Iniciar sesión'; }
      }
    });
  }

  function authModalHtml() {
    var t = typeof window.atmT === 'function' ? window.atmT : function (k) { return k; };
    return '<div class="auth-modal" id="auth-modal" hidden>' +
      '<div class="auth-card" role="dialog" aria-modal="true">' +
      '<button type="button" class="auth-close" data-close-auth aria-label="Cerrar">✕</button>' +
      '<h2 data-i18n="enterName">' + t('enterName') + '</h2>' +
      '<p class="lede" data-i18n="guestHint">' + t('guestHint') + '</p>' +
      '<div style="display:flex;flex-direction:column;gap:10px;align-items:center;width:100%;margin-bottom:14px;">' +
      '<div id="google-guides-btn" style="min-height:44px;display:flex;justify-content:center;width:100%;"></div>' +
      '<button type="button" id="btn-guides-x" style="width:100%;max-width:280px;display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#000;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:9999px;font-size:14px;font-weight:600;padding:10px 16px;cursor:pointer;">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
      '<span>Continuar con X</span></button>' +
      '</div>' +
      '<form id="guides-email-form" style="display:flex;flex-direction:column;gap:8px;width:100%;margin-bottom:12px;">' +
      '<input type="email" id="guides-login-email" placeholder="Correo electrónico" required style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.2);color:inherit;font-size:13px;box-sizing:border-box;">' +
      '<input type="password" id="guides-login-password" placeholder="Contraseña" required style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.2);color:inherit;font-size:13px;box-sizing:border-box;">' +
      '<button type="submit" id="btn-guides-email-submit" style="padding:9px;border-radius:8px;background:var(--primary,#38bdf8);color:#000;font-weight:600;font-size:13px;border:none;cursor:pointer;">Iniciar sesión con correo</button>' +
      '<div id="guides-email-error" style="display:none;font-size:12px;color:#fca5a5;text-align:center;padding:2px 0;"></div>' +
      '</form>' +
      '<div style="display:flex;align-items:center;gap:10px;margin:4px 0 14px;color:var(--text-muted,#71717a);font-size:12px;width:100%;">' +
      '<span style="flex:1;height:1px;background:var(--border,rgba(255,255,255,0.1));"></span>' +
      '<span>o usa un nombre local</span>' +
      '<span style="flex:1;height:1px;background:var(--border,rgba(255,255,255,0.1));"></span>' +
      '</div>' +
      '<form id="guest-form">' +
      '<input type="text" name="guestName" maxlength="40" required autocomplete="nickname" placeholder="' + t('yourName') + '" data-i18n-placeholder="yourName" value="' + esc(guestName()) + '">' +
      '<button type="submit" data-i18n="guestContinue">' + t('guestContinue') + '</button>' +
      '</form>' +
      '<div style="margin-top:14px;text-align:center;">' +
      '<a class="auth-studio" href="' + studioLoginUrl(false) + '" data-studio-login rel="noopener" data-i18n="studioLogin">' + t('studioLogin') + '</a>' +
      '</div>' +
      '</div></div>';
  }

  function ensureAuthModal() {
    if (document.getElementById('auth-modal')) return;
    document.body.insertAdjacentHTML('beforeend', authModalHtml());
    bindGuidesEmailForm();
  }

  function openAuth() {
    ensureAuthModal();
    var modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.hidden = false;
    bindGuidesEmailForm();
    mountGoogleInGuides();
    var input = modal.querySelector('[name="guestName"]');
    if (input) {
      input.value = guestName();
      setTimeout(function () { input.focus(); }, 20);
    }
  }

  function closeAuth() {
    var modal = document.getElementById('auth-modal');
    if (modal) modal.hidden = true;
  }

  (function checkSocialCallback() {
    try {
      var params = new URLSearchParams(window.location.search);
      var state = params.get('state') || '';
      var isX = params.get('auth') === 'x_callback' || state.indexOf('x_oauth_') === 0;
      if (!isX) return;
      var code = params.get('code');
      window.history.replaceState({}, document.title, window.location.pathname);
      if (code) {
        fetch('/api/auth/x', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code, redirectUri: window.location.origin + '/?auth=x_callback' })
        })
          .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
          .then(function (res) {
            if (res.ok && res.d.token) {
              setSharedToken(res.d.token, res.d.user);
              location.reload();
            } else {
              alert(res.d.error || 'No se pudo validar con X');
            }
          })
          .catch(function () { alert('Error al contactar con X'); });
      }
    } catch (e) {}
  })();

  function checkUrlToken() {
    try {
      var p = new URLSearchParams(location.search);
      var tok = p.get('auth_token') || p.get('token');
      if (tok) {
        localStorage.setItem('trujillo_ai_token', tok);
        localStorage.setItem('auth_token', tok);
        setSharedCookie('auth_token', tok);
        setSharedCookie('session_active', '1');
        p.delete('auth_token');
        p.delete('token');
        var clean = location.pathname + (p.toString() ? '?' + p.toString() : '') + location.hash;
        history.replaceState(null, '', clean);
      }
    } catch (e) {}
  }

  async function checkSession() {
    try {
      var tok = localStorage.getItem('trujillo_ai_token') ||
        localStorage.getItem('auth_token') ||
        getSharedCookie('auth_token') ||
        getSharedCookie('ta_session');
      var h = { 'Content-Type': 'application/json' };
      if (tok) h.Authorization = 'Bearer ' + tok;
      var r = await fetch('/api/auth/status', {
        headers: h,
        credentials: 'same-origin'
      });
      var data = await r.json().catch(function () { return {}; });
      if (data && data.authenticated && (data.user || data.me)) {
        window.__taMe = data.user || data.me;
        paintAccount();
        document.dispatchEvent(new CustomEvent('atm:me'));
      }
    } catch (e) {}
  }

  window.atmGuestName = guestName;
  window.atmOpenAuth = openAuth;
  window.atmOpenStudioLogin = openStudioLogin;
  window.atmCheckSession = checkSession;

  function headerHtml() {
    if (isShare()) {
      return '<span class="brand"><span>Doc</span></span>' +
        '<div class="topbar-actions">' + themeButtonHtml() + langPickerHtml() + '</div>';
    }
    return '<a href="/" class="brand">' +
      '<img src="/avatar.png" alt="" class="brand-avatar" width="28" height="28">' +
      '<span>ATM Docs</span></a>' +
      '<div class="topbar-actions">' +
      themeButtonHtml() +
      langPickerHtml() +
      accountHtml() +
      '</div>';
  }

  function footerHtml() {
    if (isShare()) return '<p data-i18n="docLabel">Documento</p>';
    var t = typeof window.atmT === 'function' ? window.atmT : function (k) { return k; };
    return '<p data-i18n="footer">' + t('footer') + '</p>' +
      '<nav class="docs-footer-nav">' +
      '<a href="/" data-i18n="index">' + t('index') + '</a>' +
      '<a href="https://ai.trujillomingorance.com" rel="noopener" data-i18n="studio">' + t('studio') + '</a>' +
      '</nav>';
  }

  function fillActions(actions) {
    var existingTheme = actions.querySelector('.theme-toggle-btn');
    if (!existingTheme) {
      actions.insertAdjacentHTML('afterbegin', themeButtonHtml());
    } else if (!existingTheme.querySelector('svg')) {
      existingTheme.outerHTML = themeButtonHtml();
    }
    if (!actions.querySelector('.lang-picker, #lang-picker')) {
      var theme = actions.querySelector('.theme-toggle-btn');
      if (theme) theme.insertAdjacentHTML('afterend', langPickerHtml());
      else actions.insertAdjacentHTML('afterbegin', langPickerHtml());
    }
    actions.querySelectorAll('.hub-link, .lang-toggle-group').forEach(function (el) { el.remove(); });
    paintAccount();
  }

  function ensureHeader() {
    document.body.classList.add('docs-body');
    var bar = document.querySelector('.docs-topbar');
    if (!bar) {
      bar = document.createElement('header');
      bar.className = 'docs-topbar';
      document.body.insertBefore(bar, document.body.firstChild);
    }
    bar.id = 'docs-topbar';
    var crumb = bar.querySelector('.ee-crumb');
    if (crumb) crumb.remove();
    if (isShare() || !bar.querySelector('.brand')) {
      bar.innerHTML = headerHtml();
    } else {
      var actions = bar.querySelector('.topbar-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'topbar-actions';
        bar.appendChild(actions);
      }
      fillActions(actions);
    }
    var legacy = document.querySelector('.site-header');
    if (legacy) legacy.setAttribute('hidden', '');
    ensureAuthModal();
  }

  function ensureFooter() {
    document.querySelectorAll('footer.site-footer').forEach(function (el) { el.remove(); });
    var foot = document.getElementById('docs-footer');
    if (!foot) {
      foot = document.createElement('footer');
      foot.className = 'docs-footer';
      foot.id = 'docs-footer';
      document.body.appendChild(foot);
    }
    foot.innerHTML = footerHtml();
  }

  function bindOnce() {
    if (window.__atmChromeBound) return;
    window.__atmChromeBound = true;
    document.addEventListener('click', function (e) {
      var themeBtn = e.target.closest('.theme-toggle-btn');
      if (themeBtn) {
        e.preventDefault();
        applyTheme(themeNow() === 'light' ? 'dark' : 'light');
        return;
      }
      if (e.target.closest('[data-logout]')) {
        e.preventDefault();
        logout();
        return;
      }
      var accBtn = e.target.closest('#account-btn');
      if (accBtn) {
        e.preventDefault();
        var accMenu = document.getElementById('account-menu');
        if (accMenu) {
          accMenu.hidden = !accMenu.hidden;
          accBtn.setAttribute('aria-expanded', accMenu.hidden ? 'false' : 'true');
        }
        var langOpen = document.getElementById('lang-menu');
        if (langOpen) langOpen.hidden = true;
        return;
      }
      if (e.target.closest('[data-open-auth]')) {
        e.preventDefault();
        closeAccountMenu();
        openAuth();
        return;
      }
      if (e.target.closest('[data-close-auth]') || (e.target.id === 'auth-modal')) {
        closeAuth();
        return;
      }
      var studioBtn = e.target.closest('[data-studio-login], .auth-studio');
      if (studioBtn) {
        e.preventDefault();
        openStudioLogin();
        return;
      }
      var xBtn = e.target.closest('#btn-guides-x');
      if (xBtn) {
        e.preventDefault();
        var state = 'x_oauth_' + Math.random().toString(36).slice(2, 10);
        try { localStorage.setItem('trujillo_x_oauth_state', state); } catch (err) {}
        var redirectUri = encodeURIComponent(window.location.origin + '/?auth=x_callback');
        window.location.href = 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NF94WVVIT1dzSXZNaTJuYjRXSEc6MTpjaQ' +
          '&redirect_uri=' + redirectUri + '&scope=users.read%20tweet.read&state=' + state +
          '&code_challenge=challenge&code_challenge_method=plain';
        return;
      }
      if (!e.target.closest('.account-menu-wrap')) closeAccountMenu();
      var flagBtn = e.target.closest('#lang-flag-btn');
      if (flagBtn) {
        var menu = document.getElementById('lang-menu');
        if (menu) menu.hidden = !menu.hidden;
        return;
      }
      var langBtn = e.target.closest('.lang-option[data-lang], .lang-btn[data-lang]');
      if (!langBtn) {
        var open = document.getElementById('lang-menu');
        if (open && !e.target.closest('.lang-picker')) open.hidden = true;
        return;
      }
      var lang = langBtn.getAttribute('data-lang');
      var menuClose = document.getElementById('lang-menu');
      if (menuClose) menuClose.hidden = true;
      if (typeof window.atmApplyUi === 'function') window.atmApplyUi(lang);
    });
    document.addEventListener('submit', function (e) {
      var form = e.target.closest('#guest-form');
      if (!form) return;
      e.preventDefault();
      var name = setGuestName((form.guestName && form.guestName.value) || '');
      if (!name) return;
      closeAuth();
      paintAccount();
      document.dispatchEvent(new CustomEvent('atm:guest', { detail: { name: name } }));
      if (typeof window.atmApplyUi === 'function') window.atmApplyUi(window.atmLang());
    });
    document.addEventListener('atm:me', paintAccount);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAuth();
        closeAccountMenu();
      }
    });

    window.addEventListener('message', function (e) {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'AUTH_SUCCESS' || e.data.type === 'LOGIN_SUCCESS' || e.data.token || e.data.auth_token) {
        var tok = e.data.token || e.data.auth_token;
        if (tok) {
          localStorage.setItem('trujillo_ai_token', tok);
          localStorage.setItem('auth_token', tok);
          setSharedCookie('auth_token', tok);
          setSharedCookie('session_active', '1');
        }
        closeAuth();
        checkSession();
      }
    });
  }

  window.confirmModal = function confirmModal(message) {
    return new Promise(function (resolve) {
      var dialog = document.getElementById('app-confirm-dialog');
      if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'app-confirm-dialog';
        dialog.className = 'auth-card';
        dialog.style.position = 'fixed';
        dialog.style.inset = '0';
        dialog.style.margin = 'auto';
        dialog.style.maxWidth = 'min(420px, calc(100vw - 32px))';
        dialog.style.color = 'var(--text-primary)';
        dialog.style.boxSizing = 'border-box';
        dialog.innerHTML =
          '<p class="lede" id="app-confirm-msg" style="margin:0 0 20px;font-size:15px;line-height:1.55;color:var(--text-primary);"></p>' +
          '<div class="comment-actions" style="display:flex;justify-content:flex-end;gap:10px;margin:0;">' +
          '<button type="button" class="tool-btn" id="app-confirm-cancel" data-i18n="cancel">Cancelar</button>' +
          '<button type="button" class="tool-btn danger" id="app-confirm-ok" data-i18n="confirm">Confirmar</button>' +
          '</div>';
        document.body.appendChild(dialog);

        dialog.addEventListener('click', function (ev) {
          if (ev.target === dialog) dialog.close('cancel');
        });

        var cancelBtn = dialog.querySelector('#app-confirm-cancel');
        if (cancelBtn) cancelBtn.addEventListener('click', function () {
          dialog.close('cancel');
        });

        var okBtn = dialog.querySelector('#app-confirm-ok');
        if (okBtn) okBtn.addEventListener('click', function () {
          dialog.close('confirm');
        });
      }

      var msgEl = dialog.querySelector('#app-confirm-msg');
      if (msgEl) msgEl.textContent = String(message || '');

      var t = typeof window.atmT === 'function' ? window.atmT : function (k) { return k; };
      var cancelBtn = dialog.querySelector('#app-confirm-cancel');
      if (cancelBtn) cancelBtn.textContent = t('cancel') || 'Cancelar';
      var okBtn = dialog.querySelector('#app-confirm-ok');
      if (okBtn) okBtn.textContent = t('confirm') || 'Confirmar';

      function onClose() {
        resolve(dialog.returnValue === 'confirm');
      }
      dialog.addEventListener('close', onClose, { once: true });

      if (dialog.open) dialog.close('cancel');
      dialog.returnValue = '';

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
        if (okBtn) okBtn.focus();
      } else {
        resolve(window.confirm(message));
      }
    });
  };

  function boot() {
    checkUrlToken();
    applyTheme(themeNow());
    ensureHeader();
    ensureFooter();
    bindOnce();
    checkSession();
    if (typeof window.atmApplyUi === 'function') window.atmApplyUi(window.atmLang());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
