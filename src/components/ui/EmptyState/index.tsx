import './styles.css';

export default function EmptyState() {
  return (
    <div className="empty-state">
      <p className="empty-title">No capital entered</p>
      <p className="empty-text">
        Enter your trading capital above to see how it splits across 5 trades.
      </p>
    </div>
  );
}
