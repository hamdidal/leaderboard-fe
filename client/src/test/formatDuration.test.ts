import { describe, it, expect } from 'vitest';
import { getDurationParts, pad2 } from '@/lib/formatDuration';

describe('getDurationParts', () => {
  it('returns zeros for 0 seconds', () => {
    expect(getDurationParts(0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('returns zeros for negative values (clamped)', () => {
    expect(getDurationParts(-100)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('correctly parses 1 full day', () => {
    expect(getDurationParts(86400)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
  });

  it('correctly parses 1 hour', () => {
    expect(getDurationParts(3600)).toEqual({ days: 0, hours: 1, minutes: 0, seconds: 0 });
  });

  it('correctly parses 90 seconds', () => {
    expect(getDurationParts(90)).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 30 });
  });

  it('handles a complex duration — 3 days 4 hours 5 minutes 6 seconds', () => {
    const total = 3 * 86400 + 4 * 3600 + 5 * 60 + 6;
    expect(getDurationParts(total)).toEqual({ days: 3, hours: 4, minutes: 5, seconds: 6 });
  });

  it('handles exactly one week', () => {
    expect(getDurationParts(7 * 86400)).toEqual({ days: 7, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe('pad2', () => {
  it('pads single digit numbers', () => {
    expect(pad2(5)).toBe('05');
    expect(pad2(0)).toBe('00');
  });

  it('does not pad double digit numbers', () => {
    expect(pad2(42)).toBe('42');
    expect(pad2(99)).toBe('99');
  });

  it('does not truncate numbers > 99', () => {
    expect(pad2(100)).toBe('100');
  });
});
