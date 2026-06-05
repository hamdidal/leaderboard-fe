import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useWeekTransition } from '@/hooks/useWeekTransition';

describe('useWeekTransition', () => {
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockClear();
  });

  it('opens recap when last week rewards exist for a prior week', () => {
    const { result } = renderHook(() =>
      useWeekTransition({
        weekStatus: 'ACTIVE',
        currentWeekId: '2026W23',
        lastWeekRewards: {
          weekId: '2026W22',
          poolTotal: 1_000_000,
          rewards: [{ rank: 1, userId: 'u1', amount: 200_000, displayName: 'Winner' }],
        },
      }),
    );

    expect(result.current.hasLastWeek).toBe(true);
    expect(result.current.showRecapModal).toBe(true);
    expect(result.current.phase).toBe('recap');
  });

  it('does not open recap when already dismissed', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('2026W22');

    const { result } = renderHook(() =>
      useWeekTransition({
        weekStatus: 'ACTIVE',
        currentWeekId: '2026W23',
        lastWeekRewards: {
          weekId: '2026W22',
          poolTotal: 1_000_000,
          rewards: [{ rank: 1, userId: 'u1', amount: 200_000 }],
        },
      }),
    );

    expect(result.current.showRecapModal).toBe(false);
    expect(result.current.phase).toBe('live');
  });

  it('enters distributing on week_reset live event', () => {
    const { result } = renderHook(() =>
      useWeekTransition({
        weekStatus: 'ACTIVE',
        currentWeekId: '2026W23',
      }),
    );

    act(() => {
      result.current.handleLiveEvent({
        type: 'week_reset',
        oldWeekId: '2026W22',
        newWeekId: '2026W23',
      });
    });

    expect(result.current.phase).toBe('distributing');
  });
});
