import type { LegendListRenderItemProps } from "@legendapp/list/react";
import type { PaginationStatus } from "convex/react";
import { useLayoutEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LegendList } from "@legendapp/list/react";
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
      api.posts.queries.getFeed,
      {
        order: "oldest first",
        paginationOpts: {
          cursor: null,
          numItems: POST_FEED_PAGE_SIZE,
        },
      },
    );

    return { initialPosts: initialPosts.page };
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
    api.posts.queries.getFeed,
    { order: "oldest first" },
    { initialNumItems: POST_FEED_PAGE_SIZE },
  );
  const visiblePosts = status === "LoadingFirstPage" ? initialPosts : posts;

  return (
    <HomePostList
      loadingStatus={status}
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
    <div className="h-screen w-full overflow-hidden">
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
  const { containerHeight, containerRef } = useListContainerHeight();

  function loadMorePosts() {
    if (loadingStatus === "CanLoadMore") {
      loadMore();
    }
  }

  return (
    <div className="h-full min-h-0" ref={containerRef}>
      <LegendList
        data={posts}
        renderItem={(props) => <HomePostItem {...props} />}
        keyExtractor={keyExtractor}
        maintainVisibleContentPosition={true}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={1.5}
        recycleItems={true}
        style={{
          height: containerHeight,
        }}
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 112,
        }}
        ListHeaderComponent={<HomePostListHeader />}
        ListEmptyComponent={<HomePostListEmpty />}
        ItemSeparatorComponent={PostSeparator}
        ListFooterComponent={
          <HomePostListFooter loadingStatus={loadingStatus} posts={posts} />
        }
      />
    </div>
  );
}

function HomePostItem({ item }: LegendListRenderItemProps<UIPost>) {
  return (
    <div className="mx-auto w-full max-w-xl px-4">
      <Post post={item} />
    </div>
  );
}

function HomePostListHeader() {
  return (
    <div className="mx-auto w-full max-w-xl px-4">
      <Image
        src={logoSmall}
        alt="Ruby"
        className="mx-auto mb-6 size-12 rounded-full"
        height={48}
        layout="fixed"
        width={48}
      />
    </div>
  );
}

function HomePostListEmpty() {
  return (
    <div className="mx-auto w-full max-w-xl px-4">
      <div className="border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm">
        No posts yet.
      </div>
    </div>
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
    return <div className="mx-auto h-28 w-full max-w-xl px-4" />;
  }

  if (
    loadingStatus === "LoadingFirstPage" ||
    loadingStatus === "LoadingMore" ||
    loadingStatus === "CanLoadMore"
  ) {
    return (
      <div className="mx-auto flex h-20 w-full max-w-xl items-center justify-center px-4">
        <Loader className="text-muted-foreground size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-muted-foreground mx-auto flex w-full max-w-xl items-center gap-5 px-6 pt-16 pb-12 text-center text-sm">
      <div className="from-border h-px flex-1 bg-gradient-to-l to-transparent" />
      <div className="flex shrink-0 items-center gap-2">
        <Radio className="text-primary size-3.5 animate-[feed-live_3.2s_ease-in-out_infinite]" />
        <p>New updates will appear here</p>
      </div>
      <div className="from-border h-px flex-1 bg-gradient-to-r to-transparent" />
    </div>
  );
}

function PostSeparator() {
  return <div className="h-10" />;
}

function keyExtractor(post: UIPost) {
  return post._id;
}

function useListContainerHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    setHeight(element.clientHeight);
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return { containerHeight: height, containerRef: ref };
}
