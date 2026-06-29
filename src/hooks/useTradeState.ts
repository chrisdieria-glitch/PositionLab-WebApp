import { useState, useRef, useLayoutEffect } from 'react';
import type { TradeEntry } from '../types';
import { MAX_TRADES } from '../constants/trades';
import { sanitizeDecimalInput } from '../utils/sanitize';

export function useTradeState() {
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const entryRefs = useRef<(HTMLInputElement | null)[]>([]);
  const closeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const prevTradesLen = useRef(0);
  const prevCloseCount = useRef(0);

  useLayoutEffect(() => {
    if (trades.length > prevTradesLen.current) {
      entryRefs.current[trades.length - 1]?.focus();
    }
    prevTradesLen.current = trades.length;
  }, [trades.length]);

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
      setTrades([...trades, { entryPrice: '', closePrice: '' }]);
    }
  };

  const handleEntryChange = (index: number, text: string) => {
    const cleaned = sanitizeDecimalInput(text);
    if (cleaned === null) return;
    setTrades(prev => {
      const next = [...prev];
      next[index] = { ...next[index], entryPrice: cleaned };
      return next;
    });
  };

  const handleCloseChange = (index: number, text: string) => {
    const cleaned = sanitizeDecimalInput(text);
    if (cleaned === null) return;
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

  const entryCount = trades.length;
  const closeCount = trades.filter(t => t.closePrice !== null && t.closePrice !== '').length;

  return {
    trades,
    entryCount,
    closeCount,
    entryRefs,
    closeRefs,
    handleAddRow,
    handleEntryChange,
    handleCloseChange,
    handleDeleteEntry,
    handleDeleteClose,
    canAddRow: entryCount < MAX_TRADES,
    canAddClose: entryCount < MAX_TRADES,
  };
}
