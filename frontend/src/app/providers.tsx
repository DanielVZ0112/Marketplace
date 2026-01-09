import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/lib/react-query';
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/shared/lib/theme";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }
