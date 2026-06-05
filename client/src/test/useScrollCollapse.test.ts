import { act, fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useScrollCollapse } from '@/hooks/useScrollCollapse';

describe('useScrollCollapse', () => {
  it('collapses after threshold and expands when scrolled back to top', () => {
    const el = document.createElement('main');
    Object.defineProperty(el, 'scrollTop', { writable: true, value: 0 });
    document.body.appendChild(el);

    const scrollRef = { current: el };

    const { result } = renderHook(() => useScrollCollapse(scrollRef));

    expect(result.current).toBe(false);

    act(() => {
      el.scrollTop = 80;
      fireEvent.scroll(el);
    });
    expect(result.current).toBe(true);

    act(() => {
      el.scrollTop = 20;
      fireEvent.scroll(el);
    });
    expect(result.current).toBe(false);

    document.body.removeChild(el);
  });
});
