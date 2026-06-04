import { useMemo, useState } from 'react';
import { ChevronDown, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LatestRewardsResponse, RewardEntry } from '@panteon/shared';
import { CoinAmount } from '@/components/atoms/CoinAmount/CoinAmount';
import { cn } from '@/lib/utils';
import { formatCoinsFull } from './prizeUtils';

interface WeekRewardsPanelProps {
  data: LatestRewardsResponse;
  highlightUserId?: string;
  defaultExpanded?: boolean;
}

function RewardRow({
  entry,
  isMe,
}: {
  entry: RewardEntry;
  isMe: boolean;
}) {
  const { t } = useTranslation();
  const name = entry.displayName ?? entry.userId.slice(0, 8);

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-b border-border/30 px-3 py-2 text-sm last:border-0',
        isMe && 'bg-primary/[0.08]',
      )}
    >
      <span className="w-8 flex-shrink-0 tabular-nums font-semibold text-muted-foreground">
        #{entry.rank}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium">
        {name}
        {isMe && (
          <span className="ml-1.5 text-[10px] font-bold uppercase text-primary">
            {t('leaderboard.you')}
          </span>
        )}
      </span>
      <CoinAmount amount={entry.amount} size="sm" />
    </div>
  );
}

export function WeekRewardsPanel({
  data,
  highlightUserId,
  defaultExpanded = true,
}: WeekRewardsPanelProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const myReward = useMemo(
    () => data.rewards.find((r) => r.userId === highlightUserId),
    [data.rewards, highlightUserId],
  );

  const winner = data.rewards.find((r) => r.rank === 1);

  const panelLabel =
    data.weekId != null
      ? t('leaderboard.rewardsTitle', { weekId: data.weekId })
      : t('leaderboard.rewardsTitleGeneric');

  const headingText =
    data.weekId != null
      ? t('leaderboard.rewardsTitle', { weekId: data.weekId })
      : t('leaderboard.rewardsTitleGeneric');

  return (
    <section
      className="mx-auto max-w-[720px] px-2.5"
      aria-label={panelLabel}
    >
      <div className="top100-panel glass-panel overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/30"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <Trophy className="h-4 w-4 flex-shrink-0 text-[var(--design-gold)]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{headingText}</p>
            <p className="text-xs text-muted-foreground">
              {t('leaderboard.rewardsPoolTotal')}: {formatCoinsFull(data.poolTotal)}
              {winner?.displayName && (
                <span className="ml-2">
                  · {t('leaderboard.rewardsWinner', { name: winner.displayName })}
                </span>
              )}
            </p>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform',
              expanded && 'rotate-180',
            )}
            aria-hidden
          />
        </button>

        {myReward != null && (
          <div className="border-t border-border/40 bg-primary/[0.06] px-3 py-2 text-sm">
            <span className="text-muted-foreground">{t('leaderboard.rewardsYourPrize')}: </span>
            <span className="font-semibold text-foreground">
              <CoinAmount amount={myReward.amount} size="sm" />
            </span>
            <span className="ml-1 text-muted-foreground">
              ({t('leaderboard.rank')} #{myReward.rank})
            </span>
          </div>
        )}

        {expanded && (
          <div
            className="max-h-[min(280px,40dvh)] overflow-y-auto border-t border-border/40"
            role="list"
          >
            {data.rewards.map((entry) => (
              <RewardRow
                key={entry.userId}
                entry={entry}
                isMe={entry.userId === highlightUserId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
