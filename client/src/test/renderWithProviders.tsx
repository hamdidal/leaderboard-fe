import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import type { ReactElement, ReactNode } from 'react';
import i18n from '@/i18n/config';
import { ThemeProvider } from '@/theme/ThemeProvider';

interface ProviderProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

function AllProviders({ children, queryClient }: ProviderProps) {
  const client =
    queryClient
    ?? new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

  return (
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>{children}</ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & { queryClient?: QueryClient },
) {
  const { queryClient, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders queryClient={queryClient}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}
