import React from 'react';
import { RunwayAnalysis, NormalizedTransaction } from '../types';
import { CategorySummary, SavingsRateAnalysis } from '../utils/categories';
import { generatePersonalizedTips, PersonalizedTip } from '../utils/personalizedTips';
import { useI18n } from '../utils/i18n';

interface PersonalizedTipsProps {
  runwayAnalysis: RunwayAnalysis;
  categories: CategorySummary[];
  savingsRate: SavingsRateAnalysis;
  transactions: NormalizedTransaction[];
}

export const PersonalizedTips: React.FC<PersonalizedTipsProps> = ({
  runwayAnalysis,
  categories,
  savingsRate,
  transactions
}) => {
  const { t } = useI18n();

  const tips: PersonalizedTip[] = generatePersonalizedTips(
    runwayAnalysis,
    categories,
    savingsRate,
    transactions
  );

  if (tips.length === 0) return null;

  return (
    <section className="tips-section" aria-labelledby="tips-title">
      <div className="section-header-row">
        <div>
          <div className="section-tag">Asistente de Estrategia Familiar</div>
          <h2 id="tips-title" className="section-title">
            {t('tips.section_title')}
          </h2>
        </div>
        <p className="section-subtitle">{t('tips.section_desc')}</p>
      </div>

      <div className="tips-grid">
        {tips.map((tip) => (
          <article key={tip.id} className={`tip-card ${tip.badgeClass}`}>
            <div className="tip-card-top">
              <span className={`tip-badge ${tip.badgeClass}`}>
                {t(tip.badgeKey)}
              </span>
              {tip.impactMetric && (
                <span className="tip-impact-pill">
                  <svg
                    className="tool-ic"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  <span>{tip.impactMetric}</span>
                </span>
              )}
            </div>

            <h3 className="tip-card-title">
              {t(tip.titleKey, tip.titleParams)}
            </h3>

            <p className="tip-card-desc">
              {t(tip.descKey, tip.descParams)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
export default PersonalizedTips;
