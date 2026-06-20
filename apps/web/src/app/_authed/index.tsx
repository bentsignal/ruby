import type { PaginationStatus } from "convex/react";
import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { usePaginatedQuery } from "convex/react";
import { Loader, Radio } from "lucide-react";

import type { UIPost } from "@acme/convex/posts/types";
import { POST_FEED_PAGE_SIZE } from "@acme/config/posts";
import { api } from "@acme/convex/api";

import logoSmall from "~/assets/logo-small.webp";
import { Post } from "~/features/post/components/post";

export const Route = createFileRoute("/_authed/")({
  loader: async ({ context }) => {
    const initialPosts = await context.convexHttpClient.query(
      api.posts.queries.getFriendsFeedPaginated,
      {
        order: "oldest first",
        paginationOpts: {
          cursor: null,
          numItems: POST_FEED_PAGE_SIZE,
        },
      },
    );

    return { initialPosts };
  },
  component: HomePage,
});

function HomePage() {
  const initialPosts = Route.useLoaderData({
    select: (data) => data.initialPosts,
  });
  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.queries.getFriendsFeedPaginated,
    { order: "oldest first" },
    { initialNumItems: POST_FEED_PAGE_SIZE },
  );
  const visiblePosts =
    status === "LoadingFirstPage" ? initialPosts.page : posts;
  const visibleStatus =
    status === "LoadingFirstPage"
      ? initialPosts.isDone
        ? "Exhausted"
        : "CanLoadMore"
      : status;

  return (
    <HomePostList
      loadingStatus={visibleStatus}
      loadMore={() => loadMore(POST_FEED_PAGE_SIZE)}
      posts={visiblePosts}
    />
  );
}

function HomePostList({
  loadingStatus,
  loadMore,
  posts,
}: {
  loadingStatus: PaginationStatus;
  loadMore: () => void;
  posts: UIPost[];
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pt-6 pb-28">
      <HomePostListHeader />
      <HomePosts
        loadingStatus={loadingStatus}
        loadMore={loadMore}
        posts={posts}
      />
    </div>
  );
}

function HomePosts({
  loadingStatus,
  loadMore,
  posts,
}: {
  loadingStatus: PaginationStatus;
  loadMore: () => void;
  posts: UIPost[];
}) {
  if (loadingStatus !== "LoadingFirstPage" && posts.length === 0) {
    return (
      <div className="border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-10">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
      <LoadMoreSentinel loadingStatus={loadingStatus} loadMore={loadMore} />
      <HomePostListFooter loadingStatus={loadingStatus} posts={posts} />
    </div>
  );
}

function HomePostListHeader() {
  return (
    <Image
      src={logoSmall}
      alt="Ruby"
      className="mx-auto mb-6 size-12 rounded-full"
      height={48}
      layout="fixed"
      width={48}
    />
  );
}

function HomePostListFooter({
  loadingStatus,
  posts,
}: {
  loadingStatus: PaginationStatus;
  posts: UIPost[];
}) {
  if (posts.length === 0) {
    return <div className="h-28" />;
  }

  if (
    loadingStatus === "LoadingFirstPage" ||
    loadingStatus === "LoadingMore" ||
    loadingStatus === "CanLoadMore"
  ) {
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <Loader className="text-muted-foreground size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-muted-foreground flex items-center gap-5 px-2 pt-16 pb-12 text-center text-sm">
      <div className="from-border h-px flex-1 bg-gradient-to-l to-transparent" />
      <div className="flex shrink-0 items-center gap-2">
        <Radio className="text-primary size-3.5 animate-[feed-live_3.2s_ease-in-out_infinite]" />
        <p>New updates will appear here</p>
      </div>
      <div className="from-border h-px flex-1 bg-gradient-to-r to-transparent" />
    </div>
  );
}

function LoadMoreSentinel({
  loadingStatus,
  loadMore,
}: {
  loadingStatus: PaginationStatus;
  loadMore: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line no-restricted-syntax -- Observes page scroll position to trigger infinite feed loading before the user reaches the bottom.
  useEffect(() => {
    const element = ref.current;
    if (!element || loadingStatus !== "CanLoadMore") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "1400px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [loadingStatus, loadMore]);

  return <div ref={ref} className="h-px" />;
}
