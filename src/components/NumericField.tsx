import { useRef, useEffect } from 'react';

interface NumericFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  isValid: boolean;
  formattedValue: string;
  isLocked: boolean;
  onRequestEdit: () => void;
}

export default function NumericField({
  label,
  value,
  onChange,
  isValid,
  formattedValue,
  isLocked,
  onRequestEdit,
}: NumericFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLocked) {
      inputRef.current?.focus();
    }
  }, [isLocked]);

  const handleClick = () => {
    if (isLocked) onRequestEdit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLocked) onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isLocked && (e.key === 'Enter' || e.key === ' ')) {
      onRequestEdit();
    }
  };

  return (
    <div className="numeric-field">
      <label className="numeric-field-label">{label}</label>
      <div
        className="numeric-field-content"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className="capital-input-wrap">
          <input
            ref={inputRef}
            type="text"
            className={`capital-input ${isLocked ? 'locked' : ''}`}
            placeholder="0.00"
            value={value}
            onChange={handleChange}
            disabled={isLocked}
            inputMode="decimal"
          />
        </div>
        {isValid && (
          <div className="capital-total-wrap">
            <span className="capital-total">{formattedValue}</span>
            {isLocked && <span className="locked-badge">Locked</span>}
          </div>
        )}
      </div>
    </div>
  );
}
