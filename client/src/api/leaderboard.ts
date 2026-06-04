import type {
  LatestRewardsResponse,
  MeLeaderboardResponse,
  PoolResponse,
  TopLeaderboardResponse,
  WeekCurrentResponse,
} from '@panteon/shared';
import { apiFetch } from './client';

export function fetchTop100(): Promise<TopLeaderboardResponse> {
  return apiFetch('/api/leaderboard/top');
}

export function fetchMe(token: string): Promise<MeLeaderboardResponse> {
  return apiFetch('/api/leaderboard/me', { token });
}

export function fetchPool(): Promise<PoolResponse> {
  return apiFetch('/api/pool');
}

export function fetchCurrentWeek(): Promise<WeekCurrentResponse> {
  return apiFetch('/api/week/current');
}

export function fetchDemoToken(userId: string): Promise<{ token: string }> {
  return apiFetch('/api/auth/demo-token', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function fetchRewardsForWeek(weekId: string): Promise<LatestRewardsResponse> {
  return apiFetch(`/api/rewards/${encodeURIComponent(weekId)}`);
}

export function fetchLatestRewards(): Promise<LatestRewardsResponse> {
  return apiFetch<LatestRewardsResponse>('/api/rewards/latest');
}
