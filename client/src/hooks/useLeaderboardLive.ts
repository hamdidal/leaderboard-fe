import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  leaderboardLiveSocket,
  type LiveEventType,
  type WsStatus,
} from '@/lib/leaderboardLiveSocket';

export type { WsStatus, LiveEventType };

export function useLeaderboardLive(
  weekId?: string,
  enabled = true,
  onLiveEvent?: (type: LiveEventType) => void,
): { wsStatus: WsStatus } {
  const queryClient = useQueryClient();
  const [wsStatus, setWsStatus] = useState<WsStatus>('disconnected');

  useEffect(() => {
    return leaderboardLiveSocket.subscribe(
      weekId,
      enabled,
      setWsStatus,
      (type) => {
        onLiveEvent?.(type);
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
