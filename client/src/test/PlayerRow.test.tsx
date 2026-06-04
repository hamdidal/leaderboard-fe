import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { PlayerRow } from '@/components/premium/PlayerRow';
import { mockEntry } from '../stories/fixtures';
import { renderWithProviders } from './renderWithProviders';

describe('PlayerRow', () => {
  it('renders rank, name, and list item anchor id', () => {
    const entry = mockEntry(12, { userId: 'u-12', name: 'Alex Rivera' });
    renderWithProviders(
      <PlayerRow entry={entry} poolTotal={1_000_000} index={0} />,
    );

    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('#12')).toBeInTheDocument();
    expect(document.getElementById('lb-player-u-12')).toBeInTheDocument();
  });

  it('shows you tag for current user', () => {
    const entry = mockEntry(76, { userId: 'demo-user', name: 'Demo Hero' });
    renderWithProviders(
      <PlayerRow entry={entry} isCurrentUser poolTotal={1_000_000} />,
    );

    expect(screen.getByText('you')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveClass('is-me');
  });

  it('exposes accessible rank label', () => {
    const entry = mockEntry(5, { name: 'Fifth' });
    renderWithProviders(<PlayerRow entry={entry} poolTotal={500_000} />);

    expect(screen.getByRole('listitem', { name: /Rank 5: Fifth/i })).toBeInTheDocument();
  });
});
