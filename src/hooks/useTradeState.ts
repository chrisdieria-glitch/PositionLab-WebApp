import { useState, useRef, useLayoutEffect } from 'react';
import type { TradeEntry } from '../types';
import { MAX_TRADES } from '../constants/trades';
import { sanitizeDecimalInput } from '../utils/sanitize';

export function useTradeState() {
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const closeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const prevCloseCount = useRef(0);

  useLayoutEffect(() => {
    const closeCount = trades.filter(t => t.closePrice !== null && t.closePrice !== '').length;
    if (closeCount > prevCloseCount.current) {
      for (let i = 0; i < trades.length; i++) {
        if (trades[i].closePrice === '') {
          closeRefs.current[i]?.focus();
          break;
        }
      }
    }
    prevCloseCount.current = closeCount;
  }, [trades]);

  const handleAddRow = () => {
    if (trades.length < MAX_TRADES) {
      setTrades([...trades, { closePrice: '' }]);
    }
  };

  const handleCloseChange = (index: number, text: string) => {
    const cleaned = sanitizeDecimalInput(text);
    if (cleaned === null) return;
    if (cleaned.length > 27) return;
    setTrades(prev => {
      const next = [...prev];
      next[index] = { ...next[index], closePrice: cleaned };
      return next;
    });
  };

  const handleDeleteEntry = (index: number) => {
    setTrades(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteClose = (index: number) => {
    setTrades(prev => {
      const next = [...prev];
      next[index] = { ...next[index], closePrice: null };
      return next;
    });
  };

  const closeCount = trades.filter(t => t.closePrice !== null && t.closePrice !== '').length;

  return {
    trades,
    closeCount,
    closeRefs,
    handleAddRow,
    handleCloseChange,
    handleDeleteEntry,
    handleDeleteClose,
    canAddRow: trades.length < MAX_TRADES,
  };
}
