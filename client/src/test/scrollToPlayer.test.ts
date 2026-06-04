import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { scrollToPlayerAnchor } from '@/lib/scrollToPlayer';

describe('scrollToPlayerAnchor', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollTo = vi.fn();
    document.body.innerHTML = `
      <main id="main-content" style="height:200px;overflow:auto">
        <div id="lb-player-user-a" style="height:40px">A</div>
        <div id="lb-player-user-b" style="height:40px">B</div>
      </main>
      <aside id="player-context-panel">
        <button aria-controls="neighbor-rows" aria-expanded="false">Expand</button>
      </aside>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('scrolls to in-list player anchor', () => {
    const ok = scrollToPlayerAnchor('user-b', 42);
    expect(ok).toBe(true);
    expect(document.getElementById('lb-player-user-b')?.classList.contains('lb-scroll-flash')).toBe(true);
  });

  it('targets context panel when rank is above 100', () => {
    const ok = scrollToPlayerAnchor('user-x', 5000);
    expect(ok).toBe(true);
    expect(document.getElementById('player-context-panel')?.classList.contains('lb-scroll-flash')).toBe(
      true,
    );
  });

  it('returns false when anchor is missing', () => {
    expect(scrollToPlayerAnchor('missing', 10)).toBe(false);
  });
});
