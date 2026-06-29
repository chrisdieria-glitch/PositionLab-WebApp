interface DividerBarProps {
  canAddRow: boolean;
  onAddRow: () => void;
}

export default function DividerBar({ canAddRow, onAddRow }: DividerBarProps) {
  return (
    <div className="divider-bar">
      <button
        className="btn-add-price"
        disabled={!canAddRow}
        onClick={onAddRow}
      >
        + Add entry and close price
      </button>
    </div>
  );
}
