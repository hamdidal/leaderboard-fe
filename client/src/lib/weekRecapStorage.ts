const RECAP_DISMISSED_KEY = 'panteon-recap-dismissed-week';

export function getRecapDismissedWeekId(): string | null {
  try {
    return localStorage.getItem(RECAP_DISMISSED_KEY);
  } catch {
    return null;
  }
}

export function markRecapDismissed(weekId: string): void {
  try {
    localStorage.setItem(RECAP_DISMISSED_KEY, weekId);
  } catch {
    // ignore quota / private mode
  }
}

export function isRecapDismissed(weekId: string): boolean {
  return getRecapDismissedWeekId() === weekId;
}
