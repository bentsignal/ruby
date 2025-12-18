"use client";

import type { ReactNode } from "react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";

import { env } from "~/env";
import { authClient } from "~/lib/auth-client";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL, {});

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

export const Provider = ({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) => {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
      initialToken={initialToken}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexBetterAuthProvider>
  );
};
