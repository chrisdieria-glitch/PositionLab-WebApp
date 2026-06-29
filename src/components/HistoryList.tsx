import HistoryRow from './HistoryRow';
import type { HistoryListItem } from '../types';

interface HistoryListProps {
  items: HistoryListItem[];
  level: string;
  onSelect: (item: HistoryListItem) => void;
  title: string;
}

export default function HistoryList({ items, level, onSelect, title }: HistoryListProps) {
  return (
    <div className="panel">
      <h2 className="section-title">{title}</h2>
      {items.length === 0 ? (
        <p className="history-empty">No saved operations</p>
      ) : (
        items.map((item, index) => (
          <HistoryRow
            key={level === 'years' ? `y-${item.year}` : level === 'months' ? `m-${item.month}` : `d-${index}`}
            label={item.label}
            profit={item.profit}
            onPress={() => onSelect(item)}
          />
        ))
      )}
    </div>
  );
}
