import { create } from 'zustand';
import { getJwtSubject } from '@/lib/jwt';

const DEMO_USER_STORAGE_KEY = 'panteon-demo-user';
const TOKEN_STORAGE_KEY = 'panteon-token';
export const DEFAULT_DEMO_USER_ID = 'demo-user';

function readStoredAuth(): { authToken: string | null; demoUserId: string } {
  const demoUserId =
    localStorage.getItem(DEMO_USER_STORAGE_KEY) ?? DEFAULT_DEMO_USER_ID;
  const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!storedToken) {
    return { authToken: null, demoUserId };
  }
  const tokenUserId = getJwtSubject(storedToken);
  if (tokenUserId !== demoUserId) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return { authToken: null, demoUserId };
  }
  return { authToken: storedToken, demoUserId };
}

const initial = readStoredAuth();

interface UiState {
  authToken: string | null;
  demoUserId: string;
  setAuthToken: (token: string | null) => void;
  setDemoUserId: (id: string) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  authToken: initial.authToken,
  demoUserId: initial.demoUserId,
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    set({ authToken: token });
  },
  setDemoUserId: (id) => {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, id);
    const tokenUser = get().authToken ? getJwtSubject(get().authToken!) : null;
    if (tokenUser !== id) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      set({ demoUserId: id, authToken: null });
      return;
    }
    set({ demoUserId: id });
  },
}));
