import type { LeaderboardEntry } from '@panteon/shared';

export const TIER_BANDS = [
  { min: 1, max: 3, key: 'leaderboard.tierPodium', rangeKey: 'leaderboard.tierRangePodium' },
  { min: 4, max: 10, key: 'leaderboard.tierElite', rangeKey: 'leaderboard.tierRangeElite' },
  { min: 11, max: 50, key: 'leaderboard.tierGold', rangeKey: 'leaderboard.tierRangeGold' },
  { min: 51, max: 100, key: 'leaderboard.tierSilver', rangeKey: 'leaderboard.tierRangeSilver' },
] as const;

export type TierI18nKey = (typeof TIER_BANDS)[number]['key'];

export function getTierI18nKey(rank: number): TierI18nKey | undefined {
  return TIER_BANDS.find((t) => rank >= t.min && rank <= t.max)?.key;
}

export function getNextTierI18nKey(rank: number): TierI18nKey | undefined {
  const idx = TIER_BANDS.findIndex((t) => rank >= t.min && rank <= t.max);
  if (idx <= 0) return undefined;
  return TIER_BANDS[idx - 1].key;
}

export function computePointsToNextTier(
  rank: number,
  meScore: number,
  top100Entries: readonly LeaderboardEntry[],
): { tierKey: TierI18nKey; points: number } | null {
  const idx = TIER_BANDS.findIndex((t) => rank >= t.min && rank <= t.max);
  if (idx <= 0) return null;

  const targetRank = TIER_BANDS[idx - 1].max;
  const boundary = top100Entries.find((e) => e.rank === targetRank);
  if (!boundary) return null;

  const points = Math.ceil(boundary.score - meScore + 1);
  if (points <= 0) return null;

  return { tierKey: TIER_BANDS[idx - 1].key, points };
}

export function formatGlobalPlayerCount(n: number, locale: string): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 1 })}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toLocaleString(locale, { maximumFractionDigits: 1 })}K`;
  }
  return n.toLocaleString(locale);
}
