import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LeaderboardPage } from '@/features/leaderboard/LeaderboardPage';
import { renderWithProviders } from './renderWithProviders';
import {
  mockMeInTop100,
  mockMeOutsideTop100,
  mockPool,
  mockRewardsEmpty,
  mockTop100,
  mockWeekActive,
} from './leaderboardFixtures';

const fetchTop100 = vi.fn();
const fetchPool = vi.fn();
const fetchCurrentWeek = vi.fn();
const fetchMe = vi.fn();
const fetchLatestRewards = vi.fn();
const fetchDemoToken = vi.fn();

vi.mock('@/api/leaderboard', () => ({
  fetchTop100: (...args: unknown[]) => fetchTop100(...args),
  fetchPool: (...args: unknown[]) => fetchPool(...args),
  fetchCurrentWeek: (...args: unknown[]) => fetchCurrentWeek(...args),
  fetchMe: (...args: unknown[]) => fetchMe(...args),
  fetchLatestRewards: (...args: unknown[]) => fetchLatestRewards(...args),
  fetchDemoToken: (...args: unknown[]) => fetchDemoToken(...args),
  fetchRewardsForWeek: vi.fn(),
}));

vi.mock('@/hooks/useLeaderboardLive', () => ({
  useLeaderboardLive: () => ({ wsStatus: 'disconnected' as const }),
}));

vi.mock('@/lib/jwt', () => ({
  getJwtSubject: () => 'demo-user',
}));

vi.mock('@/lib/scrollToPlayer', () => ({
  scrollToPlayerAnchor: vi.fn(),
}));

const mockSetAuthToken = vi.fn();
const mockSetDemoUserId = vi.fn();

vi.mock('@/store/uiStore', () => ({
  useUiStore: (
    selector?: (state: {
      authToken: string | null;
      demoUserId: string;
      setAuthToken: typeof mockSetAuthToken;
      setDemoUserId: typeof mockSetDemoUserId;
    }) => unknown,
  ) => {
    const state = {
      authToken: 'test-jwt',
      demoUserId: 'demo-user',
      setAuthToken: mockSetAuthToken,
      setDemoUserId: mockSetDemoUserId,
    };
    return selector ? selector(state) : state;
  },
  DEFAULT_DEMO_USER_ID: 'demo-user',
}));

function renderPage() {
  return renderWithProviders(<LeaderboardPage />);
}

function getPlayerContextPanel() {
  return screen.getByRole('complementary', { name: /Your Position: Rank/i });
}

describe('LeaderboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchTop100.mockResolvedValue(mockTop100);
    fetchPool.mockResolvedValue(mockPool);
    fetchCurrentWeek.mockResolvedValue(mockWeekActive);
    fetchMe.mockResolvedValue(mockMeInTop100);
    fetchLatestRewards.mockResolvedValue(mockRewardsEmpty);
    fetchDemoToken.mockResolvedValue({ token: 'test-jwt' });
  });

  it('renders top 100 rows after API resolves', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(10);
    });

    expect(screen.getByText('Muscle Land')).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /Rank 4: Player 4/i })).toBeInTheDocument();
    expect(fetchTop100).toHaveBeenCalled();
    expect(fetchPool).toHaveBeenCalled();
  });

  it('shows your position panel for in-top-100 demo user', async () => {
    renderPage();

    await waitFor(() => {
      expect(getPlayerContextPanel()).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Jump to me' })).toBeInTheDocument();
    expect(getPlayerContextPanel()).toHaveTextContent(/#76/);
    expect(screen.getByRole('listitem', { name: /Rank 76: Demo Hero/i })).toBeInTheDocument();
  });

  it('shows outside-top-100 context when me response is outside top 100', async () => {
    fetchMe.mockResolvedValue(mockMeOutsideTop100);

    renderPage();

    await waitFor(() => {
      expect(getPlayerContextPanel()).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Jump to me' })).not.toBeInTheDocument();
    expect(getPlayerContextPanel()).toHaveTextContent(/#8[,.]?001|#8001/);
  });

  it('expands neighborhood list on panel click when outside top 100', async () => {
    fetchMe.mockResolvedValue(mockMeOutsideTop100);
    const user = userEvent.setup();

    renderPage();

    await waitFor(() => {
      expect(getPlayerContextPanel()).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Show nearby players/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('Nearby players')).toBeInTheDocument();
    });

    expect(screen.getByText('Player 7998')).toBeInTheDocument();
    expect(screen.getByText('Outside Demo')).toBeInTheDocument();
  });
});
