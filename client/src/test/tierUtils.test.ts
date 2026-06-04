import { describe, it, expect } from 'vitest';
import {
  computePointsToNextTier,
  getTierI18nKey,
  getNextTierI18nKey,
} from '@/lib/tierUtils';
import type { LeaderboardEntry } from '@panteon/shared';

function entry(rank: number, score: number): LeaderboardEntry {
  return { userId: `u-${rank}`, rank, score, name: `P${rank}`, avatarUrl: null };
}

describe('tierUtils', () => {
  it('maps rank to tier i18n key', () => {
    expect(getTierI18nKey(1)).toBe('leaderboard.tierPodium');
    expect(getTierI18nKey(8)).toBe('leaderboard.tierElite');
    expect(getTierI18nKey(25)).toBe('leaderboard.tierGold');
    expect(getTierI18nKey(75)).toBe('leaderboard.tierSilver');
  });

  it('returns next tier key', () => {
    expect(getNextTierI18nKey(75)).toBe('leaderboard.tierGold');
    expect(getNextTierI18nKey(1)).toBeUndefined();
  });

  it('computes points to next tier boundary', () => {
    const top = [
      entry(1, 5000),
      entry(10, 3000),
      entry(50, 1500),
      entry(100, 500),
    ];
    const result = computePointsToNextTier(75, 1200, top);
    expect(result?.tierKey).toBe('leaderboard.tierGold');
    expect(result?.points).toBe(301);
  });
});
