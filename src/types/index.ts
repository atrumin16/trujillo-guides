/**
 * Interfaces TypeScript para el ecosistema Savings & Runway Familiar
 * Procesamiento 100% en memoria volátil (Zero-Knowledge)
 */

export type BankId =
  | 'caixabank'
  | 'santander'
  | 'bbva'
  | 'sabadell'
  | 'bankinter'
  | 'ing'
  | 'openbank'
  | 'myinvestor'
  | 'n26'
  | 'revolut'
  | 'traderepublic'
  | 'scalable'
  | 'degiro'
  | 'ibkr'
  | 'abanca'
  | 'unicaja'
  | 'kutxabank'
  | 'ibercaja'
  | 'generic';

export type TransactionType = 'income' | 'expense' | 'transfer' | 'interest' | 'fee';

export interface NormalizedTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  rawDate: string;
  concept: string;
  amount: number; // Positivo para ingresos, negativo para gastos
  balance?: number;
  bankId: BankId;
  bankName: string;
  sourceFile: string;
  category?: string;
  type: TransactionType;
  isAvoidableLeak?: boolean;
  leakReason?: string;
}

export interface BankProfile {
  id: BankId;
  name: string;
  shortName: string;
  badgeColor: string;
  delimiters: string[];
  signatureHeaders: string[]; // Cabeceras características en minúsculas
  dateColumns: string[];
  conceptColumns: string[];
  amountColumns: string[];
  balanceColumns?: string[];
  incomeColumns?: string[];
  expenseColumns?: string[];
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM/DD/YYYY' | 'auto';
  decimalSeparator: ',' | '.' | 'auto';
  thousandsSeparator: '.' | ',' | ' ' | 'auto';
}

export interface ParseResult {
  fileName: string;
  bankId: BankId;
  bankName: string;
  transactions: NormalizedTransaction[];
  totalIncome: number;
  totalExpense: number;
  rowCount: number;
  errorCount: number;
  dateRange: { start: string; end: string } | null;
}

export interface RunwayAnalysis {
  totalLiquidity: number;
  totalIncome: number;
  totalExpenses: number;
  monthsSpanned: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netMonthlyBurn: number; // monthlyExpenses - monthlyIncome
  isSurplus: boolean;
  runwayMonths: number; // Meses de vida del colchón
  runwayYears: number;
  leakMonthlyEstimate: number;
  topExpenses: NormalizedTransaction[];
  transactionsByBank: Record<string, number>;
}

export interface CompoundProjection {
  years: number;
  monthlyContribution: number;
  totalContributed: number;
  futureValue: number;
  compoundInterestEarned: number;
}
