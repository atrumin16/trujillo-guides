import React, { useState, useEffect, useRef } from 'react';
import { useI18n, SUPPORTED_LANGUAGES, LanguageId } from '../utils/i18n';

interface HeaderProps {
  onReset: () => void;
  hasData: boolean;
}

type FontSize = 'normal' | 'large' | 'xlarge';

export const Header: React.FC<HeaderProps> = ({ onReset, hasData }) => {
  const { language, setLanguage, t } = useI18n();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langPickerRef = useRef<HTMLDivElement>(null);

  // Inicializar tema y tamaño de fuente desde localStorage / DOM
  useEffect(() => {
    try {
      const currentTheme =
        document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(currentTheme);

      const savedFs = (localStorage.getItem('atm_savings_font_size') as FontSize) || 'normal';
      if (savedFs === 'large' || savedFs === 'xlarge') {
        setFontSize(savedFs);
        document.documentElement.setAttribute('data-font-size', savedFs);
      }
    } catch (e) {}
  }, []);

  // Cerrar menú de idiomas al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langPickerRef.current && !langPickerRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Conmutador de tema claro / oscuro
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('trujillo_theme', nextTheme);
      localStorage.setItem('atm_theme', nextTheme);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', nextTheme === 'light' ? '#ffffff' : '#080c14');
      }
    } catch (e) {}
  };

  // Conmutador de tamaño de letra (A / A+ / A++)
  const cycleFontSize = () => {
    let nextFs: FontSize = 'normal';
    if (fontSize === 'normal') nextFs = 'large';
    else if (fontSize === 'large') nextFs = 'xlarge';
    else nextFs = 'normal';

    setFontSize(nextFs);
    document.documentElement.setAttribute('data-font-size', nextFs);
    try {
      localStorage.setItem('atm_savings_font_size', nextFs);
    } catch (e) {}
  };

  const handleSelectLanguage = (langId: LanguageId) => {
    setLanguage(langId);
    setIsLangMenuOpen(false);
  };

  const handleResetClick = () => {
    if (window.confirm(t('header.reset_confirm'))) {
      onReset();
    }
  };

  const activeLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="docs-topbar" id="docs-topbar">
      {/* Brand canónico idéntico a ATM Docs y ATM Labs */}
      <a href="https://labs.trujillomingorance.com" className="brand" title="ATM Labs">
        <img src="/avatar.png" alt="" className="brand-avatar" width="28" height="28" />
        <span>ATM Savings</span>
      </a>

      <div className="topbar-actions">
        {/* Hub Links del ecosistema */}
        <a className="hub-link" href="https://labs.trujillomingorance.com" rel="noopener" title="ATM Labs">
          Labs
        </a>
        <a className="hub-link" href="https://guides.trujillomingorance.com" rel="noopener" title="ATM Engineering Guides">
          Guides
        </a>

        {/* Indicador de Privacidad Zero-Knowledge */}
        <div className="topbar-privacy-chip" title={t('header.privacy_title')}>
          <svg
            className="tool-ic"
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>{t('header.privacy')}</span>
        </div>

        {/* Conmutador de Tamaño de Letra A / A+ / A++ */}
        <button
          type="button"
          className="theme-toggle-btn font-size-toggle-btn"
          onClick={cycleFontSize}
          title={
            fontSize === 'normal'
              ? t('header.font_normal')
              : fontSize === 'large'
              ? t('header.font_large')
              : t('header.font_xlarge')
          }
          aria-label={t('header.font_size')}
        >
          <span className="font-size-text" aria-hidden="true">
            {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
          </span>
        </button>

        {/* Conmutador de Tema (Sol / Luna exacto a chrome.js) */}
        <button
          type="button"
          className="theme-toggle-btn"
          id="theme-btn"
          onClick={toggleTheme}
          title={t('header.theme')}
          aria-label={t('header.theme')}
        >
          <svg
            className="sun-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg
            className="moon-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        {/* Selector de Idiomas con Banderas (exacto a chrome.js) */}
        <div className="lang-picker" id="lang-picker" ref={langPickerRef}>
          <button
            type="button"
            className="lang-flag-btn"
            id="lang-flag-btn"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            aria-haspopup="listbox"
            aria-expanded={isLangMenuOpen}
            title={activeLangMeta.name}
          >
            <span className="flag">{activeLangMeta.flag}</span>
            <span className="lang-code">{activeLangMeta.id.toUpperCase()}</span>
          </button>

          {isLangMenuOpen && (
            <div className="lang-menu" id="lang-menu" role="listbox">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`lang-option ${l.id === language ? 'active' : ''}`}
                  onClick={() => handleSelectLanguage(l.id)}
                  role="option"
                  aria-selected={l.id === language}
                >
                  <span className="flag">{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón de Reiniciar / Borrar Datos */}
        {hasData && (
          <button
            type="button"
            className="account-chip account-login reset-btn"
            onClick={handleResetClick}
            title={t('header.reset_title')}
            aria-label={t('header.reset')}
          >
            <svg
              className="tool-ic"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            <span>{t('header.reset')}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
