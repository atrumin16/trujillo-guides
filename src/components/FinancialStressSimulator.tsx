import React, { useState, useMemo } from 'react';
import { useI18n } from '../utils/i18n';
import { formatCurrency } from '../utils/formatters';

interface FinancialStressSimulatorProps {
  totalLiquidity: number;
  averageIncome: number;
  averageExpenses: number;
}

export const FinancialStressSimulator: React.FC<FinancialStressSimulatorProps> = ({
  totalLiquidity,
  averageIncome,
  averageExpenses
}) => {
  const { t } = useI18n();

  // Estados interactivos para las 3 variables de estrés
  const [incomeDropPct, setIncomeDropPct] = useState<number>(0);
  const [unexpectedExpense, setUnexpectedExpense] = useState<number>(0);
  const [inflationPct, setInflationPct] = useState<number>(0);

  const simulation = useMemo(() => {
    // Nuevos ingresos con la caída aplicada
    const stressedIncome = Math.max(0, averageIncome * (1 - incomeDropPct / 100));
    // Nuevos gastos con la inflación aplicada
    const stressedExpenses = averageExpenses * (1 + inflationPct / 100);
    // Nuevo colchón tras restar el gasto imprevisto puntual
    const stressedLiquidity = Math.max(0, totalLiquidity - unexpectedExpense);

    // Gasto neto mensual en el escenario de estrés
    const monthlyNetBurn = stressedExpenses - stressedIncome;

    let stressedRunwayMonths = 0;
    if (stressedExpenses > 0) {
      if (monthlyNetBurn > 0) {
        // Los ingresos no cubren los gastos: el colchón se va quemando
        stressedRunwayMonths = stressedLiquidity / monthlyNetBurn;
      } else {
        // Sigue habiendo superávit a pesar del estrés
        stressedRunwayMonths = stressedLiquidity / stressedExpenses;
      }
    }

    const cleanMonths = parseFloat(stressedRunwayMonths.toFixed(1));

    let resilienceClass = 'resilience-high';
    let resilienceText = t('stress.resilience_high');

    if (cleanMonths < 6) {
      resilienceClass = 'resilience-low';
      resilienceText = t('stress.resilience_low');
    } else if (cleanMonths < 12) {
      resilienceClass = 'resilience-med';
      resilienceText = t('stress.resilience_med');
    }

    return {
      stressedIncome,
      stressedExpenses,
      stressedLiquidity,
      cleanMonths,
      resilienceClass,
      resilienceText
    };
  }, [totalLiquidity, averageIncome, averageExpenses, incomeDropPct, unexpectedExpense, inflationPct, t]);

  if (averageExpenses <= 0) return null;

  return (
    <div className="step-card stress-simulator-card">
      <div className="card-header">
        <span className="card-badge">Simulador de Escenarios Extremos</span>
        <h3 className="card-title">{t('stress.title')}</h3>
        <p className="card-description">{t('stress.desc')}</p>
      </div>

      <div className="stress-controls-grid">
        {/* Control 1: Caída de Ingresos */}
        <div className="stress-control-box">
          <div className="stress-control-head">
            <label htmlFor="incomeDropRange" className="stress-label">
              {t('stress.income_drop')}
            </label>
            <span className="stress-val-badge danger">-{incomeDropPct}%</span>
          </div>
          <input
            id="incomeDropRange"
            type="range"
            min="0"
            max="100"
            step="5"
            value={incomeDropPct}
            onChange={(e) => setIncomeDropPct(Number(e.target.value))}
            className="stress-slider"
          />
          <div className="stress-scale">
            <span>0% (Normal)</span>
            <span>-25% (ERTE/Baja)</span>
            <span>-100% (Paro total)</span>
          </div>
        </div>

        {/* Control 2: Gasto Imprevisto Puntual */}
        <div className="stress-control-box">
          <div className="stress-control-head">
            <label htmlFor="unexpExpenseRange" className="stress-label">
              {t('stress.unexpected_expense')}
            </label>
            <span className="stress-val-badge warning">-{formatCurrency(unexpectedExpense)}</span>
          </div>
          <input
            id="unexpExpenseRange"
            type="range"
            min="0"
            max="10000"
            step="500"
            value={unexpectedExpense}
            onChange={(e) => setUnexpectedExpense(Number(e.target.value))}
            className="stress-slider"
          />
          <div className="stress-scale">
            <span>0 €</span>
            <span>2.500 € (Avería)</span>
            <span>10.000 € (Reforma)</span>
          </div>
        </div>

        {/* Control 3: Subida por Inflación / Costes Fijos */}
        <div className="stress-control-box">
          <div className="stress-control-head">
            <label htmlFor="inflationRange" className="stress-label">
              {t('stress.inflation')}
            </label>
            <span className="stress-val-badge info">+{inflationPct}%</span>
          </div>
          <input
            id="inflationRange"
            type="range"
            min="0"
            max="30"
            step="2"
            value={inflationPct}
            onChange={(e) => setInflationPct(Number(e.target.value))}
            className="stress-slider"
          />
          <div className="stress-scale">
            <span>0%</span>
            <span>+10% (Alquiler/Luz)</span>
            <span>+30% (Crisis severa)</span>
          </div>
        </div>
      </div>

      {/* Panel de Resultado del Simulador */}
      <div className={`stress-result-banner ${simulation.resilienceClass}`}>
        <div className="stress-result-left">
          <span className="stress-result-caption">{t('stress.result_runway')}</span>
          <div className="stress-result-number">
            <strong>{simulation.cleanMonths}</strong>
            <span>meses de supervivencia</span>
          </div>
        </div>

        <div className="stress-result-right">
          <p className="stress-resilience-diagnosis">{simulation.resilienceText}</p>
          <div className="stress-breakdown-chips">
            <span className="stress-chip">
              Liquidez restante: {formatCurrency(simulation.stressedLiquidity)}
            </span>
            <span className="stress-chip">
              Gastos simulados: {formatCurrency(simulation.stressedExpenses)}/mes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
