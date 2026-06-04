import { AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LeaderboardEntry } from '@panteon/shared';
import { PlayerRow } from './PlayerRow';

interface RankedListProps {
  entries: LeaderboardEntry[];
  highlightUserId?: string;
  rankDeltas?: ReadonlyMap<string, number>;
  poolTotal?: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function RankedList({
  entries,
  highlightUserId,
  rankDeltas,
  poolTotal,
  isLoading,
  isError,
  onRetry,
}: RankedListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="top100-list" aria-busy="true" aria-label={t('leaderboard.loading')}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="top100-row top100-row--skeleton"
            style={{ animationDelay: `${i * 50}ms` }}
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-10" role="alert">
        <p className="text-sm text-muted-foreground">{t('leaderboard.failedToLoad')}</p>
        <button
          type="button"
          onClick={onRetry}
          className="design-icon-btn gap-2 px-3 text-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          {t('leaderboard.retry')}
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground" role="status">
        {t('leaderboard.rankingsEmpty')}
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label={t('leaderboard.rankingsHeader', { from: 4, to: 100 })}
      className="top100-list"
    >
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => (
          <PlayerRow
            key={entry.userId}
            entry={entry}
            isCurrentUser={entry.userId === highlightUserId}
            rankDelta={rankDeltas?.get(entry.userId)}
            poolTotal={poolTotal}
            index={i}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
