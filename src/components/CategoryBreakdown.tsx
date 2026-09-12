import React, { useState } from 'react';
import { RunwayAnalysis, NormalizedTransaction } from '../types';
import {
  calculateCategoryBreakdown,
  calculateSavingsRate,
  calculateRunwayTarget,
  CategorySummary
} from '../utils/categories';
import { formatCurrency } from '../utils/formatters';
import { useI18n } from '../utils/i18n';

interface CategoryBreakdownProps {
  transactions: NormalizedTransaction[];
  runwayAnalysis: RunwayAnalysis;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  transactions,
  runwayAnalysis
}) => {
  const { t } = useI18n();
  const [targetMonths, setTargetMonths] = useState<number>(12);

  const categories: CategorySummary[] = calculateCategoryBreakdown(
    transactions,
    runwayAnalysis.monthsSpanned
  );

  const savingsRate = calculateSavingsRate(
    runwayAnalysis.monthlyIncome,
    runwayAnalysis.monthlyExpenses
  );

  const targetAnalysis = calculateRunwayTarget(
    runwayAnalysis.monthlyExpenses,
    runwayAnalysis.totalLiquidity,
    targetMonths
  );

  return (
    <section className="category-section" aria-labelledby="cat-title">
      <div className="section-header-row">
        <div>
          <div className="section-tag">{t('cat.savings_rate_title')}</div>
          <h2 id="cat-title" className="section-title">
            {t('cat.section_title')}
          </h2>
        </div>
        <p className="section-subtitle">{t('cat.section_desc')}</p>
      </div>

      {/* Rejilla Superior: Semáforo de Tasa de Ahorro y Objetivo de Tranquilidad */}
      <div className="financial-health-grid">
        {/* Tarjeta 1: Semáforo de Tasa de Ahorro */}
        <div className={`savings-rate-card ${savingsRate.statusClass}`}>
          <div className="rate-card-header">
            <span className="rate-card-label">{t('cat.savings_rate_title')}</span>
            <span className={`rate-badge ${savingsRate.statusClass}`}>
              {t(savingsRate.titleKey)}
            </span>
          </div>

          <div className="rate-card-hero">
            <div className="rate-percentage-value">
              {savingsRate.ratePercentage > 0 ? `+${savingsRate.ratePercentage}%` : `${savingsRate.ratePercentage}%`}
            </div>
            <div className="rate-monthly-net">
              <span className="net-label">Ahorro Neto:</span>{' '}
              <strong className={savingsRate.netSavingsMonthly >= 0 ? 'text-income' : 'text-expense'}>
                {savingsRate.netSavingsMonthly >= 0 ? '+' : ''}
                {formatCurrency(savingsRate.netSavingsMonthly)}/mes
              </strong>
            </div>
          </div>

          <div className="rate-progress-track" aria-hidden="true">
            <div
              className={`rate-progress-fill ${savingsRate.statusClass}`}
              style={{
                width: `${Math.max(0, Math.min(100, Math.max(5, savingsRate.ratePercentage)))}%`
              }}
            />
          </div>

          <p className="rate-description">{t(savingsRate.descKey)}</p>
        </div>

        {/* Tarjeta 2: Objetivo del Colchón de Tranquilidad */}
        <div className="target-cushion-card">
          <div className="target-card-header">
            <div>
              <h3 className="target-title">{t('target.title')}</h3>
              <p className="target-desc">{t('target.desc')}</p>
            </div>
          </div>

          {/* Selector de meses objetivo */}
          <div className="target-selector-row" role="radiogroup" aria-label="Objetivo de meses">
            <button
              type="button"
              className={`target-btn ${targetMonths === 6 ? 'active' : ''}`}
              onClick={() => setTargetMonths(6)}
            >
              {t('target.choice_6')}
            </button>
            <button
              type="button"
              className={`target-btn ${targetMonths === 12 ? 'active' : ''}`}
              onClick={() => setTargetMonths(12)}
            >
              {t('target.choice_12')}
            </button>
            <button
              type="button"
              className={`target-btn ${targetMonths === 24 ? 'active' : ''}`}
              onClick={() => setTargetMonths(24)}
            >
              {t('target.choice_24')}
            </button>
          </div>

          <div className="target-stats-row">
            <div className="target-stat-item">
              <span className="target-stat-label">
                {t('target.needed_label', { months: targetMonths })}
              </span>
              <span className="target-stat-val text-accent">
                {formatCurrency(targetAnalysis.neededAmount, { hideCents: true })}
              </span>
            </div>
            <div className="target-stat-item">
              <span className="target-stat-label">{t('target.current_label')}</span>
              <span className="target-stat-val">
                {formatCurrency(targetAnalysis.currentLiquidity, { hideCents: true })}
              </span>
            </div>
          </div>

          <div className="target-progress-wrapper">
            <div className="target-progress-track">
              <div
                className={`target-progress-fill ${targetAnalysis.isCovered ? 'fill-success' : 'fill-warning'}`}
                style={{ width: `${Math.min(100, targetAnalysis.coveragePercentage)}%` }}
              />
            </div>
            <div className="target-progress-label">
              <span>{t('target.progress')}</span>
              <strong>{targetAnalysis.coveragePercentage}%</strong>
            </div>
          </div>

          <div className={`target-status-banner ${targetAnalysis.isCovered ? 'banner-success' : 'banner-warning'}`}>
            <svg
              className="banner-ic"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {targetAnalysis.isCovered ? (
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              ) : (
                <circle cx="12" cy="12" r="10" />
              )}
              {targetAnalysis.isCovered ? (
                <polyline points="22 4 12 14.01 9 11.01" />
              ) : (
                <>
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
            <span>
              {targetAnalysis.isCovered
                ? t('target.achieved')
                : t('target.missing', {
                    amount: formatCurrency(targetAnalysis.difference, { hideCents: true }),
                    months: targetMonths
                  })}
            </span>
          </div>
        </div>
      </div>

      {/* Desglose Gráfico por Categorías */}
      <div className="categories-breakdown-card">
        <div className="cat-card-header">
          <h3 className="cat-card-title">Distribución de Gastos por Partidas</h3>
          <span className="cat-count-badge">
            {categories.filter((c) => c.totalAmount > 0).length} categorías activas
          </span>
        </div>

        <div className="categories-list">
          {categories
            .filter((c) => c.totalAmount > 0)
            .map((cat) => (
              <div key={cat.key} className="category-item-row">
                <div className="cat-item-info">
                  <div className="cat-color-dot" style={{ backgroundColor: cat.color }} />
                  <span className="cat-label">{t(cat.labelKey)}</span>
                  <span className="cat-tx-count">({cat.count} recibos)</span>
                </div>

                <div className="cat-item-bar-container">
                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill"
                      style={{
                        width: `${Math.max(3, cat.percentage)}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                  <span className="cat-pct-label">{cat.percentage.toFixed(1)}%</span>
                </div>

                <div className="cat-item-amounts">
                  <span className="cat-monthly-avg">
                    {formatCurrency(cat.monthlyAverage)}
                    <span className="cat-period">/mes</span>
                  </span>
                  <span className="cat-total-spent">
                    Total: -{formatCurrency(cat.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
