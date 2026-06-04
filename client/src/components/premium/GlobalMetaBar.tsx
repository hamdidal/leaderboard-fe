import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { TIER_BANDS, formatGlobalPlayerCount } from '@/lib/tierUtils';

interface GlobalMetaBarProps {
  totalPlayers?: number;
  activeTierKey?: string;
  nextTierHint?: { tierKey: string; points: string } | null;
}

export function GlobalMetaBar({
  totalPlayers = 0,
  activeTierKey,
  nextTierHint,
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
              tier: t(nextTierHint.tierKey),
            })}
          </p>
        )}
      </div>

      <ul className="tier-legend" aria-label={t('leaderboard.tierLegendAria')}>
        {TIER_BANDS.map((band) => {
          const isActive = activeTierKey === band.key;
          return (
            <li key={band.key}>
              <span
                className={cn('tier-legend-chip', isActive && 'tier-legend-chip--active')}
                title={t(band.rangeKey)}
              >
                <span className="tier-legend-name">{t(band.key)}</span>
                <span className="tier-legend-range">{t(band.rangeKey)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
