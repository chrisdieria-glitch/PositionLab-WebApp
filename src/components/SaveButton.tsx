interface SaveButtonProps {
  visible: boolean;
  onPress: () => void;
}

export default function SaveButton({ visible, onPress }: SaveButtonProps) {
  if (!visible) return null;

  return (
    <div className="btn-save-wrap">
      <button className="btn-save" onClick={onPress}>
        Save Operation
      </button>
    </div>
  );
}
