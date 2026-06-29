interface TradeSummaryProps {
  entryAvg: string;
  closeAvg: string;
  totalProfit: string;
  showClose: boolean;
}

export default function TradeSummary({ entryAvg, closeAvg, totalProfit, showClose }: TradeSummaryProps) {
  const isPositive = totalProfit.startsWith('+');
  const isNegative = totalProfit.startsWith('-');

  return (
    <div className="summary-bar">
      <div className="summary-col">
        <span className="summary-label">Entry Average</span>
        <span className="summary-value">${entryAvg}</span>
      </div>
      {showClose && (
        <div className="summary-col">
          <span className="summary-label">Close Average</span>
          <span className="summary-value">${closeAvg}</span>
        </div>
      )}
      <div className="summary-col right">
        <span className="summary-label">Total Profit</span>
        <span
          className={`summary-profit ${isPositive ? 'profit-positive' : ''} ${isNegative ? 'profit-negative' : ''}`}
        >
          {totalProfit}
        </span>
      </div>
    </div>
  );
}
