import type { SavedOperation } from '../types';

const STORAGE_KEY = 'positionlab_journal';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function getOperations(): Promise<SavedOperation[]> {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const ops: SavedOperation[] = JSON.parse(json);
    return ops.sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    console.log('[journalStorage] getOperations ERROR:', e);
    return [];
  }
}

export async function getOperation(id: string): Promise<SavedOperation | null> {
  const ops = await getOperations();
  return ops.find((op) => op.id === id) || null;
}

export async function saveOperation(
  data: Omit<SavedOperation, 'id' | 'timestamp'>
): Promise<SavedOperation | null> {
  try {
    const ops = await getOperations();
    const operation: SavedOperation = {
      id: generateId(),
      timestamp: Date.now(),
      ...data,
    };
    ops.unshift(operation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ops));
    return operation;
  } catch (e) {
    console.log('[journalStorage] saveOperation ERROR:', e);
    return null;
  }
}
