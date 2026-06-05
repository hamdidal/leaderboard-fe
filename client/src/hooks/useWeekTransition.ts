import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LatestRewardsResponse } from '@panteon/shared';
import type { LiveEvent } from '@/lib/leaderboardLiveSocket';
import { isRecapDismissed, markRecapDismissed } from '@/lib/weekRecapStorage';

export type WeekUiPhase = 'live' | 'distributing' | 'recap';

interface UseWeekTransitionOptions {
  weekStatus?: 'ACTIVE' | 'DISTRIBUTING' | 'CLOSED';
  currentWeekId?: string;
  lastWeekRewards?: LatestRewardsResponse;
}

export function useWeekTransition({
  weekStatus,
  currentWeekId,
  lastWeekRewards,
}: UseWeekTransitionOptions) {
  const [isDistributing, setIsDistributing] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);

  const lastWeekId = lastWeekRewards?.weekId ?? null;
  const hasLastWeek = Boolean(lastWeekId && (lastWeekRewards?.rewards.length ?? 0) > 0);

  const shouldOfferRecap = useMemo(() => {
    if (!hasLastWeek || !lastWeekId || !currentWeekId) return false;
    const isPastWeekRecap =
      lastWeekId !== currentWeekId || weekStatus === 'CLOSED';
    if (!isPastWeekRecap) return false;
    if (sessionDismissed) return false;
    return !isRecapDismissed(lastWeekId);
  }, [hasLastWeek, lastWeekId, currentWeekId, weekStatus, sessionDismissed]);

  const handleLiveEvent = useCallback((event: LiveEvent) => {
    if (event.type === 'week_reset') {
      setIsDistributing(true);
    }
  }, []);

  useEffect(() => {
    if (weekStatus === 'DISTRIBUTING') {
      setIsDistributing(true);
    } else if (weekStatus === 'ACTIVE') {
      setIsDistributing(false);
    }
  }, [weekStatus]);

  useEffect(() => {
    if (shouldOfferRecap && isDistributing) {
      setIsDistributing(false);
    }
  }, [shouldOfferRecap, isDistributing]);

  const phase: WeekUiPhase = isDistributing
    ? 'distributing'
    : shouldOfferRecap
      ? 'recap'
      : 'live';

  const dismissRecap = useCallback(() => {
    if (lastWeekId) {
      markRecapDismissed(lastWeekId);
    }
    setSessionDismissed(true);
  }, [lastWeekId]);

  return {
    phase,
    showRecapModal: shouldOfferRecap && !isDistributing,
    dismissRecap,
    handleLiveEvent,
    hasLastWeek,
    lastWeekId,
  };
}
