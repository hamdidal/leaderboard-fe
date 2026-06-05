import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  leaderboardLiveSocket,
  type LiveEvent,
  type WsStatus,
} from '@/lib/leaderboardLiveSocket';

export type { WsStatus, LiveEvent };

export function useLeaderboardLive(
  weekId?: string,
  enabled = true,
  onLiveEvent?: (event: LiveEvent) => void,
): { wsStatus: WsStatus } {
  const queryClient = useQueryClient();
  const [wsStatus, setWsStatus] = useState<WsStatus>('disconnected');

  useEffect(() => {
    return leaderboardLiveSocket.subscribe(
      weekId,
      enabled,
      setWsStatus,
      (event) => {
        onLiveEvent?.(event);
        void Promise.all([
          queryClient.invalidateQueries({ queryKey: ['top100'] }),
          queryClient.invalidateQueries({ queryKey: ['me'] }),
          queryClient.invalidateQueries({ queryKey: ['pool'] }),
          queryClient.invalidateQueries({ queryKey: ['week'] }),
          queryClient.invalidateQueries({ queryKey: ['rewards'] }),
        ]);
      },
    );
  }, [weekId, enabled, queryClient, onLiveEvent]);

  return { wsStatus };
}
