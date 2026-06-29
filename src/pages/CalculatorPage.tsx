import { useEffect } from 'react';
import Header from '../components/Header';
import NumericField from '../components/NumericField';
import EmptyState from '../components/EmptyState';
import TradeBreakdown from '../components/TradeBreakdown';
import DividerBar from '../components/DividerBar';
import TradePriceTable from '../components/TradePriceTable';
import TradeSummary from '../components/TradeSummary';
import ConfirmModal from '../components/ConfirmModal';
import SaveButton from '../components/SaveButton';
import { formatCurrency } from '../utils/format';
import { TRADES } from '../constants/trades';
import { saveOperation } from '../storage/journalStorage';
import { calcEntryPrice } from '../utils/calculations';
import { useCalculator } from '../context/CalculatorContext';

interface CalculatorPageProps {
  onSaveComplete?: () => void;
}

export default function CalculatorPage({ onSaveComplete }: CalculatorPageProps) {
  const {
    capital,
    isCapitalLocked,
    showConfirmModal,
    capitalTimerRef,
    handleCapitalChange,
    handleCapitalPress,
    handleConfirmEdit,
    handleCancelEdit,

    startingPrice,
    isStartingPriceLocked,
    showStartingPriceConfirm,
    handleStartingPriceChange,
    handleStartingPricePress,
    handleStartingPriceConfirm,
    handleStartingPriceCancel,

    showSaveConfirm,
    handleSavePress,
    handleSaveCancel,
    setShowSaveConfirm,

    trades,
    closeCount,
    closeRefs,
    handleAddRow,
    handleCloseChange,
    handleDeleteEntry,
    handleDeleteClose,
    canAddRow,
  } = useCalculator();

  const handleSaveConfirm = async () => {
    setShowSaveConfirm(false);
    const now = new Date();
    const op = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      capital: capitalNum,
      startingPrice: startingPriceNum,
      trades: trades.map((t, i) => ({
        label: TRADES[i].label,
        percent: TRADES[i].percent,
        entryPrice: calcEntryPrice(startingPriceNum, TRADES[i].bajada),
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

  useEffect(() => {
    return () => {
      if (capitalTimerRef.current) clearTimeout(capitalTimerRef.current);
    };
  }, []);

  const capitalNum = parseFloat(capital);
  const hasValidCapital = !isNaN(capitalNum) && capitalNum > 0;

  const startingPriceNum = parseFloat(startingPrice);
  const hasValidStartingPrice = !isNaN(startingPriceNum) && startingPriceNum > 0;

  const canShowContent = hasValidCapital && hasValidStartingPrice;

  const profits = trades.map((trade, i) => {
    const entry = calcEntryPrice(startingPriceNum, TRADES[i].bajada);
    const close = parseFloat(trade.closePrice ?? '');
    if (!hasValidStartingPrice || isNaN(entry) || entry <= 0 || isNaN(close) || close <= 0) return null;
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
      if (!hasValidStartingPrice) break;
      const price = calcEntryPrice(startingPriceNum, TRADES[i].bajada);
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
    if (!hasValidStartingPrice) return null;
    let total = 0;
    let hasAny = false;
    for (let i = 0; i < trades.length; i++) {
      const entry = calcEntryPrice(startingPriceNum, TRADES[i].bajada);
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

      <div className="inputs-row">
        <NumericField
          label="Capital"
          value={capital}
          onChange={handleCapitalChange}
          isValid={hasValidCapital}
          formattedValue={hasValidCapital ? formatCurrency(capitalNum) : ''}
          isLocked={isCapitalLocked}
          onRequestEdit={handleCapitalPress}
        />
        <NumericField
          label="Starting Price"
          value={startingPrice}
          onChange={handleStartingPriceChange}
          isValid={hasValidStartingPrice}
          formattedValue={hasValidStartingPrice ? formatCurrency(startingPriceNum) : ''}
          isLocked={isStartingPriceLocked}
          onRequestEdit={handleStartingPricePress}
        />
      </div>

      {!canShowContent ? (
        <EmptyState />
      ) : (
        <TradeBreakdown capitalNum={capitalNum} startingPriceNum={startingPriceNum} />
      )}

      {canShowContent && (
        <DividerBar canAddRow={canAddRow} onAddRow={handleAddRow} />
      )}

      {canShowContent && trades.length > 0 && (
        <TradePriceTable
          trades={trades}
          closeRefs={closeRefs}
          onCloseChange={handleCloseChange}
          onDeleteEntry={handleDeleteEntry}
          profits={profits}
        />
      )}

      {canShowContent && trades.length > 0 && (
        <TradeSummary
          entryAvg={formattedEntryAvg}
          closeAvg={formattedCloseAvg}
          totalProfit={formattedTotalProfit}
          showClose={closeCount > 0}
        />
      )}

      {canShowContent && totalProfit !== null && (
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
        visible={showStartingPriceConfirm}
        title="Change Starting Price"
        message="Are you sure you want to change the starting price? All entry prices will recalculate."
        confirmLabel="Yes, Unlock"
        cancelLabel="Cancel"
        onConfirm={handleStartingPriceConfirm}
        onCancel={handleStartingPriceCancel}
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
