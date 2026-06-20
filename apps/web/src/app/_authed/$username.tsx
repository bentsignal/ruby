import type { PaginationStatus } from "convex/react";
import { useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { usePaginatedQuery } from "convex/react";
import { Loader } from "lucide-react";

import type { UIPost } from "@acme/convex/posts/types";
import { POST_FEED_PAGE_SIZE } from "@acme/config/posts";
import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui-web/separator";

import { Post } from "~/features/post/components/post";
import { PrimaryButton } from "~/features/profile/components/buttons/primary-button";
import { Bio } from "~/features/profile/components/info/bio";
import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { UserProvidedLink } from "~/features/profile/components/info/user-provided-link";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";

export const Route = createFileRoute("/_authed/$username")({
  loader: async ({ context, params }) => {
    const [, initialPosts] = await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.profile.queries.getByUsername, {
          username: params.username,
        }),
      ),
      context.convexHttpClient.query(api.posts.queries.getByUsername, {
        username: params.username,
        order: "newest first",
        paginationOpts: {
          cursor: null,
          numItems: POST_FEED_PAGE_SIZE,
        },
      }),
    ]);

    return { initialPosts: initialPosts.page };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const result = useSuspenseQuery({
    ...convexQuery(api.profile.queries.getByUsername, {
      username: Route.useParams({ select: (p) => p.username }),
    }),
    select: (data) => data,
  });

  if (result.data === null) {
    throw notFound();
  }

  const { info: profile, relationship } = result.data;
  return (
    <div className="max-w-auto mx-auto flex min-h-screen flex-col gap-4 px-4 pt-8 pb-28 sm:max-w-md sm:pt-12 lg:max-w-xl">
      <ProfileStore profile={profile} relationship={relationship}>
        <div className="flex items-center gap-4">
          <PFP variant="md" />
          <div className="flex flex-col">
            <Name className="font-bold" />
            <Username />
          </div>
          <PrimaryButton className="ml-auto hidden lg:flex" />
        </div>
        <Bio />
        <UserProvidedLink className="mb-1" />
        <PrimaryButton className="flex lg:hidden" />
        <Separator />
      </ProfileStore>
      <ProfilePostList />
    </div>
  );
}

function ProfilePostList() {
  const initialPosts = Route.useLoaderData({
    select: (data) => data.initialPosts,
  });
  const username = Route.useParams({ select: (p) => p.username });
  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.queries.getByUsername,
    { username, order: "newest first" },
    { initialNumItems: POST_FEED_PAGE_SIZE },
  );
  const visiblePosts = status === "LoadingFirstPage" ? initialPosts : posts;

  return (
    <div className="flex flex-col gap-6">
      <EmptyPosts posts={visiblePosts} />
      {visiblePosts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      <LoadMoreSentinel
        loadingStatus={status}
        loadMore={() => loadMore(POST_FEED_PAGE_SIZE)}
      />
      <ProfilePostListFooter loadingStatus={status} posts={visiblePosts} />
    </div>
  );
}

function EmptyPosts({ posts }: { posts: UIPost[] }) {
  if (posts.length > 0) return null;

  return (
    <div className="border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm">
      No posts yet.
    </div>
  );
}

function ProfilePostListFooter({
  loadingStatus,
  posts,
}: {
  loadingStatus: PaginationStatus;
  posts: unknown[];
}) {
  if (posts.length === 0) return <div className="h-28" />;

  if (loadingStatus === "LoadingMore" || loadingStatus === "CanLoadMore") {
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <Loader className="text-muted-foreground size-5 animate-spin" />
      </div>
    );
  }

  return <div className="h-28" />;
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
