export function getPreciseFontSize(amountStr: string, containerWidth: number): number {
  if (!containerWidth || containerWidth <= 0) return 20;
  const charWidth = 10.5;
  const estTextWidth = amountStr.length * charWidth;
  const ratio = (containerWidth - 4) / estTextWidth;
  return Math.max(13, Math.min(20, Math.floor(20 * ratio)));
}
