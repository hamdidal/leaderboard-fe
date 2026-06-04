import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn (classNames merger)', () => {
  it('returns a single class untouched', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('merges multiple classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', false, undefined, null, '')).toBe('foo');
  });

  it('resolves Tailwind conflicting utilities — last one wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('resolves conflicting text sizes', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles conditional object syntax', () => {
    expect(cn({ 'bg-red-500': true, 'bg-blue-500': false })).toBe('bg-red-500');
  });

  it('handles array syntax', () => {
    expect(cn(['flex', 'items-center'])).toBe('flex items-center');
  });

  it('returns empty string when all values are falsy', () => {
    expect(cn(false, undefined)).toBe('');
  });
});
