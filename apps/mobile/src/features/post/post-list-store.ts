import type { RefObject } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { createStore } from "rostra";

import type { UIPost } from "@acme/convex/posts/types";

import type { PullToRefreshState } from "~/features/post/pull-to-refresh";
import { usePostListPullToRefresh } from "./hooks/use-post-list-pull-to-refresh";

export type PostListLoadingStatus =
  | "LoadingFirstPage"
  | "CanLoadMore"
  | "LoadingMore"
  | "Exhausted";

interface PostListStoreProps {
  loadingStatus: PostListLoadingStatus;
  loadMore: () => void;
  onRefresh?: () => unknown;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  posts: UIPost[];
  refScrollView?: RefObject<ScrollView | null>;
}

function useInternalStore({
  loadingStatus,
  loadMore,
  onRefresh,
  onScroll,
  posts,
  refScrollView,
}: PostListStoreProps) {
  const [pullToRefreshState, setPullToRefreshState] =
    useState<PullToRefreshState>("idle");

  async function refreshList() {
    await onRefresh?.();
  }

  const { handleMomentumScrollEnd, handleScroll, handleScrollEndDrag } =
    usePostListPullToRefresh({
      onPullToRefreshStateChange: setPullToRefreshState,
      onRefresh: refreshList,
      onScroll,
    });

  return {
    handleMomentumScrollEnd,
    handleScroll,
    handleScrollEndDrag,
    loadMore,
    loadingStatus,
    posts,
    pullToRefreshState,
    refScrollView,
  };
}

export const { Store: PostListStore, useStore: usePostListStore } =
  createStore(useInternalStore);
