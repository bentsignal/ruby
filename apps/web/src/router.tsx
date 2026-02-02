import { createRouter } from "@tanstack/react-router";

import { convexQueryClient, queryClient } from "~/context/convex-context";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
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
