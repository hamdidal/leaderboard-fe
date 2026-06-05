import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { canNavigateToTier, scrollToTierStart } from '@/lib/scrollToTier';
import type { LeaderboardEntry } from '@panteon/shared';

function entry(rank: number, userId = `user-${rank}`): LeaderboardEntry {
  return { rank, userId, name: `Player ${rank}`, score: 100_000 - rank * 100 };
}

describe('scrollToTier', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollTo = vi.fn();
    document.body.innerHTML = `
      <main id="main-content" style="height:400px;overflow:auto">
        <section id="podium-stage" style="height:80px">Podium</section>
        <div id="lb-player-user-1" style="height:40px">#1</div>
        <div id="lb-player-user-4" style="height:40px">#4</div>
        <div id="lb-player-user-11" style="height:40px">#11</div>
      </main>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('canNavigateToTier checks boundary rank exists', () => {
    const entries = [entry(1), entry(4), entry(11)];
    expect(canNavigateToTier('leaderboard.tierPodium', entries)).toBe(true);
    expect(canNavigateToTier('leaderboard.tierElite', entries)).toBe(true);
    expect(canNavigateToTier('leaderboard.tierGold', entries)).toBe(true);
    expect(canNavigateToTier('leaderboard.tierSilver', entries)).toBe(false);
  });

  it('scrollToTierStart targets first rank of tier', () => {
    const entries = [entry(1), entry(4), entry(11), entry(51)];
    const ok = scrollToTierStart('leaderboard.tierGold', entries);
    expect(ok).toBe(true);
    expect(document.getElementById('lb-player-user-11')?.classList.contains('lb-scroll-flash')).toBe(
      true,
    );
  });

  it('scrollToTierStart falls back to podium section', () => {
    const ok = scrollToTierStart('leaderboard.tierPodium', []);
    expect(ok).toBe(true);
    expect(document.getElementById('podium-stage')?.classList.contains('lb-scroll-flash')).toBe(true);
  });
});
