import { describe, it, expect } from 'vitest';
import { computePointsToTop100 } from '@/lib/leaderboardGap';
import type { LeaderboardEntry } from '@panteon/shared';

function entry(rank: number, score: number): LeaderboardEntry {
  return { userId: `u-${rank}`, rank, score, name: `P${rank}`, avatarUrl: null };
}

describe('computePointsToTop100', () => {
  const top100 = [
    ...Array.from({ length: 99 }, (_, i) => entry(i + 1, 2000)),
    entry(100, 1000),
  ];

  it('returns gap to beat rank 100 score', () => {
    expect(computePointsToTop100(100, top100)).toBe(901);
  });

  it('returns 0 when already above rank 100 score', () => {
    expect(computePointsToTop100(1500, top100)).toBe(0);
  });

  it('returns null when top list is empty', () => {
    expect(computePointsToTop100(500, [])).toBeNull();
  });
});
