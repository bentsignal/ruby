import { MINUTE, RateLimiter } from "@convex-dev/rate-limiter";

import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  updateFriendStatus: {
    kind: "token bucket",
    rate: 10,
    period: MINUTE,
    capacity: 70,
  },
  placesAutocomplete: {
    kind: "token bucket",
    rate: 60,
    period: MINUTE,
    capacity: 60,
  },
  placesResolve: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 20,
  },
});
