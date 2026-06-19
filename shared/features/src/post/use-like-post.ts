import { useMutation } from "convex/react";

import { api } from "@acme/convex/api";

export function useLikePost() {
  return useMutation(api.likes.mutations.like).withOptimisticUpdate(
    (localStore, args) => {
      for (const query of [
        api.posts.queries.getAll,
        api.posts.queries.getByUsername,
      ]) {
        for (const { args: queryArgs, value } of localStore.getAllQueries(
          query,
        )) {
          if (!value) continue;
          localStore.setQuery(query, queryArgs, [
            ...value.map((post) =>
              post._id === args.postId ? { ...post, likedByMe: true } : post,
            ),
          ]);
        }
      }
    },
  );
}

export function useUnlikePost() {
  return useMutation(api.likes.mutations.unlike).withOptimisticUpdate(
    (localStore, args) => {
      for (const query of [
        api.posts.queries.getAll,
        api.posts.queries.getByUsername,
      ]) {
        for (const { args: queryArgs, value } of localStore.getAllQueries(
          query,
        )) {
          if (!value) continue;
          localStore.setQuery(query, queryArgs, [
            ...value.map((post) =>
              post._id === args.postId ? { ...post, likedByMe: false } : post,
            ),
          ]);
        }
      }
    },
  );
}
