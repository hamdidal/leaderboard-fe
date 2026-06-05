import type { LeaderboardEntry } from '@panteon/shared';
import { TIER_BANDS, type TierI18nKey } from './tierUtils';
import { scrollToPlayerAnchor } from './scrollToPlayer';

export const PODIUM_SECTION_ID = 'podium-stage';

function scrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'smooth';
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function flashElement(el: HTMLElement): void {
  el.classList.add('lb-scroll-flash');
  window.setTimeout(() => el.classList.remove('lb-scroll-flash'), 2_000);
}

function scrollElementIntoMainView(
  el: HTMLElement,
  scrollRootId = 'main-content',
): void {
  const root = document.getElementById(scrollRootId);
  const behavior = scrollBehavior();

  if (root) {
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset =
      elRect.top - rootRect.top + root.scrollTop - root.clientHeight / 2 + elRect.height / 2;
    root.scrollTo({ top: Math.max(0, offset), behavior });
  } else {
    el.scrollIntoView({ behavior, block: 'center' });
  }

  flashElement(el);
}

/** True when the top-100 list includes the first rank of this tier. */
export function canNavigateToTier(
  tierKey: TierI18nKey,
  entries: readonly LeaderboardEntry[],
): boolean {
  const band = TIER_BANDS.find((b) => b.key === tierKey);
  if (!band) return false;
  return entries.some((e) => e.rank === band.min);
}

/**
 * Scroll main content to the first rank of a prize tier (Podium → #1, Elite → #4, etc.).
 */
export function scrollToTierStart(
  tierKey: TierI18nKey,
  entries: readonly LeaderboardEntry[],
  scrollRootId = 'main-content',
): boolean {
  const band = TIER_BANDS.find((b) => b.key === tierKey);
  if (!band) return false;

  const entry = entries.find((e) => e.rank === band.min);
  if (entry) {
    return scrollToPlayerAnchor(entry.userId, entry.rank, scrollRootId);
  }

  if (band.min <= 3) {
    const podium = document.getElementById(PODIUM_SECTION_ID);
    if (podium) {
      scrollElementIntoMainView(podium, scrollRootId);
      return true;
    }
  }

  return false;
}
