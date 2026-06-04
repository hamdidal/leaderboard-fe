import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { GlobalMetaBar } from '@/components/premium/GlobalMetaBar';
import { renderWithProviders } from './renderWithProviders';

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
});
