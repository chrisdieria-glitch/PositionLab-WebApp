import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type { ReactNode, MutableRefObject } from 'react';
import type { TradeEntry } from '../types';
import { useTradeState } from '../hooks/useTradeState';
import { sanitizeDecimalInput } from '../utils/sanitize';

interface CalculatorContextValue {
  capital: string;
  isCapitalLocked: boolean;
  showConfirmModal: boolean;
  capitalTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  handleCapitalChange: (text: string) => void;
  handleCapitalPress: () => void;
  handleConfirmEdit: () => void;
  handleCancelEdit: () => void;

  startingPrice: string;
  isStartingPriceLocked: boolean;
  showStartingPriceConfirm: boolean;
  startingPriceTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  handleStartingPriceChange: (text: string) => void;
  handleStartingPricePress: () => void;
  handleStartingPriceConfirm: () => void;
  handleStartingPriceCancel: () => void;

  showSaveConfirm: boolean;
  handleSavePress: () => void;
  handleSaveCancel: () => void;
  setShowSaveConfirm: (v: boolean) => void;

  trades: TradeEntry[];
  closeCount: number;
  closeRefs: MutableRefObject<(HTMLInputElement | null)[]>;
  handleAddRow: () => void;
  handleCloseChange: (index: number, text: string) => void;
  handleDeleteEntry: (index: number) => void;
  handleDeleteClose: (index: number) => void;
  canAddRow: boolean;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [capital, setCapital] = useState('');
  const [isCapitalLocked, setIsCapitalLocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const capitalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [startingPrice, setStartingPrice] = useState('');
  const [isStartingPriceLocked, setIsStartingPriceLocked] = useState(false);
  const [showStartingPriceConfirm, setShowStartingPriceConfirm] = useState(false);
  const startingPriceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const {
    trades,
    closeCount,
    closeRefs,
    handleAddRow,
    handleCloseChange,
    handleDeleteEntry,
    handleDeleteClose,
    canAddRow,
  } = useTradeState();

  useEffect(() => {
    return () => {
      if (capitalTimerRef.current) clearTimeout(capitalTimerRef.current);
      if (startingPriceTimerRef.current) clearTimeout(startingPriceTimerRef.current);
    };
  }, []);

  const handleCapitalChange = useCallback((text: string) => {
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
  }, []);

  const handleCapitalPress = useCallback(() => {
    if (isCapitalLocked) setShowConfirmModal(true);
  }, [isCapitalLocked]);

  const handleConfirmEdit = useCallback(() => {
    setShowConfirmModal(false);
    setIsCapitalLocked(false);
    if (capitalTimerRef.current) clearTimeout(capitalTimerRef.current);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const handleStartingPriceChange = useCallback((text: string) => {
    const cleaned = sanitizeDecimalInput(text);
    if (cleaned === null) return;
    setStartingPrice(cleaned);
    setIsStartingPriceLocked(false);
    if (startingPriceTimerRef.current) clearTimeout(startingPriceTimerRef.current);
    startingPriceTimerRef.current = setTimeout(() => {
      const num = parseFloat(cleaned);
      if (!isNaN(num) && num > 0) {
        setIsStartingPriceLocked(true);
      }
    }, 10000);
  }, []);

  const handleStartingPricePress = useCallback(() => {
    if (isStartingPriceLocked) setShowStartingPriceConfirm(true);
  }, [isStartingPriceLocked]);

  const handleStartingPriceConfirm = useCallback(() => {
    setShowStartingPriceConfirm(false);
    setIsStartingPriceLocked(false);
    if (startingPriceTimerRef.current) clearTimeout(startingPriceTimerRef.current);
  }, []);

  const handleStartingPriceCancel = useCallback(() => {
    setShowStartingPriceConfirm(false);
  }, []);

  const handleSavePress = useCallback(() => {
    setShowSaveConfirm(true);
  }, []);

  const handleSaveCancel = useCallback(() => {
    setShowSaveConfirm(false);
  }, []);

  return (
    <CalculatorContext.Provider
      value={{
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
        startingPriceTimerRef,
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
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error('useCalculator must be used within CalculatorProvider');
  return ctx;
}
