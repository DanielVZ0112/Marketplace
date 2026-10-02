import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/lib/react-query';
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/shared/lib/theme";
import { useSessionStore } from "@/shared/stores/session.store";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

function SessionInitializer() {
  const initializeFromStorage = useSessionStore((s) => s.initializeFromStorage);
  
  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);
  
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SessionInitializer />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  }
