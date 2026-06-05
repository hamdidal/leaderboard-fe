/**
 * Show skeleton until the first successful response or a hard error.
 * Uses React Query `isPending` (canonical initial-load flag).
 */
export function isAwaitingQueryData(isError: boolean, isPending: boolean): boolean {
  return !isError && isPending;
}
