import { TRADES } from '../constants/trades';
import { formatCurrency } from '../utils/format';
import { getPreciseFontSize } from '../utils/font';

interface TradeBreakdownProps {
  capitalNum: number;
}

export default function TradeBreakdown({ capitalNum }: TradeBreakdownProps) {
  return (
    <div className="panel">
      <h2 className="section-title">Allocations</h2>
      <div className="table-header">
        <span className="table-header-text col-trade">Trade</span>
        <span className="table-header-text col-size">Size</span>
        <span className="table-header-text col-risk">Risk</span>
        <span className="table-header-text col-amount">Amount</span>
      </div>
      {TRADES.map((trade) => {
        const amount = formatCurrency((capitalNum * trade.percent) / 100);
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
