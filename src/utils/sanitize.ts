export function sanitizeDecimalInput(text: string): string | null {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return null;
  return cleaned;
}
