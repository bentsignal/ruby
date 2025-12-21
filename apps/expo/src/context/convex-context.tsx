"use client";

import type { ReactNode } from "react";
import { StrictMode } from "react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";

import { env } from "~/expo.env";
import { authClient } from "~/lib/auth-client";

const convex = new ConvexReactClient(env("CONVEX_URL"), {
  // expectAuth: true,
});

const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

export function Provider({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ConvexBetterAuthProvider>
    </StrictMode>
  );
}
