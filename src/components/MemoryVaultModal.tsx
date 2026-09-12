import React, { useState, useEffect } from 'react';
import { useI18n } from '../utils/i18n';
import {
  SavedAudit,
  loadAllSavedAudits,
  saveAuditToVault,
  deleteAuditFromVault,
  exportVaultToJson,
  importVaultFromJson
} from '../utils/userMemoryStore';
import { ParseResult } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MemoryVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLiquidity: number;
  currentParseResults: ParseResult[];
  onLoadAudit: (audit: SavedAudit) => void;
}

export const MemoryVaultModal: React.FC<MemoryVaultModalProps> = ({
  isOpen,
  onClose,
  currentLiquidity,
  currentParseResults,
  onLoadAudit
}) => {
  const { t } = useI18n();
  const [audits, setAudits] = useState<SavedAudit[]>([]);
  const [scenarioName, setScenarioName] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAudits(loadAllSavedAudits());
      setSaveSuccessMsg('');
      setImportStatusMsg('');
      setScenarioName(`Auditoría ${new Date().toLocaleDateString()}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioName.trim()) return;

    saveAuditToVault(scenarioName, currentLiquidity, currentParseResults);
    setAudits(loadAllSavedAudits());
    setSaveSuccessMsg('¡Guardado con éxito en la memoria del navegador!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta auditoría guardada?')) {
      deleteAuditFromVault(id);
      setAudits(loadAllSavedAudits());
    }
  };

  const handleLoad = (audit: SavedAudit) => {
    onLoadAudit(audit);
    onClose();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importVaultFromJson(content);
        if (res.error) {
          setImportStatusMsg(`Error: ${res.error}`);
        } else {
          setAudits(loadAllSavedAudits());
          setImportStatusMsg(`Se han importado ${res.count} auditoría(s) correctamente.`);
          setTimeout(() => setImportStatusMsg(''), 5000);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card vault-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label={t('vault.close')}
        >
          &times;
        </button>

        <div className="modal-header">
          <div className="vault-icon-badge" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="modal-title">{t('vault.title')}</h2>
          <p className="modal-subtitle">{t('vault.subtitle')}</p>
        </div>

        {/* Sección: Guardar Estado Actual */}
        <section className="vault-save-section">
          <h3 className="vault-section-title">{t('vault.save_current')}</h3>
          <form onSubmit={handleSaveCurrent} className="vault-save-form">
            <div className="vault-save-inputs">
              <input
                type="text"
                className="vault-input"
                placeholder={t('vault.audit_name')}
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                maxLength={60}
                required
              />
              <button type="submit" className="vault-save-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>{t('vault.save_btn')}</span>
              </button>
            </div>
            {saveSuccessMsg && (
              <p className="vault-success-msg" role="status">
                {saveSuccessMsg}
              </p>
            )}
          </form>
        </section>

        {/* Sección: Lista de Auditorías Guardadas */}
        <section className="vault-list-section">
          <h3 className="vault-section-title">
            {t('vault.list_title')} ({audits.length})
          </h3>

          {audits.length === 0 ? (
            <div className="vault-empty-state">
              <p>{t('vault.empty')}</p>
            </div>
          ) : (
            <div className="vault-items-scroll">
              {audits.map((audit) => {
                const totalTx = audit.parseResults.reduce(
                  (sum, r) => sum + r.transactions.length,
                  0
                );
                const dateFormatted = new Date(audit.updatedAt || audit.createdAt).toLocaleString(
                  undefined,
                  { dateStyle: 'medium', timeStyle: 'short' }
                );

                return (
                  <div key={audit.id} className="vault-item-card">
                    <div className="vault-item-info">
                      <strong className="vault-item-name">{audit.name}</strong>
                      <div className="vault-item-meta">
                        <span>{dateFormatted}</span>
                        <span>•</span>
                        <span>Colchón: {formatCurrency(audit.totalLiquidity)}</span>
                        <span>•</span>
                        <span>{totalTx} movs.</span>
                        {audit.userName && (
                          <>
                            <span>•</span>
                            <span className="vault-item-user">Por: {audit.userName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="vault-item-actions">
                      <button
                        type="button"
                        className="vault-action-btn load"
                        onClick={() => handleLoad(audit)}
                        title="Cargar esta auditoría"
                      >
                        {t('vault.load_btn')}
                      </button>
                      <button
                        type="button"
                        className="vault-action-btn delete"
                        onClick={() => handleDelete(audit.id)}
                        title="Eliminar de la memoria"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sección: Backup Export/Import */}
        <footer className="vault-footer">
          <div className="vault-backup-tools">
            <button
              type="button"
              className="vault-backup-btn"
              onClick={exportVaultToJson}
              disabled={audits.length === 0}
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{t('vault.export_backup')}</span>
            </button>

            <label className="vault-backup-btn import">
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{t('vault.import_backup')}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {importStatusMsg && (
            <p className="vault-import-msg" role="status">
              {importStatusMsg}
            </p>
          )}
        </footer>
      </div>
    </div>
  );
};
