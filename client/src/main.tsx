import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme/ThemeProvider';
import { LeaderboardPage } from './features/leaderboard/LeaderboardPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import './i18n/config';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000, retry: 2 },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ErrorBoundary>
            <LeaderboardPage />
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
