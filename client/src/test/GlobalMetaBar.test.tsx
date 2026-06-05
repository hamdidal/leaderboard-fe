import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalMetaBar } from '@/components/premium/GlobalMetaBar';
import { renderWithProviders } from './renderWithProviders';
import type { LeaderboardEntry } from '@panteon/shared';

const sampleEntries: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', name: 'One', score: 9000 },
  { rank: 4, userId: 'u4', name: 'Four', score: 8000 },
  { rank: 11, userId: 'u11', name: 'Eleven', score: 7000 },
  { rank: 51, userId: 'u51', name: 'FiftyOne', score: 6000 },
];

describe('GlobalMetaBar', () => {
  it('renders global player count and tier legend', () => {
    renderWithProviders(
      <GlobalMetaBar
        totalPlayers={50_000}
        activeTierKey="leaderboard.tierSilver"
        nextTierHint={{ tierKey: 'leaderboard.tierGold', points: '12.5K' }}
      />,
    );

    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText(/50K players/i)).toBeInTheDocument();
    expect(screen.getByText('Podium')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText(/12\.5K pts to reach Gold tier/i)).toBeInTheDocument();
  });

  it('calls onTierNavigate when a tier button is clicked', async () => {
    const user = userEvent.setup();
    const onTierNavigate = vi.fn();

    renderWithProviders(
      <GlobalMetaBar
        entries={sampleEntries}
        onTierNavigate={onTierNavigate}
      />,
    );

    await user.click(screen.getByRole('button', { name: /jump to gold tier/i }));
    expect(onTierNavigate).toHaveBeenCalledWith('leaderboard.tierGold');
  });
});
