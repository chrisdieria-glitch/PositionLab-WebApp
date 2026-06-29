import { TRADES } from '../constants/trades';
import { formatCurrency } from '../utils/format';
import { getPreciseFontSize } from '../utils/font';
import { calcEntryPrice } from '../utils/calculations';

interface TradeBreakdownProps {
  capitalNum: number;
  startingPriceNum: number;
}

export default function TradeBreakdown({ capitalNum, startingPriceNum }: TradeBreakdownProps) {
  const hasStartingPrice = !isNaN(startingPriceNum) && startingPriceNum > 0;

  return (
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
        const amount = formatCurrency((capitalNum * trade.percent) / 100);
        const entryPrice = hasStartingPrice
          ? calcEntryPrice(startingPriceNum, trade.bajada)
          : 0;
        const formattedEntry = hasStartingPrice ? formatCurrency(entryPrice, 3) : '—';
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
              <span
                className="entry-price-value"
                style={hasStartingPrice ? { fontSize: getPreciseFontSize(formattedEntry, 150) } : undefined}
              >
                {formattedEntry}
              </span>
            </div>
            <div className="col-amount">
              <span
                className="amount-value"
                style={{ fontSize: getPreciseFontSize(`$${amount}`, 130) }}
              >
                ${amount}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
