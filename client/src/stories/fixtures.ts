import type { LatestRewardsResponse, LeaderboardEntry } from '@panteon/shared';

export function mockEntry(
  rank: number,
  overrides?: Partial<LeaderboardEntry>,
): LeaderboardEntry {
  return {
    userId: overrides?.userId ?? `user-${rank}`,
    name: overrides?.name ?? `Player ${rank}`,
    score: overrides?.score ?? Math.max(1_000, 500_000 - rank * 4_200),
    avatarUrl: overrides?.avatarUrl ?? `https://i.pravatar.cc/150?u=${rank}`,
    rank,
  };
}

export const podiumEntries = {
  first: mockEntry(1, { name: 'Champion Kai', score: 892_400 }),
  second: mockEntry(2, { name: 'Silver Fox', score: 801_200 }),
  third: mockEntry(3, { name: 'Bronze Bolt', score: 745_900 }),
};

export const top100Sample: LeaderboardEntry[] = [
  mockEntry(4, { name: 'Rank Four' }),
  mockEntry(5, { name: 'Rank Five' }),
  mockEntry(76, { userId: 'demo-user', name: 'Demo Hero', score: 12_450 }),
];

export const neighborsOutsideTop100: LeaderboardEntry[] = [
  mockEntry(7995, { score: 8_200 }),
  mockEntry(7996, { score: 8_150 }),
  mockEntry(7997, { score: 8_100 }),
  mockEntry(7999, { score: 7_950 }),
  mockEntry(8000, { score: 7_900 }),
];

export const meOutsideTop100 = mockEntry(7998, {
  userId: 'demo-user-8000',
  name: 'Outside Demo',
  score: 8_050,
});

export const mockRewardsData: LatestRewardsResponse = {
  weekId: '2026W22',
  poolTotal: 1_250_000,
  rewards: [
    { rank: 1, userId: 'u1', amount: 250_000, displayName: 'Champion Kai' },
    { rank: 2, userId: 'u2', amount: 187_500, displayName: 'Silver Fox' },
    { rank: 3, userId: 'u3', amount: 125_000, displayName: 'Bronze Bolt' },
    { rank: 76, userId: 'demo-user', amount: 4_200, displayName: 'Demo Hero' },
  ],
};
