import { BankId, BankProfile, NormalizedTransaction, ParseResult } from '../types';
import { BANK_PROFILES, FALLBACK_KEYWORDS } from './bankProfiles';

/**
 * Detecta el delimitador más probable de una línea CSV (; , \t |)
 */
export function detectDelimiter(text: string): string {
  const sampleLines = text.split(/\r?\n/).slice(0, 15).filter((l) => l.trim().length > 0);
  const counts: Record<string, number> = { ';': 0, ',': 0, '\t': 0, '|': 0 };

  for (const line of sampleLines) {
    for (const d of Object.keys(counts)) {
      const match = line.split(d);
      if (match.length > 1) {
        counts[d] += match.length;
      }
    }
  }

  let best = ';';
  let max = -1;
  for (const [d, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      best = d;
    }
  }
  return best;
}

/**
 * Limpia y normaliza importes numéricos (soporta 1.250,50 €, -45,20, (100,00), etc.)
 */
export function parseAmount(raw: string | number | undefined | null): number {
  if (typeof raw === 'number') return isNaN(raw) ? 0 : raw;
  if (!raw) return 0;

  let s = String(raw).trim();
  // Quitar símbolos de divisa y espacios no separables
  s = s.replace(/[\u00A0\u2000-\u200B\u202F\u205F]/g, ' ');
  s = s.replace(/[€$£]/g, '').trim();

  // Detección de formato con paréntesis negativos (120,50) -> -120.50
  let isNegative = false;
  if (s.startsWith('(') && s.endsWith(')')) {
    isNegative = true;
    s = s.slice(1, -1).trim();
  } else if (s.endsWith('-')) {
    isNegative = true;
    s = s.slice(0, -1).trim();
  } else if (s.startsWith('-')) {
    isNegative = true;
    s = s.slice(1).trim();
  } else if (s.startsWith('+')) {
    s = s.slice(1).trim();
  }

  // Quitar palabras de divisa como EUR, USD
  s = s.replace(/\b(?:EUR|USD|GBP)\b/gi, '').trim();

  // Si tiene coma y punto, determinar cuál es decimal
  if (s.includes('.') && s.includes(',')) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      // 1.250,50 -> punto de miles, coma decimal
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // 1,250.50 -> coma de miles, punto decimal
      s = s.replace(/,/g, '');
    }
  } else if (s.includes(',')) {
    // 1250,50 o 1,250 -> en España la coma es decimal
    s = s.replace(',', '.');
  }

  // Quitar cualquier carácter no numérico residual excepto punto y signo
  s = s.replace(/[^0-9.-]/g, '');

  const num = parseFloat(s);
  if (isNaN(num)) return 0;
  return isNegative ? -Math.abs(num) : num;
}

/**
 * Normaliza fechas variadas (DD/MM/YYYY, YYYY-MM-DD, etc.) a formato estándar ISO YYYY-MM-DD
 */
export function parseDate(raw: string | undefined | null): string {
  if (!raw) return new Date().toISOString().slice(0, 10);
  const s = String(raw).trim().slice(0, 20);

  // ISO: YYYY-MM-DD o YYYY/MM/DD
  const isoMatch = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // Español / Europeo: DD/MM/YYYY o DD-MM-YYYY o DD.MM.YYYY
  const euMatch = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (euMatch) {
    let [, d, m, y] = euMatch;
    if (y.length === 2) y = '20' + y;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

/**
 * Divide una línea CSV respetando comillas
 */
export function splitCsvRow(row: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (insideQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Detecta si una transacción corresponde a una fuga de capital evitable
 */
export function detectAvoidableLeak(concept: string, amount: number): { isLeak: boolean; reason?: string } {
  if (amount >= 0) return { isLeak: false };

  const c = concept.toLowerCase();

  // Farmacia / Medicación continua derivada de hábitos sedentarios
  if (/(?:farmacia|botic|medicam|parafarmacia|sanofi|pfizer|novartis|farma)\b/i.test(c)) {
    return {
      isLeak: true,
      reason: 'Farmacia / Medicación recurrente (potencialmente evitable mediante actividad física y hábitos preventivos)'
    };
  }

  // Comisiones bancarias de mantenimiento
  if (/(?:comisi[oó]n|mantenimiento|gastos de cuenta|com\.adm|cuota tarjeta|intereses descub)\b/i.test(c)) {
    return {
      isLeak: true,
      reason: 'Comisión bancaria de mantenimiento (negociable o evitable con banca sin comisiones)'
    };
  }

  // Suscripciones digitales superfluas o duplicadas
  if (/(?:netflix|spotify|disney|prime video|hbo|dazn|playstation|apple\.com\/bill|crunchyroll|youtube premium)\b/i.test(c)) {
    return {
      isLeak: true,
      reason: 'Suscripción digital / ocio pasivo (revisable para optimizar presupuesto familiar)'
    };
  }

  return { isLeak: false };
}

/**
 * Encuentra la fila que contiene las cabeceras reales del extracto (omitiendo cabeceras informativas)
 */
function findHeaderRowIndex(lines: string[], delimiter: string): { index: number; headers: string[] } {
  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = splitCsvRow(line, delimiter).map((c) => c.toLowerCase().trim());

    const hasDate = cells.some((c) => FALLBACK_KEYWORDS.date.some((kw) => c.includes(kw)));
    const hasAmount = cells.some((c) => FALLBACK_KEYWORDS.amount.some((kw) => c.includes(kw)));
    const hasConcept = cells.some((c) => FALLBACK_KEYWORDS.concept.some((kw) => c.includes(kw)));

    if ((hasDate && hasAmount) || (hasDate && hasConcept)) {
      return { index: i, headers: cells };
    }
  }
  return { index: 0, headers: splitCsvRow(lines[0] || '', delimiter).map((c) => c.toLowerCase().trim()) };
}

/**
 * Asocia un archivo bancario con el perfil más afín
 */
function matchBankProfile(headers: string[], fileName: string): BankProfile | null {
  const cleanName = fileName.toLowerCase();

  // 1. Verificación por nombre de archivo
  for (const profile of BANK_PROFILES) {
    if (cleanName.includes(profile.id) || cleanName.includes(profile.shortName.toLowerCase())) {
      return profile;
    }
  }

  // 2. Verificación por cabeceras signature
  let bestProfile: BankProfile | null = null;
  let bestScore = 0;

  for (const profile of BANK_PROFILES) {
    let score = 0;
    for (const sig of profile.signatureHeaders) {
      if (headers.some((h) => h.includes(sig) || sig.includes(h))) {
        score++;
      }
    }
    if (score > bestScore && score >= 2) {
      bestScore = score;
      bestProfile = profile;
    }
  }

  return bestProfile;
}

/**
 * Normaliza un archivo CSV bancario completo en memoria RAM
 */
export function normalizeBankCsv(content: string, fileName: string): ParseResult {
  const delimiter = detectDelimiter(content);
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return {
      fileName,
      bankId: 'generic',
      bankName: 'Desconocido',
      transactions: [],
      totalIncome: 0,
      totalExpense: 0,
      rowCount: 0,
      errorCount: 0,
      dateRange: null
    };
  }

  const { index: headerIndex, headers } = findHeaderRowIndex(lines, delimiter);
  const matchedProfile = matchBankProfile(headers, fileName);

  const bankId: BankId = matchedProfile ? matchedProfile.id : 'generic';
  const bankName = matchedProfile ? matchedProfile.name : 'Entidad Bancaria';

  // Identificar índices de columnas
  let dateIdx = -1;
  let conceptIdx = -1;
  let amountIdx = -1;
  let balanceIdx = -1;
  let incomeIdx = -1;
  let expenseIdx = -1;

  if (matchedProfile) {
    dateIdx = headers.findIndex((h) => matchedProfile.dateColumns.some((col) => h.includes(col)));
    conceptIdx = headers.findIndex((h) => matchedProfile.conceptColumns.some((col) => h.includes(col)));
    amountIdx = headers.findIndex((h) => matchedProfile.amountColumns.some((col) => h.includes(col)));
    if (matchedProfile.balanceColumns) {
      balanceIdx = headers.findIndex((h) => matchedProfile.balanceColumns!.some((col) => h.includes(col)));
    }
  }

  // Fallback heurístico si no se detectó alguna columna
  if (dateIdx === -1) {
    dateIdx = headers.findIndex((h) => FALLBACK_KEYWORDS.date.some((kw) => h.includes(kw)));
  }
  if (conceptIdx === -1) {
    conceptIdx = headers.findIndex((h) => FALLBACK_KEYWORDS.concept.some((kw) => h.includes(kw)));
  }
  if (amountIdx === -1) {
    amountIdx = headers.findIndex((h) => FALLBACK_KEYWORDS.amount.some((kw) => h.includes(kw)));
    if (amountIdx === -1) {
      incomeIdx = headers.findIndex((h) => FALLBACK_KEYWORDS.income.some((kw) => h.includes(kw)));
      expenseIdx = headers.findIndex((h) => FALLBACK_KEYWORDS.expense.some((kw) => h.includes(kw)));
    }
  }

  // Si no se encuentra fecha o concepto, intentar posiciones por defecto comunes
  if (dateIdx === -1 && headers.length > 0) dateIdx = 0;
  if (conceptIdx === -1 && headers.length > 1) conceptIdx = 1;
  if (amountIdx === -1 && incomeIdx === -1 && headers.length > 2) amountIdx = headers.length - 1;

  const transactions: NormalizedTransaction[] = [];
  let totalIncome = 0;
  let totalExpense = 0;
  let errorCount = 0;

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim()) continue;

    const cells = splitCsvRow(rawLine, delimiter);
    if (cells.length <= Math.max(dateIdx, conceptIdx, amountIdx)) {
      errorCount++;
      continue;
    }

    const rawDate = cells[dateIdx] || '';
    const date = parseDate(rawDate);
    const concept = (cells[conceptIdx] || 'Movimiento bancario').replace(/\s+/g, ' ').trim();

    let amount = 0;
    if (amountIdx !== -1) {
      amount = parseAmount(cells[amountIdx]);
    } else if (incomeIdx !== -1 && expenseIdx !== -1) {
      const inc = Math.abs(parseAmount(cells[incomeIdx]));
      const exp = Math.abs(parseAmount(cells[expenseIdx]));
      amount = inc > 0 ? inc : -exp;
    }

    if (amount === 0 && !concept) {
      errorCount++;
      continue;
    }

    let balance: number | undefined;
    if (balanceIdx !== -1 && cells[balanceIdx]) {
      balance = parseAmount(cells[balanceIdx]);
    }

    let type: NormalizedTransaction['type'] = amount >= 0 ? 'income' : 'expense';
    const cLower = concept.toLowerCase();
    if (/transferencia|traspaso|bizum/i.test(cLower)) {
      type = 'transfer';
    } else if (/inter[eé]s|rendimiento|remuneraci[oó]n/i.test(cLower)) {
      type = 'interest';
    } else if (/comisi[oó]n|custodia|mantenimiento/i.test(cLower)) {
      type = 'fee';
    }

    const leakCheck = detectAvoidableLeak(concept, amount);

    const tx: NormalizedTransaction = {
      id: `${bankId}-${date}-${Math.abs(amount)}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      date,
      rawDate,
      concept,
      amount,
      balance,
      bankId,
      bankName,
      sourceFile: fileName,
      type,
      isAvoidableLeak: leakCheck.isLeak,
      leakReason: leakCheck.reason
    };

    transactions.push(tx);

    if (amount > 0) {
      totalIncome += amount;
    } else {
      totalExpense += Math.abs(amount);
    }
  }

  // Ordenar cronológicamente descendente (más recientes primero)
  transactions.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));

  let dateRange = null;
  if (transactions.length > 0) {
    const dates = transactions.map((t) => t.date).filter(Boolean).sort();
    if (dates.length > 0) {
      dateRange = {
        start: dates[0],
        end: dates[dates.length - 1]
      };
    }
  }

  return {
    fileName,
    bankId,
    bankName,
    transactions,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpense: Math.round(totalExpense * 100) / 100,
    rowCount: transactions.length,
    errorCount,
    dateRange
  };
}
