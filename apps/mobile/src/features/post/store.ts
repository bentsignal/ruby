import { useState } from "react";
import * as Haptics from "expo-haptics";
import { createStore } from "rostra";

import type { UIPost } from "@acme/convex/posts/types";
import { useLikePost, useUnlikePost } from "@acme/features/post";

interface PostStoreProps {
  onLikedByMeChange?: (postId: UIPost["_id"], likedByMe: boolean) => void;
  post: UIPost;
}

export type PostMediaItem = ReturnType<typeof getPostMediaItems>[number];

function useInternalStore({ onLikedByMeChange, post }: PostStoreProps) {
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const [likedByMeOverride, setLikedByMeOverride] = useState<{
    likedByMe: boolean;
    postId: UIPost["_id"];
  } | null>(null);
  const likedByMe =
    likedByMeOverride?.postId === post._id
      ? likedByMeOverride.likedByMe
      : post.likedByMe;

  function updateLikedByMe(nextLikedByMe: boolean) {
    setLikedByMeOverride({ likedByMe: nextLikedByMe, postId: post._id });
    onLikedByMeChange?.(post._id, nextLikedByMe);
  }

  async function like() {
    if (likedByMe) return;
    updateLikedByMe(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await likeMutation({ postId: post._id });
    } catch {
      updateLikedByMe(false);
    }
  }

  async function toggleLike() {
    const nextLikedByMe = !likedByMe;
    updateLikedByMe(nextLikedByMe);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await (nextLikedByMe ? likeMutation : unlikeMutation)({
        postId: post._id,
      });
    } catch {
      updateLikedByMe(!nextLikedByMe);
    }
  }

  return {
    caption: post.caption,
    createdAt: post._creationTime,
    creator: post.creator,
    location: post.location,
    mediaItems: getPostMediaItems(post),
    postId: post._id,
    likedByMe,
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
