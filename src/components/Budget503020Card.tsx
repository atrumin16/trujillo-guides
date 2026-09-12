import React, { useMemo } from 'react';
import { useI18n } from '../utils/i18n';
import { CategoryBreakdownItem } from '../types';
import { formatCurrency } from '../utils/formatters';

interface Budget503020CardProps {
  categories: CategoryBreakdownItem[];
  averageIncome: number;
  averageExpenses: number;
}

export const Budget503020Card: React.FC<Budget503020CardProps> = ({
  categories,
  averageIncome,
  averageExpenses
}) => {
  const { t } = useI18n();

  const metrics = useMemo(() => {
    // Definición de Necesidades (Costes Fijos Básicos de Supervivencia)
    const needsCategories = new Set([
      'housing',
      'supermarket',
      'utilities',
      'transport',
      'health',
      'insurance'
    ]);

    // Definición de Deseos y Estilo de Vida (Prescindibles / Ocio)
    const wantsCategories = new Set([
      'dining',
      'shopping',
      'subscriptions',
      'education',
      'other_expense',
      'cash'
    ]);

    let needsAmount = 0;
    let wantsAmount = 0;

    categories.forEach((c) => {
      if (needsCategories.has(c.category)) {
        needsAmount += c.totalAmount;
      } else if (wantsCategories.has(c.category)) {
        wantsAmount += c.totalAmount;
      } else {
        wantsAmount += c.totalAmount;
      }
    });

    // Base de cálculo: si hay ingresos registrados, se calculan sobre ingresos.
    // Si no hay ingresos suficientes o es negativo, se calculan sobre el gasto total.
    const baseAmount = averageIncome > averageExpenses ? averageIncome : averageExpenses;
    const savingsAmount = Math.max(0, averageIncome - averageExpenses);

    const needsPct = baseAmount > 0 ? Math.round((needsAmount / baseAmount) * 100) : 0;
    const wantsPct = baseAmount > 0 ? Math.round((wantsAmount / baseAmount) * 100) : 0;
    const savingsPct = baseAmount > 0 ? Math.round((savingsAmount / baseAmount) * 100) : 0;

    return {
      needsAmount,
      wantsAmount,
      savingsAmount,
      needsPct,
      wantsPct,
      savingsPct,
      baseAmount
    };
  }, [categories, averageIncome, averageExpenses]);

  if (averageExpenses <= 0) return null;

  const getStatusBadge = (type: 'needs' | 'wants' | 'savings', pct: number) => {
    if (type === 'needs') {
      if (pct <= 50) return { label: t('rule503020.status_optimal'), cls: 'status-good' };
      if (pct <= 60) return { label: t('rule503020.status_warning'), cls: 'status-warn' };
      return { label: t('rule503020.status_alert'), cls: 'status-bad' };
    }
    if (type === 'wants') {
      if (pct <= 30) return { label: t('rule503020.status_optimal'), cls: 'status-good' };
      if (pct <= 40) return { label: t('rule503020.status_warning'), cls: 'status-warn' };
      return { label: t('rule503020.status_alert'), cls: 'status-bad' };
    }
    // savings
    if (pct >= 20) return { label: t('rule503020.status_optimal'), cls: 'status-good' };
    if (pct >= 10) return { label: t('rule503020.status_warning'), cls: 'status-warn' };
    return { label: t('rule503020.status_alert'), cls: 'status-bad' };
  };

  const needsStatus = getStatusBadge('needs', metrics.needsPct);
  const wantsStatus = getStatusBadge('wants', metrics.wantsPct);
  const savingsStatus = getStatusBadge('savings', metrics.savingsPct);

  return (
    <div className="step-card budget-503020-card">
      <div className="card-header">
        <span className="card-badge">Estructura Financiera</span>
        <h3 className="card-title">{t('rule503020.title')}</h3>
        <p className="card-description">{t('rule503020.desc')}</p>
      </div>

      <div className="rule-pillars-grid">
        {/* Pilar 1: Necesidades Básicas (50%) */}
        <div className="pillar-box">
          <div className="pillar-header">
            <div className="pillar-title-wrap">
              <span className="pillar-name">{t('rule503020.needs')}</span>
              <span className="pillar-target">Meta: 50%</span>
            </div>
            <span className={`pillar-badge ${needsStatus.cls}`}>{needsStatus.label}</span>
          </div>

          <div className="pillar-amount">{formatCurrency(metrics.needsAmount)}</div>
          <div className="pillar-meter-bg">
            <div
              className={`pillar-meter-fill ${needsStatus.cls}`}
              style={{ width: `${Math.min(100, metrics.needsPct)}%` }}
            />
          </div>
          <div className="pillar-footer">
            <span>{metrics.needsPct}% de tus ingresos</span>
            <span className="pillar-delta">
              {metrics.needsPct > 50 ? `+${metrics.needsPct - 50}% exceso` : 'En objetivo'}
            </span>
          </div>
        </div>

        {/* Pilar 2: Deseos y Ocio (30%) */}
        <div className="pillar-box">
          <div className="pillar-header">
            <div className="pillar-title-wrap">
              <span className="pillar-name">{t('rule503020.wants')}</span>
              <span className="pillar-target">Meta: 30%</span>
            </div>
            <span className={`pillar-badge ${wantsStatus.cls}`}>{wantsStatus.label}</span>
          </div>

          <div className="pillar-amount">{formatCurrency(metrics.wantsAmount)}</div>
          <div className="pillar-meter-bg">
            <div
              className={`pillar-meter-fill ${wantsStatus.cls}`}
              style={{ width: `${Math.min(100, metrics.wantsPct)}%` }}
            />
          </div>
          <div className="pillar-footer">
            <span>{metrics.wantsPct}% de tus ingresos</span>
            <span className="pillar-delta">
              {metrics.wantsPct > 30 ? `+${metrics.wantsPct - 30}% exceso` : 'Controlado'}
            </span>
          </div>
        </div>

        {/* Pilar 3: Ahorro e Inversión (20%) */}
        <div className="pillar-box">
          <div className="pillar-header">
            <div className="pillar-title-wrap">
              <span className="pillar-name">{t('rule503020.savings')}</span>
              <span className="pillar-target">Meta: 20%</span>
            </div>
            <span className={`pillar-badge ${savingsStatus.cls}`}>{savingsStatus.label}</span>
          </div>

          <div className="pillar-amount">{formatCurrency(metrics.savingsAmount)}</div>
          <div className="pillar-meter-bg">
            <div
              className={`pillar-meter-fill ${savingsStatus.cls}`}
              style={{ width: `${Math.min(100, metrics.savingsPct)}%` }}
            />
          </div>
          <div className="pillar-footer">
            <span>{metrics.savingsPct}% de tus ingresos</span>
            <span className="pillar-delta">
              {metrics.savingsPct >= 20 ? 'Excelente margen' : `${20 - metrics.savingsPct}% por debajo`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
