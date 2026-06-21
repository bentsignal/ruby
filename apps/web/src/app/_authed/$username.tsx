import type { LegendListRenderItemProps } from "@legendapp/list/react";
import type { PaginationStatus } from "convex/react";
import { useLayoutEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { LegendList } from "@legendapp/list/react";
import { usePaginatedQuery } from "convex/react";
import { Loader } from "lucide-react";

import type { Relationship } from "@acme/convex/friends/types";
import type { UIPost } from "@acme/convex/posts/types";
import type { UIProfile } from "@acme/convex/profile/types";
import { POST_FEED_PAGE_SIZE } from "@acme/config/posts";
import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui-web/separator";

import { Post } from "~/features/post/components/post";
import { PostSeparator } from "~/features/post/components/post-separator";
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
    <div className="h-screen w-full overflow-hidden">
      <ProfilePostList profile={profile} relationship={relationship} />
    </div>
  );
}

function ProfilePostList({
  profile,
  relationship,
}: {
  profile: UIProfile;
  relationship: Relationship;
}) {
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
  const { containerHeight, containerRef } = useListContainerHeight();

  function loadMorePosts() {
    if (status === "CanLoadMore") {
      loadMore(POST_FEED_PAGE_SIZE);
    }
  }

  return (
    <div className="h-full min-h-0" ref={containerRef}>
      <LegendList
        data={visiblePosts}
        renderItem={(props) => <ProfilePostItem {...props} />}
        keyExtractor={keyExtractor}
        maintainVisibleContentPosition={true}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={1.5}
        recycleItems={true}
        style={{
          height: containerHeight,
        }}
        contentContainerStyle={{
          paddingBottom: 112,
        }}
        ListHeaderComponent={
          <ProfilePostListHeader
            profile={profile}
            relationship={relationship}
          />
        }
        ListEmptyComponent={<EmptyPosts />}
        ItemSeparatorComponent={ProfilePostSeparator}
        ListFooterComponent={
          <ProfilePostListFooter loadingStatus={status} posts={visiblePosts} />
        }
      />
    </div>
  );
}

function ProfilePostListHeader({
  profile,
  relationship,
}: {
  profile: UIProfile;
  relationship: Relationship;
}) {
  return (
    <ProfileStore profile={profile} relationship={relationship}>
      <div className="mx-auto flex w-full flex-col gap-4 px-4 pt-8 pb-4 sm:max-w-md sm:pt-12 lg:max-w-xl">
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
      </div>
    </ProfileStore>
  );
}

function ProfilePostItem({ item }: LegendListRenderItemProps<UIPost>) {
  return (
    <div className="mx-auto w-full px-4 sm:max-w-md lg:max-w-xl">
      <Post post={item} />
    </div>
  );
}

function EmptyPosts() {
  return (
    <div className="mx-auto w-full px-4 sm:max-w-md lg:max-w-xl">
      <div className="border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm">
        No posts yet.
      </div>
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
  if (posts.length === 0) {
    return <div className="mx-auto h-28 w-full px-4 sm:max-w-md lg:max-w-xl" />;
  }

  if (loadingStatus === "LoadingMore" || loadingStatus === "CanLoadMore") {
    return (
      <div className="mx-auto flex h-20 w-full items-center justify-center px-4 sm:max-w-md lg:max-w-xl">
        <Loader className="text-muted-foreground size-5 animate-spin" />
      </div>
    );
  }

  return <div className="mx-auto h-28 w-full px-4 sm:max-w-md lg:max-w-xl" />;
}

function ProfilePostSeparator({ leadingItem }: { leadingItem: UIPost }) {
  return (
    <PostSeparator
      className="sm:max-w-md lg:max-w-xl"
      leadingItem={leadingItem}
    />
  );
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
