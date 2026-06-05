import { type ReactNode, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LeaderboardEntry } from '@panteon/shared';
import type { WsStatus } from '@/hooks/useLeaderboardLive';
import { useScrollCollapse } from '@/hooks/useScrollCollapse';
import { useSecondsUntil } from '@/hooks/useSecondsUntil';
import { LangSwitcher } from '@/components/molecules/LangSwitcher';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { getDurationParts, pad2 } from '@/lib/formatDuration';
import { getTierLabel, type TierI18nKey } from '@/lib/tierUtils';
import { cn } from '@/lib/utils';
import { CoinIcon } from '@/components/atoms/CoinIcon/CoinIcon';
import { formatCoinsFull, formatCoins } from './prizeUtils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GlobalMetaBar } from '@/components/premium/GlobalMetaBar';
import { JumpToMeButton } from '@/components/premium/JumpToMeButton';
import { CompactHeaderStrip } from '@/components/premium/CompactHeaderStrip';
import { CollapsibleHeaderSection } from '@/components/premium/CollapsibleHeaderSection';
import { Podium } from '@/components/premium/Podium';
import { RankedList } from '@/components/premium/RankedList';
import { StickyPlayerContext } from '@/components/premium/StickyPlayerContext';
import muscleLandLogo from '@/assets/muscle-land-logo.png';

export interface LeaderboardLayoutProps {
  wsStatus: WsStatus;
  statusBanner?: ReactNode;
  lastWeekSection?: ReactNode;
  hasLastWeek?: boolean;
  onScrollToLastWeek?: () => void;
  meStatusSlot?: ReactNode;
  poolTotal?: number;
  endsAt?: string;
  weekId?: string;
  playerRank?: number;
  estimatedReward?: number | null;
  playerTierKey?: TierI18nKey;
  nextTierHint?: { tierKey: TierI18nKey; points: string } | null;
  totalPlayers?: number;
  entries: LeaderboardEntry[];
  highlightUserId?: string;
  rankDeltas?: ReadonlyMap<string, number>;
  isTopLoading: boolean;
  isTopError: boolean;
  onRetryTop: () => void;
  meEntry?: LeaderboardEntry;
  meNeighbors?: LeaderboardEntry[];
  showPlayerContext?: boolean;
  inTop100?: boolean;
  pointsToTop100?: number | null;
  onJumpToMe?: () => void;
  jumpToMeDisabled?: boolean;
  suppressPodiumConfetti?: boolean;
  onTierNavigate?: (tierKey: TierI18nKey) => void;
}

const BADGE_BASE =
  'inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold';

function WsBadge({ status }: { status: WsStatus }) {
  const { t } = useTranslation();

  if (status === 'connected') {
    return (
      <span className="design-live-chip">
        <span className="design-live-dot" aria-hidden />
        {t('leaderboard.liveLabel')}
      </span>
    );
  }
  if (status === 'connecting') {
    return (
      <span className={cn(BADGE_BASE, 'border-amber-500/30 bg-amber-500/[0.10] text-amber-600 dark:text-amber-400')}>
        <Wifi className="h-3 w-3 flex-shrink-0" aria-hidden />
        {t('ws.connecting')}
      </span>
    );
  }
  return (
    <span className={cn(BADGE_BASE, 'border-border/50 bg-muted/40 text-muted-foreground')}>
      <WifiOff className="h-3 w-3 flex-shrink-0" aria-hidden />
      {t('ws.disconnected')}
    </span>
  );
}

function WeekTimer({ endsAt }: { endsAt?: string }) {
  const secondsLeft = useSecondsUntil(endsAt);

  if (!endsAt || secondsLeft == null) {
    return <span className="tabular-nums text-muted-foreground">–</span>;
  }

  const { days, hours, minutes } = getDurationParts(secondsLeft);

  const label = days > 0
    ? `${days}d ${pad2(hours)}h`
    : `${pad2(hours)}h ${pad2(minutes)}m`;

  return <span className="design-pb-rval">{label}</span>;
}

function HeaderStatusMeta({ wsStatus, weekId }: { wsStatus: WsStatus; weekId?: string }) {
  return (
    <>
      <WsBadge status={wsStatus} />
      {weekId && <span className="design-wk-chip">{weekId}</span>}
    </>
  );
}

function PlayerStatPill({
  rank,
  estimatedReward,
  tierKey,
}: {
  rank?: number;
  estimatedReward?: number | null;
  tierKey?: TierI18nKey;
}) {
  if (!rank) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      className="design-pb-pill-group flex flex-wrap items-center gap-1.5"
    >
      <span
        className={cn(
          BADGE_BASE,
          'border-[hsl(var(--primary)/0.30)] bg-[hsl(var(--primary)/0.10)] text-primary tabular-nums',
        )}
      >
        #{rank.toLocaleString()}
        {tierKey && (
          <span className="ml-1 rounded-sm bg-primary/20 px-1 text-[10px] font-bold">
            {getTierLabel(tierKey)}
          </span>
        )}
      </span>

      {estimatedReward != null && estimatedReward > 0 && (
        <span
          className={cn(BADGE_BASE, 'tabular-nums inline-flex items-center gap-1')}
          style={{
            borderColor: 'var(--design-gold-border)',
            background: 'var(--design-gold-bg)',
            color: 'var(--design-gold)',
          }}
        >
          <CoinIcon size="sm" />
          {formatCoins(estimatedReward)}
        </span>
      )}
    </motion.div>
  );
}

export function LeaderboardLayout({
  wsStatus,
  statusBanner,
  meStatusSlot,
  lastWeekSection,
  hasLastWeek = false,
  onScrollToLastWeek,
  poolTotal,
  endsAt,
  weekId,
  playerRank,
  estimatedReward,
  playerTierKey,
  nextTierHint = null,
  totalPlayers,
  entries,
  highlightUserId,
  rankDeltas,
  isTopLoading,
  isTopError,
  onRetryTop,
  meEntry,
  meNeighbors = [],
  showPlayerContext = false,
  inTop100 = false,
  pointsToTop100 = null,
  onJumpToMe,
  jumpToMeDisabled = false,
  suppressPodiumConfetti = false,
  onTierNavigate,
}: LeaderboardLayoutProps) {
  const { t } = useTranslation();
  const mainScrollRef = useRef<HTMLElement>(null);
  const headerCollapsed = useScrollCollapse(mainScrollRef);

  const [podiumFirst, podiumSecond, podiumThird] = entries;
  const listEntries = useMemo(() => entries.slice(3), [entries]);
  const hasStickyContext = showPlayerContext && meEntry != null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative flex h-dvh flex-col overflow-hidden bg-background font-sans text-foreground">
        <div className="design-bg-glow" aria-hidden />

        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <header
          data-collapsed={headerCollapsed ? 'true' : 'false'}
          className={cn(
            'lb-header sticky top-0 z-40 w-full',
            'glass-strong glass-shine',
            'border-b',
            'dark:bg-[rgba(11,9,25,0.80)] dark:border-b-white/[0.07]',
            'dark:shadow-[0_4px_24px_rgba(0,0,0,0.40),inset_0_1px_0_rgba(255,255,255,0.05)]',
            'bg-white/[0.72] border-b-[rgba(120,110,200,0.20)]',
            'shadow-[0_2px_16px_rgba(85,104,245,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]',
          )}
        >
          <div className="app-header-shell header-inner">
            <div className="app-header-row">
              <div className="app-header-brand">
                <div className="app-header-identity">
                  <div className="app-header-logo" aria-hidden>
                    <img
                      src={muscleLandLogo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h1 className="app-header-title text-foreground">
                    {t('leaderboard.title')}
                  </h1>
                </div>
                <div className="app-header-controls sm:hidden">
                  <LangSwitcher />
                  <ThemeToggle />
                </div>
              </div>

              <div className="app-header-meta--mobile">
                <HeaderStatusMeta wsStatus={wsStatus} weekId={weekId} />
              </div>

              <div className="app-header-actions">
                <HeaderStatusMeta wsStatus={wsStatus} weekId={weekId} />
                <span className="app-header-actions-divider" aria-hidden />
                <LangSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>

          <CompactHeaderStrip
            visible={headerCollapsed}
            poolTotal={poolTotal}
            endsAt={endsAt}
            playerRank={playerRank}
            estimatedReward={estimatedReward}
            totalPlayers={totalPlayers}
            hasRewardsPanel={hasLastWeek}
            onLastWeekClick={onScrollToLastWeek}
            playerTierKey={playerTierKey}
          />

          <CollapsibleHeaderSection collapsed={headerCollapsed}>
            <div className="prize-bar-center">
              <div className="design-prize-bar">
                <section className="design-pb-pool" aria-label={t('leaderboard.prizePoolLabel')}>
                  <div className="design-pb-icon">
                    <CoinIcon size="xl" />
                  </div>
                  <div className="design-pb-pool-text">
                    <p className="design-pb-label">{t('leaderboard.prizePoolLabel')}</p>
                    {poolTotal != null ? (
                      <p
                        className="design-pb-amount"
                        aria-label={`${t('leaderboard.prizePoolLabel')}: ${formatCoinsFull(poolTotal)}`}
                      >
                        <span className="design-pb-amount-full">{formatCoinsFull(poolTotal)}</span>
                        <span className="design-pb-amount-short">{formatCoins(poolTotal)}</span>
                      </p>
                    ) : (
                      <p className="design-pb-amount text-muted-foreground">–</p>
                    )}
                  </div>
                </section>

                <section className="design-pb-aside" aria-label={t('leaderboard.resetsIn')}>
                  <div className="design-pb-timer">
                    <p className="design-pb-rlabel">{t('leaderboard.resetsIn')}</p>
                    <WeekTimer endsAt={endsAt} />
                  </div>

                  {playerRank != null && (
                    <div className="design-pb-stats">
                      <PlayerStatPill
                        rank={playerRank}
                        estimatedReward={playerRank <= 100 ? estimatedReward : null}
                        tierKey={playerTierKey}
                      />
                    </div>
                  )}
                </section>
              </div>
            </div>

            <GlobalMetaBar
              totalPlayers={totalPlayers}
              activeTierKey={playerTierKey}
              nextTierHint={nextTierHint}
              entries={entries}
              onTierNavigate={onTierNavigate}
            />

            {statusBanner}
            {meStatusSlot}
          </CollapsibleHeaderSection>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <main
            id="main-content"
            ref={mainScrollRef}
            tabIndex={-1}
            className="main-scroll relative z-10 flex-1 overflow-y-auto min-h-0 scroll-smooth"
            style={{ scrollbarGutter: 'stable' }}
          >
            <div className="mx-auto max-w-[720px] space-y-3 px-2.5 py-4">
              {lastWeekSection}

              {hasLastWeek && (
                <div className="this-week-divider px-3.5 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {t('leaderboard.thisWeekLabel')}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('leaderboard.thisWeekLiveHint')}</p>
                </div>
              )}

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="px-3.5 pt-[18px]"
              >
                <Podium
                  first={podiumFirst}
                  second={podiumSecond}
                  third={podiumThird}
                  poolTotal={poolTotal}
                  highlightUserId={highlightUserId}
                  suppressConfetti={suppressPodiumConfetti}
                />
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                aria-labelledby="list-heading"
                className="px-1 pb-3 sm:px-2.5"
              >
                <div className="top100-panel glass-panel glass-shine">
                  <div
                    id="list-heading"
                    className={cn('design-col-hdr', onJumpToMe && 'design-col-hdr--actions')}
                  >
                    <div className={onJumpToMe ? 'design-col-hdr-cols' : undefined}>
                      <span>{t('leaderboard.rank')}</span>
                      <span>{t('leaderboard.player')}</span>
                      <span className="design-col-hdr-r">
                        {t('leaderboard.scorePrizeCol')}
                      </span>
                    </div>
                    {onJumpToMe && (
                      <JumpToMeButton
                        onClick={onJumpToMe}
                        disabled={jumpToMeDisabled}
                      />
                    )}
                  </div>

                  <RankedList
                    entries={listEntries}
                    highlightUserId={highlightUserId}
                    rankDeltas={rankDeltas}
                    poolTotal={poolTotal}
                    isLoading={isTopLoading}
                    isError={isTopError}
                    onRetry={onRetryTop}
                  />
                </div>
              </motion.section>
            </div>
          </main>

          <AnimatePresence>
            {hasStickyContext && (
              <StickyPlayerContext
                me={meEntry!}
                neighbors={meNeighbors}
                totalPlayers={totalPlayers}
                inTop100={inTop100}
                pointsToTop100={pointsToTop100}
                weeklyContribution={
                  meEntry != null && meEntry.score > 0
                    ? Math.round(meEntry.score * 0.02)
                    : undefined
                }
                show
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}
