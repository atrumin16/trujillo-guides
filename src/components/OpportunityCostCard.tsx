import React, { useState, useEffect } from 'react';
import { getStandardProjections, ANNUAL_MARKET_RETURN_RATE } from '../utils/compoundInterest';
import { formatCurrency } from '../utils/formatters';
import { useI18n } from '../utils/i18n';

interface OpportunityCostCardProps {
  detectedMonthlyLeak: number;
}

const PRESET_SAVINGS = [30, 60, 100, 150, 250];

export const OpportunityCostCard: React.FC<OpportunityCostCardProps> = ({
  detectedMonthlyLeak
}) => {
  const { t } = useI18n();
  const [simulatedAmount, setSimulatedAmount] = useState<number>(
    detectedMonthlyLeak > 0 ? Math.round(detectedMonthlyLeak) : 50
  );

  useEffect(() => {
    if (detectedMonthlyLeak > 0) {
      setSimulatedAmount(Math.round(detectedMonthlyLeak));
    }
  }, [detectedMonthlyLeak]);

  const { projection10Years, projection15Years } = getStandardProjections(simulatedAmount);

  const pct10 =
    projection10Years.totalContributed > 0
      ? Math.round(
          (projection10Years.compoundInterestEarned / projection10Years.totalContributed) * 100
        )
      : 0;

  const pct15 =
    projection15Years.totalContributed > 0
      ? Math.round(
          (projection15Years.compoundInterestEarned / projection15Years.totalContributed) * 100
        )
      : 0;

  return (
    <section className="opportunity-section" aria-labelledby="opportunity-title">
      <div className="section-header-row">
        <div>
          <div className="section-tag">{t('opp.tag')}</div>
          <h2 id="opportunity-title" className="section-title">
            {t('opp.title')}
          </h2>
        </div>
        <div className="compound-rate-pill">
          <span>{t('opp.rate_pill')}</span>
        </div>
      </div>

      <p className="section-description">{t('opp.desc')}</p>

      {/* Selector interactivo de ahorro mensual */}
      <div className="simulator-box">
        <div className="simulator-header">
          <label htmlFor="savings-slider" className="simulator-label">
            {t('opp.slider_label')}
          </label>
          <div className="simulator-current-val">
            <strong>{formatCurrency(simulatedAmount, { hideCents: true })}</strong>
            <span className="simulator-period">/mes</span>
          </div>
        </div>

        <div className="slider-container">
          <input
            id="savings-slider"
            type="range"
            min="10"
            max="500"
            step="10"
            value={simulatedAmount}
            onChange={(e) => setSimulatedAmount(parseInt(e.target.value, 10))}
            className="accessible-range-slider"
            aria-label="Ahorro mensual a simular"
          />
        </div>

        <div className="simulator-presets">
          <span className="presets-caption">{t('opp.presets_caption')}</span>
          {detectedMonthlyLeak > 0 && (
            <button
              type="button"
              className={`preset-chip ${simulatedAmount === Math.round(detectedMonthlyLeak) ? 'active' : ''}`}
              onClick={() => setSimulatedAmount(Math.round(detectedMonthlyLeak))}
            >
              {t('opp.detected_leaks_btn', {
                amount: formatCurrency(detectedMonthlyLeak, { hideCents: true })
              })}
            </button>
          )}
          {PRESET_SAVINGS.map((amount) => (
            <button
              key={amount}
              type="button"
              className={`preset-chip ${simulatedAmount === amount ? 'active' : ''}`}
              onClick={() => setSimulatedAmount(amount)}
            >
              {formatCurrency(amount, { hideCents: true })}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas comparativas a 10 y 15 años */}
      <div className="projections-grid">
        {/* Proyección a 10 Años */}
        <div className="projection-card">
          <div className="projection-header">
            <span className="projection-horizon">{t('opp.horizon_10')}</span>
            <span className="projection-rate">{(ANNUAL_MARKET_RETURN_RATE * 100).toFixed(0)}% anual compuesto</span>
          </div>

          <div className="projection-future-val text-accent">
            {formatCurrency(projection10Years.futureValue, { hideCents: true })}
          </div>
          <div className="projection-subtext">{t('opp.future_capital')}</div>

          <div className="projection-breakdown">
            <div className="breakdown-row">
              <span className="breakdown-label">{t('opp.contributed')}</span>
              <span className="breakdown-value">
                {formatCurrency(projection10Years.totalContributed, { hideCents: true })}
              </span>
            </div>
            <div className="breakdown-row highlight-row">
              <span className="breakdown-label">{t('opp.interest_earned')}</span>
              <span className="breakdown-value text-income">
                +{formatCurrency(projection10Years.compoundInterestEarned, { hideCents: true })}
              </span>
            </div>
            <div className="projection-compound-badge">
              {t('opp.compound_badge', { pct: pct10 })}
            </div>
          </div>
        </div>

        {/* Proyección a 15 Años */}
        <div className="projection-card featured-projection">
          <div className="projection-header">
            <span className="projection-horizon">{t('opp.horizon_15')}</span>
            <span className="projection-rate">Efecto Bola de Nieve</span>
          </div>

          <div className="projection-future-val text-income">
            {formatCurrency(projection15Years.futureValue, { hideCents: true })}
          </div>
          <div className="projection-subtext">{t('opp.future_capital')}</div>

          <div className="projection-breakdown">
            <div className="breakdown-row">
              <span className="breakdown-label">{t('opp.contributed')}</span>
              <span className="breakdown-value">
                {formatCurrency(projection15Years.totalContributed, { hideCents: true })}
              </span>
            </div>
            <div className="breakdown-row highlight-row">
              <span className="breakdown-label">{t('opp.interest_earned')}</span>
              <span className="breakdown-value text-income">
                +{formatCurrency(projection15Years.compoundInterestEarned, { hideCents: true })}
              </span>
            </div>
            <div className="projection-compound-badge featured-badge">
              {t('opp.compound_badge', { pct: pct15 })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OpportunityCostCard;
