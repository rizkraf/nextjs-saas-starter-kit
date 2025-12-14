"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type * as React from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 60 seconds
        staleTime: 60 * 1000,
        // Keep data in cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Don't refetch on mount if data is fresh
        refetchOnMount: false,
        // Don't refetch on window focus
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
