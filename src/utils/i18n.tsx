import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageId = 'es' | 'en' | 'ca';

export interface LanguageMeta {
  id: LanguageId;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'ca', name: 'Català', flag: '🇦🇩' }
];

export const TRANSLATIONS: Record<LanguageId, Record<string, string>> = {
  es: {
    // Topbar & Header
    'header.brand': 'Savings & Runway Familiar',
    'header.badge': 'Auditoría Privada',
    'header.privacy': '100% Volátil en RAM • Zero-Knowledge',
    'header.privacy_title': 'Tus extractos se procesan únicamente en la memoria RAM de tu navegador. Ningún dato viaja a la red.',
    'header.back_labs': 'ATM Labs',
    'header.guides': 'Guías',
    'header.reset': 'Reiniciar',
    'header.reset_title': 'Borrar todos los datos y reiniciar la auditoría',
    'header.reset_confirm': '¿Seguro que deseas reiniciar y borrar todos los extractos cargados en memoria?',
    'header.theme': 'Tema',
    'header.font_size': 'Tamaño de letra',
    'header.font_normal': 'Texto Normal (A)',
    'header.font_large': 'Texto Grande (A+)',
    'header.font_xlarge': 'Texto Muy Grande (A++)',

    // Paso 1: Liquidez
    'step1.badge': 'Paso 1',
    'step1.title': 'Colchón de Liquidez Global Familiar',
    'step1.desc': 'Indica el dinero líquido disponible hoy en tu familia (cuentas corrientes, libretas de ahorro, cuentas remuneradas, depósitos o fondos monetarios) del que puedes disponer sin penalización en caso de emergencia.',
    'step1.input_label': 'Importe de liquidez en euros',
    'step1.active_preview': 'Importe activo:',
    'step1.presets_label': 'Accesos directos:',
    'step1.stepper_minus': 'Restar 1.000 €',
    'step1.stepper_plus': 'Añadir 1.000 €',

    // Paso 2: Dropzone & Carga
    'step2.badge': 'Paso 2',
    'step2.title': 'Carga de Extractos Bancarios (CSV o Excel)',
    'step2.desc': 'Arrastra o selecciona uno o varios extractos descargados de tu banca online. Soporta todos los bancos españoles (CaixaBank, Santander, BBVA, Sabadell, Bankinter, ING, MyInvestor, Openbank, Abanca, Unicaja, Revolut, N26, Trade Republic, etc.).',
    'step2.drop_prompt': 'Arrastra aquí tus extractos bancarios o',
    'step2.select_files': 'selecciona archivos desde tu equipo',
    'step2.support_info': 'Formatos CSV y texto exportados de banca online. Multi-entidad automática.',
    'step2.processing': 'Analizando extractos en memoria volátil...',
    'step2.demo_btn': 'Cargar datos de ejemplo',
    'step2.demo_sub': 'Prueba el análisis al instante con extractos de muestra sin subir tus archivos.',
    'step2.loaded_title': 'Extractos Bancarios Consolidados',
    'step2.movements': 'movimientos',
    'step2.period': 'Periodo:',
    'step2.remove_file': 'Quitar extracto',
    'step2.err_empty': 'El archivo {name} parece estar vacío o no contiene transacciones válidas.',
    'step2.err_read': 'No se pudo leer el archivo {name}. Asegúrate de que no esté protegido con contraseña.',
    'step2.warn_duplicate': 'El extracto {name} se ha actualizado correctamente.',

    // Métricas de Runway
    'runway.title': 'Salud Financiera y Colchón de Supervivencia (Runway)',
    'runway.subtitle': 'Basado en {months} meses de actividad bancaria consolidada.',
    'runway.hero_label': 'Tiempo Estimado de Cobertura',
    'runway.surplus': 'Superávit Activo',
    'runway.exhausted': 'Agotado',
    'runway.months': 'meses',
    'runway.years': 'años',
    'runway.stat_surplus': 'Capacidad de Ahorro Mensual',
    'runway.stat_burn': 'Quema Mensual Neta (Burn Rate)',
    'runway.note_surplus': 'Margen disponible para invertir o incrementar patrimonio',
    'runway.note_burn': 'Déficit mensual cubierto por tu colchón de liquidez',
    'runway.kpi_liquidity': 'Colchón Líquido',
    'runway.kpi_liquidity_sub': 'Fondos de disponibilidad inmediata',
    'runway.kpi_income': 'Ingresos Mensuales',
    'runway.kpi_income_sub': 'Nóminas, pensiones y rentas periódicas',
    'runway.kpi_expenses': 'Gastos Mensuales',
    'runway.kpi_expenses_sub': 'Consumo ordinario, suministros y compras',
    'runway.kpi_leaks': 'Fugas Evitables Detectadas',
    'runway.kpi_leaks_sub': 'Suscripciones y gastos sedentarios prescindibles',

    // Status / Semáforo Runway
    'status.surplus_title': 'Superávit Financiero',
    'status.surplus_badge': 'Capacidad de Ahorro Activa',
    'status.surplus_exp': 'Tus ingresos mensuales superan a los gastos. Tu colchón de seguridad no se consume y genera margen de ahorro continuo.',
    'status.exhausted_title': 'Sin Colchón Disponible',
    'status.exhausted_badge': '0 meses',
    'status.exhausted_exp': 'El balance de liquidez actual está agotado o no cubre los gastos del periodo actual.',
    'status.critical_badge': 'Alerta: Margen Crítico (< 6 meses)',
    'status.critical_exp': 'Con el ritmo de gasto neto actual, los fondos disponibles durarán aproximadamente {months} meses ({days} días). Se aconseja reducir gastos inmediatos.',
    'status.moderate_badge': 'Margen Moderado (6-18 meses)',
    'status.moderate_exp': 'Tu colchón cubre {months} meses de gastos netos. Estás protegido frente a imprevistos normales, pero optimizar fugas dará mayor tranquilidad.',
    'status.solid_badge': 'Excelente Colchón (> 18 meses)',
    'status.solid_exp': 'Dispones de una holgura financiera sólida de {years} años de tranquilidad y supervivencia sin nuevos ingresos.',

    // Desglose por categorías y Tasa de Ahorro
    'cat.section_title': 'Desglose Visual de Gastos y Tasa de Ahorro Familiar',
    'cat.section_desc': 'Distribución automática de tus salidas de dinero para entender en qué partidas se concentran los recursos del hogar.',
    'cat.savings_rate_title': 'Tasa de Ahorro Familiar Mensual',
    'cat.savings_rate_sub': 'Porcentaje de tus ingresos netos que logras retener cada mes.',
    'cat.rate_excellent': 'Excelente (Ahorro > 20%)',
    'cat.rate_healthy': 'Saludable (Ahorro 10% - 20%)',
    'cat.rate_tight': 'Ajustado (Ahorro 0% - 10%)',
    'cat.rate_deficit': 'En Déficit (Gasto supera ingreso)',
    'cat.rate_desc_excellent': '¡Enhorabuena! Retienes una proporción muy alta de tus ingresos, blindando el patrimonio familiar.',
    'cat.rate_desc_healthy': 'Buen equilibrio. Mantienes un colchón creciente mes a mes para imprevistos e inversión.',
    'cat.rate_desc_tight': 'Llegas a fin de mes, pero cualquier imprevisto (avería, salud) podría comprometer tus ahorros.',
    'cat.rate_desc_deficit': 'Atención: Estás consumiendo parte de tus reservas para sostener los gastos ordinarios.',

    // Objetivo de Colchón (Simulator)
    'target.title': 'Objetivo del "Colchón de Tranquilidad"',
    'target.desc': 'El estándar de oro de la economía familiar recomienda tener entre 6 y 12 meses de gastos esenciales en liquidez inmediata.',
    'target.choice_6': '6 Meses (Básico)',
    'target.choice_12': '12 Meses (Recomendado)',
    'target.choice_24': '24 Meses (Máxima Paz)',
    'target.needed_label': 'Capital necesario para {months} meses:',
    'target.current_label': 'Colchón actual:',
    'target.achieved': '¡Meta Cumplida! Tienes un colchón óptimo de tranquilidad.',
    'target.missing': 'Te faltan {amount} para alcanzar tu objetivo de {months} meses de tranquilidad.',
    'target.progress': 'Progreso de cobertura:',

    // Categorías
    'cat.housing': 'Vivienda, Hipoteca y Alquiler',
    'cat.supermarket': 'Alimentación y Supermercado',
    'cat.utilities': 'Suministros (Luz, Agua, Gas, Internet)',
    'cat.health_insurance': 'Salud, Seguros y Farmacia',
    'cat.transport': 'Transporte, Combustible y Viajes',
    'cat.leaks': 'Fugas y Suscripciones Detectadas',
    'cat.leisure': 'Ocio, Restauración y Compras',
    'cat.income': 'Nóminas y Rentas Ingresadas',
    'cat.other': 'Otros Gastos y Varios',

    // Coste de Oportunidad
    'opp.tag': 'Palanca de Ahorro e Interés Compuesto',
    'opp.title': 'Coste de Oportunidad al 7% Anual',
    'opp.rate_pill': 'Rentabilidad de Referencia: 7% Anual Compuesto',
    'opp.desc': 'El dinero que se filtra en pequeñas cuotas sedentarias o suscripciones olvidadas tiene un coste oculto enorme: el capital que deja de producir al reinvertirse en un índice global diversificado.',
    'opp.slider_label': 'Simula redirigir este ahorro mensual hacia un fondo indexado:',
    'opp.presets_caption': 'Atajos rápidos:',
    'opp.detected_leaks_btn': 'Fugas detectadas ({amount})',
    'opp.horizon_10': 'Horizonte 10 Años',
    'opp.horizon_15': 'Horizonte 15 Años',
    'opp.future_capital': 'Capital Acumulado Estimado',
    'opp.contributed': 'Capital Aportado de tu Bolsillo:',
    'opp.interest_earned': 'Intereses Ganados por el Mercado:',
    'opp.compound_badge': '+{pct}% de Rendimiento Generado',
    'opp.explanation_10': 'Si eliminas estas fugas e inviertes {amount}/mes en un fondo indexado global al 7% anual, dentro de 10 años dispondrás de {future} (habiendo aportado únicamente {contributed}).',
    'opp.explanation_15': 'Gracias al poder del interés compuesto exponencial, en 15 años tu dinero se multiplicará hasta alcanzar {future}, generando {interest} en intereses pasivos sin esfuerzo adicional.',

    // Top 8 Gastos
    'top.badge': 'Auditoría de Impacto',
    'top.title': 'Top 8 Mayores Salidas y Recibos',
    'top.subtitle': 'Los pagos de mayor volumen registrados en tus extractos bancarios.',

    // Tabla de Movimientos
    'table.title': 'Extracto Consolidado de Movimientos',
    'table.subtitle': 'Mostrando {filtered} de {total} transacciones auditadas.',
    'table.search_placeholder': 'Buscar concepto, comercio o banco...',
    'table.all_banks': 'Todas las entidades ({count})',
    'table.tab_all': 'Todos ({count})',
    'table.tab_expenses': 'Gastos',
    'table.tab_income': 'Ingresos',
    'table.tab_leaks': 'Fugas Detectadas',
    'table.empty': 'No se encontraron movimientos con los filtros seleccionados.',
    'table.th_date': 'Fecha',
    'table.th_bank': 'Entidad',
    'table.th_concept': 'Concepto / Descripción',
    'table.th_category': 'Categoría / Alerta',
    'table.th_amount': 'Importe',
    'table.page_prev': '← Anterior',
    'table.page_next': 'Siguiente →',
    'table.page_of': 'Página {current} de {total}',

    // Exportación a Excel y PDF
    'export.excel_btn': 'Exportar Excel Formateado (.xls)',
    'export.excel_tooltip': 'Descarga una hoja de cálculo con formato visual, colores, totales y fórmulas',
    'export.print_btn': 'Imprimir / Guardar en PDF',
    'export.print_tooltip': 'Abre la vista de impresión optimizada para guardar en PDF o imprimir en papel',
    'export.generating': 'Generando documento...',

    // Estrategia y Consejos Personalizados
    'tips.section_title': 'Estrategia Financiera Personalizada y Consejos a Medida',
    'tips.section_desc': 'Recomendaciones inteligentes generadas en tiempo real a partir del análisis exclusivo de tus extractos y hábitos de gasto.',
    'tips.badge_timing': 'Planificación y Tesorería',
    'tips.timing_title': 'Desconcentra gastos grandes: Paga trimestral o semestralmente',
    'tips.timing_desc': 'Hemos detectado {count} recibos de gran importe ({names}) que concentran {amount} en poco tiempo. Contacta con tus aseguradoras y compañías para fraccionar el pago (IBI, seguro de coche, seguro de hogar, revisiones) de forma semestral o trimestral. Evitarás caídas bruscas de liquidez en un solo mes y ganarás margen de maniobra ante imprevistos.',
    'tips.badge_urgency': 'Alerta de Seguridad',
    'tips.critical_title': 'Prioridad #1: Construir el Muro de 6 Meses ({months} meses actuales)',
    'tips.critical_desc': 'Con un gasto mensual de {monthlyExpenses}, tu colchón actual te protege durante {months} meses. Recomendamos acumular {needed} adicionales antes de comprometer fondos en compras no esenciales.',
    'tips.badge_optim': 'Optimización de Capital',
    'tips.oversized_title': 'Excedente de Seguridad: Tu colchón cubre {years} años',
    'tips.oversized_desc': 'Dispones de {months} meses de cobertura ({years} años). Mantener más de 12-18 meses de liquidez en una cuenta corriente al 0% sufre la erosión de la inflación. Considera mover el excedente de {excess} hacia cuentas remuneradas o fondos indexados globales.',
    'tips.badge_leaks': 'Poda Directa de Fugas',
    'tips.leaks_title': 'Ahorro Inmediato: Recupera {yearly} al año',
    'tips.leaks_desc': 'Detectamos {count} cobros de suscripciones y cuotas recurrentes ({names}) por un total de {monthly}/mes. Cancelar las que no uses liberará {yearly} al año en tu bolsillo sin esfuerzo.',
    'tips.badge_budget': 'Vivienda y Esfuerzo',
    'tips.housing_title': 'Ratio de Vivienda al {pct}% de tus Ingresos',
    'tips.housing_desc': 'Tus costes fijos de vivienda suman {amount}/mes ({pct}% de ingresos). Los economistas recomiendan mantener este ratio por debajo del 30-35% para tener estabilidad financiera.',
    'tips.badge_habit': 'Hábito Familiar',
    'tips.pay_first_title': 'Automatiza: Págate a ti primero el día 1 de cada mes',
    'tips.pay_first_desc': 'Programa una transferencia automática de {amount}/mes hacia una hucha o libreta separada el mismo día que entra tu nómina o pensión. Si ahorras al principio en vez de esperar a final de mes, el ahorro se consolida automáticamente.',
    'tips.badge_method': 'Filtro Emocional',
    'tips.rule_72_title': 'Regla de las 72 Horas para Gastos No Esenciales',
    'tips.rule_72_desc': 'Para cualquier capricho o gasto superior a 100 €, espera 3 días antes de comprar. Más del 70% de las compras por impulso se descartan transcurrido ese tiempo de enfriamiento.',

    // Footer
    'footer.privacy': 'Privacidad Absoluta: Ningún dato bancario viaja a servidores ni se guarda en cookies ni almacenamiento local.',
    'footer.disclaimer': 'Esta herramienta es un simulador matemático privado y local para asistencia y orden financiero familiar. No constituye asesoramiento financiero regulado ni recomendaciones personalizadas de inversión.',
    'footer.copyright': '© {year} Trujillo AI • Ecosistema de Ingeniería y Guías Técnicas'
  },

  en: {
    // Topbar & Header
    'header.brand': 'Family Savings & Runway',
    'header.badge': 'Private Audit',
    'header.privacy': '100% Volatile in RAM • Zero-Knowledge',
    'header.privacy_title': 'Your bank statements are processed strictly in your browser RAM. No financial data ever leaves your device.',
    'header.back_labs': 'ATM Labs',
    'header.guides': 'Guides',
    'header.reset': 'Reset',
    'header.reset_title': 'Clear all data and restart audit',
    'header.reset_confirm': 'Are you sure you want to reset and clear all statements loaded in memory?',
    'header.theme': 'Theme',
    'header.font_size': 'Font size',
    'header.font_normal': 'Normal Text (A)',
    'header.font_large': 'Large Text (A+)',
    'header.font_xlarge': 'Extra Large Text (A++)',

    // Step 1: Liquidity
    'step1.badge': 'Step 1',
    'step1.title': 'Family Global Liquid Cushion',
    'step1.desc': 'Enter total liquid funds available across all accounts (checking, savings, high-yield accounts, emergency deposits, or money market funds) accessible immediately without penalties.',
    'step1.input_label': 'Liquidity amount in euros',
    'step1.active_preview': 'Active amount:',
    'step1.presets_label': 'Quick presets:',
    'step1.stepper_minus': 'Subtract 1,000 €',
    'step1.stepper_plus': 'Add 1,000 €',

    // Step 2: Dropzone & Upload
    'step2.badge': 'Step 2',
    'step2.title': 'Upload Bank Statements (CSV or Excel)',
    'step2.desc': 'Drag & drop or browse bank statements exported from your online banking. Supports Spanish & international banks (CaixaBank, Santander, BBVA, Sabadell, Bankinter, ING, MyInvestor, Openbank, Revolut, N26, Trade Republic, etc.).',
    'step2.drop_prompt': 'Drag & drop your bank statements here or',
    'step2.select_files': 'browse files on your device',
    'step2.support_info': 'CSV and text formats exported from online banking. Automatic multi-bank parsing.',
    'step2.processing': 'Analyzing statements in volatile RAM memory...',
    'step2.demo_btn': 'Load Demo Sample Data',
    'step2.demo_sub': 'Try the audit instantly with realistic sample data without uploading your personal files.',
    'step2.loaded_title': 'Consolidated Bank Statements',
    'step2.movements': 'transactions',
    'step2.period': 'Date range:',
    'step2.remove_file': 'Remove statement',
    'step2.err_empty': 'File {name} appears empty or contains no valid transactions.',
    'step2.err_read': 'Could not read file {name}. Please make sure it is not password-protected.',
    'step2.warn_duplicate': 'Statement {name} was successfully updated.',

    // Runway Metrics
    'runway.title': 'Financial Health & Survival Runway Cushion',
    'runway.subtitle': 'Based on {months} months of consolidated bank activity.',
    'runway.hero_label': 'Estimated Coverage Time',
    'runway.surplus': 'Active Surplus',
    'runway.exhausted': 'Exhausted',
    'runway.months': 'months',
    'runway.years': 'years',
    'runway.stat_surplus': 'Monthly Net Savings Capacity',
    'runway.stat_burn': 'Net Monthly Burn Rate',
    'runway.note_surplus': 'Margin available to invest or grow family net worth',
    'runway.note_burn': 'Monthly deficit covered by your liquid savings cushion',
    'runway.kpi_liquidity': 'Liquid Cushion',
    'runway.kpi_liquidity_sub': 'Immediately available emergency funds',
    'runway.kpi_income': 'Monthly Incomes',
    'runway.kpi_income_sub': 'Salaries, pensions, and periodic revenues',
    'runway.kpi_expenses': 'Monthly Expenses',
    'runway.kpi_expenses_sub': 'Living costs, bills, groceries and purchases',
    'runway.kpi_leaks': 'Detected Avoidable Leaks',
    'runway.kpi_leaks_sub': 'Forgotten subscriptions and sedentary fees',

    // Runway Status
    'status.surplus_title': 'Financial Surplus',
    'status.surplus_badge': 'Active Savings Capacity',
    'status.surplus_exp': 'Monthly income exceeds expenses. Your emergency cushion is not depleted and provides ongoing investing capability.',
    'status.exhausted_title': 'No Cushion Available',
    'status.exhausted_badge': '0 months',
    'status.exhausted_exp': 'Current liquidity balance is exhausted or does not cover current expenses.',
    'status.critical_badge': 'Alert: Critical Margin (< 6 months)',
    'status.critical_exp': 'At the current net spend rate, funds will last approximately {months} months ({days} days). Cutting non-essential spend is recommended.',
    'status.moderate_badge': 'Moderate Margin (6-18 months)',
    'status.moderate_exp': 'Your cushion covers {months} months of net spending. You are safeguarded against standard emergencies, but optimizing leaks will offer greater peace of mind.',
    'status.solid_badge': 'Solid Cushion (> 18 months)',
    'status.solid_exp': 'You have a solid financial runway of {years} years of peace of mind and survival without new income.',

    // Categories & Savings Rate
    'cat.section_title': 'Visual Expense Breakdown & Family Savings Rate',
    'cat.section_desc': 'Automatic categorization of money outflows to understand where household resources are allocated.',
    'cat.savings_rate_title': 'Monthly Family Savings Rate',
    'cat.savings_rate_sub': 'Percentage of your net income retained each month.',
    'cat.rate_excellent': 'Excellent (Savings > 20%)',
    'cat.rate_healthy': 'Healthy (Savings 10% - 20%)',
    'cat.rate_tight': 'Tight (Savings 0% - 10%)',
    'cat.rate_deficit': 'In Deficit (Spending exceeds income)',
    'cat.rate_desc_excellent': 'Congratulations! You retain a high portion of your earnings, strongly building family wealth.',
    'cat.rate_desc_healthy': 'Good balance. You maintain a growing cushion month by month for emergencies and investment.',
    'cat.rate_desc_tight': 'Breaking even, but unforeseen expenses (repairs, health) could deplete emergency savings.',
    'cat.rate_desc_deficit': 'Caution: You are tapping into your cash reserves to cover regular monthly expenses.',

    // Target Peace of Mind Simulator
    'target.title': 'Peace of Mind Runway Target',
    'target.desc': 'The family financial gold standard recommends keeping between 6 and 12 months of essential living expenses in liquid reserves.',
    'target.choice_6': '6 Months (Basic)',
    'target.choice_12': '12 Months (Recommended)',
    'target.choice_24': '24 Months (Maximum Peace of Mind)',
    'target.needed_label': 'Target capital for {months} months:',
    'target.current_label': 'Current cushion:',
    'target.achieved': 'Goal Achieved! You have an optimal peace of mind cushion.',
    'target.missing': 'You need {amount} more to achieve your {months}-month peace of mind goal.',
    'target.progress': 'Coverage progress:',

    // Categories
    'cat.housing': 'Housing, Mortgage & Rent',
    'cat.supermarket': 'Groceries & Supermarket',
    'cat.utilities': 'Utilities (Electricity, Water, Gas, Internet)',
    'cat.health_insurance': 'Health, Insurance & Pharmacy',
    'cat.transport': 'Transport, Fuel & Travel',
    'cat.leaks': 'Detected Leaks & Subscriptions',
    'cat.leisure': 'Leisure, Dining & Shopping',
    'cat.income': 'Salaries, Pensions & Revenues',
    'cat.other': 'Other Expenses & Miscellaneous',

    // Opportunity Cost
    'opp.tag': 'Savings Leverage & Compound Growth',
    'opp.title': 'Opportunity Cost at 7% Annual Return',
    'opp.rate_pill': 'Benchmark Return: 7% Compound Annual Rate',
    'opp.desc': 'Money leaking into small forgotten subscriptions carries a massive hidden cost: the wealth it fails to generate when reinvested into a globally diversified index fund.',
    'opp.slider_label': 'Simulate redirecting this monthly saving into an index fund:',
    'opp.presets_caption': 'Quick presets:',
    'opp.detected_leaks_btn': 'Detected leaks ({amount})',
    'opp.horizon_10': '10-Year Horizon',
    'opp.horizon_15': '15-Year Horizon',
    'opp.future_capital': 'Estimated Accumulated Capital',
    'opp.contributed': 'Capital Contributed by You:',
    'opp.interest_earned': 'Market Interest Earned:',
    'opp.compound_badge': '+{pct}% Total Return Generated',
    'opp.explanation_10': 'By eliminating these leaks and investing {amount}/month into a 7% global index fund, in 10 years you will accumulate {future} (having contributed only {contributed}).',
    'opp.explanation_15': 'Powered by exponential compound growth, in 15 years your money will grow to {future}, generating {interest} in pure passive market returns.',

    // Top 8 Expenses
    'top.badge': 'Impact Audit',
    'top.title': 'Top 8 Largest Outflows & Bills',
    'top.subtitle': 'The largest individual payments recorded across your bank statements.',

    // Transactions Table
    'table.title': 'Consolidated Statement of Transactions',
    'table.subtitle': 'Displaying {filtered} of {total} audited transactions.',
    'table.search_placeholder': 'Search concept, merchant or bank...',
    'table.all_banks': 'All banks ({count})',
    'table.tab_all': 'All ({count})',
    'table.tab_expenses': 'Expenses',
    'table.tab_income': 'Incomes',
    'table.tab_leaks': 'Detected Leaks',
    'table.empty': 'No transactions match the selected filters.',
    'table.th_date': 'Date',
    'table.th_bank': 'Bank',
    'table.th_concept': 'Concept / Description',
    'table.th_category': 'Category / Alert',
    'table.th_amount': 'Amount',
    'table.page_prev': '← Previous',
    'table.page_next': 'Next →',
    'table.page_of': 'Page {current} of {total}',

    // Excel & Print Export
    'export.excel_btn': 'Export Formatted Excel (.xls)',
    'export.excel_tooltip': 'Download a visually styled spreadsheet with colors, totals and summary tables',
    'export.print_btn': 'Print / Save as PDF',
    'export.print_tooltip': 'Open print-optimized view to print on paper or save as clean PDF',
    'export.generating': 'Generating document...',

    // Personalized Strategy & Tips
    'tips.section_title': 'Personalized Financial Strategy & Actionable Tips',
    'tips.section_desc': 'Smart recommendations dynamically generated from real-time analysis of your statements and spending patterns.',
    'tips.badge_timing': 'Cash Flow & Timing',
    'tips.timing_title': 'Stagger large expenses: Pay quarterly or semi-annually',
    'tips.timing_desc': 'We detected {count} large outflows ({names}) concentrating {amount} within a short window. Contact your insurers and providers to split large annual bills (home/car insurance, property taxes, vehicle inspection) into quarterly or semi-annual payments. This prevents steep cash-flow shocks in a single month and grants 2-3 months of extra buffer for unforeseen events.',
    'tips.badge_urgency': 'Security Alert',
    'tips.critical_title': 'Priority #1: Build the 6-Month Safety Wall ({months} months currently)',
    'tips.critical_desc': 'With monthly expenses of {monthlyExpenses}, your current cushion protects you for {months} months. We advise saving an extra {needed} before committing funds to non-essential purchases.',
    'tips.badge_optim': 'Capital Optimization',
    'tips.oversized_title': 'Security Surplus: Your cushion covers {years} years',
    'tips.oversized_desc': 'You have {months} months of coverage ({years} years). Keeping more than 12-18 months of liquidity in a 0% checking account suffers from inflation drag. Consider shifting the surplus of {excess} into high-yield savings or diversified global index funds.',
    'tips.badge_leaks': 'Direct Leak Trimming',
    'tips.leaks_title': 'Instant Savings: Recover {yearly} per year',
    'tips.leaks_desc': 'We found {count} recurring subscription charges ({names}) totaling {monthly}/month. Cancelling inactive services will free up {yearly}/year in your pocket with zero lifestyle friction.',
    'tips.badge_budget': 'Housing Effort Ratio',
    'tips.housing_title': 'Housing Cost Ratio at {pct}% of Income',
    'tips.housing_desc': 'Fixed housing costs total {amount}/month ({pct}% of income). Financial standards advise keeping this ratio below 30-35% to protect monthly flexibility.',
    'tips.badge_habit': 'Household Habit',
    'tips.pay_first_title': 'Automate: Pay yourself first on Day 1 of each month',
    'tips.pay_first_desc': 'Set up an automatic monthly transfer of {amount} to a separate vault on the exact day your salary or pension arrives. Saving upfront rather than waiting for month-end consolidates savings automatically.',
    'tips.badge_method': 'Emotional Filter',
    'tips.rule_72_title': 'The 72-Hour Rule for Non-Essential Purchases',
    'tips.rule_72_desc': 'For any discretionary purchase over 100 €, wait 3 days before buying. Over 70% of impulse buys are discarded once this mental cooling-off period passes.',

    // Footer
    'footer.privacy': 'Absolute Privacy: No banking data travels to servers or is stored in cookies or local storage.',
    'footer.disclaimer': 'This tool is a private, local mathematical simulator for family financial assistance. It does not constitute regulated financial advice.',
    'footer.copyright': '© {year} Trujillo AI • Engineering Ecosystem & Technical Guides'
  },

  ca: {
    // Topbar & Header
    'header.brand': 'Savings & Runway Familiar',
    'header.badge': 'Auditoria Privada',
    'header.privacy': '100% Volàtil en RAM • Zero-Knowledge',
    'header.privacy_title': 'Els teus extractes es processen únicament a la memòria RAM del teu navegador. Cap dada no viatja a la xarxa.',
    'header.back_labs': 'ATM Labs',
    'header.guides': 'Guies',
    'header.reset': 'Reiniciar',
    'header.reset_title': 'Esborrar totes les dades i reiniciar l’auditoria',
    'header.reset_confirm': 'Segur que vols reiniciar i esborrar tots els extractes carregats a la memòria?',
    'header.theme': 'Tema',
    'header.font_size': 'Mida de lletra',
    'header.font_normal': 'Text Normal (A)',
    'header.font_large': 'Text Gran (A+)',
    'header.font_xlarge': 'Text Molt Gran (A++)',

    // Pas 1: Liquiditat
    'step1.badge': 'Pas 1',
    'step1.title': 'Matalàs de Liquiditat Global Familiar',
    'step1.desc': 'Indica el capital líquid disponible avui a la teva família (comptes corrents, llibretes, comptes remunerats o fons monetaris) disponible sense penalització en cas d’imprevist.',
    'step1.input_label': 'Import de liquiditat en euros',
    'step1.active_preview': 'Import actiu:',
    'step1.presets_label': 'Dreceres ràpides:',
    'step1.stepper_minus': 'Restar 1.000 €',
    'step1.stepper_plus': 'Afegir 1.000 €',

    // Pas 2: Dropzone & Càrrega
    'step2.badge': 'Pas 2',
    'step2.title': 'Càrrega d’Extractes Bancaris (CSV o Excel)',
    'step2.desc': 'Arrossega o selecciona un o diversos extractos descarregats de la teva banca en línia. Suporta CaixaBank, Santander, BBVA, Sabadell, Bankinter, ING, MyInvestor, Openbank, Revolut, etc.',
    'step2.drop_prompt': 'Arrossega aquí els teus extractes bancaris o',
    'step2.select_files': 'selecciona fitxers des del teu dispositiu',
    'step2.support_info': 'Formats CSV i text de banca online. Multi-entitat automàtica.',
    'step2.processing': 'Analitzant extractes a la memòria volàtil...',
    'step2.demo_btn': 'Carregar dades d’exemple',
    'step2.demo_sub': 'Prova l’auditoria a l’instant amb extractes de mostra sense pujar fitxers personals.',
    'step2.loaded_title': 'Extractes Bancaris Consolidats',
    'step2.movements': 'moviments',
    'step2.period': 'Període:',
    'step2.remove_file': 'Treure extracte',
    'step2.err_empty': 'El fitxer {name} sembla buit o no conté transaccions vàlides.',
    'step2.err_read': 'No s’ha pogut llegir el fitxer {name}. Assegura’t que no té contrasenya.',
    'step2.warn_duplicate': 'L’extracte {name} s’ha actualitzat correctament.',

    // Mètriques de Runway
    'runway.title': 'Salut Financera i Matalàs de Supervivència (Runway)',
    'runway.subtitle': 'Basat en {months} mesos d’activitat bancària consolidada.',
    'runway.hero_label': 'Temps Estimat de Cobertura',
    'runway.surplus': 'Superàvit Actiu',
    'runway.exhausted': 'Esgotat',
    'runway.months': 'mesos',
    'runway.years': 'anys',
    'runway.stat_surplus': 'Capacitat d’Estalvi Mensual',
    'runway.stat_burn': 'Crema Mensual Neta (Burn Rate)',
    'runway.note_surplus': 'Marge disponible per a invertir o fer créixer el patrimoni familiar',
    'runway.note_burn': 'Dèficit mensual cobert pel teu matalàs de liquiditat',
    'runway.kpi_liquidity': 'Matalàs Líquid',
    'runway.kpi_liquidity_sub': 'Fons de disponibilitat immediata',
    'runway.kpi_income': 'Ingressos Mensuals',
    'runway.kpi_income_sub': 'Nòmines, pensions i rendes periòdiques',
    'runway.kpi_expenses': 'Despeses Mensuals',
    'runway.kpi_expenses_sub': 'Consum ordinari, subministraments i compres',
    'runway.kpi_leaks': 'Fugues Evitables Detectades',
    'runway.kpi_leaks_sub': 'Subscripcions i despeses sedentàries prescindibles',

    // Status / Semàfor Runway
    'status.surplus_title': 'Superàvit Financer',
    'status.surplus_badge': 'Capacitat d’Estalvi Activa',
    'status.surplus_exp': 'Els teus ingressos mensuals superen les despeses. El teu matalàs de seguretat no es consumeix.',
    'status.exhausted_title': 'Sense Matalàs Disponible',
    'status.exhausted_badge': '0 mesos',
    'status.exhausted_exp': 'El balanç de liquiditat actual està esgotat o no cobreix les despeses del període.',
    'status.critical_badge': 'Alerta: Marge Crític (< 6 mesos)',
    'status.critical_exp': 'Amb el ritme de despesa actual, els fons duraran aproximadament {months} mesos ({days} dies).',
    'status.moderate_badge': 'Marge Moderat (6-18 mesos)',
    'status.moderate_exp': 'El teu matalàs cobreix {months} mesos de despeses netes. Estàs protegit davant imprevistos ordinaris.',
    'status.solid_badge': 'Excel·lent Matalàs (> 18 mesos)',
    'status.solid_exp': 'Tens una folgança financera sòlida de {years} anys de tranquil·litat i supervivència.',

    // Categories i Taxa d'Estalvi
    'cat.section_title': 'Desglossament Visual de Despeses i Taxa d’Estalvi Familiar',
    'cat.section_desc': 'Distribució automàtica de les sortides de diners per a comprendre les partides de la llar.',
    'cat.savings_rate_title': 'Taxa d’Estalvi Familiar Mensual',
    'cat.savings_rate_sub': 'Percentatge dels teus ingressos nets que aconsegueixes retenir cada mes.',
    'cat.rate_excellent': 'Excel·lent (Estalvi > 20%)',
    'cat.rate_healthy': 'Saludable (Estalvi 10% - 20%)',
    'cat.rate_tight': 'Ajustat (Estalvi 0% - 10%)',
    'cat.rate_deficit': 'En Dèficit (Despeses superen ingressos)',
    'cat.rate_desc_excellent': 'Enhorabona! Retens una proporció molt alta d’ingressos, blindant el patrimoni familiar.',
    'cat.rate_desc_healthy': 'Bon equilibri. Mantens un matalàs creixent mes a mes per a imprevistos i inversió.',
    'cat.rate_desc_tight': 'Arribes a fi de mes, però qualsevol imprevist podria comprometre els teus estalvis.',
    'cat.rate_desc_deficit': 'Atenció: Estàs consumint part de les teves reserves per a cobrir despeses ordinàries.',

    // Objectiu de Matalàs
    'target.title': 'Objectiu del "Matalàs de Tranquil·litat"',
    'target.desc': 'L’estàndard d’or de l’economia familiar recomana tenir entre 6 i 12 mesos de despeses essencials en liquiditat immediata.',
    'target.choice_6': '6 Mesos (Bàsic)',
    'target.choice_12': '12 Mesos (Recomanat)',
    'target.choice_24': '24 Mesos (Màxima Pau)',
    'target.needed_label': 'Capital necessari per a {months} mesos:',
    'target.current_label': 'Matalàs actual:',
    'target.achieved': 'Meta Aconseguida! Tens un matalàs òptim de tranquil·litat.',
    'target.missing': 'Et falten {amount} per a assolir el teu objectiu de {months} mesos de pau mental.',
    'target.progress': 'Progrés de cobertura:',

    // Categories
    'cat.housing': 'Habitatge, Hipoteca i Lloguer',
    'cat.supermarket': 'Alimentació i Supermercat',
    'cat.utilities': 'Subministraments (Llum, Aigua, Gas, Internet)',
    'cat.health_insurance': 'Salut, Assegurances i Farmàcia',
    'cat.transport': 'Transport, Combustible i Viatges',
    'cat.leaks': 'Fugues i Subscripcions Detectades',
    'cat.leisure': 'Oci, Restauració i Compres',
    'cat.income': 'Nòmines i Rendes Ingressades',
    'cat.other': 'Altres Despeses i Diversos',

    // Cost d'Oportunitat
    'opp.tag': 'Palanca d’Estalvi i Interès Compost',
    'opp.title': 'Cost d’Oportunitat al 7% Anual',
    'opp.rate_pill': 'Rendibilitat de Referència: 7% Anual Compost',
    'opp.desc': 'Els diners que es filtren en petites quotes sedentàries tenen un cost ocult enorme si es reinverteixen en un fons indexat global diversificat.',
    'opp.slider_label': 'Simula redirigir aquest estalvi mensual cap a un fons indexat:',
    'opp.presets_caption': 'Dreceres ràpides:',
    'opp.detected_leaks_btn': 'Fugues detectades ({amount})',
    'opp.horizon_10': 'Horitzó 10 Anys',
    'opp.horizon_15': 'Horitzó 15 Anys',
    'opp.future_capital': 'Capital Acumulat Estimat',
    'opp.contributed': 'Capital Aportat de la Teva Butxaca:',
    'opp.interest_earned': 'Interessos Guanyats pel Mercat:',
    'opp.compound_badge': '+{pct}% de Rendiment Generat',
    'opp.explanation_10': 'Si elimines aquestes fugues i inverteixes {amount}/mes en un fons indexat al 7%, en 10 anys disposaràs de {future} (havent aportat només {contributed}).',
    'opp.explanation_15': 'Gràcies al poder de l’interès compost exponencial, en 15 anys els teus diners es multiplicaran fins a assolir {future}, generant {interest} en interessos passius.',

    // Top 8 Despeses
    'top.badge': 'Auditoria d’Impacte',
    'top.title': 'Top 8 Majors Sortides i Rebuts',
    'top.subtitle': 'Els pagaments de major volum registrats als teus extractes bancaris.',

    // Taula de Moviments
    'table.title': 'Extracte Consolidat de Moviments',
    'table.subtitle': 'Mostrant {filtered} de {total} transaccions auditades.',
    'table.search_placeholder': 'Cercar concepte, comerç o banc...',
    'table.all_banks': 'Totes les entitats ({count})',
    'table.tab_all': 'Tots ({count})',
    'table.tab_expenses': 'Despeses',
    'table.tab_income': 'Ingressos',
    'table.tab_leaks': 'Fugues Detectades',
    'table.empty': 'No s’han trobat moviments amb els filtres seleccionats.',
    'table.th_date': 'Data',
    'table.th_bank': 'Entitat',
    'table.th_concept': 'Concepte / Descripció',
    'table.th_category': 'Categoria / Alerta',
    'table.th_amount': 'Import',
    'table.page_prev': '← Anterior',
    'table.page_next': 'Següent →',
    'table.page_of': 'Pàgina {current} de {total}',

    // Exportació
    'export.excel_btn': 'Exportar Excel Formatejat (.xls)',
    'export.excel_tooltip': 'Descarrega un full de càlcul amb format visual, colors, totals i fórmules',
    'export.print_btn': 'Imprimir / Desar en PDF',
    'export.print_tooltip': 'Obre la vista d’impressió optimitzada per a guardar en PDF o imprimir en paper',
    'export.generating': 'Generant document...',

    // Estratègia i Consells Personalitzats
    'tips.section_title': 'Estratègia Financera Personalitzada i Consells a Mida',
    'tips.section_desc': 'Recomanacions intel·ligents generades en temps real a partir de l’anàlisi exclusiu dels teus extractes i hàbits.',
    'tips.badge_timing': 'Planificació i Tresoreria',
    'tips.timing_title': 'Desconcentra despeses grans: Paga trimestral o semestralment',
    'tips.timing_desc': 'Hem detectat {count} rebuts de gran import ({names}) que concentren {amount} en poc temps. Contacta amb les teves asseguradores i companyies per fraccionar el pagament (IBI, assegurança de cotxe, llar, revisions) de forma semestral o trimestral. Evitaràs caigudes brusques de liquiditat en un sol mes i guanyaràs marge de maniobra davant d’imprevistos.',
    'tips.badge_urgency': 'Alerta de Seguretat',
    'tips.critical_title': 'Prioritat #1: Construir el Mur de 6 Mesos ({months} mesos actuals)',
    'tips.critical_desc': 'Amb una despesa mensual de {monthlyExpenses}, el teu matalàs actual et protegeix durant {months} mesos. Recomanem acumular {needed} addicionals abans de comprometre fons en compres no essencials.',
    'tips.badge_optim': 'Optimització de Capital',
    'tips.oversized_title': 'Excedent de Seguretat: El teu matalàs cobreix {years} anys',
    'tips.oversized_desc': 'Distingeixes {months} mesos de cobertura ({years} anys). Mantenir més de 12-18 mesos de liquiditat en un compte corrent al 0% pateix l’erosió de la inflació. Considera moure l’excedent de {excess} cap a comptes remunerats o fons indexats globals.',
    'tips.badge_leaks': 'Poda Directa de Fugues',
    'tips.leaks_title': 'Estalvi Immediat: Recupera {yearly} l’any',
    'tips.leaks_desc': 'Detectem {count} cobraments de subscripcions i quotes recurrents ({names}) per un total de {monthly}/mes. Cancel·lar les que no facis servir alliberarà {yearly} l’any a la teva butxaca sense esforç.',
    'tips.badge_budget': 'Habitatge i Esforç',
    'tips.housing_title': 'Ràtio d’Habitatge al {pct}% dels teus Ingressos',
    'tips.housing_desc': 'Els teus costos fixos d’habitatge sumen {amount}/mes ({pct}% d’ingressos). Els economistes recomanen mantenir aquest ràtio per sota del 30-35% per tenir estabilitat financera.',
    'tips.badge_habit': 'Hàbit Familiar',
    'tips.pay_first_title': 'Automatitza: Paga’t a tu primer el dia 1 de cada mes',
    'tips.pay_first_desc': 'Programa una transferència automàtica de {amount}/mes cap a una guardiola o llibreta separada el mateix dia que entra la teva nòmina o pensió. Si estalvies al principi en comptes d’esperar a final de mes, l’estalvi es consolida automàticament.',
    'tips.badge_method': 'Filtre Emocional',
    'tips.rule_72_title': 'Regla de les 72 Hores per a Despeses No Essencials',
    'tips.rule_72_desc': 'Per a qualsevol caprici o despesa superior a 100 €, espera 3 dies abans de comprar. Més del 70% de les compres per impuls es descarten un cop transcorregut aquest temps de refredament.',

    // Footer
    'footer.privacy': 'Privacitat Absoluta: Cap dada bancària no viatja a servidors ni es guarda en galetes ni emmagatzematge local.',
    'footer.disclaimer': 'Aquesta eina és un simulador matemàtic privat i local per a assistència financera familiar. No constitueix assessorament regulat.',
    'footer.copyright': '© {year} Trujillo AI • Ecosistema d’Enginyeria i Guies Tècniques'
  }
};

interface I18nContextType {
  language: LanguageId;
  setLanguage: (lang: LanguageId) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function detectInitialLanguage(): LanguageId {
  try {
    const saved = localStorage.getItem('atm_lang');
    if (saved === 'es' || saved === 'en' || saved === 'ca') {
      return saved;
    }
  } catch (e) {}

  if (typeof navigator !== 'undefined') {
    const nav = (navigator.language || 'es').toLowerCase();
    if (nav.startsWith('ca')) return 'ca';
    if (nav.startsWith('en')) return 'en';
  }
  return 'es';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageId>(detectInitialLanguage);

  const setLanguage = (lang: LanguageId) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('atm_lang', lang);
      document.documentElement.lang = lang;
    } catch (e) {}
    document.dispatchEvent(new CustomEvent('atm:lang', { detail: { lang } }));
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch (e) {}
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.es;
    let text = dict[key] || TRANSLATIONS.es[key] || key;

    if (params) {
      for (const [paramKey, paramVal] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      }
    }
    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback safe dummy context
    return {
      language: 'es',
      setLanguage: () => {},
      t: (key: string) => TRANSLATIONS.es[key] || key
    };
  }
  return context;
}
