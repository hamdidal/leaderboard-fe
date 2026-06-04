import { describe, expect, it } from 'vitest';
import { parseLiveEventPayload } from '@/lib/leaderboardLiveSocket';

describe('parseLiveEventPayload', () => {
  it('accepts rank_update', () => {
    expect(parseLiveEventPayload(JSON.stringify({ type: 'rank_update', userId: 'u1' }))).toBe(
      'rank_update',
    );
  });

  it('accepts week_reset', () => {
    expect(
      parseLiveEventPayload(
        JSON.stringify({ type: 'week_reset', oldWeekId: '2026W22', newWeekId: '2026W23' }),
      ),
    ).toBe('week_reset');
  });

  it('ignores connected handshake', () => {
    expect(parseLiveEventPayload(JSON.stringify({ type: 'connected', weekId: '2026W23' }))).toBe(
      null,
    );
  });

  it('ignores malformed JSON', () => {
    expect(parseLiveEventPayload('not-json')).toBe(null);
  });
});
