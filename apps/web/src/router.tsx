import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexReactClient } from "convex/react";

import { env } from "~/env";
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
  convex: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
  queryClient: QueryClient;
}

export function getRouter() {
  const convex = new ConvexReactClient(env.VITE_CONVEX_URL, {
    expectAuth: true,
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
  return createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      convex,
      queryClient,
      convexQueryClient,
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
