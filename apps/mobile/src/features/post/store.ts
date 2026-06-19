import * as Haptics from "expo-haptics";
import { createStore } from "rostra";

import type { UIPost } from "@acme/convex/posts/types";
import { useLikePost, useUnlikePost } from "@acme/features/post";

interface PostStoreProps {
  post: UIPost;
}

export type PostMediaItem = ReturnType<typeof getPostMediaItems>[number];

function useInternalStore({ post }: PostStoreProps) {
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();

  async function like() {
    if (post.likedByMe) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await likeMutation({ postId: post._id });
    } catch {
      // Convex will roll back the optimistic update on failure.
    }
  }

  async function toggleLike() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await (post.likedByMe ? unlikeMutation : likeMutation)({
        postId: post._id,
      });
    } catch {
      // Convex will roll back the optimistic update on failure.
    }
  }

  return {
    caption: post.caption,
    createdAt: post._creationTime,
    creator: post.creator,
    location: post.location,
    mediaItems: getPostMediaItems(post),
    postId: post._id,
    likedByMe: post.likedByMe,
    like,
    toggleLike,
  };
}

function getPostMediaItems(post: UIPost) {
  return post.files.map((file) => ({
    mediaType: file.mediaType,
    url: file.url,
  }));
}

export const { Store: PostStore, useStore: usePostStore } =
  createStore(useInternalStore);
