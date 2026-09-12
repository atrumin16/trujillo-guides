import { NormalizedTransaction, RunwayAnalysis } from '../types';
import { CategorySummary, SavingsRateAnalysis } from './categories';
import { formatCurrency } from './formatters';

export interface PersonalizedTip {
  id: string;
  category: 'timing' | 'runway' | 'leaks' | 'budget' | 'habits';
  priority: 'high' | 'medium' | 'info';
  badgeClass: string;
  badgeKey: string;
  titleKey: string;
  titleParams?: Record<string, string | number>;
  descKey: string;
  descParams?: Record<string, string | number>;
  actionTextKey?: string;
  impactMetric?: string;
}

/**
 * Analiza los extractos y métricas reales del usuario para generar recomendaciones financieras hiperpersonalizadas
 */
export function generatePersonalizedTips(
  runwayAnalysis: RunwayAnalysis,
  categories: CategorySummary[],
  savingsRate: SavingsRateAnalysis,
  transactions: NormalizedTransaction[]
): PersonalizedTip[] {
  const tips: PersonalizedTip[] = [];

  // 1. RECOMENDACIÓN CLAVE: DESCONCENTRACIÓN Y CALENDARIZACIÓN DE GASTOS GRANDES
  // Detectar transacciones individuales de gasto elevadas (>= 250 €) que no sean nóminas
  const largeExpenses = transactions
    .filter((tx) => tx.amount < -250)
    .sort((a, b) => a.amount - b.amount); // Los más negativos primero

  if (largeExpenses.length >= 2) {
    const totalLarge = largeExpenses.slice(0, 3).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const names = largeExpenses.slice(0, 2).map((t) => t.concept.slice(0, 24)).join(', ');

    tips.push({
      id: 'stagger_large_expenses',
      category: 'timing',
      priority: 'high',
      badgeClass: 'badge-warning',
      badgeKey: 'tips.badge_timing',
      titleKey: 'tips.timing_title',
      descKey: 'tips.timing_desc',
      descParams: {
        count: largeExpenses.length,
        names,
        amount: formatCurrency(totalLarge, { hideCents: true })
      },
      impactMetric: `+2-3 meses de estabilidad en tesorería`
    });
  }

  // 2. RUNWAY CRÍTICO (< 6 meses) O SOBREASIGNACIÓN (> 24 meses)
  if (!runwayAnalysis.isSurplus && runwayAnalysis.runwayMonths > 0 && runwayAnalysis.runwayMonths < 6) {
    const missingFor6 = Math.max(0, runwayAnalysis.monthlyExpenses * 6 - runwayAnalysis.totalLiquidity);
    tips.push({
      id: 'critical_runway',
      category: 'runway',
      priority: 'high',
      badgeClass: 'badge-danger',
      badgeKey: 'tips.badge_urgency',
      titleKey: 'tips.critical_title',
      titleParams: { months: runwayAnalysis.runwayMonths.toFixed(1) },
      descKey: 'tips.critical_desc',
      descParams: {
        months: runwayAnalysis.runwayMonths.toFixed(1),
        monthlyExpenses: formatCurrency(runwayAnalysis.monthlyExpenses, { hideCents: true }),
        needed: formatCurrency(missingFor6, { hideCents: true })
      },
      impactMetric: `Objetivo: blindar ${formatCurrency(missingFor6, { hideCents: true })}`
    });
  } else if (runwayAnalysis.runwayMonths > 24) {
    const buffer18Months = runwayAnalysis.monthlyExpenses * 18;
    const excess = Math.max(0, runwayAnalysis.totalLiquidity - buffer18Months);

    tips.push({
      id: 'oversized_cushion',
      category: 'runway',
      priority: 'medium',
      badgeClass: 'badge-info',
      badgeKey: 'tips.badge_optim',
      titleKey: 'tips.oversized_title',
      titleParams: { years: runwayAnalysis.runwayYears.toFixed(1) },
      descKey: 'tips.oversized_desc',
      descParams: {
        months: runwayAnalysis.runwayMonths.toFixed(0),
        years: runwayAnalysis.runwayYears.toFixed(1),
        excess: formatCurrency(excess, { hideCents: true })
      },
      impactMetric: `Rendimiento potencial: +${formatCurrency(excess * 0.04, { hideCents: true })}/año`
    });
  }

  // 3. PODA DE FUGAS Y SUSCRIPCIONES OLVIDADAS
  if (runwayAnalysis.leakMonthlyEstimate > 0) {
    const leakTxs = transactions.filter((tx) => tx.isAvoidableLeak);
    const leakYearly = Math.round(runwayAnalysis.leakMonthlyEstimate * 12);
    const leakNames = Array.from(new Set(leakTxs.map((t) => t.concept.slice(0, 18)))).slice(0, 3).join(', ');

    tips.push({
      id: 'prune_leaks',
      category: 'leaks',
      priority: 'high',
      badgeClass: 'badge-warning',
      badgeKey: 'tips.badge_leaks',
      titleKey: 'tips.leaks_title',
      titleParams: { yearly: formatCurrency(leakYearly, { hideCents: true }) },
      descKey: 'tips.leaks_desc',
      descParams: {
        monthly: formatCurrency(runwayAnalysis.leakMonthlyEstimate, { hideCents: true }),
        yearly: formatCurrency(leakYearly, { hideCents: true }),
        count: leakTxs.length,
        names: leakNames || 'suscripciones detectadas'
      },
      impactMetric: `Ahorro neto: +${formatCurrency(leakYearly, { hideCents: true })}/año`
    });
  }

  // 4. PARTIDA DOMINANTE (Vivienda o Supermercado)
  const housingCat = categories.find((c) => c.key === 'housing');
  if (housingCat && runwayAnalysis.monthlyIncome > 0) {
    const housingRatio = Math.round((housingCat.monthlyAverage / runwayAnalysis.monthlyIncome) * 100);
    if (housingRatio > 35) {
      tips.push({
        id: 'housing_ratio',
        category: 'budget',
        priority: 'medium',
        badgeClass: 'badge-warning',
        badgeKey: 'tips.badge_budget',
        titleKey: 'tips.housing_title',
        titleParams: { pct: housingRatio },
        descKey: 'tips.housing_desc',
        descParams: {
          pct: housingRatio,
          amount: formatCurrency(housingCat.monthlyAverage, { hideCents: true })
        },
        impactMetric: `Ratio saludable recomendado: < 30%`
      });
    }
  }

  // 5. AUTOMATIZACIÓN DEL AHORRO (Págate a ti primero)
  const recommendedAutoSave = Math.max(50, Math.round((runwayAnalysis.monthlyIncome || 1500) * 0.1));
  tips.push({
    id: 'pay_yourself_first',
    category: 'habits',
    priority: 'info',
    badgeClass: 'badge-success',
    badgeKey: 'tips.badge_habit',
    titleKey: 'tips.pay_first_title',
    descKey: 'tips.pay_first_desc',
    descParams: {
      amount: formatCurrency(recommendedAutoSave, { hideCents: true })
    },
    impactMetric: `+${formatCurrency(recommendedAutoSave * 12, { hideCents: true })} ahorrados en 1 año`
  });

  // 6. FILTRO DE ENFRIAMIENTO (Regla de las 72 Horas)
  tips.push({
    id: 'rule_72_hours',
    category: 'habits',
    priority: 'info',
    badgeClass: 'badge-info',
    badgeKey: 'tips.badge_method',
    titleKey: 'tips.rule_72_title',
    descKey: 'tips.rule_72_desc',
    impactMetric: `Hasta -15% en compras no planificadas`
  });

  return tips;
}
