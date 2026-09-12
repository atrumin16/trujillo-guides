import React, { useMemo } from 'react';
import { useI18n } from '../utils/i18n';
import { NormalizedTransaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface RecurringExpensesCardProps {
  transactions: NormalizedTransaction[];
}

interface RecurringItem {
  key: string;
  cleanDescription: string;
  category: string;
  estimatedMonthlyAmount: number;
  occurrences: number;
  isSubscription: boolean;
}

export const RecurringExpensesCard: React.FC<RecurringExpensesCardProps> = ({ transactions }) => {
  const { t } = useI18n();

  const recurringData = useMemo(() => {
    const expenseTx = transactions.filter((t) => t.amount < 0);
    const groups = new Map<string, { txs: NormalizedTransaction[]; sum: number }>();

    expenseTx.forEach((tx) => {
      // Normalizar nombre del concepto para agrupar cargos recurrentes
      const cleanDesc = tx.description
        .toLowerCase()
        .replace(/^(recibo|adeudo|cargo|pago|tarjeta|compra)\s+/i, '')
        .replace(/\d{4,}/g, '') // Quitar números largos o referencias
        .replace(/ref\..*/i, '')
        .trim();

      const groupKey = cleanDesc.slice(0, 20);
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { txs: [], sum: 0 });
      }
      const g = groups.get(groupKey)!;
      g.txs.push(tx);
      g.sum += Math.abs(tx.amount);
    });

    const items: RecurringItem[] = [];
    let monthlyTotal = 0;
    let cancelableMonthly = 0;

    groups.forEach((data, key) => {
      // Si aparece en 2 o más ocasiones o pertenece a categorías típicamente recurrentes
      const isSub =
        data.txs.some((t) => t.category === 'subscriptions') ||
        key.includes('netflix') ||
        key.includes('spotify') ||
        key.includes('prime') ||
        key.includes('gym') ||
        key.includes('gimnasio') ||
        key.includes('disney') ||
        key.includes('youtube') ||
        key.includes('hbo') ||
        key.includes('apple');

      const isUtilityOrRent = data.txs.some((t) => ['housing', 'utilities', 'insurance'].includes(t.category));

      if (data.txs.length >= 2 || isSub || isUtilityOrRent) {
        const avgAmount = data.sum / Math.max(1, data.txs.length);
        monthlyTotal += avgAmount;
        if (isSub) {
          cancelableMonthly += avgAmount;
        }

        items.push({
          key,
          cleanDescription: data.txs[0].description,
          category: data.txs[0].category,
          estimatedMonthlyAmount: avgAmount,
          occurrences: data.txs.length,
          isSubscription: isSub
        });
      }
    });

    // Ordenar de mayor a menor importe
    items.sort((a, b) => b.estimatedMonthlyAmount - a.estimatedMonthlyAmount);

    return {
      items: items.slice(0, 10), // Top 10 gastos fijos
      monthlyTotal,
      yearlyTotal: monthlyTotal * 12,
      cancelableMonthly,
      totalCount: items.length
    };
  }, [transactions]);

  if (recurringData.items.length === 0) return null;

  return (
    <div className="step-card recurring-expenses-card">
      <div className="card-header">
        <span className="card-badge">Costes Fijos Comprometidos</span>
        <h3 className="card-title">{t('recurring.title')}</h3>
        <p className="card-description">{t('recurring.desc')}</p>
      </div>

      <div className="recurring-kpi-summary">
        <div className="recurring-kpi-box">
          <span className="recurring-kpi-label">{t('recurring.monthly_total')}</span>
          <strong className="recurring-kpi-val highlight">
            {formatCurrency(recurringData.monthlyTotal)} / mes
          </strong>
        </div>

        <div className="recurring-kpi-box">
          <span className="recurring-kpi-label">{t('recurring.yearly_total')}</span>
          <strong className="recurring-kpi-val">
            {formatCurrency(recurringData.yearlyTotal)} / año
          </strong>
        </div>

        {recurringData.cancelableMonthly > 0 && (
          <div className="recurring-kpi-box savings-potential">
            <span className="recurring-kpi-label">Margen de Ahorro en Suscripciones:</span>
            <strong className="recurring-kpi-val green">
              {formatCurrency(recurringData.cancelableMonthly)} / mes ({formatCurrency(recurringData.cancelableMonthly * 12)}/año)
            </strong>
          </div>
        )}
      </div>

      <div className="recurring-list-table">
        <div className="recurring-list-header">
          <span>Concepto recurrente</span>
          <span>Frecuencia detectada</span>
          <span>Importe medio</span>
        </div>
        <div className="recurring-list-body">
          {recurringData.items.map((item) => (
            <div key={item.key} className="recurring-list-row">
              <div className="recurring-desc-col">
                <span className="recurring-badge">
                  {item.isSubscription ? 'Suscripción' : 'Cuota fija'}
                </span>
                <span className="recurring-name" title={item.cleanDescription}>
                  {item.cleanDescription}
                </span>
              </div>
              <div className="recurring-freq-col">
                {item.occurrences} {item.occurrences === 1 ? 'cargo' : 'cargos periódicos'}
              </div>
              <div className="recurring-amount-col">
                {formatCurrency(item.estimatedMonthlyAmount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
