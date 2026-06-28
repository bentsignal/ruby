import { useState } from "react";
import * as Haptics from "expo-haptics";
import { createStore } from "rostra";

import type { PostDisplayAspectRatio } from "@acme/config/posts";
import type { UIPost } from "@acme/convex/posts/types";
import type { UIProfile } from "@acme/convex/profile/types";
import { DEFAULT_POST_DISPLAY_ASPECT_RATIO } from "@acme/config/posts";
import { useLikePost, useUnlikePost } from "@acme/features/post";

type PostStoreProps =
  | {
      onLikedByMeChange?: (postId: UIPost["_id"], likedByMe: boolean) => void;
      post: UIPost;
      value?: never;
    }
  | {
      onLikedByMeChange?: never;
      post?: never;
      value: PostStoreValue;
    };

export interface PostMediaItem {
  mediaType: "image" | "video";
  url: string;
}

export interface PostStoreValue {
  caption?: string;
  createdAt: number;
  creator: UIProfile;
  displayAspectRatio: PostDisplayAspectRatio;
  likedByMe: boolean;
  like: () => Promise<void> | void;
  location: UIPost["location"];
  mediaItems: PostMediaItem[];
  postId: UIPost["_id"] | "draft";
  toggleLike: () => Promise<void> | void;
}

function useInternalStore(props: PostStoreProps) {
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const [likedByMeOverride, setLikedByMeOverride] = useState<{
    likedByMe: boolean;
    postId: UIPost["_id"];
  } | null>(null);
  if (!props.post) return props.value;

  const { onLikedByMeChange, post } = props;
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
    displayAspectRatio:
      post.displayAspectRatio ?? DEFAULT_POST_DISPLAY_ASPECT_RATIO,
    location: post.location,
    mediaItems: getPostMediaItems(post),
    postId: post._id,
    likedByMe,
    like,
    toggleLike,
  } satisfies PostStoreValue;
}

function getPostMediaItems(post: UIPost) {
  return post.files.map((file) => ({
    mediaType: file.mediaType,
    url: file.url,
  }));
}

export const { Store: PostStore, useStore: usePostStore } = createStore<
  PostStoreProps,
  PostStoreValue
>(useInternalStore);
