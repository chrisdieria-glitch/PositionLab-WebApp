import { useState, useEffect } from 'react';
import { getOperations, getOperation } from '../storage/journalStorage';
import {
  getHierarchyLevel,
  groupByYear,
  groupByMonth,
  groupByDay,
} from '../utils/historyGrouping';
import HistoryList from '../components/HistoryList';
import HistoryRow from '../components/HistoryRow';
import JournalViewer from '../components/JournalViewer';
import type { SavedOperation, NavScreen, HistoryListItem } from '../types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface HistoryPageProps {
  reloadTrigger: number;
}

export default function HistoryPage({ reloadTrigger }: HistoryPageProps) {
  const [operations, setOperations] = useState<SavedOperation[]>([]);
  const [navStack, setNavStack] = useState<NavScreen[]>([{ level: 'root' }]);

  const current = navStack[navStack.length - 1];

  useEffect(() => {
    getOperations().then(setOperations);
  }, [reloadTrigger]);

  const push = (screen: NavScreen) => {
    setNavStack((prev) => [...prev, screen]);
  };

  const pop = () => {
    if (navStack.length > 1) {
      setNavStack((prev) => prev.slice(0, -1));
    }
  };

  const renderContent = () => {
    if (operations.length === 0) {
      return (
        <div className="history-empty">No saved operations yet</div>
      );
    }

    switch (current.level) {
      case 'root': {
        const level = getHierarchyLevel(operations);
        if (level === 'years') {
          const years = groupByYear(operations);
          return (
            <HistoryList
              title="History"
              items={years.map((y) => ({
                label: String(y.year),
                profit: y.profit,
                year: y.year,
              }))}
              level="years"
              onSelect={(item: HistoryListItem) => push({ level: 'year', year: item.year })}
            />
          );
        } else if (level === 'months') {
          const months = groupByMonth(operations);
          return (
            <HistoryList
              title="History"
              items={months.map((m) => ({
                label: m.monthLabel,
                profit: m.profit,
                month: m.month,
                year: operations[0].year,
              }))}
              level="months"
              onSelect={(item: HistoryListItem) => push({ level: 'month', year: item.year, month: item.month })}
            />
          );
        } else {
          const first = operations[0];
          const days = groupByDay(operations, first.year, first.month);
          return (
            <HistoryList
              title="History"
              items={days.map((d) => ({
                label: String(d.day),
                profit: d.profit,
                day: d.day,
                year: first.year,
                month: first.month,
                operations: d.operations,
              }))}
              level="days"
              onSelect={(item: HistoryListItem) => {
                if (item.operations && item.operations.length === 1) {
                  push({ level: 'operation', id: item.operations[0].id });
                } else {
                  push({ level: 'day', year: item.year, month: item.month, day: item.day });
                }
              }}
            />
          );
        }
      }

      case 'year': {
        const months = groupByMonth(operations, current.year);
        return (
          <HistoryList
            title={`${current.year}`}
            items={months.map((m) => ({
              label: m.monthLabel,
              profit: m.profit,
              month: m.month,
              year: current.year,
            }))}
            level="months"
            onSelect={(item: HistoryListItem) =>
              push({ level: 'month', year: item.year, month: item.month })
            }
          />
        );
      }

      case 'month': {
        const days = groupByDay(operations, current.year!, current.month!);
        return (
          <HistoryList
            title={`${MONTH_NAMES[current.month!]} ${current.year}`}
            items={days.map((d) => ({
              label: String(d.day),
              profit: d.profit,
              day: d.day,
              operations: d.operations,
            }))}
            level="days"
            onSelect={(item: HistoryListItem) => {
              if (item.operations && item.operations.length === 1) {
                push({ level: 'operation', id: item.operations[0].id });
              } else {
                push({ level: 'day', year: current.year, month: current.month, day: item.day });
              }
            }}
          />
        );
      }

      case 'day': {
        const days = groupByDay(operations, current.year!, current.month!);
        const dayData = days.find((d) => d.day === current.day);
        if (!dayData) return null;
        return (
          <div className="panel">
            <h2 className="section-title">
              {MONTH_NAMES[current.month!]} {current.day}, {current.year}
            </h2>
            {dayData.operations.map((op) => (
              <HistoryRow
                key={op.id}
                label={op.trades && op.trades.length > 0 ? 'Strategy' : 'Operation'}
                profit={op.totalProfit ?? undefined}
                onPress={() => push({ level: 'operation', id: op.id })}
              />
            ))}
          </div>
        );
      }

      case 'operation': {
        return <OperationView operationId={current.id!} />;
      }

      default:
        return null;
    }
  };

  return (
    <div className="page">
      {navStack.length > 1 && (
        <div className="history-header">
          <button className="btn-back" onClick={pop}>
            ← Back
          </button>
        </div>
      )}
      {renderContent()}
    </div>
  );
}

function OperationView({ operationId }: { operationId: string }) {
  const [operation, setOperation] = useState<SavedOperation | null>(null);

  useEffect(() => {
    getOperation(operationId).then(setOperation);
  }, [operationId]);

  if (!operation) return null;

  const dateStr = new Date(operation.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <p className="history-date-label">{dateStr}</p>
      <JournalViewer operation={operation} />
    </div>
  );
}
