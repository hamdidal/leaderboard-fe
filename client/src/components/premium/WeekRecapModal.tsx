import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LatestRewardsResponse, RewardEntry } from '@panteon/shared';
import { CoinAmount } from '@/components/atoms/CoinAmount/CoinAmount';
import { CoinIcon } from '@/components/atoms/CoinIcon/CoinIcon';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getTierI18nKey, getTierLabel } from '@/lib/tierUtils';
import { formatCoinsFull } from './prizeUtils';

interface WeekRecapModalProps {
  open: boolean;
  data: LatestRewardsResponse;
  highlightUserId?: string;
  myReward?: RewardEntry;
  onContinue: () => void;
}

export function WeekRecapModal({
  open,
  data,
  highlightUserId,
  myReward,
  onContinue,
}: WeekRecapModalProps) {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const winner = data.rewards.find((r) => r.rank === 1);

  const myRankFromRewards = myReward?.rank;
  const tierKey =
    myRankFromRewards != null ? getTierI18nKey(myRankFromRewards) : undefined;

  const confettiFiredRef = useRef(false);

  useEffect(() => {
    if (!open) {
      confettiFiredRef.current = false;
      return;
    }
    if (reducedMotion || !myReward || myReward.amount <= 0 || confettiFiredRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      confettiFiredRef.current = true;
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55, x: 0.5 },
        colors: ['#f5c642', '#3ddea8', '#5b7cff', '#ffffff'],
        scalar: 0.9,
        ticks: 180,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [open, reducedMotion, myReward?.amount, myReward?.userId]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="week-recap-overlay fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            aria-label={t('leaderboard.recapClose')}
            onClick={onContinue}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="week-recap-title"
            className="week-recap-dialog relative z-10 mx-auto w-full max-w-[420px] rounded-t-2xl border border-border/60 bg-background p-5 shadow-2xl sm:rounded-2xl sm:m-4"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            <button
              type="button"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:bg-muted/40"
              onClick={onContinue}
              aria-label={t('leaderboard.recapClose')}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="mb-4 flex items-center gap-2 pr-8">
              <Trophy className="h-5 w-5 text-[var(--design-gold)]" aria-hidden />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t('leaderboard.recapEyebrow')}
                </p>
                <h2 id="week-recap-title" className="text-lg font-bold text-foreground">
                  {data.weekId
                    ? t('leaderboard.recapTitle', { weekId: data.weekId })
                    : t('leaderboard.rewardsTitleGeneric')}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-[var(--design-gold-border)] bg-[var(--design-gold-bg)] px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--design-gold)]">
                  {t('leaderboard.rewardsPoolTotal')}
                </p>
                <p className="text-xl font-extrabold tabular-nums text-[var(--design-gold)]">
                  {formatCoinsFull(data.poolTotal)}
                </p>
                {winner?.displayName && (
                  <p className="mt-1 text-sm text-foreground/90">
                    {t('leaderboard.rewardsWinner', { name: winner.displayName })}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t('leaderboard.recapYourResult')}
                </p>
                {myReward ? (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums">
                      #{myReward.rank.toLocaleString()}
                    </span>
                    {tierKey && (
                      <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                        {getTierLabel(tierKey)}
                      </span>
                    )}
                    {myReward.amount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--design-gold)]">
                        <CoinIcon size="sm" />
                        <CoinAmount amount={myReward.amount} size="sm" />
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {t('leaderboard.recapNoPrize')}
                      </span>
                    )}
                  </div>
                ) : highlightUserId ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('leaderboard.recapNotInTop100')}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('leaderboard.recapSignInHint')}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              onClick={onContinue}
            >
              {t('leaderboard.recapContinue')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
