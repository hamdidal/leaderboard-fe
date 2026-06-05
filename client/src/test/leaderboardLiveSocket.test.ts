import { describe, expect, it } from 'vitest';
import { parseLiveEvent } from '@/lib/leaderboardLiveSocket';

describe('parseLiveEvent', () => {
  it('accepts rank_update with userId', () => {
    expect(parseLiveEvent(JSON.stringify({ type: 'rank_update', userId: 'u1' }))).toEqual({
      type: 'rank_update',
      userId: 'u1',
    });
  });

  it('accepts week_reset with week ids', () => {
    expect(
      parseLiveEvent(
        JSON.stringify({ type: 'week_reset', oldWeekId: '2026W22', newWeekId: '2026W23' }),
      ),
    ).toEqual({
      type: 'week_reset',
      oldWeekId: '2026W22',
      newWeekId: '2026W23',
    });
  });

  it('ignores connected handshake', () => {
    expect(parseLiveEvent(JSON.stringify({ type: 'connected', weekId: '2026W23' }))).toBeNull();
  });

  it('ignores malformed JSON', () => {
    expect(parseLiveEvent('not-json')).toBeNull();
  });
});
