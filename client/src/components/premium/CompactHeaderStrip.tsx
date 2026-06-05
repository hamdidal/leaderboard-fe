import { Clock, Globe, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CoinIcon } from '@/components/atoms/CoinIcon/CoinIcon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getDurationParts, pad2 } from '@/lib/formatDuration';
import { useSecondsUntil } from '@/hooks/useSecondsUntil';
import { formatGlobalPlayerCount, getTierLabel, type TierI18nKey } from '@/lib/tierUtils';
import { cn } from '@/lib/utils';
import { formatCoins } from './prizeUtils';

interface CompactHeaderStripProps {
  visible: boolean;
  poolTotal?: number;
  endsAt?: string;
  playerRank?: number;
  estimatedReward?: number | null;
  totalPlayers?: number;
  hasRewardsPanel?: boolean;
  onLastWeekClick?: () => void;
  playerTierKey?: TierI18nKey;
}

function CompactChip({
  label,
  children,
  className,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const classNames = cn(
    'header-compact-chip inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tabular-nums',
    onClick && 'cursor-pointer transition-opacity hover:opacity-85',
    className,
  );

  if (onClick) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className={classNames} aria-label={label} onClick={onClick}>
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={classNames} aria-label={label}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

function CompactTimer({ endsAt }: { endsAt?: string }) {
  const secondsLeft = useSecondsUntil(endsAt);

  if (!endsAt || secondsLeft == null) {
    return <span className="text-muted-foreground">–</span>;
  }

  const { days, hours, minutes } = getDurationParts(secondsLeft);
  const label =
    days > 0 ? `${days}d ${pad2(hours)}h` : `${pad2(hours)}h ${pad2(minutes)}m`;

  return <span>{label}</span>;
}

export function CompactHeaderStrip({
  visible,
  poolTotal,
  endsAt,
  playerRank,
  estimatedReward,
  totalPlayers = 0,
  hasRewardsPanel = false,
  onLastWeekClick,
  playerTierKey,
}: CompactHeaderStripProps) {
  const { t, i18n } = useTranslation();

  const playerLabel =
    totalPlayers > 0
      ? t('leaderboard.globalPlayers', {
          formatted: formatGlobalPlayerCount(totalPlayers, i18n.language),
        })
      : t('leaderboard.global');

  return (
    <div
      className="header-compact-grid"
      data-visible={visible ? 'true' : 'false'}
      aria-hidden={!visible || undefined}
    >
      <div className="header-compact-inner">
        <div
          className="header-compact-strip mx-auto flex w-full max-w-[720px] flex-wrap items-center gap-1.5 px-2.5 pb-2 pt-0.5"
          role="group"
          aria-label={t('leaderboard.compactHeaderAria')}
        >
          {poolTotal != null && (
            <CompactChip
              label={t('leaderboard.prizePoolLabel')}
              className="border-[var(--design-gold-border)] bg-[var(--design-gold-bg)] text-[var(--design-gold)]"
            >
              <CoinIcon size="sm" />
              <span>{formatCoins(poolTotal)}</span>
            </CompactChip>
          )}

          <CompactChip
            label={t('leaderboard.resetsIn')}
            className="border-border/50 bg-muted/30 text-foreground"
          >
            <Clock className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
            <CompactTimer endsAt={endsAt} />
          </CompactChip>

          {playerRank != null && (
            <CompactChip
              label={t('leaderboard.myRank')}
              className="border-[hsl(var(--primary)/0.30)] bg-[hsl(var(--primary)/0.10)] text-primary"
            >
              <span>#{playerRank.toLocaleString()}</span>
              {playerTierKey && (
                <span className="rounded-sm bg-primary/20 px-1 text-[9px] font-bold uppercase">
                  {getTierLabel(playerTierKey)}
                </span>
              )}
              {estimatedReward != null && estimatedReward > 0 && playerRank <= 100 && (
                <>
                  <span className="opacity-40" aria-hidden>
                    ·
                  </span>
                  <CoinIcon size="sm" />
                  <span>{formatCoins(estimatedReward)}</span>
                </>
              )}
            </CompactChip>
          )}

          <CompactChip
            label={playerLabel}
            className="border-border/50 bg-muted/20 text-muted-foreground"
          >
            <Globe className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
            <span className="truncate">
              {totalPlayers > 0
                ? formatGlobalPlayerCount(totalPlayers, i18n.language)
                : t('leaderboard.global')}
            </span>
          </CompactChip>

          {hasRewardsPanel && (
            <CompactChip
              label={t('leaderboard.lastWeekJump')}
              className="border-[var(--design-gold-border)] bg-muted/20 text-[var(--design-gold)]"
              onClick={onLastWeekClick}
            >
              <Trophy className="h-3 w-3 shrink-0" aria-hidden />
            </CompactChip>
          )}
        </div>
      </div>
    </div>
  );
}
