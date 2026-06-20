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
  for (const { args: queryArgs, value } of localStore.getAllQueries(
    api.posts.queries.getByUsername,
  )) {
    if (!value) continue;
    localStore.setQuery(
      api.posts.queries.getByUsername,
      queryArgs,
      value.map((post) => updatePost(post, postId, likedByMe)),
    );
  }

  const updatedFeedOrders = new Set<string>();
  for (const { args: queryArgs } of localStore.getAllQueries(
    api.posts.queries.getFriendsFeedPaginated,
  )) {
    if (updatedFeedOrders.has(queryArgs.order)) continue;
    updatedFeedOrders.add(queryArgs.order);
    optimisticallyUpdateValueInPaginatedQuery(
      localStore,
      api.posts.queries.getFriendsFeedPaginated,
      { order: queryArgs.order },
      (post) => updatePost(post, postId, likedByMe),
    );
  }

  const updatedProfileQueries = new Set<string>();
  for (const { args: queryArgs } of localStore.getAllQueries(
    api.posts.queries.getByUsernamePaginated,
  )) {
    const argsToMatch = {
      username: queryArgs.username,
      order: queryArgs.order,
    };
    const queryKey = `${argsToMatch.username}:${argsToMatch.order}`;
    if (updatedProfileQueries.has(queryKey)) continue;
    updatedProfileQueries.add(queryKey);
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
