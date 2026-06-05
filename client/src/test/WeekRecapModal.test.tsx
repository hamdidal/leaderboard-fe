import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WeekRecapModal } from '@/components/premium/WeekRecapModal';
import { renderWithProviders } from './renderWithProviders';

const mockData = {
  weekId: '2026W22',
  poolTotal: 1_250_000,
  rewards: [
    { rank: 1, userId: 'u1', amount: 250_000, displayName: 'Champion Kai' },
    { rank: 76, userId: 'demo-user', amount: 4_200, displayName: 'Demo Hero' },
  ],
};

describe('WeekRecapModal', () => {
  it('renders winner and personal reward when open', () => {
    renderWithProviders(
      <WeekRecapModal
        open
        data={mockData}
        highlightUserId="demo-user"
        myReward={mockData.rewards[1]}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Champion Kai/i)).toBeInTheDocument();
    expect(screen.getByText(/#76/)).toBeInTheDocument();
  });

  it('calls onContinue when primary button clicked', async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();

    renderWithProviders(
      <WeekRecapModal
        open
        data={mockData}
        myReward={mockData.rewards[1]}
        onContinue={onContinue}
      />,
    );

    await user.click(screen.getByRole('button', { name: /continue to this week/i }));
    expect(onContinue).toHaveBeenCalledOnce();
  });
});
