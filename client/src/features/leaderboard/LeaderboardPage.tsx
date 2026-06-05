import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchCurrentWeek,
  fetchDemoToken,
  fetchLatestRewards,
  fetchMe,
  fetchPool,
  fetchRewardsForWeek,
  fetchTop100,
} from '@/api/leaderboard';
import { ApiError } from '@/api/client';
import { LeaderboardLayout } from '@/components/premium/LeaderboardLayout';
import { WeekRewardsPanel } from '@/components/premium/WeekRewardsPanel';
import { StatusBanner } from '@/components/premium/StatusBanner';
import type { LatestRewardsResponse } from '@panteon/shared';
import { DEFAULT_DEMO_USER_ID, useUiStore } from '@/store/uiStore';
import { useLeaderboardLive } from '@/hooks/useLeaderboardLive';
import { getJwtSubject } from '@/lib/jwt';
import { computePointsToTop100 } from '@/lib/leaderboardGap';
import { scrollToPlayerAnchor } from '@/lib/scrollToPlayer';
import {
  computePointsToNextTier,
  getTierI18nKey,
} from '@/lib/tierUtils';
import { formatCoins } from '@/components/premium/prizeUtils';
import type { LeaderboardEntry } from '@panteon/shared';

function estimateReward(poolTotal: number, rank: number): number | null {
  if (rank < 1 || rank > 100 || poolTotal <= 0) return null;
  const FIXED: Record<number, number> = { 1: 0.2, 2: 0.15, 3: 0.1 };
  if (rank <= 3) return poolTotal * (FIXED[rank] ?? 0);
  let totalWeight = 0;
  for (let r = 4; r <= 100; r++) totalWeight += 101 - r;
  return poolTotal * 0.55 * ((101 - rank) / totalWeight);
}

export function LeaderboardPage() {
  const { t } = useTranslation();
  const { authToken, demoUserId, setAuthToken, setDemoUserId } = useUiStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mockPlayer = params.get('mockPlayer');
    if (mockPlayer === '8000' || mockPlayer === 'outside') {
      if (demoUserId !== 'demo-user-8000') {
        setDemoUserId('demo-user-8000');
        setAuthToken(null);
      }
      return;
    }
    if (demoUserId !== DEFAULT_DEMO_USER_ID) {
      setDemoUserId(DEFAULT_DEMO_USER_ID);
      setAuthToken(null);
    }
  }, [demoUserId, setDemoUserId, setAuthToken]);

  useEffect(() => {
    const tokenUser = authToken ? getJwtSubject(authToken) : null;
    if (tokenUser === demoUserId && authToken) return;

    if (authToken && tokenUser !== demoUserId) {
      setAuthToken(null);
      return;
    }

    let cancelled = false;
    fetchDemoToken(demoUserId)
      .then(({ token }) => {
        if (!cancelled) setAuthToken(token);
      })
      .catch(() => {
        if (!cancelled) setAuthToken(null);
      });

    return () => {
      cancelled = true;
    };
  }, [authToken, demoUserId, setAuthToken]);

  const weekQuery = useQuery({ queryKey: ['week'], queryFn: fetchCurrentWeek, refetchInterval: 60_000 });

  const prevRanksRef = useRef<Map<string, number>>(new Map());
  const [rankDeltas, setRankDeltas] = useState<ReadonlyMap<string, number>>(new Map());

  const handleLiveEvent = useCallback((type: 'rank_update' | 'week_reset') => {
    if (type === 'week_reset') {
      prevRanksRef.current = new Map();
      setRankDeltas(new Map());
    }
  }, []);

  const { wsStatus } = useLeaderboardLive(
    weekQuery.data?.weekId,
    Boolean(weekQuery.data?.weekId),
    handleLiveEvent,
  );

  const pollMs = wsStatus === 'connected' ? 30_000 : 10_000;

  const topQuery = useQuery({
    queryKey: ['top100'],
    queryFn: fetchTop100,
    refetchInterval: pollMs,
  });
  const poolQuery = useQuery({ queryKey: ['pool'], queryFn: fetchPool, refetchInterval: pollMs });
  const meQuery = useQuery({
    queryKey: ['me', authToken],
    queryFn: () => fetchMe(authToken!),
    enabled: !!authToken,
    refetchInterval: pollMs,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 401) && failureCount < 3,
  });

  const closedWeekId = weekQuery.data?.status === 'CLOSED' ? weekQuery.data.weekId : null;

  const closedRewardsQuery = useQuery({
    queryKey: ['rewards', closedWeekId],
    queryFn: () => fetchRewardsForWeek(closedWeekId!),
    enabled: !!closedWeekId,
    retry: false,
  });

  const latestRewardsQuery = useQuery({
    queryKey: ['rewards', 'latest'],
    queryFn: fetchLatestRewards,
    enabled: !closedWeekId,
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (meQuery.error instanceof ApiError && meQuery.error.status === 401) {
      setAuthToken(null);
    }
  }, [meQuery.error, setAuthToken]);

  useEffect(() => {
    prevRanksRef.current = new Map();
    setRankDeltas(new Map());
  }, [weekQuery.data?.weekId]);

  useEffect(() => {
    const entries = topQuery.data?.entries;
    if (!entries) return;

    const prev = prevRanksRef.current;
    const deltas = new Map<string, number>();

    for (const entry of entries) {
      const previousRank = prev.get(entry.userId);
      if (previousRank != null && previousRank !== entry.rank) {
        deltas.set(entry.userId, previousRank - entry.rank);
      }
    }

    const next = new Map<string, number>();
    for (const entry of entries) next.set(entry.userId, entry.rank);
    prevRanksRef.current = next;

    if (deltas.size > 0) {
      setRankDeltas(deltas);
      const tid = setTimeout(() => setRankDeltas(new Map()), 15_000);
      return () => clearTimeout(tid);
    }
  }, [topQuery.data]);

  const entries: LeaderboardEntry[] = topQuery.data?.entries ?? [];
  const poolTotal = poolQuery.data?.poolTotal;
  const weekStatus = weekQuery.data?.status;
  const meData = meQuery.data;
  const meEntry = meData?.me;
  const meNeighbors = meData?.neighbors ?? [];

  const estimated = poolTotal != null && meEntry != null
    ? estimateReward(poolTotal, meEntry.rank)
    : null;

  const playerTierKey = meEntry != null ? getTierI18nKey(meEntry.rank) : undefined;

  const inTop100 = meData?.inTop100 ?? false;

  const nextTierHint = useMemo(() => {
    if (!meEntry || !inTop100 || entries.length === 0) return null;
    const next = computePointsToNextTier(meEntry.rank, meEntry.score, entries);
    if (!next) return null;
    return { tierKey: next.tierKey, points: formatCoins(next.points) };
  }, [meEntry, inTop100, entries]);
  const showPlayerContext = meEntry != null;

  const pointsToTop100 = useMemo(() => {
    if (!meEntry || inTop100 || entries.length === 0) return null;
    return computePointsToTop100(meEntry.score, entries);
  }, [meEntry, inTop100, entries]);

  const handleJumpToMe = useCallback(() => {
    if (!meEntry) return;
    scrollToPlayerAnchor(meEntry.userId, meEntry.rank);
  }, [meEntry]);

  const rewardsData: LatestRewardsResponse | undefined =
    closedRewardsQuery.data ?? latestRewardsQuery.data;

  const myRewardEntry = rewardsData?.rewards.find((r) => r.userId === meEntry?.userId);
  const weekWinner = rewardsData?.rewards.find((r) => r.rank === 1);

  const showRewardsPanel =
    rewardsData != null && rewardsData.rewards.length > 0;

  const statusBanner =
    weekStatus === 'DISTRIBUTING' ? (
      <StatusBanner variant="distributing" message={t('leaderboard.distributingBanner')} />
    ) : weekStatus === 'CLOSED' ? (
      <StatusBanner
        variant="closed"
        message={t('leaderboard.closedBanner')}
        winnerName={weekWinner?.displayName}
        playerReward={myRewardEntry?.amount}
      />
    ) : undefined;

  const meStatusSlot = (() => {
    if (!authToken || meQuery.isLoading) return null;
    if (meQuery.error instanceof ApiError && meQuery.error.status === 404) {
      return (
        <p className="mx-auto max-w-[720px] px-3 py-2 text-center text-sm text-muted-foreground" role="status">
          {t('leaderboard.meNotOnBoard')}
        </p>
      );
    }
    if (meQuery.isError) {
      return (
        <p className="mx-auto max-w-[720px] px-3 py-2 text-center text-sm text-destructive" role="alert">
          {t('leaderboard.meError')}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => meQuery.refetch()}
          >
            {t('leaderboard.retry')}
          </button>
        </p>
      );
    }
    return null;
  })();

  const rewardsPanel = showRewardsPanel ? (
    <WeekRewardsPanel
      data={rewardsData}
      highlightUserId={meEntry?.userId}
      defaultExpanded={weekStatus === 'DISTRIBUTING' || weekStatus === 'CLOSED'}
    />
  ) : undefined;

  return (
    <LeaderboardLayout
      wsStatus={wsStatus}
      statusBanner={statusBanner}
      rewardsPanel={rewardsPanel}
      meStatusSlot={meStatusSlot}
      poolTotal={poolTotal}
      endsAt={weekQuery.data?.endsAt}
      weekId={weekQuery.data?.weekId ?? poolQuery.data?.weekId}
      playerRank={meEntry?.rank}
      estimatedReward={estimated}
      playerTierKey={playerTierKey}
      nextTierHint={nextTierHint}
      totalPlayers={weekQuery.data?.totalPlayers ?? 0}
      entries={entries}
      highlightUserId={meEntry?.userId}
      rankDeltas={rankDeltas}
      isTopLoading={topQuery.isLoading || poolQuery.isLoading}
      isTopError={topQuery.isError}
      onRetryTop={() => topQuery.refetch()}
      meEntry={meEntry}
      meNeighbors={meNeighbors}
      showPlayerContext={showPlayerContext}
      inTop100={inTop100}
      pointsToTop100={pointsToTop100}
      onJumpToMe={meEntry && inTop100 ? handleJumpToMe : undefined}
      jumpToMeDisabled={!authToken || meQuery.isLoading || topQuery.isLoading}
    />
  );
}

