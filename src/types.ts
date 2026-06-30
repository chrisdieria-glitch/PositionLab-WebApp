export interface TradeEntry {
  closePrice: string | null;
}

export interface ProfitData {
  amount: string;
  percent: string;
}

export interface SavedTrade {
  label: string;
  percent: number;
  entryPrice: number | null;
  closePrice: number | null;
  marketDropPercent?: number;
}

export interface SavedOperation {
  id: string;
  timestamp: number;
  year: number;
  month: number;
  day: number;
  capital: number;
  startingPrice: number;
  trades: SavedTrade[];
  entryWeightedAvg: number;
  closeWeightedAvg: number;
  totalProfit: number | null;
}

export interface YearGroup {
  year: number;
  profit: number;
  count: number;
}

export interface MonthGroup {
  month: number;
  monthLabel: string;
  profit: number;
  count: number;
}

export interface DayGroup {
  day: number;
  profit: number;
  operations: SavedOperation[];
}

export interface HistoryListItem {
  label: string;
  profit?: number;
  year?: number;
  month?: number;
  day?: number;
  operations?: SavedOperation[];
}

export type TabKey = 'calculator' | 'history';
export type NavLevel = 'root' | 'year' | 'month' | 'day' | 'operation';

export interface NavScreen {
  level: NavLevel;
  year?: number;
  month?: number;
  day?: number;
  id?: string;
}
