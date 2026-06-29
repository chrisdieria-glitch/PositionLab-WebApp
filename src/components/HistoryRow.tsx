interface HistoryRowProps {
  label: string;
  profit?: number;
  onPress: () => void;
}

export default function HistoryRow({ label, profit, onPress }: HistoryRowProps) {
  const isPositive = profit !== undefined && profit > 0;
  const isNegative = profit !== undefined && profit < 0;

  const formattedProfit = (() => {
    if (profit === undefined || profit === 0) return '$0.00';
    const abs = Math.abs(profit).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return profit > 0 ? `+$${abs}` : `-$${abs}`;
  })();

  return (
    <div className="history-row" onClick={onPress} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onPress(); }}>
      <span className="history-label">{label}</span>
      {profit !== undefined && (
        <span
          className={`history-profit ${isPositive ? 'profit-positive' : ''} ${isNegative ? 'profit-negative' : ''}`}
        >
          {formattedProfit}
        </span>
      )}
    </div>
  );
}
