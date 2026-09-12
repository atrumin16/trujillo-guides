import React from 'react';
import { RunwayAnalysis } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useI18n } from '../utils/i18n';

interface RunwayMetricsProps {
  analysis: RunwayAnalysis;
}

export const RunwayMetrics: React.FC<RunwayMetricsProps> = ({ analysis }) => {
  const { t } = useI18n();

  // Obtener estado y textos según los meses de colchón
  let badgeClass: 'badge-success' | 'badge-warning' | 'badge-danger' = 'badge-success';
  let badgeText = t('status.surplus_badge');
  let explanationText = t('status.surplus_exp');

  if (analysis.isSurplus || !isFinite(analysis.runwayMonths)) {
    badgeClass = 'badge-success';
    badgeText = t('status.surplus_badge');
    explanationText = t('status.surplus_exp');
  } else if (analysis.runwayMonths <= 0) {
    badgeClass = 'badge-danger';
    badgeText = t('status.exhausted_badge');
    explanationText = t('status.exhausted_exp');
  } else if (analysis.runwayMonths < 6) {
    badgeClass = 'badge-danger';
    badgeText = t('status.critical_badge');
    explanationText = t('status.critical_exp', {
      months: analysis.runwayMonths.toFixed(1),
      days: (analysis.runwayMonths * 30.4).toFixed(0)
    });
  } else if (analysis.runwayMonths < 18) {
    badgeClass = 'badge-warning';
    badgeText = t('status.moderate_badge');
    explanationText = t('status.moderate_exp', {
      months: analysis.runwayMonths.toFixed(1)
    });
  } else {
    badgeClass = 'badge-success';
    badgeText = t('status.solid_badge');
    explanationText = t('status.solid_exp', {
      years: analysis.runwayYears.toFixed(1)
    });
  }

  return (
    <section className="metrics-section" aria-labelledby="metrics-title">
      <div className="section-header-row">
        <div>
          <h2 id="metrics-title" className="section-title">
            {t('runway.title')}
          </h2>
          <p className="section-subtitle">
            {t('runway.subtitle', { months: analysis.monthsSpanned })}
          </p>
        </div>
        <div className={`status-badge-pill ${badgeClass}`}>
          <span className="status-indicator-dot" aria-hidden="true" />
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Tarjeta Principal de Semáforo / Diagnóstico */}
      <div className={`runway-hero-card ${badgeClass}`}>
        <div className="hero-content">
          <div className="hero-label">{t('runway.hero_label')}</div>
          <div className="hero-value">
            {analysis.isSurplus ? (
              <span className="surplus-text">{t('runway.surplus')}</span>
            ) : analysis.runwayMonths > 0 ? (
              <span>
                {analysis.runwayMonths.toFixed(1)}{' '}
                <span className="hero-unit">{t('runway.months')}</span>
                {analysis.runwayMonths >= 12 && (
                  <span className="hero-subyears">
                    {' '}({analysis.runwayYears.toFixed(1)} {t('runway.years')})
                  </span>
                )}
              </span>
            ) : (
              <span className="danger-text">{t('runway.exhausted')}</span>
            )}
          </div>
          <p className="hero-explanation">{explanationText}</p>
        </div>

        <div className="hero-side-stat">
          <div className="side-stat-label">
            {analysis.isSurplus ? t('runway.stat_surplus') : t('runway.stat_burn')}
          </div>
          <div className={`side-stat-value ${analysis.isSurplus ? 'text-income' : 'text-expense'}`}>
            {analysis.isSurplus
              ? `+${formatCurrency(Math.abs(analysis.netMonthlyBurn))}`
              : `-${formatCurrency(analysis.netMonthlyBurn)}`}
            <span className="side-stat-period">/mes</span>
          </div>
          <div className="side-stat-note">
            {analysis.isSurplus ? t('runway.note_surplus') : t('runway.note_burn')}
          </div>
        </div>
      </div>

      {/* Rejilla de Métricas Clave */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-row">
            <span className="kpi-label">{t('runway.kpi_liquidity')}</span>
            <svg
              className="kpi-svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <div className="kpi-value text-accent">
            {formatCurrency(analysis.totalLiquidity, { hideCents: true })}
          </div>
          <div className="kpi-footnote">{t('runway.kpi_liquidity_sub')}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-row">
            <span className="kpi-label">{t('runway.kpi_income')}</span>
            <svg
              className="kpi-svg text-income"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
          <div className="kpi-value text-income">
            +{formatCurrency(analysis.monthlyIncome)}
          </div>
          <div className="kpi-footnote">{t('runway.kpi_income_sub')}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-row">
            <span className="kpi-label">{t('runway.kpi_expenses')}</span>
            <svg
              className="kpi-svg text-expense"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
          <div className="kpi-value text-expense">
            -{formatCurrency(analysis.monthlyExpenses)}
          </div>
          <div className="kpi-footnote">{t('runway.kpi_expenses_sub')}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-row">
            <span className="kpi-label">{t('runway.kpi_leaks')}</span>
            <svg
              className="kpi-svg text-warning"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="kpi-value text-warning">
            {formatCurrency(analysis.leakMonthlyEstimate)}
            <span className="kpi-sub-period">/mes</span>
          </div>
          <div className="kpi-footnote">{t('runway.kpi_leaks_sub')}</div>
        </div>
      </div>
    </section>
  );
};
export default RunwayMetrics;
