import { useState } from "react";
import { createStore } from "rostra";

import type { PostDisplayAspectRatio } from "@acme/config/posts";
import type { UIPost } from "@acme/convex/posts/types";
import type { UIProfile } from "@acme/convex/profile/types";
import { DEFAULT_POST_DISPLAY_ASPECT_RATIO } from "@acme/config/posts";
import { useLikePost, useUnlikePost } from "@acme/features/post";

type PostStoreProps =
  | {
      post: UIPost;
      value?: never;
    }
  | {
      post?: never;
      value: PostStoreValue;
    };

export interface PostMediaItem {
  alt: string;
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

  const { post } = props;
  const likedByMe =
    likedByMeOverride?.postId === post._id
      ? likedByMeOverride.likedByMe
      : post.likedByMe;

  async function like() {
    if (likedByMe) return;
    setLikedByMeOverride({ likedByMe: true, postId: post._id });
    try {
      await likeMutation({ postId: post._id });
    } catch {
      setLikedByMeOverride({ likedByMe: false, postId: post._id });
    }
  }

  async function toggleLike() {
    const nextLikedByMe = !likedByMe;
    setLikedByMeOverride({ likedByMe: nextLikedByMe, postId: post._id });
    try {
      await (nextLikedByMe ? likeMutation : unlikeMutation)({
        postId: post._id,
      });
    } catch {
      setLikedByMeOverride({ likedByMe: !nextLikedByMe, postId: post._id });
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
    alt: post.caption ?? file.fileName,
    mediaType: file.mediaType,
    url: file.url,
  }));
}

export const { Store: PostStore, useStore: usePostStore } = createStore<
  PostStoreProps,
  PostStoreValue
>(useInternalStore);
