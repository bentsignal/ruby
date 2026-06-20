import type { RefObject } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { createStore } from "rostra";

import type { FetchPostsPage } from "./hooks/use-stable-paginated-posts";
import type { PullToRefreshState } from "~/features/post/pull-to-refresh";
import { usePostListPullToRefresh } from "./hooks/use-post-list-pull-to-refresh";
import { useStablePaginatedPosts } from "./hooks/use-stable-paginated-posts";

interface PostListStoreProps {
  fetchPage: FetchPostsPage;
  onRefresh?: () => unknown;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  resetKey: string;
  refScrollView?: RefObject<ScrollView | null>;
}

function useInternalStore({
  fetchPage,
  onRefresh,
  onScroll,
  resetKey,
  refScrollView,
}: PostListStoreProps) {
  const [pullToRefreshState, setPullToRefreshState] =
    useState<PullToRefreshState>("idle");
  const { posts, loadingStatus, loadMore, refresh, setPostLikedByMe } =
    useStablePaginatedPosts(fetchPage, resetKey);

  async function refreshList() {
    await Promise.all([refresh(), onRefresh?.()]);
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
    setPostLikedByMe,
  };
}

export const { Store: PostListStore, useStore: usePostListStore } =
  createStore(useInternalStore);
