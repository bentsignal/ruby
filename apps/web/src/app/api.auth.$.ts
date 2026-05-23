import { createFileRoute } from "@tanstack/react-router";

import { withAuthCookies } from "~/features/auth/lib/cookies";
import { handler } from "~/features/auth/lib/server";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => withAuthCookies(await handler(request)),
      POST: async ({ request }) => withAuthCookies(await handler(request)),
    },
  },
});
