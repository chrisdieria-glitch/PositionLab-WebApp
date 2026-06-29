import { TRADES } from '../../../constants/trades';
import { formatCurrency } from '../../../utils/format';
import { calcEntryPrice } from '../../../utils/calculations';
import type { SavedOperation } from '../../../types';
import './styles.css';

interface JournalViewerProps {
  operation: SavedOperation;
}

export default function JournalViewer({ operation }: JournalViewerProps) {
  const { capital, startingPrice, trades, entryWeightedAvg, closeWeightedAvg, totalProfit } = operation;

  const hasStartingPrice = typeof startingPrice === 'number' && startingPrice > 0;
  const hasClose = trades && trades.some((t) => t.closePrice !== null);
  const hasEntry = trades && trades.some((t) => t.entryPrice !== null);

  const formattedEntryAvg = entryWeightedAvg > 0 ? formatCurrency(entryWeightedAvg) : '0.00';
  const formattedCloseAvg = closeWeightedAvg > 0 ? formatCurrency(closeWeightedAvg) : '0.00';

  const formattedTotalProfit = (() => {
    if (totalProfit === null) return '$0.00';
    if (totalProfit === 0) return '$0.00';
    return totalProfit > 0
      ? `+$${formatCurrency(totalProfit)}`
      : `-$${formatCurrency(Math.abs(totalProfit))}`;
  })();

  const isProfitPositive = formattedTotalProfit.startsWith('+');
  const isProfitNegative = formattedTotalProfit.startsWith('-');

  const getEntryPrice = (index: number): number | null => {
    if (hasStartingPrice) {
      return calcEntryPrice(startingPrice, TRADES[index].bajada);
    }
    return trades?.[index]?.entryPrice ?? null;
  };

  return (
    <div>
      <div className="panel">
        <h2 className="section-title">Total Capital</h2>
        <div className="jv-capital-row">
          <span className="jv-capital-value">${formatCurrency(capital)}</span>
        </div>
      </div>

      {hasStartingPrice && (
        <div className="panel">
          <h2 className="section-title">Starting Price</h2>
          <div className="jv-capital-row">
            <span className="jv-capital-value">${formatCurrency(startingPrice)}</span>
          </div>
        </div>
      )}

      <div className="panel">
        <h2 className="section-title">Allocations</h2>
        <div className="table-header">
          <span className="table-header-text col-trade">Trade</span>
          <span className="table-header-text col-size">Alloc</span>
          <span className="table-header-text col-risk">Drop</span>
          <span className="table-header-text col-entry-price">Entry Price</span>
          <span className="table-header-text col-amount">Amount</span>
        </div>
        {TRADES.map((trade) => {
          const amount = formatCurrency((capital * trade.percent) / 100);
          const entry = getEntryPrice(TRADES.indexOf(trade));
          return (
            <div key={trade.id} className="table-row">
              <div className="col-trade">
                <span className="trade-badge">{trade.label}</span>
              </div>
              <div className="col-size">
                <span className="badge-pill badge-blue">{trade.percent}%</span>
              </div>
              <div className="col-risk">
                <span className="badge-pill badge-red">{trade.bajada}%</span>
              </div>
              <div className="col-entry-price">
                <span className="entry-price-value">
                  {entry !== null ? formatCurrency(entry, 3) : '—'}
                </span>
              </div>
              <div className="col-amount">
                <span className="amount-value">${amount}</span>
              </div>
            </div>
          );
        })}
      </div>

      {hasEntry && (
        <div className="panel">
          <h2 className="section-title">Trade History</h2>
          <div className="table-header">
            <span className="table-header-text col-trade">Trade</span>
            <span className="table-header-text col-prices">Prices</span>
            <span className="table-header-text col-profit">Profit</span>
          </div>
          {trades.map((trade, index) => {
            const entry = getEntryPrice(index);
            const close = trade.closePrice;
            const profitCalc = (() => {
              if (entry && close) {
                const allocated = (capital * TRADES[index].percent) / 100;
                const quantity = allocated / entry;
                const p = (close - entry) * quantity;
                const pct = ((close - entry) / entry) * 100;
                return {
                  amount: p === 0 ? '$0.00' : p > 0 ? `+$${formatCurrency(p)}` : `-$${formatCurrency(Math.abs(p))}`,
                  percent: pct === 0 ? '0.00%' : `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`,
                };
              }
              return null;
            })();
            const isPos = profitCalc && profitCalc.amount.startsWith('+');
            const isNeg = profitCalc && profitCalc.amount.startsWith('-');

            return (
              <div key={index} className="table-row">
                <div className="col-trade">
                  <span className="trade-badge">{TRADES[index].label}</span>
                </div>
                <div className="col-prices">
                  <div className="price-row">
                    <span className="price-label">Close:</span>
                    <span className="jv-price-value">
                      {close ? close.toFixed(2) : '—'}
                    </span>
                  </div>
                </div>
                <div className="col-profit">
                  {profitCalc ? (
                    <div className="profit-stack">
                      <span className={`profit-percent ${isPos ? 'profit-positive' : ''} ${isNeg ? 'profit-negative' : ''}`}>
                        {profitCalc.percent}
                      </span>
                      <span className={`profit-amount ${isPos ? 'profit-positive' : ''} ${isNeg ? 'profit-negative' : ''}`}>
                        {profitCalc.amount}
                      </span>
                    </div>
                  ) : (
                    <span className="profit-empty">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="summary-bar">
        <div className="summary-col">
          <span className="summary-label">Entry Average</span>
          <span className="summary-value">${formattedEntryAvg}</span>
        </div>
        {hasClose && (
          <div className="summary-col">
            <span className="summary-label">Close Average</span>
            <span className="summary-value">${formattedCloseAvg}</span>
          </div>
        )}
        <div className="summary-col right">
          <span className="summary-label">Total Profit</span>
          <span
            className={`summary-profit ${isProfitPositive ? 'profit-positive' : ''} ${isProfitNegative ? 'profit-negative' : ''}`}
          >
            {formattedTotalProfit}
          </span>
        </div>
      </div>
    </div>
  );
}
