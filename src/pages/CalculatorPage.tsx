import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import CapitalInput from '../components/CapitalInput';
import EmptyState from '../components/EmptyState';
import TradeBreakdown from '../components/TradeBreakdown';
import DividerBar from '../components/DividerBar';
import TradePriceTable from '../components/TradePriceTable';
import TradeSummary from '../components/TradeSummary';
import ConfirmModal from '../components/ConfirmModal';
import SaveButton from '../components/SaveButton';
import { sanitizeDecimalInput } from '../utils/sanitize';
import { formatCurrency } from '../utils/format';
import { TRADES } from '../constants/trades';
import { useTradeState } from '../hooks/useTradeState';
import { saveOperation } from '../storage/journalStorage';

interface CalculatorPageProps {
  onSaveComplete?: () => void;
}

export default function CalculatorPage({ onSaveComplete }: CalculatorPageProps) {
  const [capital, setCapital] = useState('');
  const [isCapitalLocked, setIsCapitalLocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const capitalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    trades,
    closeCount,
    entryRefs,
    closeRefs,
    handleAddRow,
    handleEntryChange,
    handleCloseChange,
    handleDeleteEntry,
    handleDeleteClose,
    canAddRow,
  } = useTradeState();

  const handleCapitalChange = (text: string) => {
    const cleaned = sanitizeDecimalInput(text);
    if (cleaned === null) return;
    setCapital(cleaned);
    setIsCapitalLocked(false);
    if (capitalTimerRef.current) clearTimeout(capitalTimerRef.current);
    capitalTimerRef.current = setTimeout(() => {
      const num = parseFloat(cleaned);
      if (!isNaN(num) && num > 0) {
        setIsCapitalLocked(true);
      }
    }, 10000);
  };

  const handleCapitalPress = () => {
    if (isCapitalLocked) setShowConfirmModal(true);
  };

  const handleConfirmEdit = () => {
    setShowConfirmModal(false);
    setIsCapitalLocked(false);
    if (capitalTimerRef.current) clearTimeout(capitalTimerRef.current);
  };

  const handleCancelEdit = () => {
    setShowConfirmModal(false);
  };

  const handleSavePress = () => {
    setShowSaveConfirm(true);
  };

  const handleSaveConfirm = async () => {
    setShowSaveConfirm(false);
    const now = new Date();
    const op = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      capital: capitalNum,
      trades: trades.map((t, i) => ({
        label: TRADES[i].label,
        percent: TRADES[i].percent,
        entryPrice: t.entryPrice !== '' ? parseFloat(t.entryPrice) : null,
        closePrice: t.closePrice !== '' && t.closePrice !== null ? parseFloat(t.closePrice) : null,
      })),
      entryWeightedAvg,
      closeWeightedAvg,
      totalProfit,
    };
    const result = await saveOperation(op);
    if (result === null) {
      alert('Could not save the operation. Check console for details.');
    } else if (onSaveComplete) {
      onSaveComplete();
    }
  };

  const handleSaveCancel = () => {
    setShowSaveConfirm(false);
  };

  useEffect(() => {
    return () => {
      if (capitalTimerRef.current) clearTimeout(capitalTimerRef.current);
    };
  }, []);

  const capitalNum = parseFloat(capital);
  const hasValidCapital = !isNaN(capitalNum) && capitalNum > 0;

  const profits = trades.map((trade, i) => {
    const entry = parseFloat(trade.entryPrice);
    const close = parseFloat(trade.closePrice ?? '');
    if (isNaN(entry) || entry <= 0 || isNaN(close) || close <= 0) return null;
    const allocated = (capitalNum * TRADES[i].percent) / 100;
    const quantity = allocated / entry;
    const profit = (close - entry) * quantity;
    const percentReturn = ((close - entry) / entry) * 100;
    return {
      amount: profit === 0
        ? '$0.00'
        : profit > 0
          ? `+$${formatCurrency(profit)}`
          : `-$${formatCurrency(Math.abs(profit))}`,
      percent: percentReturn === 0
        ? '0.00%'
        : `${percentReturn > 0 ? '+' : ''}${percentReturn.toFixed(2)}%`,
    };
  });

  const entryWeightedAvg = (() => {
    let sum = 0;
    let totalWeight = 0;
    for (let i = 0; i < trades.length; i++) {
      const price = parseFloat(trades[i].entryPrice);
      if (!isNaN(price) && price > 0) {
        sum += price * TRADES[i].percent;
        totalWeight += TRADES[i].percent;
      }
    }
    return totalWeight > 0 ? sum / totalWeight : 0;
  })();

  const closeWeightedAvg = (() => {
    let sum = 0;
    let totalWeight = 0;
    for (let i = 0; i < trades.length; i++) {
      const price = parseFloat(trades[i].closePrice ?? '');
      if (!isNaN(price) && price > 0) {
        sum += price * TRADES[i].percent;
        totalWeight += TRADES[i].percent;
      }
    }
    return totalWeight > 0 ? sum / totalWeight : 0;
  })();

  const totalProfit = (() => {
    let total = 0;
    let hasAny = false;
    for (let i = 0; i < trades.length; i++) {
      const entry = parseFloat(trades[i].entryPrice);
      const close = parseFloat(trades[i].closePrice ?? '');
      if (isNaN(entry) || entry <= 0 || isNaN(close) || close <= 0) continue;
      const allocated = (capitalNum * TRADES[i].percent) / 100;
      const quantity = allocated / entry;
      total += (close - entry) * quantity;
      hasAny = true;
    }
    return hasAny ? total : null;
  })();

  const formattedEntryAvg = entryWeightedAvg > 0 ? formatCurrency(entryWeightedAvg) : '0.00';
  const formattedCloseAvg = closeWeightedAvg > 0 ? formatCurrency(closeWeightedAvg) : '0.00';

  const formattedTotalProfit = (() => {
    if (totalProfit === null) return '$0.00';
    if (totalProfit === 0) return '$0.00';
    return totalProfit > 0
      ? `+$${formatCurrency(totalProfit)}`
      : `-$${formatCurrency(Math.abs(totalProfit))}`;
  })();

  return (
    <div className="page">
      <Header />

      <CapitalInput
        capital={capital}
        onChange={handleCapitalChange}
        hasValidCapital={hasValidCapital}
        formattedCapital={hasValidCapital ? formatCurrency(capitalNum) : ''}
        isLocked={isCapitalLocked}
        onRequestEdit={handleCapitalPress}
      />

      {!hasValidCapital ? (
        <EmptyState />
      ) : (
        <TradeBreakdown capitalNum={capitalNum} />
      )}

      {hasValidCapital && (
        <DividerBar canAddRow={canAddRow} onAddRow={handleAddRow} />
      )}

      {hasValidCapital && trades.length > 0 && (
        <TradePriceTable
          trades={trades}
          entryRefs={entryRefs}
          closeRefs={closeRefs}
          onEntryChange={handleEntryChange}
          onCloseChange={handleCloseChange}
          onDeleteEntry={handleDeleteEntry}
          onDeleteClose={handleDeleteClose}
          profits={profits}
        />
      )}

      {hasValidCapital && trades.length > 0 && (
        <TradeSummary
          entryAvg={formattedEntryAvg}
          closeAvg={formattedCloseAvg}
          totalProfit={formattedTotalProfit}
          showClose={closeCount > 0}
        />
      )}

      {hasValidCapital && totalProfit !== null && (
        <SaveButton visible={true} onPress={handleSavePress} />
      )}

      <ConfirmModal
        visible={showConfirmModal}
        title="Change Capital"
        message="Are you sure you want to change the capital? All trade calculations will update."
        confirmLabel="Yes, Unlock"
        cancelLabel="Cancel"
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
      />

      <ConfirmModal
        visible={showSaveConfirm}
        title="Save Operation"
        message="Are you sure you finished this strategy?"
        confirmLabel="Save"
        cancelLabel="Cancel"
        onConfirm={handleSaveConfirm}
        onCancel={handleSaveCancel}
      />
    </div>
  );
}
