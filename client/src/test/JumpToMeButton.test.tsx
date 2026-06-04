import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JumpToMeButton } from '@/components/premium/JumpToMeButton';
import { renderWithProviders } from './renderWithProviders';

describe('JumpToMeButton', () => {
  it('calls onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderWithProviders(<JumpToMeButton onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Jump to me' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderWithProviders(<JumpToMeButton onClick={onClick} disabled />);

    const btn = screen.getByRole('button', { name: 'Jump to me' });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
