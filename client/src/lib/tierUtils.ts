import type { LeaderboardEntry } from '@panteon/shared';

/** Tier names are brand/game terms — always English regardless of UI locale. */
export const TIER_BANDS = [
  {
    min: 1,
    max: 3,
    key: 'leaderboard.tierPodium',
    label: 'Podium',
  },
  {
    min: 4,
    max: 10,
    key: 'leaderboard.tierElite',
    label: 'Elite',
  },
  {
    min: 11,
    max: 50,
    key: 'leaderboard.tierGold',
    label: 'Gold',
  },
  {
    min: 51,
    max: 100,
    key: 'leaderboard.tierSilver',
    label: 'Silver',
  },
] as const;

export type TierI18nKey = (typeof TIER_BANDS)[number]['key'];

export function getTierLabel(tierKey: TierI18nKey): string {
  return TIER_BANDS.find((band) => band.key === tierKey)?.label ?? tierKey;
}

export function getTierI18nKey(rank: number): TierI18nKey | undefined {
  return TIER_BANDS.find((t) => rank >= t.min && rank <= t.max)?.key;
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
