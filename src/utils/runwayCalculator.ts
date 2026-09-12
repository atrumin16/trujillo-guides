import { NormalizedTransaction, ParseResult, RunwayAnalysis } from '../types';

/**
 * Calcula el periodo en meses transcurridos entre la fecha inicial y final
 */
function calculateMonthsBetween(startDateStr: string, endDateStr: string): number {
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 25) {
      // Periodo de 1 mes típico de extracto bancario
      return 1;
    }
    // Promedio de días por mes (365.25 / 12)
    return Math.max(1, diffDays / 30.4375);
  } catch (e) {
    return 1;
  }
}

/**
 * Consolida extractos bancarios múltiples y calcula la salud financiera y pista de despegue (Runway)
 */
export function calculateRunway(
  totalLiquidity: number,
  parseResults: ParseResult[]
): RunwayAnalysis {
  const allTransactions: NormalizedTransaction[] = [];
  const transactionsByBank: Record<string, number> = {};

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalAvoidableLeaks = 0;

  for (const res of parseResults) {
    transactionsByBank[res.bankName] = (transactionsByBank[res.bankName] || 0) + res.transactions.length;

    for (const tx of res.transactions) {
      allTransactions.push(tx);

      if (tx.amount > 0) {
        totalIncome += tx.amount;
      } else if (tx.amount < 0) {
        const absVal = Math.abs(tx.amount);
        totalExpenses += absVal;

        if (tx.isAvoidableLeak) {
          totalAvoidableLeaks += absVal;
        }
      }
    }
  }

  // Ordenar transacciones por fecha descendente
  allTransactions.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));

  // Calcular meses abarcados por las transacciones
  let monthsSpanned = 1;
  const validDates = allTransactions.map((t) => t.date).filter(Boolean).sort();
  if (validDates.length > 1) {
    const earliest = validDates[0];
    const latest = validDates[validDates.length - 1];
    monthsSpanned = calculateMonthsBetween(earliest, latest);
  }

  const monthlyIncome = Math.round((totalIncome / monthsSpanned) * 100) / 100;
  const monthlyExpenses = Math.round((totalExpenses / monthsSpanned) * 100) / 100;
  const leakMonthlyEstimate = Math.round((totalAvoidableLeaks / monthsSpanned) * 100) / 100;

  // Si los ingresos mensuales cubren los gastos, hay superávit
  const isSurplus = monthlyIncome >= monthlyExpenses;
  const netMonthlyBurn = isSurplus
    ? -(monthlyIncome - monthlyExpenses)
    : Math.round((monthlyExpenses - monthlyIncome) * 100) / 100;

  let runwayMonths = 0;
  let runwayYears = 0;

  if (isSurplus) {
    runwayMonths = Infinity;
    runwayYears = Infinity;
  } else if (netMonthlyBurn > 0 && totalLiquidity > 0) {
    runwayMonths = Math.round((totalLiquidity / netMonthlyBurn) * 10) / 10;
    runwayYears = Math.round((runwayMonths / 12) * 10) / 10;
  }

  // Obtener los 8 mayores gastos
  const expenseTransactions = allTransactions.filter((t) => t.amount < 0);
  expenseTransactions.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  const topExpenses = expenseTransactions.slice(0, 8);

  return {
    totalLiquidity,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    monthsSpanned: Math.round(monthsSpanned * 10) / 10,
    monthlyIncome,
    monthlyExpenses,
    netMonthlyBurn,
    isSurplus,
    runwayMonths,
    runwayYears,
    leakMonthlyEstimate,
    topExpenses,
    transactionsByBank
  };
}
