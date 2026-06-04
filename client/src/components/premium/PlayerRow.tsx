import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LeaderboardEntry } from '@panteon/shared';
import { cn } from '@/lib/utils';
import { CoinIcon } from '@/components/atoms/CoinIcon/CoinIcon';
import { EllipsisText } from '@/components/atoms/EllipsisText/EllipsisText';
import { getPrizeShare, formatCoins, formatScore } from './prizeUtils';

export interface PlayerRowProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  rankDelta?: number;
  poolTotal?: number;
  index?: number;
  compact?: boolean;
}

export function PlayerRow({
  entry,
  isCurrentUser,
  rankDelta,
  poolTotal,
  index = 0,
  compact = false,
}: PlayerRowProps) {
  const { t } = useTranslation();
  const prizeCoins = poolTotal && entry.rank <= 100 ? getPrizeShare(entry.rank, poolTotal) : 0;
  const rankLabel = `#${entry.rank.toLocaleString()}`;
  const avatarSize = compact ? 32 : 44;

  return (
    <motion.div
      id={`lb-player-${entry.userId}`}
      role="listitem"
      aria-label={`${t('leaderboard.rank')} ${entry.rank}: ${entry.name}`}
      initial={compact ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.5), ease: 'easeOut' }}
      className={cn(
        'top100-row',
        compact && 'top100-row--compact',
        isCurrentUser && 'is-me',
      )}
    >
      <div className="top100-row-main">
        <span className={cn('top100-rank-badge', entry.rank <= 10 && 'top10')}>
          {rankLabel}
        </span>

        <img
          src={entry.avatarUrl ?? `https://i.pravatar.cc/150?u=${entry.userId}`}
          alt={`${entry.name}'s avatar`}
          width={avatarSize}
          height={avatarSize}
          className={cn('top100-avatar', isCurrentUser && 'top100-avatar--me')}
          loading="lazy"
        />

        <div className="top100-info">
          <div className="top100-name">
            <EllipsisText text={entry.name} className="top100-name-text" />
            {isCurrentUser && (
              <span className="top100-you-tag">{t('leaderboard.you')}</span>
            )}
          </div>
          {!compact && (
            <p className="top100-pts">{formatScore(entry.score)} pts</p>
          )}
        </div>
      </div>

      {!compact && (
        <div className="top100-row-end">
          <div className="flex items-center justify-end gap-1.5">
            <span className="top100-score">{formatScore(entry.score)}</span>
            {rankDelta != null && rankDelta !== 0 && (
              <span
                className={cn(
                  'top100-delta',
                  rankDelta > 0 ? 'top100-delta--up' : 'top100-delta--down',
                )}
                aria-label={`Rank changed by ${Math.abs(rankDelta)}`}
              >
                {rankDelta > 0 ? (
                  <TrendingUp className="h-3 w-3" aria-hidden />
                ) : (
                  <TrendingDown className="h-3 w-3" aria-hidden />
                )}
                {Math.abs(rankDelta)}
              </span>
            )}
          </div>
          {prizeCoins > 0 && (
            <div className="top100-prize">
              <span className="top100-prize-label">{t('leaderboard.estPrize')}</span>
              <span className="top100-prize-value" title={String(Math.round(prizeCoins))}>
                <CoinIcon size="sm" />
                {formatCoins(prizeCoins)}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
