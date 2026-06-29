import './styles.css';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="modal-btn cancel" onClick={onCancel}>
            {cancelLabel || 'Cancel'}
          </button>
          <button className="modal-btn confirm" onClick={onConfirm}>
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
