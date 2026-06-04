export function getPrizeShare(rank: number, poolTotal: number): number {
  if (poolTotal <= 0 || rank < 1) return 0;
  if (rank === 1) return poolTotal * 0.2;
  if (rank === 2) return poolTotal * 0.15;
  if (rank === 3) return poolTotal * 0.1;
  if (rank <= 100) {
    let totalWeight = 0;
    for (let r = 4; r <= 100; r++) totalWeight += 101 - r;
    return poolTotal * 0.55 * ((101 - rank) / totalWeight);
  }
  return 0;
}

export function formatCoins(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
}

export function formatScore(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

export function formatCoinsFull(n: number): string {
  return Math.round(n).toLocaleString();
}
