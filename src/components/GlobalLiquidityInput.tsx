import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';
import { useI18n } from '../utils/i18n';

interface GlobalLiquidityInputProps {
  value: number;
  onChange: (val: number) => void;
}

const PRESET_AMOUNTS = [5000, 10000, 20000, 30000, 50000, 100000];

// Formatea un número con separador de miles español (15000 -> 15.000)
function formatThousands(numStr: string): string {
  if (!numStr) return '';
  const clean = numStr.replace(/[^0-9]/g, '');
  if (!clean) return '';
  return parseInt(clean, 10).toLocaleString('es-ES');
}

export const GlobalLiquidityInput: React.FC<GlobalLiquidityInputProps> = ({
  value,
  onChange
}) => {
  const { t } = useI18n();
  const [displayValue, setDisplayValue] = useState<string>(
    value > 0 ? value.toLocaleString('es-ES') : ''
  );

  useEffect(() => {
    setDisplayValue(value > 0 ? value.toLocaleString('es-ES') : '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const num = parseInt(raw, 10);
    setDisplayValue(formatThousands(raw));
    onChange(num);
  };

  const handleAdjust = (delta: number) => {
    const next = Math.max(0, (value || 0) + delta);
    onChange(next);
  };

  const handlePreset = (amount: number) => {
    onChange(amount);
  };

  return (
    <section className="step-card" aria-labelledby="step1-title">
      <div className="step-badge-row">
        <span className="step-badge">{t('step1.badge')}</span>
        <h2 id="step1-title" className="step-title">
          {t('step1.title')}
        </h2>
      </div>

      <p className="step-description">{t('step1.desc')}</p>

      <div className="liquidity-input-wrapper">
        <div className="liquidity-input-box">
          <label htmlFor="liquidity-input" className="sr-only">
            {t('step1.input_label')}
          </label>
          <div className="currency-prefix">€</div>
          <input
            id="liquidity-input"
            type="text"
            inputMode="numeric"
            className="large-liquidity-input"
            placeholder="0"
            value={displayValue}
            onChange={handleInputChange}
            aria-describedby="liquidity-help"
            autoComplete="off"
            spellCheck="false"
          />
          <div className="liquidity-steppers">
            <button
              type="button"
              className="stepper-btn"
              onClick={() => handleAdjust(-1000)}
              disabled={value <= 0}
              aria-label={t('step1.stepper_minus')}
              title="-1.000 €"
            >
              -1.000
            </button>
            <button
              type="button"
              className="stepper-btn"
              onClick={() => handleAdjust(1000)}
              aria-label={t('step1.stepper_plus')}
              title="+1.000 €"
            >
              +1.000
            </button>
            <button
              type="button"
              className="stepper-btn stepper-btn-lg"
              onClick={() => handleAdjust(5000)}
              aria-label="Añadir 5.000 €"
              title="+5.000 €"
            >
              +5.000
            </button>
          </div>
        </div>

        {value > 0 && (
          <div className="formatted-preview" aria-live="polite">
            {t('step1.active_preview')}{' '}
            <strong>{formatCurrency(value, { hideCents: true })}</strong>
          </div>
        )}

        <div className="presets-row">
          <span className="presets-label">{t('step1.presets_label')}</span>
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`preset-chip ${value === preset ? 'active' : ''}`}
              onClick={() => handlePreset(preset)}
            >
              {formatCurrency(preset, { hideCents: true })}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
