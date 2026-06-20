import { useEffect, useRef, useState } from "react";

import type { UIPost } from "@acme/convex/posts/types";
import { POST_FEED_PAGE_SIZE } from "@acme/config/posts";

interface PostsPage {
  page: UIPost[];
  isDone: boolean;
  continueCursor: string;
}

export type FetchPostsPage = (paginationOpts: {
  cursor: string | null;
  numItems: number;
}) => Promise<PostsPage>;

export type PostListLoadingStatus =
  | "LoadingFirstPage"
  | "CanLoadMore"
  | "LoadingMore"
  | "Refreshing"
  | "Exhausted";

function useStablePaginatedPosts(fetchPage: FetchPostsPage, resetKey: string) {
  const [posts, setPosts] = useState<UIPost[]>([]);
  const [loadingStatus, setLoadingStatus] =
    useState<PostListLoadingStatus>("LoadingFirstPage");
  const cursorRef = useRef<string | null>(null);
  const isDoneRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const loadingStatusRef = useRef<PostListLoadingStatus>("LoadingFirstPage");
  const requestIdRef = useRef(0);

  function setNextLoadingStatus(status: PostListLoadingStatus) {
    loadingStatusRef.current = status;
    setLoadingStatus(status);
  }

  function resetLoadingStateAfterError() {
    setNextLoadingStatus(isDoneRef.current ? "Exhausted" : "CanLoadMore");
  }

  async function loadFirstPage(mode: "initial" | "refresh") {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    loadingMoreRef.current = false;
    setNextLoadingStatus(
      mode === "initial" ? "LoadingFirstPage" : "Refreshing",
    );

    try {
      const nextPage = await fetchPage({
        cursor: null,
        numItems: POST_FEED_PAGE_SIZE,
      });
      if (requestIdRef.current !== requestId) return;

      cursorRef.current = nextPage.continueCursor;
      isDoneRef.current = nextPage.isDone;
      setPosts(nextPage.page);
      setNextLoadingStatus(nextPage.isDone ? "Exhausted" : "CanLoadMore");
    } catch (error) {
      if (requestIdRef.current !== requestId) return;
      console.error(error);
      resetLoadingStateAfterError();
    }
  }

  // eslint-disable-next-line no-restricted-syntax -- Starts the one-time non-reactive Convex page fetch when the feed target changes.
  useEffect(() => {
    void Promise.resolve().then(() => loadFirstPage("initial"));
    return () => {
      requestIdRef.current++;
    };
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  async function refresh() {
    await loadFirstPage("refresh");
  }

  async function loadMore() {
    if (
      isDoneRef.current ||
      loadingMoreRef.current ||
      loadingStatusRef.current !== "CanLoadMore"
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setNextLoadingStatus("LoadingMore");
    const requestId = requestIdRef.current;
    try {
      const nextPage = await fetchPage({
        cursor: cursorRef.current,
        numItems: POST_FEED_PAGE_SIZE,
      });
      if (requestIdRef.current !== requestId) return;

      cursorRef.current = nextPage.continueCursor;
      isDoneRef.current = nextPage.isDone;
      setPosts((currentPosts) => [...currentPosts, ...nextPage.page]);
      setNextLoadingStatus(nextPage.isDone ? "Exhausted" : "CanLoadMore");
    } catch (error) {
      if (requestIdRef.current !== requestId) return;
      console.error(error);
      resetLoadingStateAfterError();
    }

    if (requestIdRef.current === requestId) {
      loadingMoreRef.current = false;
    }
  }

  function setPostLikedByMe(postId: UIPost["_id"], likedByMe: boolean) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === postId ? { ...post, likedByMe } : post,
      ),
    );
  }

  return {
    posts,
    loadingStatus,
    loadMore,
    refresh,
    setPostLikedByMe,
  };
}

export { useStablePaginatedPosts };
