const WS_BASE =
  typeof window !== 'undefined'
    ? (import.meta.env.VITE_WS_URL ??
      `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/live`)
    : '';

const RECONNECT_MS = 3000;

export type WsStatus = 'connecting' | 'connected' | 'disconnected';

export type LiveEventType = 'rank_update' | 'week_reset';

type StatusListener = (status: WsStatus) => void;
type LiveEventListener = (type: LiveEventType) => void;

export function parseLiveEventPayload(raw: string): LiveEventType | null {
  try {
    const data = JSON.parse(raw) as { type?: string };
    if (data.type === 'rank_update' || data.type === 'week_reset') {
      return data.type;
    }
    return null;
  } catch {
    return null;
  }
}

function detachWebSocket(ws: WebSocket) {
  ws.onopen = null;
  ws.onmessage = null;
  ws.onerror = null;
  ws.onclose = null;
  if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
    ws.close();
  }
}

class LeaderboardLiveSocket {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private weekId: string | null = null;
  private status: WsStatus = 'disconnected';
  private readonly statusListeners = new Set<StatusListener>();
  private readonly liveEventListeners = new Set<LiveEventListener>();

  subscribe(
    weekId: string | undefined,
    enabled: boolean,
    onStatus: StatusListener,
    onLiveEvent: LiveEventListener,
  ): () => void {
    this.statusListeners.add(onStatus);
    this.liveEventListeners.add(onLiveEvent);
    onStatus(this.status);

    if (enabled && weekId) {
      this.setTarget(weekId);
    } else {
      this.clearTarget();
    }

    return () => {
      this.statusListeners.delete(onStatus);
      this.liveEventListeners.delete(onLiveEvent);
      if (this.statusListeners.size === 0) {
        this.teardown();
      }
    };
  }

  private setTarget(weekId: string) {
    if (this.weekId === weekId && this.ws) return;
    this.teardownSocket();
    this.weekId = weekId;
    this.connect();
  }

  private clearTarget() {
    this.weekId = null;
    this.teardownSocket();
    this.setStatus('disconnected');
  }

  private teardown() {
    this.weekId = null;
    this.teardownSocket();
    this.setStatus('disconnected');
  }

  private clearReconnect() {
    if (this.reconnectTimer != null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private teardownSocket() {
    this.clearReconnect();
    if (this.ws) {
      detachWebSocket(this.ws);
      this.ws = null;
    }
  }

  private setStatus(next: WsStatus) {
    this.status = next;
    for (const listener of this.statusListeners) listener(next);
  }

  private emitLiveEvent(type: LiveEventType) {
    for (const listener of this.liveEventListeners) listener(type);
  }

  private scheduleReconnect() {
    this.clearReconnect();
    if (!this.weekId || this.statusListeners.size === 0) return;
    this.reconnectTimer = setTimeout(() => this.connect(), RECONNECT_MS);
  }

  private connect() {
    if (!this.weekId || this.statusListeners.size === 0) return;

    this.teardownSocket();
    this.setStatus('connecting');

    const url = `${WS_BASE}?weekId=${encodeURIComponent(this.weekId)}`;
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      if (this.ws !== ws) return;
      this.setStatus('connected');
    };

    ws.onmessage = (event) => {
      if (this.ws !== ws) return;
      const liveType = parseLiveEventPayload(event.data as string);
      if (liveType) this.emitLiveEvent(liveType);
    };

    ws.onerror = () => {
      if (this.ws !== ws) return;
      this.setStatus('disconnected');
    };

    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      this.setStatus('disconnected');
      this.scheduleReconnect();
    };
  }
}

export const leaderboardLiveSocket = new LeaderboardLiveSocket();
