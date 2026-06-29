import { useState } from 'react';
import { TRADES } from '../constants/trades';
import { getPreciseFontSize } from '../utils/font';
import type { TradeEntry, ProfitData } from '../types';

interface TradePriceTableProps {
  trades: TradeEntry[];
  entryRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  closeRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onEntryChange: (index: number, text: string) => void;
  onCloseChange: (index: number, text: string) => void;
  onDeleteEntry: (index: number) => void;
  onDeleteClose: (index: number) => void;
  profits: (ProfitData | null)[];
}

export default function TradePriceTable({
  trades, entryRefs, closeRefs,
  onEntryChange, onCloseChange,
  onDeleteEntry,
  profits,
}: TradePriceTableProps) {
  const [profitWidth, setProfitWidth] = useState(0);

  return (
    <div className="panel">
      <h2 className="section-title">Trade History</h2>
      <div className="table-header">
        <span className="table-header-text col-trade">Trade</span>
        <span className="table-header-text col-prices">Prices</span>
        <span className="table-header-text col-profit">Profit</span>
      </div>
      {trades.map((trade, index) => {
        const profitData = profits[index];
        const isPositive = profitData && profitData.amount.startsWith('+');
        const isNegative = profitData && profitData.amount.startsWith('-');
        const hasEntry = trade.entryPrice !== null;

        return (
          <div key={index} className="table-row">
            <div className="col-trade">
              <span className="trade-badge">{TRADES[index].label}</span>
            </div>
            <div className="col-prices">
              <div className="price-row">
                <span className="price-label">Entry:</span>
                <input
                  ref={el => { entryRefs.current[index] = el; }}
                  type="text"
                  className="price-input entry"
                  placeholder="0.00"
                  value={hasEntry ? trade.entryPrice : ''}
                  onChange={(e) => onEntryChange(index, e.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div className="price-row">
                <span className="price-label">Close:</span>
                <input
                  ref={el => { closeRefs.current[index] = el; }}
                  type="text"
                  className="price-input"
                  placeholder="0.00"
                  value={trade.closePrice ?? ''}
                  onChange={(e) => onCloseChange(index, e.target.value)}
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="trade-action-wrap">
              <div className="col-profit">
                {profitData ? (
                  <div className="profit-stack">
                    <span
                      className={`profit-percent ${isPositive ? 'profit-positive' : ''} ${isNegative ? 'profit-negative' : ''}`}
                    >
                      {profitData.percent}
                    </span>
                    <span
                      ref={index === 0 ? (el) => {
                        if (el) setProfitWidth(el.offsetWidth || 80);
                      } : undefined}
                      className={`profit-amount ${isPositive ? 'profit-positive' : ''} ${isNegative ? 'profit-negative' : ''}`}
                      style={{ fontSize: getPreciseFontSize(profitData.amount, profitWidth || 80) }}
                    >
                      {profitData.amount}
                    </span>
                  </div>
                ) : (
                  <span className="profit-empty">—</span>
                )}
              </div>
              <button
                className="btn-delete-row"
                onClick={() => onDeleteEntry(index)}
                title="Remove trade"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
