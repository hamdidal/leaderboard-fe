import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { StatusBanner } from '@/components/premium/StatusBanner';
import { renderWithProviders } from './renderWithProviders';

describe('StatusBanner', () => {
  it('renders distributing status', () => {
    renderWithProviders(
      <StatusBanner variant="distributing" message="Rewards are being calculated…" />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Rewards are being calculated');
  });

  it('shows winner and player reward when closed', () => {
    renderWithProviders(
      <StatusBanner
        variant="closed"
        message="Week closed"
        winnerName="Champion Kai"
        playerReward={4200}
      />,
    );

    expect(screen.getByText(/Champion Kai won/i)).toBeInTheDocument();
    expect(screen.getByText(/You earned 4,200 coins/i)).toBeInTheDocument();
  });
});
