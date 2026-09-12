/**
 * Formateadores de moneda, fecha y números para entorno bancario español
 */

const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const euroNoCentsFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

/**
 * Formatea un valor numérico a moneda Euro (€)
 */
export function formatCurrency(
  amount: number | undefined | null,
  options: { showSign?: boolean; hideCents?: boolean } = {}
): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const formatter = options.hideCents ? euroNoCentsFormatter : euroFormatter;
  const formatted = formatter.format(Math.abs(val));

  if (val < 0) {
    return `-${formatted}`;
  }
  if (options.showSign && val > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) al formato legible en castellano
 */
export function formatDate(
  dateStr: string | undefined | null,
  format: 'short' | 'medium' | 'full' = 'short'
): string {
  if (!dateStr) return '—';
  try {
    const parts = dateStr.slice(0, 10).split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);

      if (format === 'short') {
        // 15/10/2024
        return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
      } else if (format === 'medium') {
        // 15 oct 2024
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      } else {
        // 15 de octubre de 2024
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    }
  } catch (e) {
    // Fallback simple
  }
  return dateStr;
}

/**
 * Formato amigable de tiempo de colchón financiero (Runway)
 */
export function formatRunwayStatus(
  months: number,
  isSurplus: boolean
): {
  headline: string;
  badge: string;
  badgeClass: 'badge-success' | 'badge-warning' | 'badge-danger' | 'badge-neutral';
  explanation: string;
} {
  if (isSurplus || !isFinite(months)) {
    return {
      headline: 'Superávit Financiero',
      badge: 'Capacidad de Ahorro Activa',
      badgeClass: 'badge-success',
      explanation: 'Tus ingresos mensuales superan a los gastos. Tu colchón de seguridad no se consume y genera margen de inversión continua.'
    };
  }

  if (months <= 0) {
    return {
      headline: 'Sin Colchón Disponible',
      badge: '0 meses',
      badgeClass: 'badge-danger',
      explanation: 'El balance de liquidez actual está agotado o no cubre los gastos del periodo actual.'
    };
  }

  const years = months / 12;

  if (months < 6) {
    return {
      headline: `${months.toFixed(1)} meses de colchón`,
      badge: 'Alerta: Margen Crítico (< 6 meses)',
      badgeClass: 'badge-danger',
      explanation: `Con el ritmo de gasto neto actual, los fondos disponibles durarán aproximadamente ${months.toFixed(1)} meses (${(months * 30.4).toFixed(0)} días).`
    };
  }

  if (months < 18) {
    return {
      headline: `${months.toFixed(1)} meses (${years.toFixed(1)} años)`,
      badge: 'Margen Moderado (6-18 meses)',
      badgeClass: 'badge-warning',
      explanation: `Tu colchón cubre ${months.toFixed(1)} meses de gastos netos. Se recomienda optimizar fugas para extenderlo a más de 2 años.`
    };
  }

  return {
    headline: `${months.toFixed(1)} meses (${years.toFixed(1)} años)`,
    badge: 'Excelente Colchón (> 18 meses)',
    badgeClass: 'badge-success',
    explanation: `Dispones de una holgura financiera sólida de ${years.toFixed(1)} años de supervivencia sin nuevos ingresos.`
  };
}

/**
 * Formateo general de números con separadores españoles
 */
export function formatNumber(val: number): string {
  return numberFormatter.format(val);
}
