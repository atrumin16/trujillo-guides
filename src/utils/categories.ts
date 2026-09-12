import { NormalizedTransaction } from '../types';

export type ExpenseCategoryKey =
  | 'housing'
  | 'supermarket'
  | 'utilities'
  | 'health_insurance'
  | 'transport'
  | 'leaks'
  | 'leisure'
  | 'other';

export interface CategorySummary {
  key: ExpenseCategoryKey;
  labelKey: string;
  totalAmount: number;
  monthlyAverage: number;
  percentage: number;
  count: number;
  color: string;
}

export interface SavingsRateAnalysis {
  ratePercentage: number; // e.g. 24.5%
  status: 'excellent' | 'healthy' | 'tight' | 'deficit';
  statusClass: string;
  titleKey: string;
  descKey: string;
  netSavingsMonthly: number;
}

export interface RunwayTargetAnalysis {
  targetMonths: number;
  neededAmount: number;
  currentLiquidity: number;
  difference: number;
  isCovered: boolean;
  coveragePercentage: number;
}

const CATEGORY_COLORS: Record<ExpenseCategoryKey, string> = {
  housing: '#3b82f6', // Azul primario
  supermarket: '#10b981', // Verde esmeralda
  utilities: '#06b6d4', // Cyan
  health_insurance: '#8b5cf6', // Violeta
  transport: '#f59e0b', // Ámbar
  leaks: '#f43f5e', // Rosa/Rojo fuga
  leisure: '#ec4899', // Magenta
  other: '#64748b' // Gris pizarra
};

/**
 * Categoriza heurísticamente una transacción bancaria a partir de su concepto y características
 */
export function categorizeTransaction(tx: NormalizedTransaction): ExpenseCategoryKey {
  if (tx.isAvoidableLeak) {
    return 'leaks';
  }

  const c = (tx.concept || '').toLowerCase();

  // 1. Vivienda, hipoteca, alquiler, comunidad
  if (
    /(?:hipoteca|prestamo hipotec|alquiler|arrendamiento|comunidad de prop|comunidad vec|renta mensual|cuota comunid|ibi|itp)\b/i.test(
      c
    )
  ) {
    return 'housing';
  }

  // 2. Supermercados y alimentación diaria
  if (
    /(?:mercadona|carrefour|dia |dia%|lidl|aldi|eroski|alcampo|bonpreu|consum|hipercor|corte ingles super|fruter[ií]a|carnicer[ií]a|panader[ií]a|pescader[ií]a|charcuter[ií]a|makro|ahorramas|alimerka)\b/i.test(
      c
    )
  ) {
    return 'supermarket';
  }

  // 3. Suministros (Luz, agua, gas, telecomunicaciones)
  if (
    /(?:endesa|iberdrola|naturgy|totalenergies|repsol luz|energia|gas natural|canal isabel|emasesa|aig[uü]es|aqualia|vodafone|movistar|orange|digi|o2|pepephone|yoigo|masmovil|telefonica|jazztel|fibra|recibo luz|recibo agua)\b/i.test(
      c
    )
  ) {
    return 'utilities';
  }

  // 4. Salud, seguros y farmacia
  if (
    /(?:segurcaixa|mapfre|sanitas|adeslas|asisa|mutua madr|dkv|axa|allianz|linea directa|farmacia|botic|parafarmacia|clinica|dental|hospital|oftalmolog|fisioter)\b/i.test(
      c
    )
  ) {
    return 'health_insurance';
  }

  // 5. Transporte, combustible y viajes
  if (
    /(?:repsol|cepsa|bp |galp|petronor|shell|gasolinera|combustible|renfe|adif|metro|emt|alsa|iryo|ouigo|uber|cabify|taxi|peaje|autopista|ap-?\d+|parking|aparcam|itv|taller|mecanic)\b/i.test(
      c
    )
  ) {
    return 'transport';
  }

  // 6. Ocio, restauración, compras y estilo de vida
  if (
    /(?:restaurante|bar |cafeter|mcdonald|burger|pizzer|telepizza|glovo|uber eats|just eat|amazon|zara|pull&bear|stradivarius|mango|primark|ikea|el corte ingles|fnac|mediamarkt|cinema|cine |teatro|hotel|booking|airbnb|vueling|ryanair|iberia)\b/i.test(
      c
    )
  ) {
    return 'leisure';
  }

  return 'other';
}

/**
 * Calcula el desglose consolidado de gastos por categorías
 */
export function calculateCategoryBreakdown(
  transactions: NormalizedTransaction[],
  monthsSpanned: number = 1
): CategorySummary[] {
  const expenseTxs = transactions.filter((tx) => tx.amount < 0);
  const totalExpenseAbs = expenseTxs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const months = Math.max(1, monthsSpanned);

  const accumulator: Record<
    ExpenseCategoryKey,
    { total: number; count: number }
  > = {
    housing: { total: 0, count: 0 },
    supermarket: { total: 0, count: 0 },
    utilities: { total: 0, count: 0 },
    health_insurance: { total: 0, count: 0 },
    transport: { total: 0, count: 0 },
    leaks: { total: 0, count: 0 },
    leisure: { total: 0, count: 0 },
    other: { total: 0, count: 0 }
  };

  for (const tx of expenseTxs) {
    const cat = categorizeTransaction(tx);
    const absVal = Math.abs(tx.amount);
    accumulator[cat].total += absVal;
    accumulator[cat].count += 1;
  }

  const summaries: CategorySummary[] = (
    Object.keys(accumulator) as ExpenseCategoryKey[]
  ).map((key) => {
    const data = accumulator[key];
    const percentage = totalExpenseAbs > 0 ? (data.total / totalExpenseAbs) * 100 : 0;
    return {
      key,
      labelKey: `cat.${key}`,
      totalAmount: Math.round(data.total * 100) / 100,
      monthlyAverage: Math.round((data.total / months) * 100) / 100,
      percentage: Math.round(percentage * 10) / 10,
      count: data.count,
      color: CATEGORY_COLORS[key]
    };
  });

  // Ordenar de mayor a menor volumen de gasto
  summaries.sort((a, b) => b.totalAmount - a.totalAmount);
  return summaries;
}

/**
 * Calcula la Tasa de Ahorro Mensual del hogar
 * Tasa = (Ingresos - Gastos) / Ingresos * 100
 */
export function calculateSavingsRate(
  monthlyIncome: number,
  monthlyExpenses: number
): SavingsRateAnalysis {
  const netSavings = monthlyIncome - monthlyExpenses;

  if (monthlyIncome <= 0) {
    return {
      ratePercentage: 0,
      status: 'deficit',
      statusClass: 'status-deficit',
      titleKey: 'cat.rate_deficit',
      descKey: 'cat.rate_desc_deficit',
      netSavingsMonthly: netSavings
    };
  }

  const rawRate = (netSavings / monthlyIncome) * 100;
  const ratePercentage = Math.round(rawRate * 10) / 10;

  if (ratePercentage >= 20) {
    return {
      ratePercentage,
      status: 'excellent',
      statusClass: 'status-excellent',
      titleKey: 'cat.rate_excellent',
      descKey: 'cat.rate_desc_excellent',
      netSavingsMonthly: netSavings
    };
  }

  if (ratePercentage >= 10) {
    return {
      ratePercentage,
      status: 'healthy',
      statusClass: 'status-healthy',
      titleKey: 'cat.rate_healthy',
      descKey: 'cat.rate_desc_healthy',
      netSavingsMonthly: netSavings
    };
  }

  if (ratePercentage >= 0) {
    return {
      ratePercentage,
      status: 'tight',
      statusClass: 'status-tight',
      titleKey: 'cat.rate_tight',
      descKey: 'cat.rate_desc_tight',
      netSavingsMonthly: netSavings
    };
  }

  return {
    ratePercentage,
    status: 'deficit',
    statusClass: 'status-deficit',
    titleKey: 'cat.rate_deficit',
    descKey: 'cat.rate_desc_deficit',
    netSavingsMonthly: netSavings
  };
}

/**
 * Calcula la meta del Colchón de Tranquilidad (6, 12 o 24 meses de gastos mensuales)
 */
export function calculateRunwayTarget(
  monthlyExpenses: number,
  currentLiquidity: number,
  targetMonths: number
): RunwayTargetAnalysis {
  const neededAmount = Math.round(monthlyExpenses * targetMonths);
  const diff = currentLiquidity - neededAmount;
  const isCovered = diff >= 0;
  const coveragePercentage =
    neededAmount > 0 ? Math.min(200, Math.round((currentLiquidity / neededAmount) * 100)) : 100;

  return {
    targetMonths,
    neededAmount,
    currentLiquidity,
    difference: Math.abs(diff),
    isCovered,
    coveragePercentage
  };
}
