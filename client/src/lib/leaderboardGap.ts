import type { LeaderboardEntry } from '@panteon/shared';

export function computePointsToTop100(
  meScore: number,
  top100Entries: readonly LeaderboardEntry[],
): number | null {
  if (top100Entries.length === 0) return null;

  const boundary =
    top100Entries.find((e) => e.rank === 100) ??
    top100Entries[top100Entries.length - 1];

  if (!boundary) return null;

  const gap = Math.ceil(boundary.score - meScore + 1);
  return Math.max(0, gap);
}
