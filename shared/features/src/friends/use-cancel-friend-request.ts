import { useMutation } from "convex/react";

import { api } from "@acme/convex/api";

export function useCancelFriendRequest({ username }: { username: string }) {
  return useMutation(api.friends.mutations.cancelRequest).withOptimisticUpdate(
    (localStore) => {
      const result = localStore.getQuery(api.profile.queries.getByUsername, {
        username,
      });
      if (!result) return;
      localStore.setQuery(
        api.profile.queries.getByUsername,
        { username },
        { ...result, relationship: null },
      );
    },
  );
}
