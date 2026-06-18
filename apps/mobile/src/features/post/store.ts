import { createStore } from "rostra";

import type { UIPost } from "@acme/convex/posts/types";

interface PostStoreProps {
  post: UIPost;
}

export type PostMediaItem = ReturnType<typeof getPostMediaItems>[number];

function useInternalStore({ post }: PostStoreProps) {
  return {
    caption: post.caption,
    createdAt: post._creationTime,
    creator: post.creator,
    location: post.location,
    mediaItems: getPostMediaItems(post),
  };
}

function getPostMediaItems(post: UIPost) {
  return [
    ...post.files.map((file) => ({
      mediaType: file.mediaType,
      url: file.url,
    })),
    ...post.images.map((image) => ({
      mediaType: "image" as const,
      url: image.url,
    })),
  ];
}

export const { Store: PostStore, useStore: usePostStore } =
  createStore(useInternalStore);
