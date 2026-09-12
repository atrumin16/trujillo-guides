import React, { useState } from 'react';
import { useI18n } from '../utils/i18n';
import { setStoredUserName } from '../utils/userMemoryStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (name: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName
}) => {
  const { t } = useI18n();
  const [nameInput, setNameInput] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (clean) {
      setStoredUserName(clean);
      onSaveName(clean);
      onClose();
    }
  };

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
            {nameInput ? nameInput.charAt(0).toUpperCase() : '👤'}
          </div>
          <h2 className="modal-title">{t('auth.title')}</h2>
          <p className="modal-subtitle">{t('auth.desc')}</p>
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
            autoFocus
            required
          />

          <button type="submit" className="auth-submit-btn">
            {t('auth.submit')}
          </button>
        </form>

        <div className="auth-footer">
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
