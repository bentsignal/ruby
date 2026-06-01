import { useMutation } from "convex/react";

import { api } from "../src/_generated/api";

export function useCancelFriendRequest({ username }: { username: string }) {
  return useMutation(api.friends.cancelRequest).withOptimisticUpdate(
    (localStore) => {
      const result = localStore.getQuery(api.profile.getByUsername, {
        username,
      });
      if (!result) return;
      localStore.setQuery(
        api.profile.getByUsername,
        { username },
        { ...result, relationship: null },
      );
    },
  );
}
