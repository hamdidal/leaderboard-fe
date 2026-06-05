import { describe, expect, it } from 'vitest';
import { isAwaitingQueryData } from '@/lib/queryUiState';

describe('isAwaitingQueryData', () => {
  it('returns true while the query is still pending', () => {
    expect(isAwaitingQueryData(false, true)).toBe(true);
  });

  it('returns false after a successful response', () => {
    expect(isAwaitingQueryData(false, false)).toBe(false);
  });

  it('returns false after a hard error', () => {
    expect(isAwaitingQueryData(true, true)).toBe(false);
    expect(isAwaitingQueryData(true, false)).toBe(false);
  });
});
