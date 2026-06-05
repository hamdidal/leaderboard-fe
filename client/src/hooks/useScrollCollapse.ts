import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

const COLLAPSE_THRESHOLD_PX = 72;
const EXPAND_THRESHOLD_PX = 24;

/**
 * Hysteresis scroll collapse — avoids flicker when scroll position hovers near the threshold.
 * Uses passive listeners for main-thread performance (mobile best practice).
 */
export function useScrollCollapse(scrollRef: RefObject<HTMLElement | null>): boolean {
  const [collapsed, setCollapsed] = useState(false);
  const collapsedRef = useRef(false);

  const syncFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const y = el.scrollTop;
    let next = collapsedRef.current;

    if (!collapsedRef.current && y >= COLLAPSE_THRESHOLD_PX) {
      next = true;
    } else if (collapsedRef.current && y <= EXPAND_THRESHOLD_PX) {
      next = false;
    }

    if (next !== collapsedRef.current) {
      collapsedRef.current = next;
      setCollapsed(next);
    }
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    syncFromScroll();
    el.addEventListener('scroll', syncFromScroll, { passive: true });
    return () => el.removeEventListener('scroll', syncFromScroll);
  }, [scrollRef, syncFromScroll]);

  return collapsed;
}
