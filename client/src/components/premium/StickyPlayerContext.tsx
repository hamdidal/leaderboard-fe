import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LeaderboardEntry } from '@panteon/shared';
import { cn } from '@/lib/utils';
import { CoinAmount } from '@/components/atoms/CoinAmount/CoinAmount';
import { EllipsisText } from '@/components/atoms/EllipsisText/EllipsisText';
import { formatCoins, formatScore } from './prizeUtils';

interface StickyPlayerContextProps {
  me: LeaderboardEntry;
  neighbors: LeaderboardEntry[];
  totalPlayers?: number;
  inTop100?: boolean;
  pointsToTop100?: number | null;
  weeklyContribution?: number;
  show: boolean;
}

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 34 };

function CtxRow({
  entry,
  isMe,
}: {
  entry: LeaderboardEntry;
  isMe?: boolean;
}) {
  const { t } = useTranslation();
  const avatarSize = 32;

  return (
    <div className={cn('design-crow', isMe && 'is-me')}>
      <div className="design-crk">#{entry.rank.toLocaleString()}</div>
      <img
        src={entry.avatarUrl ?? `https://i.pravatar.cc/150?u=${entry.userId}`}
        alt={`${entry.name}'s avatar`}
        width={avatarSize}
        height={avatarSize}
        className={cn(
          'rounded-full object-cover flex-shrink-0',
          isMe && 'lb-avatar-me ring-2 ring-[hsl(var(--primary))]',
        )}
        style={{ width: avatarSize, height: avatarSize }}
        loading="lazy"
      />
      <div className="design-cnm">
        <EllipsisText text={entry.name} className="design-cnm-text" />
        {isMe && <span className="lb-you-tag">{t('leaderboard.you')}</span>}
      </div>
      <div className="design-cscore">{formatScore(entry.score)}</div>
    </div>
  );
}

function AnimatedCtxRow({
  entry,
  isMe,
  delay,
}: {
  entry: LeaderboardEntry;
  isMe?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      key={entry.userId}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ ...SPRING, delay: delay ?? 0 }}
      className="overflow-hidden"
    >
      <CtxRow entry={entry} isMe={isMe} />
    </motion.div>
  );
}

export function StickyPlayerContext({
  me,
  neighbors,
  totalPlayers,
  inTop100 = false,
  pointsToTop100 = null,
  weeklyContribution,
  show,
}: StickyPlayerContextProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const above = neighbors.filter((n) => n.rank < me.rank).slice(-3);
  const below = neighbors.filter((n) => n.rank > me.rank).slice(0, 2);

  const percentile = useMemo(() => {
    if (!totalPlayers || totalPlayers < 1) return null;
    const pct = (me.rank / totalPlayers) * 100;
    return pct < 0.1 ? '<0.1' : pct.toFixed(1);
  }, [me.rank, totalPlayers]);

  const nextRankNeighbor = above.at(-1);
  const ptsToNext = nextRankNeighbor != null
    ? Math.max(0, nextRankNeighbor.score - me.score)
    : null;

  const contribution = weeklyContribution ?? (me.score > 0 ? Math.round(me.score * 0.02) : null);

  if (!show) return null;

  return (
    <motion.aside
      id="player-context-panel"
      key="player-ctx"
      role="complementary"
      aria-label={`${t('leaderboard.yourPosition')}: ${t('leaderboard.rank')} ${me.rank.toLocaleString()}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={SPRING}
      className="design-pos-panel relative z-20"
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls="neighbor-rows"
        aria-label={
          isExpanded
            ? t('leaderboard.collapseNearby')
            : t('leaderboard.expandNearby')
        }
        onClick={() => setIsExpanded((prev) => !prev)}
        className="mx-auto flex w-full max-w-[720px] cursor-pointer select-none items-center justify-between px-[18px] py-2.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <div className="flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[0.82rem]" aria-hidden>
              👤
            </span>
            <span className="design-pos-title">{t('leaderboard.yourPosition')}</span>
            {percentile != null && !inTop100 && (
              <span className="design-pos-pct">
                {t('leaderboard.topPercent', { percent: percentile })}
              </span>
            )}
          </div>
          {!isExpanded && (
            <span className="design-pos-hint pl-6 text-[0.68rem] font-medium text-[var(--design-tx3)] sm:pl-0">
              {inTop100
                ? t('leaderboard.panelHintInTop100')
                : t('leaderboard.panelHintOutside')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[0.98rem] font-extrabold tabular-nums text-foreground">
            #{me.rank.toLocaleString()}
          </span>
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={SPRING}
            className="flex items-center text-[var(--design-tx3)]"
            aria-hidden
          >
            <ChevronRight className="h-4 w-4" />
          </motion.span>
        </div>
      </button>

      {!inTop100 && pointsToTop100 != null && pointsToTop100 > 0 && (
        <p
          className="design-top100-gap-hint mx-auto flex max-w-[720px] items-center gap-1.5 px-[18px] pb-1.5"
          role="status"
        >
          <Target className="h-3.5 w-3.5 shrink-0 text-[var(--design-gold)]" aria-hidden />
          <span>
            {t('leaderboard.pointsToTop100', { points: formatCoins(pointsToTop100) })}
          </span>
        </p>
      )}

      {ptsToNext != null && ptsToNext > 0 && (
        <div className="design-pts-up mx-auto max-w-[720px] px-[18px] pb-1.5">
          <b>
            ↗{' '}
            {t('leaderboard.ptsToNextRank', {
              points: formatCoins(ptsToNext),
              rank: nextRankNeighbor!.rank,
            })}
          </b>
        </div>
      )}

      <div
        id="neighbor-rows"
        role="list"
        aria-label={isExpanded ? t('leaderboard.nearbyPlayers') : t('leaderboard.yourPosition')}
        className="mx-auto max-w-[720px] px-2.5 pb-1"
      >
        <AnimatePresence initial={false}>
          {isExpanded &&
            above.map((entry, i) => (
              <AnimatedCtxRow
                key={entry.userId}
                entry={entry}
                delay={(above.length - 1 - i) * 0.04}
              />
            ))}
        </AnimatePresence>

        {isExpanded && <CtxRow entry={me} isMe />}

        <AnimatePresence initial={false}>
          {isExpanded &&
            below.map((entry, i) => (
              <AnimatedCtxRow key={entry.userId} entry={entry} delay={i * 0.04} />
            ))}
        </AnimatePresence>
      </div>

      {contribution != null && contribution > 0 && (
        <div className="design-pool-foot mx-auto max-w-[720px]">
          <div className="design-pool-foot-l">
            <span className="inline-flex flex-wrap items-center gap-1">
              {t('leaderboard.weeklyContribution')}
              <CoinAmount amount={contribution} size="sm" />
            </span>
          </div>
          <div className="design-pool-foot-r">{t('leaderboard.poolRate')}</div>
        </div>
      )}
    </motion.aside>
  );
}
