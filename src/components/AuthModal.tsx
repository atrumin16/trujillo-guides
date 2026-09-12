import React, { useState, useEffect } from 'react';
import { useI18n } from '../utils/i18n';
import { setStoredUserName } from '../utils/userMemoryStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (name: string) => void;
}

const GOOGLE_CLIENT_ID = '161745150528-5pb84k9upvamvlvnc7lg6nr1ku74vc4a.apps.googleusercontent.com';
const X_CLIENT_ID = 'NF94WVVIT1dzSXZNaTJuYjRXSEc6MTpjaQ';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName
}) => {
  const { t } = useI18n();
  const [nameInput, setNameInput] = useState(currentName);
  const [loadingX, setLoadingX] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const applyAuthSuccess = (token: string, user: any) => {
    try {
      localStorage.setItem('trujillo_ai_token', token);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('trujillo_auth_token', token);
      if (user) {
        localStorage.setItem('trujillo_ai_user', JSON.stringify(user));
        localStorage.setItem('auth_user', JSON.stringify(user));
        if (user.name) {
          setStoredUserName(user.name);
          onSaveName(user.name);
          setNameInput(user.name);
        }
      }
      document.cookie = `ta_session=${encodeURIComponent(token)}; Domain=.trujillomingorance.com; Path=/; Secure; SameSite=Lax; Max-Age=2592000`;
      document.cookie = `auth_token=${encodeURIComponent(token)}; Domain=.trujillomingorance.com; Path=/; Secure; SameSite=Lax; Max-Age=2592000`;
    } catch (e) {}
    onClose();
  };

  // Google Sign-In setup
  useEffect(() => {
    if (!isOpen) return;

    const mountGoogleBtn = () => {
      const slot = document.getElementById('google-savings-btn');
      if (!slot || !(window as any).google?.accounts?.id) return;
      try {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (res: any) => {
            try {
              setAuthError(null);
              const r = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: res.credential })
              });
              const d = await r.json();
              if (r.ok && (d.ok || d.token)) {
                applyAuthSuccess(d.token, d.user);
              } else {
                setAuthError(d.error || 'No se pudo verificar con Google.');
              }
            } catch (err: any) {
              setAuthError(err.message || 'Error de conexión con Google');
            }
          },
          auto_select: false,
          ux_mode: 'popup'
        });
        (window as any).google.accounts.id.renderButton(slot, {
          type: 'standard',
          theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'outline' : 'filled_black',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: 280
        });
      } catch (e) {}
    };

    if ((window as any).google?.accounts?.id) {
      setTimeout(mountGoogleBtn, 50);
    } else {
      const existing = document.getElementById('google-gsi-script');
      if (!existing) {
        const s = document.createElement('script');
        s.id = 'google-gsi-script';
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.defer = true;
        s.onload = () => setTimeout(mountGoogleBtn, 50);
        document.head.appendChild(s);
      } else {
        const interval = setInterval(() => {
          if ((window as any).google?.accounts?.id) {
            clearInterval(interval);
            mountGoogleBtn();
          }
        }, 150);
        setTimeout(() => clearInterval(interval), 5000);
      }
    }
  }, [isOpen]);

  // X Callback listener
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const state = params.get('state') || '';
      const isX = params.get('auth') === 'x_callback' || state.startsWith('x_oauth_');
      if (!isX) return;
      const code = params.get('code');
      window.history.replaceState({}, document.title, window.location.pathname);
      if (code) {
        fetch('/api/auth/x', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri: window.location.origin + '/?auth=x_callback' })
        })
          .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
          .then((res) => {
            if (res.ok && res.d.token) {
              applyAuthSuccess(res.d.token, res.d.user);
            } else {
              setAuthError(res.d.error || 'No se pudo validar con X');
            }
          })
          .catch(() => setAuthError('Error al contactar con X'));
      }
    } catch (e) {}
  }, []);

  const handleXLogin = () => {
    setLoadingX(true);
    setAuthError(null);
    const state = 'x_oauth_' + Math.random().toString(36).slice(2, 10);
    try { localStorage.setItem('trujillo_x_oauth_state', state); } catch (e) {}
    const redirectUri = encodeURIComponent(window.location.origin + '/?auth=x_callback');
    window.location.href = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${X_CLIENT_ID}&redirect_uri=${redirectUri}&scope=users.read%20tweet.read&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (clean) {
      setStoredUserName(clean);
      onSaveName(clean);
      onClose();
    }
  };

  if (!isOpen) return null;

  const studioLoginUrl =
    'https://ai.trujillomingorance.com/login?redirect_to=' +
    encodeURIComponent(window.location.href) +
    '&return=' +
    encodeURIComponent(window.location.href);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          &times;
        </button>

        <div className="modal-header">
          <div className="auth-avatar-circle" aria-hidden="true">
            {nameInput ? (
              nameInput.charAt(0).toUpperCase()
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          <h2 className="modal-title">{t('auth.title')}</h2>
          <p className="modal-subtitle">{t('auth.desc')}</p>
        </div>

        {authError && (
          <div style={{ margin: '8px 0 14px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px', textAlign: 'center' }}>
            {authError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
          <div id="google-savings-btn" style={{ minHeight: '44px', display: 'flex', justifyContent: 'center', width: '100%' }} />

          <button
            type="button"
            onClick={handleXLogin}
            disabled={loadingX}
            style={{
              width: '100%',
              maxWidth: '280px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#000',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 600,
              padding: '10px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>{loadingX ? 'Conectando con X...' : 'Continuar con X'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0 16px', color: 'var(--text-muted, #71717a)', fontSize: '12px', width: '100%' }}>
          <span style={{ flex: 1, height: '1px', background: 'var(--border, rgba(255,255,255,0.1))' }} />
          <span>o usa un nombre local</span>
          <span style={{ flex: 1, height: '1px', background: 'var(--border, rgba(255,255,255,0.1))' }} />
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-input-label" htmlFor="userNameField">
            {t('auth.input_label')}
          </label>
          <input
            id="userNameField"
            type="text"
            className="auth-text-input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Ej: Alberto, Familia López..."
            maxLength={40}
            required
          />

          <button type="submit" className="auth-submit-btn">
            {t('auth.submit')}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '16px' }}>
          <a
            href={studioLoginUrl}
            className="auth-studio-link"
            rel="noopener noreferrer"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>{t('auth.studio_link')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
