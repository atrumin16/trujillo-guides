import { NormalizedTransaction, RunwayAnalysis } from '../types';
import { CategorySummary, SavingsRateAnalysis } from './categories';
import { formatDate } from './formatters';

export interface ExcelExportData {
  runwayAnalysis: RunwayAnalysis;
  categories: CategorySummary[];
  savingsRate: SavingsRateAnalysis;
  transactions: NormalizedTransaction[];
  language: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

/**
 * Escapa caracteres HTML especiales para evitar inyecciones en el archivo Excel
 */
function escapeHtml(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Genera un archivo de hoja de cálculo formateado (.xls en HTML/XML estandarizado)
 * Compatible con Microsoft Excel, Google Sheets, LibreOffice Calc y Apple Numbers.
 */
export function exportToExcel(data: ExcelExportData): void {
  const { runwayAnalysis, categories, savingsRate, transactions, t } = data;
  const today = new Date();
  const dateFormatted = today.toISOString().slice(0, 10);
  const displayDate = formatDate(dateFormatted, 'full');

  // Filtrar fugas
  const leaks = transactions.filter((tx) => tx.isAvoidableLeak);
  const totalLeaks = leaks.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Construcción del HTML/XML de la hoja de cálculo
  let html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Auditoría Financiera</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; }
    table { border-collapse: collapse; margin-bottom: 25px; width: 100%; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; }
    
    /* Encabezados y títulos */
    .title-banner { background-color: #0f172a; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: left; padding: 14px; }
    .subtitle-banner { background-color: #1e293b; color: #94a3b8; font-size: 10pt; padding: 6px 14px; }
    .section-header { background-color: #1e293b; color: #ffffff; font-size: 12pt; font-weight: bold; text-align: left; }
    .table-head th { background-color: #334155; color: #ffffff; font-weight: 600; text-align: left; }
    
    /* Formatos numéricos y estados */
    .num-currency { text-align: right; mso-number-format: "#,##0.00\\ \\€"; }
    .num-percent { text-align: right; mso-number-format: "0.0%"; }
    .num-integer { text-align: right; mso-number-format: "#,##0"; }
    .text-center { text-align: center; }
    .text-income { color: #047857; font-weight: 600; }
    .text-expense { color: #b91c1c; font-weight: 600; }
    .text-leak { color: #b45309; font-weight: 600; }
    .badge-leak { background-color: #fef3c7; color: #92400e; font-weight: bold; }
    .row-total td { background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #0f172a; }
    .kpi-title { font-weight: 600; color: #475569; background-color: #f8fafc; }
    .kpi-value { font-size: 12pt; font-weight: bold; }
  </style>
</head>
<body>

  <!-- BANNER SUPERIOR -->
  <table>
    <tr>
      <td colspan="6" class="title-banner">
        ATM LABS · AUDITORÍA DE AHORRO FAMILIAR Y RUNWAY
      </td>
    </tr>
    <tr>
      <td colspan="6" class="subtitle-banner">
        Informe generado el ${displayDate} | 100% Volátil en RAM · Privacidad Zero-Knowledge
      </td>
    </tr>
  </table>

  <!-- SECCIÓN 1: RESUMEN EJECUTIVO Y DIAGNÓSTICO -->
  <table>
    <tr>
      <th colspan="4" class="section-header">1. RESUMEN EJECUTIVO Y SALUD FINANCIERA</th>
    </tr>
    <tr>
      <td class="kpi-title" width="25%">Colchón Líquido Actual:</td>
      <td class="kpi-value num-currency" width="25%">${runwayAnalysis.totalLiquidity.toFixed(2)}</td>
      <td class="kpi-title" width="25%">Meses de Cobertura (Runway):</td>
      <td class="kpi-value text-center" width="25%">${runwayAnalysis.isSurplus ? 'SUPERÁVIT ACTIVO' : runwayAnalysis.runwayMonths.toFixed(1) + ' meses'}</td>
    </tr>
    <tr>
      <td class="kpi-title">Ingresos Medios Mensuales:</td>
      <td class="kpi-value num-currency text-income">${runwayAnalysis.monthlyIncome.toFixed(2)}</td>
      <td class="kpi-title">Gastos Medios Mensuales:</td>
      <td class="kpi-value num-currency text-expense">-${runwayAnalysis.monthlyExpenses.toFixed(2)}</td>
    </tr>
    <tr>
      <td class="kpi-title">Margen Neto Mensual:</td>
      <td class="kpi-value num-currency ${savingsRate.netSavingsMonthly >= 0 ? 'text-income' : 'text-expense'}">
        ${savingsRate.netSavingsMonthly >= 0 ? '+' : ''}${savingsRate.netSavingsMonthly.toFixed(2)}
      </td>
      <td class="kpi-title">Tasa de Ahorro Familiar:</td>
      <td class="kpi-value text-center ${savingsRate.status === 'deficit' ? 'text-expense' : 'text-income'}">
        ${savingsRate.ratePercentage.toFixed(1)}% (${t(savingsRate.titleKey)})
      </td>
    </tr>
    <tr>
      <td class="kpi-title">Fugas Evitables Detectadas:</td>
      <td class="kpi-value num-currency text-leak">${runwayAnalysis.leakMonthlyEstimate.toFixed(2)} / mes</td>
      <td class="kpi-title">Periodo Bancario Auditado:</td>
      <td class="text-center">${runwayAnalysis.monthsSpanned} ${runwayAnalysis.monthsSpanned === 1 ? 'mes' : 'meses'}</td>
    </tr>
  </table>

  <!-- SECCIÓN 2: DESGLOSE DE GASTOS POR CATEGORÍAS -->
  <table>
    <thead>
      <tr>
        <th colspan="5" class="section-header">2. DESGLOSE DE GASTOS POR CATEGORÍAS</th>
      </tr>
      <tr class="table-head">
        <th>Categoría</th>
        <th class="text-center">Nº Operaciones</th>
        <th class="text-center">Porcentaje (%)</th>
        <th class="num-currency">Gasto Medio / Mes</th>
        <th class="num-currency">Total Periodo</th>
      </tr>
    </thead>
    <tbody>
`;

  let totalCatExpenses = 0;
  let totalCatOps = 0;

  for (const cat of categories) {
    totalCatExpenses += cat.totalAmount;
    totalCatOps += cat.count;
    html += `
      <tr>
        <td><strong>${escapeHtml(t(cat.labelKey))}</strong></td>
        <td class="text-center">${cat.count}</td>
        <td class="text-center">${cat.percentage.toFixed(1)}%</td>
        <td class="num-currency">${cat.monthlyAverage.toFixed(2)}</td>
        <td class="num-currency text-expense">-${cat.totalAmount.toFixed(2)}</td>
      </tr>
    `;
  }

  html += `
      <tr class="row-total">
        <td>TOTAL GASTOS AUDITADOS</td>
        <td class="text-center">${totalCatOps}</td>
        <td class="text-center">100.0%</td>
        <td class="num-currency">${(totalCatExpenses / Math.max(1, runwayAnalysis.monthsSpanned)).toFixed(2)}</td>
        <td class="num-currency text-expense">-${totalCatExpenses.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
`;

  // SECCIÓN 3: FUGAS DETECTADAS
  if (leaks.length > 0) {
    html += `
  <table>
    <thead>
      <tr>
        <th colspan="5" class="section-header">3. AUDITORÍA DE FUGAS Y SUSCRIPCIONES IDENTIFICADAS</th>
      </tr>
      <tr class="table-head">
        <th>Fecha</th>
        <th>Entidad Bancaria</th>
        <th>Concepto</th>
        <th>Motivo de Optimización</th>
        <th class="num-currency">Importe</th>
      </tr>
    </thead>
    <tbody>
`;

    for (const leak of leaks) {
      html += `
      <tr class="badge-leak">
        <td class="text-center">${formatDate(leak.date, 'short')}</td>
        <td>${escapeHtml(leak.bankName)}</td>
        <td>${escapeHtml(leak.concept)}</td>
        <td>${escapeHtml(leak.leakReason || 'Suscripción o cuota recurrente')}</td>
        <td class="num-currency text-leak">-${Math.abs(leak.amount).toFixed(2)}</td>
      </tr>
`;
    }

    html += `
      <tr class="row-total">
        <td colspan="4">TOTAL FUGAS DETECTADAS EN EL EXTRACTO</td>
        <td class="num-currency text-leak">-${totalLeaks.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
`;
  }

  // SECCIÓN 4: REGISTRO CONSOLIDADO COMPLETO
  html += `
  <table>
    <thead>
      <tr>
        <th colspan="6" class="section-header">4. REGISTRO CONSOLIDADO DE MOVIMIENTOS BANCARIOS</th>
      </tr>
      <tr class="table-head">
        <th class="text-center">Fecha</th>
        <th>Banco</th>
        <th>Concepto / Comercio</th>
        <th>Tipo</th>
        <th>Alerta</th>
        <th class="num-currency">Importe (€)</th>
      </tr>
    </thead>
    <tbody>
`;

  for (const tx of transactions) {
    const isLeak = tx.isAvoidableLeak;
    const isInc = tx.amount > 0;
    html += `
      <tr ${isLeak ? 'class="badge-leak"' : ''}>
        <td class="text-center">${formatDate(tx.date, 'short')}</td>
        <td>${escapeHtml(tx.bankName)}</td>
        <td>${escapeHtml(tx.concept)}</td>
        <td class="text-center">${escapeHtml(tx.type)}</td>
        <td>${isLeak ? escapeHtml(tx.leakReason || 'Fuga evitable') : '—'}</td>
        <td class="num-currency ${isInc ? 'text-income' : 'text-expense'}">
          ${isInc ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
        </td>
      </tr>
`;
  }

  html += `
    </tbody>
  </table>

  <!-- NOTA AL PIE -->
  <table>
    <tr>
      <td colspan="6" style="font-size: 9pt; color: #64748b; font-style: italic; border: none;">
        Documento generado automáticamente por Trujillo AI Savings & Runway Familiar. Todos los cálculos se han efectuado en memoria RAM local sin transmisión de datos a servidores externos.
      </td>
    </tr>
  </table>

</body>
</html>
`;

  // Descargar archivo vía Blob
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Auditoria_Ahorro_Familiar_${dateFormatted}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lanza la orden de impresión nativa del navegador para guardar en PDF o imprimir
 */
export function triggerPrintReport(): void {
  window.print();
}
