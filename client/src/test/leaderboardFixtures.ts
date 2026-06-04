import type {
  LatestRewardsResponse,
  MeLeaderboardResponse,
  PoolResponse,
  TopLeaderboardResponse,
  WeekCurrentResponse,
} from '@panteon/shared';
import type { LeaderboardEntry } from '@panteon/shared';

export function mockEntry(
  rank: number,
  overrides?: Partial<LeaderboardEntry>,
): LeaderboardEntry {
  return {
    rank,
    userId: overrides?.userId ?? `user-${rank}`,
    name: overrides?.name ?? `Player ${rank}`,
    score: overrides?.score ?? Math.max(1_000, 500_000 - rank * 4_200),
    avatarUrl: overrides?.avatarUrl ?? null,
  };
}

export const mockWeekActive: WeekCurrentResponse = {
  weekId: '2026W23',
  startsAt: '2026-06-02T00:00:00.000Z',
  endsAt: '2026-06-09T00:00:00.000Z',
  status: 'ACTIVE',
  secondsRemaining: 86400,
  totalPlayers: 50_000,
};

export const mockPool: PoolResponse = {
  weekId: '2026W23',
  poolTotal: 1_250_000,
};

export const mockTop100: TopLeaderboardResponse = {
  weekId: '2026W23',
  entries: Array.from({ length: 100 }, (_, i) => {
    const rank = i + 1;
    if (rank === 76) {
      return mockEntry(76, { userId: 'demo-user', name: 'Demo Hero', score: 12_450 });
    }
    return mockEntry(rank);
  }),
};

export const mockMeInTop100: MeLeaderboardResponse = {
  weekId: '2026W23',
  inTop100: true,
  me: mockEntry(76, { userId: 'demo-user', name: 'Demo Hero', score: 12_450 }),
  neighbors: [
    mockEntry(73),
    mockEntry(74),
    mockEntry(75),
    mockEntry(77),
    mockEntry(78),
  ],
};

export const mockMeOutsideTop100: MeLeaderboardResponse = {
  weekId: '2026W23',
  inTop100: false,
  me: mockEntry(8001, { userId: 'demo-user-8000', name: 'Outside Demo', score: 7_900 }),
  neighbors: [
    mockEntry(7998),
    mockEntry(7999),
    mockEntry(8000),
    mockEntry(8002),
    mockEntry(8003),
  ],
};

export const mockRewardsEmpty: LatestRewardsResponse = {
  weekId: null,
  poolTotal: 0,
  rewards: [],
};
