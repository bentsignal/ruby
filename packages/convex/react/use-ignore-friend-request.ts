import { useMutation } from "convex/react";

import { api } from "../src/_generated/api";

export const useIgnoreFriendRequest = ({ username }: { username: string }) =>
  useMutation(api.friends.ignoreRequest).withOptimisticUpdate((localStore) => {
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
