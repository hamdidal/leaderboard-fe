import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LeaderboardEntry } from '@panteon/shared';
import { cn } from '@/lib/utils';
import { canNavigateToTier } from '@/lib/scrollToTier';
import { TIER_BANDS, formatGlobalPlayerCount, getTierLabel } from '@/lib/tierUtils';
import type { TierI18nKey } from '@/lib/tierUtils';

interface GlobalMetaBarProps {
  totalPlayers?: number;
  activeTierKey?: TierI18nKey;
  nextTierHint?: { tierKey: TierI18nKey; points: string } | null;
  entries?: readonly LeaderboardEntry[];
  onTierNavigate?: (tierKey: TierI18nKey) => void;
}

export function GlobalMetaBar({
  totalPlayers = 0,
  activeTierKey,
  nextTierHint,
  entries = [],
  onTierNavigate,
}: GlobalMetaBarProps) {
  const { t, i18n } = useTranslation();

  const playerLabel =
    totalPlayers > 0
      ? t('leaderboard.globalPlayers', {
          formatted: formatGlobalPlayerCount(totalPlayers, i18n.language),
        })
      : null;

  return (
    <section
      className="global-meta-bar mx-auto w-full max-w-[720px] px-2.5 pb-1"
      aria-label={t('leaderboard.globalMetaAria')}
    >
      <div className="global-meta-head">
        <span className="global-meta-chip">
          <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="font-bold uppercase tracking-wide">{t('leaderboard.global')}</span>
          {playerLabel && <span className="global-meta-count">{playerLabel}</span>}
        </span>
        {nextTierHint && (
          <p className="global-meta-next-tier" role="status">
            {t('leaderboard.nextTierGap', {
              points: nextTierHint.points,
              tier: getTierLabel(nextTierHint.tierKey),
            })}
          </p>
        )}
      </div>

      <ul className="tier-legend" aria-label={t('leaderboard.tierLegendAria')}>
        {TIER_BANDS.map((band) => {
          const isActive = activeTierKey === band.key;
          const canNavigate = Boolean(onTierNavigate && canNavigateToTier(band.key, entries));
          const chipClass = cn('tier-legend-chip', isActive && 'tier-legend-chip--active');

          return (
            <li key={band.key}>
              {canNavigate ? (
                <button
                  type="button"
                  className={chipClass}
                  onClick={() => onTierNavigate?.(band.key)}
                  aria-label={t('leaderboard.tierJumpAria', { tier: band.label })}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {band.label}
                </button>
              ) : (
                <span className={chipClass}>{band.label}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
