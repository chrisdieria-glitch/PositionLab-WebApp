export function calcEntryPrice(startingPrice: number, bajada: number): number {
  return startingPrice * (1 - bajada / 100);
}
