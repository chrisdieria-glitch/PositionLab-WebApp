import { TRADES } from '../../../constants/trades';
import { formatCurrency } from '../../../utils/format';
import { getPreciseFontSize } from '../../../utils/font';
import { calcEntryPrice } from '../../../utils/calculations';
import { sanitizeDecimalInput } from '../../../utils/sanitize';

interface TradeBreakdownProps {
  capitalNum: number;
  startingPriceNum: number;
  customDrops: string[];
  onDropChange: (index: number, value: string) => void;
}

export default function TradeBreakdown({ capitalNum, startingPriceNum, customDrops, onDropChange }: TradeBreakdownProps) {
  const hasStartingPrice = !isNaN(startingPriceNum) && startingPriceNum > 0;

  const handleBlur = (index: number, value: string) => {
    const val = parseFloat(value);
    if (value === '' || isNaN(val) || val < 0 || val > 100) {
      onDropChange(index, TRADES[index].bajada.toString());
    }
  };

  return (
    <div className="panel">
      <h2 className="section-title">Allocations</h2>
      <div className="table-header">
        <span className="table-header-text col-trade">Trade</span>
        <span className="table-header-text col-entry-price">Entry Price</span>
        <span className="table-header-text col-risk">Drop</span>
        <span className="table-header-text col-size">Alloc</span>
        <span className="table-header-text col-amount">Amount</span>
      </div>
      {TRADES.map((trade, index) => {
        const amount = formatCurrency((capitalNum * trade.percent) / 100);
        const dropValue = parseFloat(customDrops[index]);
        const effectiveBajada = !isNaN(dropValue) && dropValue >= 0 ? dropValue : trade.bajada;
        const entryPrice = hasStartingPrice
          ? calcEntryPrice(startingPriceNum, effectiveBajada)
          : 0;
        const formattedEntry = hasStartingPrice ? formatCurrency(entryPrice, 3) : '—';
        return (
          <div key={trade.id} className="table-row">
            <div className="col-trade">
              <span className="trade-badge">{trade.label}</span>
            </div>
            <div className="col-entry-price">
              <span
                className="entry-price-value"
                style={hasStartingPrice ? { fontSize: getPreciseFontSize(formattedEntry, 150) } : undefined}
              >
                {formattedEntry}
              </span>
            </div>
            <div className="col-risk">
              <span className="badge-pill badge-red badge-pill--drop">
                <input
                  type="text"
                  className="badge-input"
                  value={customDrops[index]}
                  onChange={(e) => {
                    const cleaned = sanitizeDecimalInput(e.target.value);
                    if (cleaned !== null) onDropChange(index, cleaned);
                  }}
                  onBlur={(e) => handleBlur(index, e.target.value)}
                  inputMode="decimal"
                />
                <span>%</span>
              </span>
            </div>
            <div className="col-size">
              <span className="badge-pill badge-blue">{trade.percent}%</span>
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
