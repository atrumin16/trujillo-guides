import { CompoundProjection } from '../types';

/**
 * Tasa de rentabilidad anual de referencia (7% real según mercado indexado global)
 */
export const ANNUAL_MARKET_RETURN_RATE = 0.07;

/**
 * Calcula el valor futuro de una aportación mensual constante mediante interés compuesto mensual
 *
 * Fórmula:
 * VF = PMT * [((1 + r/12)^(n * 12) - 1) / (r/12)]
 *
 * @param monthlyContribution Cuota o ahorro mensual en euros
 * @param years Número de años de acumulación
 * @param annualRate Tasa anualizada (por defecto 0.07 = 7%)
 */
export function calculateCompoundInterest(
  monthlyContribution: number,
  years: number,
  annualRate: number = ANNUAL_MARKET_RETURN_RATE
): CompoundProjection {
  const pmt = Math.max(0, monthlyContribution);
  const totalMonths = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRate / 12;

  if (pmt === 0) {
    return {
      years,
      monthlyContribution: 0,
      totalContributed: 0,
      futureValue: 0,
      compoundInterestEarned: 0
    };
  }

  // Si la tasa es 0, no hay interés compuesto
  if (monthlyRate === 0) {
    const total = pmt * totalMonths;
    return {
      years,
      monthlyContribution: pmt,
      totalContributed: total,
      futureValue: total,
      compoundInterestEarned: 0
    };
  }

  // VF = PMT * [((1 + i)^n - 1) / i]
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const futureValue = pmt * ((factor - 1) / monthlyRate);
  const totalContributed = pmt * totalMonths;
  const compoundInterestEarned = Math.max(0, futureValue - totalContributed);

  return {
    years,
    monthlyContribution: Math.round(pmt * 100) / 100,
    totalContributed: Math.round(totalContributed * 100) / 100,
    futureValue: Math.round(futureValue * 100) / 100,
    compoundInterestEarned: Math.round(compoundInterestEarned * 100) / 100
  };
}

/**
 * Genera el paquete estándar de proyecciones a 10 y 15 años
 */
export function getStandardProjections(monthlyAmount: number): {
  projection10Years: CompoundProjection;
  projection15Years: CompoundProjection;
} {
  return {
    projection10Years: calculateCompoundInterest(monthlyAmount, 10),
    projection15Years: calculateCompoundInterest(monthlyAmount, 15)
  };
}
