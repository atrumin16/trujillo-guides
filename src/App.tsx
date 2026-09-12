import React, { useState, useMemo } from 'react';
import { ParseResult } from './types';
import { calculateRunway } from './utils/runwayCalculator';
import { calculateCategoryBreakdown, calculateSavingsRate } from './utils/categories';
import { generateDemoStatements } from './utils/demoData';
import { I18nProvider, useI18n } from './utils/i18n';
import { Header } from './components/Header';
import { GlobalLiquidityInput } from './components/GlobalLiquidityInput';
import { UniversalDropzone } from './components/UniversalDropzone';
import { RunwayMetrics } from './components/RunwayMetrics';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { PersonalizedTips } from './components/PersonalizedTips';
import { OpportunityCostCard } from './components/OpportunityCostCard';
import { UnifiedTransactionsTable } from './components/UnifiedTransactionsTable';
import './styles/savings.css';

const SavingsMainContent: React.FC = () => {
  const { t } = useI18n();

  // Estado 100% volátil en memoria RAM (Zero-Knowledge)
  const [totalLiquidity, setTotalLiquidity] = useState<number>(0);
  const [parseResults, setParseResults] = useState<ParseResult[]>([]);

  const handleAddResults = (newResults: ParseResult[]) => {
    setParseResults((prev) => {
      const existingNames = new Set(newResults.map((r) => r.fileName));
      const filtered = prev.filter((r) => !existingNames.has(r.fileName));
      return [...filtered, ...newResults];
    });
  };

  const handleRemoveResult = (fileName: string) => {
    setParseResults((prev) => prev.filter((r) => r.fileName !== fileName));
  };

  const handleLoadDemo = () => {
    const demoStatements = generateDemoStatements();
    setParseResults(demoStatements);
    if (totalLiquidity === 0) {
      setTotalLiquidity(20000); // 20.000 € de colchón de muestra
    }
  };

  const handleReset = () => {
    setTotalLiquidity(0);
    setParseResults([]);
  };

  // Consolidación de análisis financiero
  const runwayAnalysis = useMemo(() => {
    return calculateRunway(totalLiquidity, parseResults);
  }, [totalLiquidity, parseResults]);

  // Lista plana de transacciones para la tabla
  const allTransactions = useMemo(() => {
    const list = parseResults.flatMap((r) => r.transactions);
    list.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
    return list;
  }, [parseResults]);

  // Desglose de categorías y tasa de ahorro para métricas y consejos
  const categories = useMemo(() => {
    return calculateCategoryBreakdown(allTransactions, runwayAnalysis.monthsSpanned);
  }, [allTransactions, runwayAnalysis.monthsSpanned]);

  const savingsRate = useMemo(() => {
    return calculateSavingsRate(runwayAnalysis.monthlyIncome, runwayAnalysis.monthlyExpenses);
  }, [runwayAnalysis.monthlyIncome, runwayAnalysis.monthlyExpenses]);

  const hasData = parseResults.length > 0 || totalLiquidity > 0;

  return (
    <div className="savings-app-wrapper">
      <Header onReset={handleReset} hasData={hasData} />

      <main className="savings-main">
        {/* Paso 1: Liquidez Global */}
        <GlobalLiquidityInput
          value={totalLiquidity}
          onChange={setTotalLiquidity}
        />

        {/* Paso 2: Carga Multibanco de Extractos */}
        <UniversalDropzone
          parseResults={parseResults}
          onAddResults={handleAddResults}
          onRemoveResult={handleRemoveResult}
          onLoadDemo={handleLoadDemo}
        />

        {/* Auditoría, Métricas, Desglose Visual y Consejos Personalizados */}
        {parseResults.length > 0 && (
          <>
            <RunwayMetrics analysis={runwayAnalysis} />

            {/* Desglose por categorías y semáforo de ahorro */}
            <CategoryBreakdown
              transactions={allTransactions}
              runwayAnalysis={runwayAnalysis}
            />

            {/* Consejos personalizados basados en los gastos reales del usuario */}
            <PersonalizedTips
              runwayAnalysis={runwayAnalysis}
              categories={categories}
              savingsRate={savingsRate}
              transactions={allTransactions}
            />

            <OpportunityCostCard
              detectedMonthlyLeak={runwayAnalysis.leakMonthlyEstimate}
            />

            <UnifiedTransactionsTable
              transactions={allTransactions}
              topExpenses={runwayAnalysis.topExpenses}
              runwayAnalysis={runwayAnalysis}
            />
          </>
        )}
      </main>

      <footer className="savings-footer">
        <div className="savings-footer-inner">
          <div className="footer-privacy-box">
            <svg
              className="tool-ic"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{t('footer.privacy')}</span>
          </div>

          <p className="footer-disclaimer">{t('footer.disclaimer')}</p>

          <p className="footer-copyright">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <SavingsMainContent />
    </I18nProvider>
  );
};

export default App;
