import React, { useState, useMemo } from 'react';
import { NormalizedTransaction, RunwayAnalysis } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useI18n } from '../utils/i18n';
import { exportToExcel, triggerPrintReport } from '../utils/excelExporter';
import { calculateCategoryBreakdown, calculateSavingsRate } from '../utils/categories';

interface UnifiedTransactionsTableProps {
  transactions: NormalizedTransaction[];
  topExpenses: NormalizedTransaction[];
  runwayAnalysis: RunwayAnalysis;
}

type FilterType = 'all' | 'expense' | 'income' | 'leaks';

const PAGE_SIZE = 25;

export const UnifiedTransactionsTable: React.FC<UnifiedTransactionsTableProps> = ({
  transactions,
  topExpenses,
  runwayAnalysis
}) => {
  const { language, t } = useI18n();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Lista única de bancos presentes en las transacciones
  const availableBanks = useMemo(() => {
    const banks = new Set<string>();
    transactions.forEach((t) => banks.add(t.bankName));
    return Array.from(banks);
  }, [transactions]);

  // Filtrado de transacciones
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Filtro de tipo
      if (filterType === 'expense' && tx.amount >= 0) return false;
      if (filterType === 'income' && tx.amount < 0) return false;
      if (filterType === 'leaks' && !tx.isAvoidableLeak) return false;

      // Filtro de banco
      if (selectedBank !== 'all' && tx.bankName !== selectedBank) return false;

      // Búsqueda por texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchConcept = tx.concept.toLowerCase().includes(query);
        const matchBank = tx.bankName.toLowerCase().includes(query);
        if (!matchConcept && !matchBank) return false;
      }

      return true;
    });
  }, [transactions, filterType, selectedBank, searchQuery]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleBankChange = (bank: string) => {
    setSelectedBank(bank);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Manejador de exportación a Excel
  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const categories = calculateCategoryBreakdown(transactions, runwayAnalysis.monthsSpanned);
      const savingsRate = calculateSavingsRate(
        runwayAnalysis.monthlyIncome,
        runwayAnalysis.monthlyExpenses
      );

      exportToExcel({
        runwayAnalysis,
        categories,
        savingsRate,
        transactions,
        language,
        t
      });
    } catch (e) {
      console.error('Error exportando Excel:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="transactions-section" aria-labelledby="transactions-title">
      {/* Panel Superior: Los 8 Mayores Gastos Identificados */}
      {topExpenses.length > 0 && (
        <div className="top-expenses-card">
          <div className="top-expenses-header">
            <div className="top-expenses-title-group">
              <span className="top-badge">{t('top.badge')}</span>
              <h3 className="top-title">{t('top.title')}</h3>
            </div>
            <p className="top-subtitle">{t('top.subtitle')}</p>
          </div>

          <div className="top-expenses-grid">
            {topExpenses.map((tx, idx) => (
              <div key={tx.id || idx} className="top-expense-item">
                <div className="top-expense-rank">#{idx + 1}</div>
                <div className="top-expense-info">
                  <div className="top-expense-concept" title={tx.concept}>
                    {tx.concept}
                  </div>
                  <div className="top-expense-meta">
                    <span className="meta-date">{formatDate(tx.date, 'short')}</span>
                    <span className="meta-bank-badge">{tx.bankName}</span>
                  </div>
                </div>
                <div className="top-expense-amount">
                  -{formatCurrency(Math.abs(tx.amount))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cabecera, Controles y Botones de Exportación */}
      <div className="table-controls-header">
        <div className="table-header-text">
          <h3 id="transactions-title" className="section-title">
            {t('table.title')}
          </h3>
          <p className="section-subtitle">
            {t('table.subtitle', {
              filtered: filteredTransactions.length,
              total: transactions.length
            })}
          </p>
        </div>

        {/* Acciones de Exportación (Excel & PDF) */}
        <div className="export-actions-group">
          <button
            type="button"
            className="tool-btn export-excel-btn"
            onClick={handleExportExcel}
            disabled={isExporting || transactions.length === 0}
            title={t('export.excel_tooltip')}
          >
            <svg
              className="tool-ic"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <span>{isExporting ? t('export.generating') : t('export.excel_btn')}</span>
          </button>

          <button
            type="button"
            className="tool-btn print-report-btn"
            onClick={triggerPrintReport}
            disabled={transactions.length === 0}
            title={t('export.print_tooltip')}
          >
            <svg
              className="tool-ic"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>{t('export.print_btn')}</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="filters-toolbar">
        <div className="search-box">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={t('table.search_placeholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Buscar concepto o banco"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {availableBanks.length > 1 && (
          <select
            value={selectedBank}
            onChange={(e) => handleBankChange(e.target.value)}
            className="bank-select"
            aria-label="Filtrar por entidad bancaria"
          >
            <option value="all">
              {t('table.all_banks', { count: availableBanks.length })}
            </option>
            {availableBanks.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tabs de Filtro Rápido */}
      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          {t('table.tab_all', { count: transactions.length })}
        </button>
        <button
          type="button"
          className={`filter-tab ${filterType === 'expense' ? 'active' : ''}`}
          onClick={() => handleFilterChange('expense')}
        >
          {t('table.tab_expenses')}
        </button>
        <button
          type="button"
          className={`filter-tab ${filterType === 'income' ? 'active' : ''}`}
          onClick={() => handleFilterChange('income')}
        >
          {t('table.tab_income')}
        </button>
        <button
          type="button"
          className={`filter-tab leak-tab ${filterType === 'leaks' ? 'active' : ''}`}
          onClick={() => handleFilterChange('leaks')}
        >
          {t('table.tab_leaks')}
        </button>
      </div>

      {/* Tabla de Movimientos */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state-box">
          <p>{t('table.empty')}</p>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th scope="col" className="th-date">{t('table.th_date')}</th>
                <th scope="col" className="th-bank">{t('table.th_bank')}</th>
                <th scope="col" className="th-concept">{t('table.th_concept')}</th>
                <th scope="col" className="th-tags">{t('table.th_category')}</th>
                <th scope="col" className="th-amount">{t('table.th_amount')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((tx) => (
                <tr key={tx.id} className={tx.isAvoidableLeak ? 'row-leak' : ''}>
                  <td className="td-date">{formatDate(tx.date, 'short')}</td>
                  <td className="td-bank">
                    <span className="table-bank-pill">{tx.bankName}</span>
                  </td>
                  <td className="td-concept">
                    <span className="concept-text" title={tx.concept}>
                      {tx.concept}
                    </span>
                  </td>
                  <td className="td-tags">
                    {tx.isAvoidableLeak ? (
                      <span className="leak-badge" title={tx.leakReason}>
                        <svg
                          className="tool-ic"
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{tx.leakReason || 'Fuga evitable'}</span>
                      </span>
                    ) : (
                      <span className="type-tag">{tx.type}</span>
                    )}
                  </td>
                  <td className={`td-amount ${tx.amount > 0 ? 'text-income' : 'text-expense'}`}>
                    {tx.amount > 0
                      ? `+${formatCurrency(tx.amount)}`
                      : `-${formatCurrency(Math.abs(tx.amount))}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Página anterior"
          >
            {t('table.page_prev')}
          </button>
          <span className="page-indicator">
            {t('table.page_of', { current: currentPage, total: totalPages })}
          </span>
          <button
            type="button"
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Página siguiente"
          >
            {t('table.page_next')}
          </button>
        </div>
      )}
    </section>
  );
};
export default UnifiedTransactionsTable;
