import { Clock, CheckCircle2, PartyPopper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface StatusBannerProps {
  variant: 'distributing' | 'closed';
  message: string;
  winnerName?: string;
  playerReward?: number;
}

export function StatusBanner({ variant, message, winnerName, playerReward }: StatusBannerProps) {
  const { t } = useTranslation();
  const Icon =
    variant === 'distributing'
      ? Clock
      : variant === 'closed' && playerReward
        ? PartyPopper
        : CheckCircle2;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-wrap items-center justify-center gap-2 border-b px-4 py-2.5 text-sm font-medium',
        variant === 'distributing'
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400',
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" aria-hidden />
      <span>{message}</span>
      {variant === 'closed' && winnerName && (
        <span className="border-l border-current/30 pl-2 text-xs opacity-90">
          {t('leaderboard.rewardsWinner', { name: winnerName })}
        </span>
      )}
      {variant === 'closed' && playerReward != null && playerReward > 0 && (
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
          {t('leaderboard.youEarned', { amount: playerReward.toLocaleString() })}
        </span>
      )}
    </div>
  );
}
