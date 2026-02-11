import { useMutation } from "convex/react";

import { api } from "../src/_generated/api";

export const useRemoveFriend = ({ username }: { username: string }) =>
  useMutation(api.friends.remove).withOptimisticUpdate((localStore) => {
    const result = localStore.getQuery(api.profile.getByUsername, {
      username,
    });
    if (!result) return;
    localStore.setQuery(
      api.profile.getByUsername,
      { username },
      { ...result, relationship: null },
    );
  });
