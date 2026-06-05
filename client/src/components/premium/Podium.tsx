import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import type { LeaderboardEntry } from '@panteon/shared';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { CoinIcon } from '@/components/atoms/CoinIcon/CoinIcon';
import { getPrizeShare, formatCoins, formatScore } from './prizeUtils';
import { PODIUM_SECTION_ID } from '@/lib/scrollToTier';

interface PodiumProps {
  first?: LeaderboardEntry;
  second?: LeaderboardEntry;
  third?: LeaderboardEntry;
  poolTotal?: number;
  highlightUserId?: string;
  /** Skip mount confetti (e.g. while week recap modal is showing). */
  suppressConfetti?: boolean;
}

type Medal = 1 | 2 | 3;

const AVATAR_PX: Record<Medal, number> = { 1: 64, 2: 54, 3: 50 };

interface SlotProps {
  entry: LeaderboardEntry;
  rank: Medal;
  poolTotal?: number;
  delay: number;
  reducedMotion: boolean;
  isCurrentUser?: boolean;
}

function PodiumSlot({ entry, rank, poolTotal, delay, reducedMotion, isCurrentUser }: SlotProps) {
  const prize = poolTotal ? getPrizeShare(rank, poolTotal) : 0;
  const amountLabel = prize > 0 ? formatCoins(prize) : formatScore(entry.score);
  const firstName = entry.name.split(' ')[0] ?? entry.name;
  const avatarSize = AVATAR_PX[rank];

  return (
    <motion.div
      id={`lb-player-${entry.userId}`}
      className={cn('podium-slot', `podium-slot--${rank}`, isCurrentUser && 'podium-slot--me')}
      initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, delay }}
    >
      <div className="podium-slot-head">
        <p className="podium-score">
          <CoinIcon size="xs" className="podium-score-icon" />
          <span>{amountLabel}</span>
        </p>

        {rank === 1 && (
          <img
            src="/icons/podium-crown.svg"
            alt=""
            width={30}
            height={30}
            className="podium-crown"
            aria-hidden
          />
        )}

        <div className="podium-avatar-wrap" style={{ width: avatarSize }}>
          <div className={cn('podium-avatar-ring', `podium-avatar-ring--${rank}`)}>
            <img
              src={entry.avatarUrl ?? `https://i.pravatar.cc/150?u=${entry.userId}`}
              alt={`${entry.name}, rank ${rank}`}
              width={avatarSize}
              height={avatarSize}
              className="podium-avatar-img"
              style={{ width: avatarSize, height: avatarSize }}
            />
          </div>
        </div>
      </div>

      <div className={cn('podium-column', `podium-column--${rank}`)}>
        <div className="podium-column-body podium-shimmer">
          <span className="podium-rank-num" aria-hidden>
            {rank}
          </span>
        </div>
        <div className="podium-column-foot">
          <span className="podium-name">{firstName}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function Podium({
  first,
  second,
  third,
  poolTotal,
  highlightUserId,
  suppressConfetti = false,
}: PodiumProps) {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!first || reducedMotion || suppressConfetti) return;
    const timer = setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.40, x: 0.5 },
        colors: ['#3ddea8', '#5b7cff', '#a78bfa', '#ffffff'],
        scalar: 0.95,
        gravity: 1.0,
        ticks: 220,
      });
    }, 900);
    return () => clearTimeout(timer);
  }, [first?.userId, reducedMotion, suppressConfetti]);

  if (!first && !second && !third) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground" role="status">
        <span className="text-5xl" aria-hidden>
          🏆
        </span>
        <p className="text-sm">{t('leaderboard.podiumEmpty')}</p>
      </div>
    );
  }

  return (
    <section
      id={PODIUM_SECTION_ID}
      aria-label={t('leaderboard.podiumTitle')}
      className="podium-stage"
    >
      <div className="podium-block">
        {second && (
          <PodiumSlot
            entry={second}
            rank={2}
            poolTotal={poolTotal}
            delay={0.12}
            reducedMotion={reducedMotion}
            isCurrentUser={second.userId === highlightUserId}
          />
        )}
        {first && (
          <PodiumSlot
            entry={first}
            rank={1}
            poolTotal={poolTotal}
            delay={0}
            reducedMotion={reducedMotion}
            isCurrentUser={first.userId === highlightUserId}
          />
        )}
        {third && (
          <PodiumSlot
            entry={third}
            rank={3}
            poolTotal={poolTotal}
            delay={0.22}
            reducedMotion={reducedMotion}
            isCurrentUser={third.userId === highlightUserId}
          />
        )}
      </div>
      <div className="podium-base" aria-hidden>
        <span className="podium-base-seg podium-base-seg--2" />
        <span className="podium-base-seg podium-base-seg--1" />
        <span className="podium-base-seg podium-base-seg--3" />
      </div>
    </section>
  );
}
