import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type LanguageId = 'es' | 'en' | 'ca' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ar';

export interface LanguageMeta {
  id: LanguageId;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'ca', name: 'Català', flag: '🇦🇩' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹' },
  { id: 'pt', name: 'Português', flag: '🇵🇹' },
  { id: 'zh', name: '中文', flag: '🇨🇳' },
  { id: 'ja', name: '日本語', flag: '🇯🇵' },
  { id: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    // Topbar & Header
    'header.brand': 'ATM Savings',
    'header.badge': 'Auditoría Privada',
    'header.privacy': 'Zero-Knowledge · RAM',
    'header.privacy_title': 'Tus extractos se procesan únicamente en la memoria RAM de tu navegador. Ningún dato viaja a la red.',
    'header.back_labs': 'Labs',
    'header.guides': 'Guides',
    'header.reset': 'Reiniciar',
    'header.reset_title': 'Borrar datos activos de la memoria RAM',
    'header.reset_confirm': '¿Seguro que deseas reiniciar y borrar los datos cargados en la sesión actual?',
    'header.theme': 'Cambiar tema',
    'header.font_size': 'Tamaño de letra',
    'header.font_normal': 'Texto Normal (A)',
    'header.font_large': 'Texto Grande (A+)',
    'header.font_xlarge': 'Texto Muy Grande (A++)',
    'header.login': 'Entrar',
    'header.user_guest': 'Invitado',
    'header.save_memory': 'Guardar en memoria',
    'header.saved_audits': 'Mis auditorías',
    'header.change_name': 'Cambiar nombre',
    'header.logout': 'Salir',

    // Paso 1: Liquidez
    'step1.badge': 'Paso 1',
    'step1.title': 'Colchón de Liquidez Global Familiar',
    'step1.desc': 'Indica el dinero líquido disponible hoy en tu familia (cuentas corrientes, libretas de ahorro, cuentas remuneradas o depósitos) del que puedes disponer sin penalización en caso de emergencia.',
    'step1.input_label': 'Importe de liquidez en euros',
    'step1.active_preview': 'Importe activo:',
    'step1.presets_label': 'Accesos directos:',
    'step1.stepper_minus': 'Restar 1.000 €',
    'step1.stepper_plus': 'Añadir 1.000 €',

    // Paso 2: Dropzone & Carga
    'step2.badge': 'Paso 2',
    'step2.title': 'Carga de Extractos Bancarios (CSV o Excel)',
    'step2.desc': 'Arrastra o selecciona uno o varios extractos descargados de tu banca online. Soporta todos los bancos españoles e internacionales. Procesamiento 100% en memoria volátil RAM.',
    'step2.drop_prompt': 'Arrastra aquí tus extractos bancarios o',
    'step2.select_files': 'selecciona archivos desde tu equipo',
    'step2.support_info': 'Formatos CSV y texto exportados de banca online. Detección automática multi-banco.',
    'step2.processing': 'Analizando extractos en memoria volátil...',
    'step2.demo_btn': 'Cargar datos de ejemplo',
    'step2.demo_sub': 'Prueba el análisis al instante con extractos de muestra sin subir tus archivos.',
    'step2.loaded_title': 'Extractos Bancarios Consolidados',
    'step2.movements': 'movimientos',
    'step2.period': 'Periodo:',
    'step2.remove_file': 'Quitar extracto',
    'step2.err_empty': 'El archivo {name} parece estar vacío o no contiene transacciones válidas.',
    'step2.err_read': 'No se pudo leer el archivo {name}. Asegúrate de que no esté protegido con contraseña.',

    // Paso 3: Métricas de Runway
    'step3.badge': 'Paso 3',
    'step3.title': 'Auditoría de Supervivencia y Runway Financiero',
    'step3.desc': 'Diagnóstico exacto de cuántos meses puede sostenerse tu economía familiar si se interrumpen por completo los ingresos hoy mismo.',
    'step3.runway_title': 'Supervivencia Financiera Neta',
    'step3.runway_suffix': 'meses',
    'step3.runway_days': 'aprox. {days} días de autonomía total',
    'step3.net_burn': 'Gasto Neto Mensual',
    'step3.total_income': 'Ingresos Promedio',
    'step3.total_expenses': 'Gastos Promedio',
    'step3.savings_rate': 'Tasa de Ahorro Real',
    'step3.cushion_health': 'Estado del Colchón',
    'step3.badge_critical': 'Nivel Crítico (< 3 meses)',
    'step3.badge_warning': 'En Alerta (3 - 6 meses)',
    'step3.badge_healthy': 'Saludable (6 - 12 meses)',
    'step3.badge_optimal': 'Óptimo (12 - 24 meses)',
    'step3.badge_oversized': 'Exceso de Liquidez (> 24 meses)',

    // Desglose de Gastos
    'breakdown.title': 'Radiografía de Gastos por Categoría',
    'breakdown.desc': 'Clasificación automática e inteligente de tus salidas de dinero según su impacto presupuestario.',
    'breakdown.total_expenses': 'Total Gastos:',
    'breakdown.all_categories': 'Todas las categorías',
    'breakdown.filter': 'Filtrar categoría:',

    // Categorías
    'cat.housing': 'Vivienda y Alquiler',
    'cat.supermarket': 'Supermercado y Alimentación',
    'cat.utilities': 'Luz, Agua, Gas e Internet',
    'cat.transport': 'Transporte y Combustible',
    'cat.dining': 'Restaurantes y Ocio',
    'cat.shopping': 'Compras y Comercio',
    'cat.health': 'Salud y Farmacia',
    'cat.education': 'Educación y Cursos',
    'cat.subscriptions': 'Suscripciones y Streaming',
    'cat.insurance': 'Seguros e Impuestos',
    'cat.cash': 'Cajeros y Efectivo',
    'cat.transfers': 'Transferencias y Pagos',
    'cat.other_expense': 'Otros Gastos',
    'cat.salary': 'Nómina y Salarios',
    'cat.investments': 'Inversiones y Dividendos',
    'cat.other_income': 'Otros Ingresos',

    // Consejos Personalizados
    'tips.title': 'Recomendaciones Financieras a Medida',
    'tips.desc': 'Estrategias automáticas generadas a partir de tus extractos para optimizar tu colchón y proteger tu patrimonio.',
    'tips.large_expenses_title': 'Planificar y Escalonar Pagos Grandes',
    'tips.large_expenses_desc': 'Hemos detectado {count} cargos superiores a 250 € este mes (total {amount} €). Si los separas trimestralmente o creas una provisión mensual, ganarás 2-3 meses de margen de reacción ante imprevistos.',
    'tips.runway_boost_title': 'Fortalecer el Colchón de Emergencia',
    'tips.runway_boost_desc': 'Tu colchón actual es de {months} meses. Para tener tranquilidad ante bajas médicas o imprevistos familiares, te recomendamos alcanzar entre 6 y 12 meses.',
    'tips.subscriptions_title': 'Revisar Cuotas Recurrentes y Suscripciones',
    'tips.subscriptions_desc': 'Gastas {amount} €/mes en cuotas fijas y suscripciones ({yearly} €/año). Revisar y cancelar 1 o 2 que no uses liberará liquidez inmediata.',
    'tips.housing_ratio_title': 'Ratio de Esfuerzo en Vivienda',
    'tips.housing_ratio_desc': 'La vivienda representa el {percent}% de tus ingresos (recomendado máximo 30-35%). Evita asumir nuevos compromisos crediticios fijos.',
    'tips.pay_yourself_title': 'Automatizar el "Págate a ti primero"',
    'tips.pay_yourself_desc': 'Programa una transferencia automática del 10% ({amount} €) el día 1 de cada mes hacia tu cuenta remunerada antes de empezar a gastar.',

    // Coste de Oportunidad al 7%
    'opp.title': 'Coste de Oportunidad al 7% Anual',
    'opp.desc': 'Proyección a largo plazo si inviertes tu ahorro mensual en un fondo indexado diversificado global (ej. MSCI World / S&P 500) a un retorno histórico medio del 7% anual.',
    'opp.monthly_savings': 'Ahorro mensual potencial:',
    'opp.in_5_years': 'En 5 Años',
    'opp.in_10_years': 'En 10 Años',
    'opp.in_20_years': 'En 20 Años',
    'opp.contributed': 'Capital aportado:',
    'opp.interests': 'Intereses generados:',
    'opp.note': 'Cálculo de interés compuesto con aportaciones mensuales constantes y reinversión de dividendos. No constituye asesoramiento financiero regulado.',

    // Tabla de Movimientos
    'table.title': 'Auditoría Detallada de Transacciones',
    'table.desc': 'Listado completo de movimientos normalizados con búsqueda instantánea y filtros por categoría.',
    'table.search': 'Buscar por concepto o banco…',
    'table.export_excel': 'Exportar Excel Formateado',
    'table.print_pdf': 'Guardar en PDF / Imprimir',
    'table.filter_all': 'Todos',
    'table.filter_expenses': 'Solo Gastos',
    'table.filter_income': 'Solo Ingresos',
    'table.col_date': 'Fecha',
    'table.col_desc': 'Concepto',
    'table.col_category': 'Categoría',
    'table.col_account': 'Entidad / Archivo',
    'table.col_amount': 'Importe',
    'table.no_results': 'No se encontraron movimientos coincidentes.',
    'table.showing': 'Mostrando {count} de {total} movimientos',
    'table.page_prev': 'Anterior',
    'table.page_next': 'Siguiente',

    // NUEVAS FUNCIONES: Regla 50/30/20
    'rule503020.title': 'Salud Presupuestaria · Regla 50/30/20',
    'rule503020.desc': 'Distribución equilibrada recomendada por economistas: 50% Necesidades básicas, 30% Deseos y estilo de vida, 20% Ahorro e inversión.',
    'rule503020.needs': 'Necesidades (50%)',
    'rule503020.wants': 'Deseos y Ocio (30%)',
    'rule503020.savings': 'Ahorro / Inversión (20%)',
    'rule503020.target': 'Meta estándar: {target}%',
    'rule503020.real': 'Real en tu economía: {real}% ({amount} €)',
    'rule503020.status_optimal': 'Equilibrado',
    'rule503020.status_warning': 'Atención',
    'rule503020.status_alert': 'Desviado',

    // NUEVAS FUNCIONES: Gastos Recurrentes
    'recurring.title': 'Detector de Gastos Fijos y Recurrentes',
    'recurring.desc': 'Identificación automática de cuotas periódicas mensuales (suministros, streaming, telecomunicaciones, seguros, alquiler).',
    'recurring.monthly_total': 'Compromiso fijo mensual:',
    'recurring.yearly_total': 'Compromiso fijo anual:',
    'recurring.detected_count': '{count} suscripciones y cuotas identificadas',
    'recurring.potential_savings': 'Margen de optimización revisando cuotas prescindibles: hasta {amount} €/mes',

    // NUEVAS FUNCIONES: Simulador de Estrés
    'stress.title': 'Simulador de Estrés Financiero (Crisis & Imprevistos)',
    'stress.desc': 'Pon a prueba la solidez de tu economía familiar simulando caídas de ingresos, subidas de precios o averías inesperadas.',
    'stress.income_drop': 'Caída de ingresos mensuales:',
    'stress.unexpected_expense': 'Gasto imprevisto puntual:',
    'stress.inflation': 'Subida de gastos por inflación:',
    'stress.result_runway': 'Runway en este escenario de estrés:',
    'stress.result_months': '{months} meses de autonomía',
    'stress.resilience_high': 'Resiliencia Alta: Tu economía absorbería este golpe sin problemas.',
    'stress.resilience_med': 'Resiliencia Moderada: Tu colchón resistiría pero requeriría ajustar gastos superfluos.',
    'stress.resilience_low': 'Resiliencia Crítica: En este escenario tu liquidez se agotaría en menos de 6 meses.',

    // NUEVAS FUNCIONES: Metas de Ahorro
    'goals.title': 'Rastreador de Metas Familiares',
    'goals.desc': 'Define objetivos de ahorro prioritarios (fondo de emergencia, viaje, reformas o compra de coche) y visualiza el tiempo exacto para alcanzarlos.',
    'goals.add_btn': 'Añadir Nueva Meta',
    'goals.name_placeholder': 'Nombre de la meta (ej. Reparación coche, Vacaciones)',
    'goals.amount_placeholder': 'Importe objetivo en €',
    'goals.target_date': 'A tu ritmo de ahorro actual ({rate} €/mes), alcanzarás esta meta en {months} meses ({date}).',
    'goals.progress': 'Progreso actual:',

    // Modal de Usuario & Memoria
    'vault.title': 'Bóveda de Auditorías en Memoria Local',
    'vault.subtitle': 'Tus análisis se almacenan 100% en tu navegador (Zero-Knowledge). Guarda múltiples versiones familiares o restaura auditorías anteriores.',
    'vault.save_current': 'Guardar estado actual',
    'vault.audit_name': 'Nombre de la auditoría / escenario:',
    'vault.save_btn': 'Guardar en memoria',
    'vault.list_title': 'Auditorías guardadas en este dispositivo',
    'vault.empty': 'Aún no has guardado ninguna auditoría en la memoria de este navegador.',
    'vault.load_btn': 'Cargar',
    'vault.delete_btn': 'Eliminar',
    'vault.export_backup': 'Exportar Copia de Seguridad JSON',
    'vault.import_backup': 'Importar Copia de Seguridad JSON',
    'vault.close': 'Cerrar',

    // Modal de Identificación
    'auth.title': '¿Cómo te llamamos?',
    'auth.desc': 'Indica tu nombre para personalizar tus auditorías y guardar tus presupuestos en este equipo. Sin contraseñas ni correos obligatorios.',
    'auth.input_label': 'Tu nombre o alias:',
    'auth.submit': 'Guardar y Continuar',
    'auth.studio_link': 'Tengo cuenta en Trujillo AI Studio'
  },
  en: {
    'header.brand': 'ATM Savings',
    'header.badge': 'Private Audit',
    'header.privacy': 'Zero-Knowledge · RAM',
    'header.privacy_title': 'Your bank statements are processed entirely in browser volatile RAM. No data is sent over the network.',
    'header.back_labs': 'Labs',
    'header.guides': 'Guides',
    'header.reset': 'Reset',
    'header.reset_title': 'Clear active data from RAM',
    'header.reset_confirm': 'Are you sure you want to reset and clear all statements loaded in this session?',
    'header.theme': 'Toggle theme',
    'header.font_size': 'Font size',
    'header.font_normal': 'Normal Text (A)',
    'header.font_large': 'Large Text (A+)',
    'header.font_xlarge': 'Extra Large Text (A++)',
    'header.login': 'Sign in',
    'header.user_guest': 'Guest',
    'header.save_memory': 'Save to memory',
    'header.saved_audits': 'My audits',
    'header.change_name': 'Change name',
    'header.logout': 'Sign out',

    'step1.badge': 'Step 1',
    'step1.title': 'Total Family Liquidity Cushion',
    'step1.desc': 'Enter the cash currently available to your household (checking accounts, savings books, high-yield accounts, deposits) accessible immediately without penalty.',
    'step1.input_label': 'Liquidity amount in EUR',
    'step1.active_preview': 'Active amount:',
    'step1.presets_label': 'Quick presets:',
    'step1.stepper_minus': 'Subtract 1,000 €',
    'step1.stepper_plus': 'Add 1,000 €',

    'step2.badge': 'Step 2',
    'step2.title': 'Upload Bank Statements (CSV or Excel)',
    'step2.desc': 'Drag or select bank statements exported from your online banking. Supports Spanish and international banks. 100% volatile in-RAM processing.',
    'step2.drop_prompt': 'Drop your bank statements here or',
    'step2.select_files': 'browse files from your device',
    'step2.support_info': 'CSV and text files exported from online banking. Multi-bank auto detection.',
    'step2.processing': 'Parsing statements in volatile RAM...',
    'step2.demo_btn': 'Load demo data',
    'step2.demo_sub': 'Test analysis instantly with sample statements without uploading your files.',
    'step2.loaded_title': 'Consolidated Bank Statements',
    'step2.movements': 'transactions',
    'step2.period': 'Period:',
    'step2.remove_file': 'Remove statement',
    'step2.err_empty': 'File {name} appears empty or has no valid transactions.',
    'step2.err_read': 'Could not read file {name}. Ensure it is not password-protected.',

    'step3.badge': 'Step 3',
    'step3.title': 'Survival Audit & Financial Runway',
    'step3.desc': 'Accurate calculation of how many months your household can sustain itself if all income stops today.',
    'step3.runway_title': 'Net Financial Survival',
    'step3.runway_suffix': 'months',
    'step3.runway_days': 'approx. {days} days of complete autonomy',
    'step3.net_burn': 'Monthly Net Burn',
    'step3.total_income': 'Average Income',
    'step3.total_expenses': 'Average Expenses',
    'step3.savings_rate': 'Real Savings Rate',
    'step3.cushion_health': 'Cushion Health',
    'step3.badge_critical': 'Critical (< 3 months)',
    'step3.badge_warning': 'Warning (3 - 6 months)',
    'step3.badge_healthy': 'Healthy (6 - 12 months)',
    'step3.badge_optimal': 'Optimal (12 - 24 months)',
    'step3.badge_oversized': 'Excess Liquidity (> 24 months)',

    'breakdown.title': 'Category Expense Breakdown',
    'breakdown.desc': 'Automatic smart classification of cash outflows by budget impact.',
    'breakdown.total_expenses': 'Total Expenses:',
    'breakdown.all_categories': 'All categories',
    'breakdown.filter': 'Filter category:',

    'cat.housing': 'Housing & Rent',
    'cat.supermarket': 'Groceries & Food',
    'cat.utilities': 'Utilities & Internet',
    'cat.transport': 'Transport & Fuel',
    'cat.dining': 'Dining & Leisure',
    'cat.shopping': 'Shopping & Retail',
    'cat.health': 'Healthcare & Pharmacy',
    'cat.education': 'Education & Courses',
    'cat.subscriptions': 'Subscriptions & Streaming',
    'cat.insurance': 'Insurance & Taxes',
    'cat.cash': 'Cash & ATMs',
    'cat.transfers': 'Transfers & Payments',
    'cat.other_expense': 'Other Expenses',
    'cat.salary': 'Salary & Payroll',
    'cat.investments': 'Investments & Dividends',
    'cat.other_income': 'Other Income',

    'tips.title': 'Tailored Financial Recommendations',
    'tips.desc': 'Automatic strategies based on your actual bank statements to protect and optimize your cushion.',
    'tips.large_expenses_title': 'Stagger Large Expenses',
    'tips.large_expenses_desc': 'Detected {count} charges over 250 € this month ({amount} € total). Staggering them quarterly will give you 2-3 extra months of reaction buffer.',
    'tips.runway_boost_title': 'Strengthen Emergency Cushion',
    'tips.runway_boost_desc': 'Your cushion is {months} months. We recommend reaching 6 to 12 months for peace of mind against family emergencies.',
    'tips.subscriptions_title': 'Review Recurring Subscriptions',
    'tips.subscriptions_desc': 'You spend {amount} €/month on recurring fees ({yearly} €/year). Canceling unused services immediately frees liquidity.',
    'tips.housing_ratio_title': 'Housing Effort Ratio',
    'tips.housing_ratio_desc': 'Housing represents {percent}% of your income (recommended max 30-35%). Avoid taking on new fixed debt.',
    'tips.pay_yourself_title': 'Automate "Pay Yourself First"',
    'tips.pay_yourself_desc': 'Schedule an automated transfer of 10% ({amount} €) on the 1st of every month into high-yield savings before spending.',

    'opp.title': 'Opportunity Cost at 7% Annual Return',
    'opp.desc': 'Long-term projection if your monthly savings are invested in a diversified global index fund (e.g. MSCI World / S&P 500) at 7% annual average return.',
    'opp.monthly_savings': 'Potential monthly savings:',
    'opp.in_5_years': 'In 5 Years',
    'opp.in_10_years': 'In 10 Years',
    'opp.in_20_years': 'In 20 Years',
    'opp.contributed': 'Capital contributed:',
    'opp.interests': 'Compound interest earned:',
    'opp.note': 'Compound interest calculation with monthly contributions and reinvested dividends. Not regulated financial advice.',

    'table.title': 'Detailed Transaction Audit',
    'table.desc': 'Full list of normalized transactions with instant search and category filters.',
    'table.search': 'Search description or bank…',
    'table.export_excel': 'Export Formatted Excel',
    'table.print_pdf': 'Save as PDF / Print',
    'table.filter_all': 'All',
    'table.filter_expenses': 'Expenses Only',
    'table.filter_income': 'Income Only',
    'table.col_date': 'Date',
    'table.col_desc': 'Description',
    'table.col_category': 'Category',
    'table.col_account': 'Bank / File',
    'table.col_amount': 'Amount',
    'table.no_results': 'No matching transactions found.',
    'table.showing': 'Showing {count} of {total} transactions',
    'table.page_prev': 'Previous',
    'table.page_next': 'Next',

    'rule503020.title': 'Budget Health · 50/30/20 Rule',
    'rule503020.desc': 'Recommended balance: 50% Needs, 30% Wants & lifestyle, 20% Savings & investments.',
    'rule503020.needs': 'Needs (50%)',
    'rule503020.wants': 'Wants & Leisure (30%)',
    'rule503020.savings': 'Savings & Investment (20%)',
    'rule503020.target': 'Target: {target}%',
    'rule503020.real': 'Actual: {real}% ({amount} €)',
    'rule503020.status_optimal': 'Balanced',
    'rule503020.status_warning': 'Notice',
    'rule503020.status_alert': 'Imbalanced',

    'recurring.title': 'Recurring Bills & Subscription Detector',
    'recurring.desc': 'Automatic identification of fixed monthly bills (utilities, streaming, phone, insurance, rent).',
    'recurring.monthly_total': 'Monthly committed expenses:',
    'recurring.yearly_total': 'Annual committed expenses:',
    'recurring.detected_count': '{count} recurring bills detected',
    'recurring.potential_savings': 'Optimization margin from reviewing unused subscriptions: up to {amount} €/mo',

    'stress.title': 'Financial Stress Simulator (Shock Tests)',
    'stress.desc': 'Test the resilience of your household against income drops, sudden emergencies, or inflation.',
    'stress.income_drop': 'Monthly income drop:',
    'stress.unexpected_expense': 'Sudden unexpected expense:',
    'stress.inflation': 'Expense increase from inflation:',
    'stress.result_runway': 'Runway under this stress scenario:',
    'stress.result_months': '{months} months of autonomy',
    'stress.resilience_high': 'High Resilience: Your cushion absorbs this shock comfortably.',
    'stress.resilience_med': 'Moderate Resilience: Your cushion withstands the shock but requires trimming discretionary spending.',
    'stress.resilience_low': 'Critical Resilience: In this scenario, liquidity expires in under 6 months.',

    'goals.title': 'Family Savings Goals Tracker',
    'goals.desc': 'Set prioritized savings goals (emergency fund, travel, home purchase) and see the exact timeline to reach them.',
    'goals.add_btn': 'Add New Goal',
    'goals.name_placeholder': 'Goal name (e.g. Car repair, Summer vacation)',
    'goals.amount_placeholder': 'Target amount in €',
    'goals.target_date': 'At current savings rate ({rate} €/mo), you will reach this goal in {months} months ({date}).',
    'goals.progress': 'Current progress:',

    'vault.title': 'Local Memory Audit Vault',
    'vault.subtitle': 'Your data is saved 100% inside your browser (Zero-Knowledge). Save multiple family scenarios or restore previous audits.',
    'vault.save_current': 'Save Current Audit',
    'vault.audit_name': 'Audit / Scenario name:',
    'vault.save_btn': 'Save to Memory',
    'vault.list_title': 'Saved Audits on this Device',
    'vault.empty': 'No audits saved in this browser yet.',
    'vault.load_btn': 'Load',
    'vault.delete_btn': 'Delete',
    'vault.export_backup': 'Export JSON Backup',
    'vault.import_backup': 'Import JSON Backup',
    'vault.close': 'Close',

    'auth.title': 'What should we call you?',
    'auth.desc': 'Enter your name or nickname to personalize your audits and save scenarios on this device. No password or email needed.',
    'auth.input_label': 'Your name:',
    'auth.submit': 'Save & Continue',
    'auth.studio_link': 'I have an account in Trujillo AI Studio'
  },
  ca: {
    'header.brand': 'ATM Savings',
    'header.badge': 'Auditoria Privada',
    'header.privacy': 'Zero-Knowledge · RAM',
    'header.privacy_title': 'Els teus extractes es processen exclusivament a la memòria RAM del navegador. Cap dada viatja a la xarxa.',
    'header.back_labs': 'Labs',
    'header.guides': 'Guides',
    'header.reset': 'Reiniciar',
    'header.reset_title': 'Esborrar dades de la memòria RAM',
    'header.reset_confirm': 'Segur que vols reiniciar i esborrar totes les dades carregades a la sessió actual?',
    'header.theme': 'Canviar tema',
    'header.font_size': 'Mida de lletra',
    'header.font_normal': 'Text Normal (A)',
    'header.font_large': 'Text Gran (A+)',
    'header.font_xlarge': 'Text Molt Gran (A++)',
    'header.login': 'Entrar',
    'header.user_guest': 'Convidat',
    'header.save_memory': 'Guardar a memòria',
    'header.saved_audits': 'Les meves auditories',
    'header.change_name': 'Canviar nom',
    'header.logout': 'Sortir',

    'step1.badge': 'Pas 1',
    'step1.title': 'Matalàs de Liquiditat Global Familiar',
    'step1.desc': 'Indica els diners líquids disponibles avui a la teva família dels quals pots disposar immediatament en cas d’emergència.',
    'step1.input_label': 'Import de liquiditat en euros',
    'step1.active_preview': 'Import actiu:',
    'step1.presets_label': 'Accessos directes:',
    'step1.stepper_minus': 'Restar 1.000 €',
    'step1.stepper_plus': 'Afegir 1.000 €',

    'step2.badge': 'Pas 2',
    'step2.title': 'Càrrega d’Extractes Bancaris (CSV o Excel)',
    'step2.desc': 'Arrossega o selecciona un o diversos extractes de la teva banca online. Processament 100% en memòria volàtil RAM.',
    'step2.drop_prompt': 'Arrossega aquí els teus extractes bancaris o',
    'step2.select_files': 'selecciona fitxers del teu equip',
    'step2.support_info': 'Formats CSV i text de banca online. Detecció multi-banc automàtica.',
    'step2.processing': 'Analitzant extractes en memòria volàtil...',
    'step2.demo_btn': 'Carregar dades d’exemple',
    'step2.demo_sub': 'Prova l’anàlisi a l’instant sense pujar els teus fitxers.',
    'step2.loaded_title': 'Extractes Bancaris Consolidats',
    'step2.movements': 'moviments',
    'step2.period': 'Període:',
    'step2.remove_file': 'Treure extracte',
    'step2.err_empty': 'El fitxer {name} sembla buit o no conté transaccions vàlides.',
    'step2.err_read': 'No s’ha pogut llegir el fitxer {name}.',

    'step3.badge': 'Pas 3',
    'step3.title': 'Auditoria de Supervivència i Runway Financer',
    'step3.desc': 'Diagnòstic exacte de quants mesos pot sostenir-se la teva economia si s’interrompen els ingressos avui.',
    'step3.runway_title': 'Supervivència Financera Neta',
    'step3.runway_suffix': 'mesos',
    'step3.runway_days': 'aprox. {days} dies d’autonomia total',
    'step3.net_burn': 'Despesa Neta Mensual',
    'step3.total_income': 'Ingressos Mitjans',
    'step3.total_expenses': 'Despeses Mitjanes',
    'step3.savings_rate': 'Taxa d’Estalvi Real',
    'step3.cushion_health': 'Estat del Matalàs',
    'step3.badge_critical': 'Nivell Crític (< 3 mesos)',
    'step3.badge_warning': 'En Alerta (3 - 6 mesos)',
    'step3.badge_healthy': 'Saludable (6 - 12 mesos)',
    'step3.badge_optimal': 'Òptim (12 - 24 mesos)',
    'step3.badge_oversized': 'Excés de Liquiditat (> 24 mesos)',

    'breakdown.title': 'Radiografia de Despeses per Categoria',
    'breakdown.desc': 'Classificació automàtica i intel·ligent de les teves sortides de diners.',
    'breakdown.total_expenses': 'Total Despeses:',
    'breakdown.all_categories': 'Totes les categories',
    'breakdown.filter': 'Filtrar categoria:',

    'cat.housing': 'Habitatge i Lloguer',
    'cat.supermarket': 'Supermercat i Alimentació',
    'cat.utilities': 'Llum, Aigua, Gas i Internet',
    'cat.transport': 'Transport i Carburant',
    'cat.dining': 'Restaurants i Oci',
    'cat.shopping': 'Compres i Comerç',
    'cat.health': 'Salut i Farmàcia',
    'cat.education': 'Educació i Cursos',
    'cat.subscriptions': 'Subscripcions i Streaming',
    'cat.insurance': 'Assegurances i Impostos',
    'cat.cash': 'Caixers i Efectiu',
    'cat.transfers': 'Transferències i Pagaments',
    'cat.other_expense': 'Altres Despeses',
    'cat.salary': 'Nòmina i Salaris',
    'cat.investments': 'Inversions i Dividends',
    'cat.other_income': 'Altres Ingressos',

    'rule503020.title': 'Salut Pressupostària · Regla 50/30/20',
    'rule503020.desc': 'Distribució equilibrada: 50% Necessitats, 30% Desitjos, 20% Estalvi i inversió.',
    'rule503020.needs': 'Necessitats (50%)',
    'rule503020.wants': 'Desitjos i Oci (30%)',
    'rule503020.savings': 'Estalvi / Inversió (20%)',
    'rule503020.target': 'Meta estàndard: {target}%',
    'rule503020.real': 'Real a la teva economia: {real}% ({amount} €)',
    'rule503020.status_optimal': 'Equilibrat',
    'rule503020.status_warning': 'Atenció',
    'rule503020.status_alert': 'Desviat',

    'recurring.title': 'Detector de Despeses Fixes i Recurrents',
    'recurring.desc': 'Identificació automàtica de quotes mensuals fixes.',
    'recurring.monthly_total': 'Compromís fix mensual:',
    'recurring.yearly_total': 'Compromís fix anual:',
    'recurring.detected_count': '{count} subscripcions i quotes detectades',
    'recurring.potential_savings': 'Marge d’optimització cancel·lant serveis prescindibles: fins a {amount} €/mes',

    'stress.title': 'Simulador d’Estrès Financer (Xocs i Imprevistos)',
    'stress.desc': 'Posa a prova la solidesa de la teva economia davant caigudes d’ingressos o inflació.',
    'stress.income_drop': 'Caiguda d’ingressos mensuals:',
    'stress.unexpected_expense': 'Despesa imprevista puntual:',
    'stress.inflation': 'Pujada de despeses per inflació:',
    'stress.result_runway': 'Runway en aquest escenari d’estrès:',
    'stress.result_months': '{months} mesos d’autonomia',
    'stress.resilience_high': 'Resiliència Alta: La teva economia absorbiria aquest xoc sense problemes.',
    'stress.resilience_med': 'Resiliència Moderada: El matalàs resistiria però requeriria ajustar despeses.',
    'stress.resilience_low': 'Resiliència Crítica: En aquest escenari la liquiditat s’esgotaria en menys de 6 mesos.',

    'goals.title': 'Seguiment de Metes Familiars',
    'goals.desc': 'Defineix objectius d’estalvi i visualitza el temps exacte per assolir-los.',
    'goals.add_btn': 'Afegir Nova Meta',
    'goals.name_placeholder': 'Nom de la meta (ex. Reparació cotxe, Vacances)',
    'goals.amount_placeholder': 'Import objectiu en €',
    'goals.target_date': 'Al teu ritme d’estalvi actual ({rate} €/mes), assoliràs aquesta meta en {months} mesos ({date}).',
    'goals.progress': 'Progrés actual:',

    'vault.title': 'Bòveda d’Auditories a Memòria Local',
    'vault.subtitle': 'Emmagatzematge 100% al teu navegador (Zero-Knowledge). Guarda múltiples versions o recupera auditories.',
    'vault.save_current': 'Guardar estat actual',
    'vault.audit_name': 'Nom de l’auditoria / escenari:',
    'vault.save_btn': 'Guardar a memòria',
    'vault.list_title': 'Auditories guardades en aquest dispositiu',
    'vault.empty': 'Encara no has guardat cap auditoria a la memòria d’aquest navegador.',
    'vault.load_btn': 'Carregar',
    'vault.delete_btn': 'Eliminar',
    'vault.export_backup': 'Exportar Còpia de Seguretat JSON',
    'vault.import_backup': 'Importar Còpia de Seguretat JSON',
    'vault.close': 'Tancar',

    'auth.title': 'Com et diem?',
    'auth.desc': 'Indica el teu nom per personalitzar les teves auditories en aquest dispositiu. Sense contrasenyes ni correus obligatoris.',
    'auth.input_label': 'El teu nom:',
    'auth.submit': 'Guardar i Continuar',
    'auth.studio_link': 'Tinc compte a Trujillo AI Studio'
  }
};

// Memoria dinámica en tiempo de ejecución para traducciones al vuelo
const DYNAMIC_TRANSLATIONS_CACHE = new Map<string, string>();

interface I18nContextType {
  language: LanguageId;
  setLanguage: (lang: LanguageId) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isTranslating: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageId>('es');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [, setRerenderTrigger] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('atm_lang') as LanguageId;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.id === saved)) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang: LanguageId) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('atm_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    } catch (e) {}

    // Si el idioma no tiene diccionario estático completo (fr, de, it, pt, zh, ja, ar),
    // disparamos traducción dinámica para las claves visibles
    if (!['es', 'en', 'ca'].includes(lang)) {
      triggerDynamicTranslation(lang);
    }
  };

  // Traductor dinámico para los idiomas sin diccionario estático completo
  const triggerDynamicTranslation = async (targetLang: LanguageId) => {
    setIsTranslating(true);
    try {
      const baseDict = TRANSLATIONS['es'];
      const keysToTranslate = Object.keys(baseDict).filter(
        (key) => !DYNAMIC_TRANSLATIONS_CACHE.has(`${targetLang}::${key}`)
      );

      if (keysToTranslate.length === 0) {
        setIsTranslating(false);
        return;
      }

      // Procesar en lotes de 25
      const batch = keysToTranslate.slice(0, 30);
      const texts = batch.map((k) => baseDict[k]);

      // Consultar endpoint Cloudflare Function /api/guides/translate
      const res = await fetch('/api/guides/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tl: targetLang, q: texts })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && Array.isArray(data.texts)) {
          data.texts.forEach((translatedText: string, idx: number) => {
            if (translatedText && batch[idx]) {
              DYNAMIC_TRANSLATIONS_CACHE.set(`${targetLang}::${batch[idx]}`, translatedText);
            }
          });
          setRerenderTrigger((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.warn('Dynamic translation warning:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text: string | undefined;

      // 1. Revisar caché dinámica
      const dynamicKey = `${language}::${key}`;
      if (DYNAMIC_TRANSLATIONS_CACHE.has(dynamicKey)) {
        text = DYNAMIC_TRANSLATIONS_CACHE.get(dynamicKey);
      }

      // 2. Revisar diccionarios estáticos
      if (!text && TRANSLATIONS[language] && TRANSLATIONS[language][key]) {
        text = TRANSLATIONS[language][key];
      }

      // 3. Fallback al inglés si no es español
      if (!text && TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
        text = TRANSLATIONS['en'][key];
      }

      // 4. Fallback al español por defecto
      if (!text && TRANSLATIONS['es'] && TRANSLATIONS['es'][key]) {
        text = TRANSLATIONS['es'][key];
      }

      // 5. Clave directa si no existe traducción
      if (!text) {
        text = key;
      }

      // Reemplazo de variables {param}
      if (params) {
        Object.entries(params).forEach(([k, val]) => {
          text = text!.replace(new RegExp(`\\{${k}\\}`, 'g'), String(val));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
export default useI18n;
