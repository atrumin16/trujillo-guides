import React, { useState } from 'react';
import { useI18n } from '../utils/i18n';
import { formatCurrency } from '../utils/formatters';

export interface GoalItem {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

interface SavingsGoalsTrackerProps {
  monthlySavingsCapacity: number;
  totalLiquidity: number;
}

export const SavingsGoalsTracker: React.FC<SavingsGoalsTrackerProps> = ({
  monthlySavingsCapacity,
  totalLiquidity
}) => {
  const { t } = useI18n();

  // Metas iniciales predeterminadas
  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: 'g1',
      name: 'Fondo de Emergencia (6 meses)',
      targetAmount: 12000,
      currentAmount: Math.min(12000, totalLiquidity)
    },
    {
      id: 'g2',
      name: 'Mantenimiento & Imprevistos Hogar',
      targetAmount: 3000,
      currentAmount: Math.min(3000, Math.max(0, totalLiquidity - 12000))
    }
  ]);

  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const effectiveSavings = Math.max(50, monthlySavingsCapacity);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newGoalAmount);
    if (!newGoalName.trim() || isNaN(amount) || amount <= 0) return;

    setGoals((prev) => [
      ...prev,
      {
        id: 'goal_' + Date.now(),
        name: newGoalName.trim(),
        targetAmount: amount,
        currentAmount: 0
      }
    ]);
    setNewGoalName('');
    setNewGoalAmount('');
    setShowAddForm(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="step-card savings-goals-card">
      <div className="card-header flex-between">
        <div>
          <span className="card-badge">Planificación Financiera</span>
          <h3 className="card-title">{t('goals.title')}</h3>
          <p className="card-description">{t('goals.desc')}</p>
        </div>
        <button
          type="button"
          className="add-goal-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Cancelar' : `+ ${t('goals.add_btn')}`}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddGoal} className="add-goal-form">
          <input
            type="text"
            className="goal-input"
            placeholder={t('goals.name_placeholder')}
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            maxLength={50}
            required
          />
          <input
            type="number"
            className="goal-input amount"
            placeholder={t('goals.amount_placeholder')}
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(e.target.value)}
            min="100"
            step="100"
            required
          />
          <button type="submit" className="goal-submit-btn">
            Crear Meta
          </button>
        </form>
      )}

      <div className="goals-grid">
        {goals.map((goal) => {
          const progressPct = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );
          const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
          const monthsNeeded = Math.ceil(remainingAmount / effectiveSavings);

          const targetDate = new Date();
          targetDate.setMonth(targetDate.getMonth() + monthsNeeded);
          const formattedDate = targetDate.toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric'
          });

          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-card-header">
                <h4 className="goal-name">{goal.name}</h4>
                <button
                  type="button"
                  className="goal-del-btn"
                  onClick={() => handleDeleteGoal(goal.id)}
                  aria-label="Eliminar meta"
                >
                  &times;
                </button>
              </div>

              <div className="goal-amounts">
                <span className="goal-current">{formatCurrency(goal.currentAmount)}</span>
                <span className="goal-target">de {formatCurrency(goal.targetAmount)}</span>
              </div>

              <div className="goal-progress-bar-bg">
                <div
                  className="goal-progress-bar-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="goal-meta-row">
                <span className="goal-pct">{progressPct}% completado</span>
                <span className="goal-time">
                  {remainingAmount === 0
                    ? '¡Meta alcanzada!'
                    : `En ~${monthsNeeded} meses (${formattedDate})`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
