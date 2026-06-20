import { useEffect, useRef, useState } from "react";

import type { UIPost } from "@acme/convex/posts/types";

interface PostsPage {
  page: UIPost[];
  isDone: boolean;
  continueCursor: string;
}

type FetchPostsPage = (paginationOpts: {
  cursor: string | null;
  numItems: number;
}) => Promise<PostsPage>;

type LoadingStatus =
  | "LoadingFirstPage"
  | "CanLoadMore"
  | "LoadingMore"
  | "Refreshing"
  | "Exhausted";

const PAGE_SIZE = 10;

function useStablePaginatedPosts(fetchPage: FetchPostsPage, resetKey: string) {
  const [posts, setPosts] = useState<UIPost[]>([]);
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatus>("LoadingFirstPage");
  const cursorRef = useRef<string | null>(null);
  const isDoneRef = useRef(false);
  const requestIdRef = useRef(0);

  async function loadFirstPage(mode: "initial" | "refresh") {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoadingStatus(mode === "initial" ? "LoadingFirstPage" : "Refreshing");

    const nextPage = await fetchPage({
      cursor: null,
      numItems: PAGE_SIZE,
    });
    if (requestIdRef.current !== requestId) return;

    cursorRef.current = nextPage.continueCursor;
    isDoneRef.current = nextPage.isDone;
    setPosts(nextPage.page);
    setLoadingStatus(nextPage.isDone ? "Exhausted" : "CanLoadMore");
  }

  // eslint-disable-next-line no-restricted-syntax -- Starts the one-time non-reactive Convex page fetch when the feed target changes.
  useEffect(() => {
    void Promise.resolve().then(() => loadFirstPage("initial"));
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  async function refresh() {
    await loadFirstPage("refresh");
  }

  async function loadMore() {
    if (isDoneRef.current || loadingStatus !== "CanLoadMore") return;

    setLoadingStatus("LoadingMore");
    const requestId = requestIdRef.current;
    const nextPage = await fetchPage({
      cursor: cursorRef.current,
      numItems: PAGE_SIZE,
    });
    if (requestIdRef.current !== requestId) return;

    cursorRef.current = nextPage.continueCursor;
    isDoneRef.current = nextPage.isDone;
    setPosts((currentPosts) => [...currentPosts, ...nextPage.page]);
    setLoadingStatus(nextPage.isDone ? "Exhausted" : "CanLoadMore");
  }

  return {
    posts,
    loadingStatus,
    loadMore,
    refresh,
  };
}

export { useStablePaginatedPosts };
