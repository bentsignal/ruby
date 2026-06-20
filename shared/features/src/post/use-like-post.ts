import type { OptimisticLocalStore } from "convex/browser";
import {
  optimisticallyUpdateValueInPaginatedQuery,
  useMutation,
} from "convex/react";

import type { UIPost } from "@acme/convex/posts/types";
import { api } from "@acme/convex/api";

export function useLikePost() {
  return useMutation(api.likes.mutations.like).withOptimisticUpdate(
    (localStore, args) => {
      updatePostQueries(localStore, args.postId, true);
    },
  );
}

export function useUnlikePost() {
  return useMutation(api.likes.mutations.unlike).withOptimisticUpdate(
    (localStore, args) => {
      updatePostQueries(localStore, args.postId, false);
    },
  );
}

function updatePostQueries(
  localStore: OptimisticLocalStore,
  postId: UIPost["_id"],
  likedByMe: boolean,
) {
  for (const query of [
    api.posts.queries.getAll,
    api.posts.queries.getByUsername,
  ]) {
    for (const { args: queryArgs, value } of localStore.getAllQueries(query)) {
      if (!value) continue;
      localStore.setQuery(
        query,
        queryArgs,
        value.map((post) => updatePost(post, postId, likedByMe)),
      );
    }
  }

  if (
    localStore
      .getAllQueries(api.posts.queries.getFriendsFeedPaginated)
      .some(({ value }) => value !== undefined)
  ) {
    optimisticallyUpdateValueInPaginatedQuery(
      localStore,
      api.posts.queries.getFriendsFeedPaginated,
      {},
      (post) => updatePost(post, postId, likedByMe),
    );
  }

  const updatedUsernames = new Set<string>();
  for (const { args: queryArgs } of localStore.getAllQueries(
    api.posts.queries.getByUsernamePaginated,
  )) {
    const argsToMatch = { username: queryArgs.username };
    if (updatedUsernames.has(argsToMatch.username)) continue;
    updatedUsernames.add(argsToMatch.username);
    optimisticallyUpdateValueInPaginatedQuery(
      localStore,
      api.posts.queries.getByUsernamePaginated,
      argsToMatch,
      (post) => updatePost(post, postId, likedByMe),
    );
  }
}

function updatePost<TPost extends { _id: UIPost["_id"]; likedByMe: boolean }>(
  post: TPost,
  postId: UIPost["_id"],
  likedByMe: boolean,
) {
  if (post._id !== postId) return post;

  return { ...post, likedByMe };
}
