import { useState } from "react";
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
  const [likedByMeOverride, setLikedByMeOverride] = useState<{
    likedByMe: boolean;
    postId: UIPost["_id"];
  } | null>(null);
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
    alt: post.caption ?? file.fileName,
    mediaType: file.mediaType,
    url: file.url,
  }));
}

export const { Store: PostStore, useStore: usePostStore } =
  createStore(useInternalStore);
