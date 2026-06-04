const FLASH_CLASS = 'lb-scroll-flash';
const FLASH_MS = 2_000;

function scrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'smooth';
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export function scrollToPlayerAnchor(
  userId: string,
  rank: number,
  scrollRootId = 'main-content',
): boolean {
  let targetId: string;
  if (rank <= 100) {
    targetId = `lb-player-${userId}`;
  } else {
    targetId = 'player-context-panel';
  }

  const el = document.getElementById(targetId);
  const root = document.getElementById(scrollRootId);

  if (!el) return false;

  const behavior = scrollBehavior();

  if (rank > 100) {
    el.scrollIntoView({ behavior, block: 'nearest' });
  } else if (root) {
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset =
      elRect.top - rootRect.top + root.scrollTop - root.clientHeight / 2 + elRect.height / 2;
    root.scrollTo({ top: Math.max(0, offset), behavior });
  } else {
    el.scrollIntoView({ behavior, block: 'center' });
  }

  el.classList.add(FLASH_CLASS);
  window.setTimeout(() => el.classList.remove(FLASH_CLASS), FLASH_MS);
  return true;
}
