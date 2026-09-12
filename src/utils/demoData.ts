import { ParseResult } from '../types';
import { normalizeBankCsv } from '../parsers/bankNormalizer';

/**
 * Genera extractos bancarios de demostración simulando una familia española
 * (CaixaBank y Santander) con ingresos recurrentes, gastos fijos y fugas evitables.
 */
export function generateDemoStatements(): ParseResult[] {
  // Extracto 1: CaixaBank - Cuenta Nómina y Gastos Familiares
  const caixabankCsv = `Fecha;Concepto;Importe;Saldo
01/10/2024;NOMINA EMPRESA S.A.;2450.00;4850.00
02/10/2024;RECIBO HIPOTECA BANCO; -780.00;4070.00
04/10/2024;COMPRA MERCADONA MADRID; -156.40;3913.60
05/10/2024;IBERDROLA CLIENTES RECIBO LUZ; -88.50;3825.10
08/10/2024;FARMACIA SUPLEMENTOS VITAMINICOS; -34.80;3790.30
10/10/2024;NETFLIX SUBSCRIPTION MENSUAL; -17.99;3772.31
12/10/2024;SPOTIFY ESPANA PREMIUM; -14.99;3757.32
14/10/2024;CARREFOUR HIPERMERCADO ALCOBENDAS; -124.60;3632.72
16/10/2024;COMUNIDAD PROPIETARIOS PORTAL; -80.00;3552.72
18/10/2024;REPSOL GASOLEO ESTACION; -68.00;3484.72
20/10/2024;COMISION MANTENIMIENTO CUENTA; -15.00;3469.72
22/10/2024;CANAL ISABEL II SUMINISTRO AGUA; -32.40;3437.32
25/10/2024;AMAZON PRIME MENSUALIDAD; -4.99;3432.33
28/10/2024;MERCADONA SUPERMERCADO; -142.10;3290.23
30/10/2024;TRANSFERENCIA BIZUM CENA; -25.00;3265.23
`;

  // Extracto 2: Banco Santander - Segundo titular y seguro anual
  const santanderCsv = `Fecha;Concepto;Importe;Saldo
03/10/2024;PENSION / SEGUNDO INGRESO PROFESIONAL;1100.00;2200.00
07/10/2024;SEGURO COCHE MAPFRE ANUAL; -390.00;1810.00
11/10/2024;GIMNASIO CUOTA MENSUAL NO ASISTIDO; -39.90;1770.10
15/10/2024;DISNEY PLUS SUSCRIPCION ANUAL; -8.99;1761.11
21/10/2024;RESTAURANTE FAMILIAR DOMINGO; -85.00;1676.11
26/10/2024;FARMACIA PRODUCTOS PARAFARMACIA; -22.50;1653.61
`;

  const res1 = normalizeBankCsv(caixabankCsv, 'Extracto_CaixaBank_Octubre.csv');
  const res2 = normalizeBankCsv(santanderCsv, 'Extracto_Santander_Hogar.csv');

  return [res1, res2];
}
