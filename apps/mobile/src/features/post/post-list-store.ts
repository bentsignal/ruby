import type { PaginationStatus } from "convex/react";
import type { RefObject } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { createStore } from "rostra";

import type { UIPost } from "@acme/convex/posts/types";

interface PostListStoreProps {
  loadingStatus: PaginationStatus;
  loadMore: () => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  posts: UIPost[];
  refScrollView?: RefObject<ScrollView | null>;
}

function useInternalStore({
  loadingStatus,
  loadMore,
  onScroll,
  posts,
  refScrollView,
}: PostListStoreProps) {
  return {
    loadMore,
    loadingStatus,
    onScroll,
    posts,
    refScrollView,
  };
}

export const { Store: PostListStore, useStore: usePostListStore } =
  createStore(useInternalStore);
