import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StickyPlayerContext } from '@/components/premium/StickyPlayerContext';
import {
  meOutsideTop100,
  neighborsOutsideTop100,
} from '../stories/fixtures';
import { renderWithProviders } from './renderWithProviders';

describe('StickyPlayerContext', () => {
  it('returns null when show is false', () => {
    const { container } = renderWithProviders(
      <StickyPlayerContext
        me={meOutsideTop100}
        neighbors={neighborsOutsideTop100}
        show={false}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows points to top 100 when outside top 100', () => {
    renderWithProviders(
      <StickyPlayerContext
        me={meOutsideTop100}
        neighbors={neighborsOutsideTop100}
        inTop100={false}
        pointsToTop100={12_500}
        totalPlayers={50_000}
        show
      />,
    );

    expect(screen.getByText(/12\.5K points to reach the top 100/i)).toBeInTheDocument();
  });

  it('expands to show neighbors on header click', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <StickyPlayerContext
        me={meOutsideTop100}
        neighbors={neighborsOutsideTop100}
        inTop100={false}
        show
      />,
    );

    expect(screen.queryByText('Player 7995')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show nearby players/i }));

    expect(screen.getByText('Player 7995')).toBeInTheDocument();
    expect(screen.getByText('Outside Demo')).toBeInTheDocument();
    expect(screen.getByText('you')).toBeInTheDocument();
  });
});
