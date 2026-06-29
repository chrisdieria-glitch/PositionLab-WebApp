import { useRef, useEffect } from 'react';

interface CapitalInputProps {
  capital: string;
  onChange: (text: string) => void;
  hasValidCapital: boolean;
  formattedCapital: string;
  isLocked: boolean;
  onRequestEdit: () => void;
}

export default function CapitalInput({
  capital,
  onChange,
  hasValidCapital,
  formattedCapital,
  isLocked,
  onRequestEdit,
}: CapitalInputProps) {
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
    <div
      className="capital-input-row"
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
          value={capital}
          onChange={handleChange}
          disabled={isLocked}
          inputMode="decimal"
        />
      </div>
      {hasValidCapital && (
        <div className="capital-total-wrap">
          <span className="capital-total">${formattedCapital}</span>
          {isLocked && <span className="locked-badge">Locked</span>}
        </div>
      )}
    </div>
  );
}
