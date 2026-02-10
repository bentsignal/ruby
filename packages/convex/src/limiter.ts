import { MINUTE, RateLimiter } from "@convex-dev/rate-limiter";

import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  updateFriendStatus: {
    kind: "token bucket",
    rate: 10,
    period: MINUTE,
    capacity: 100,
  },
});
