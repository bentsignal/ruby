import type { ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConvex } from "convex/react";

import { api } from "@acme/convex/api";

import type { PullToRefreshState } from "~/features/post/pull-to-refresh";
import { PostList } from "~/features/post/components/post-list";
import { setScrollHomeFeedToTopHandler } from "~/features/post/home-feed-scroll";
import { useStablePaginatedPosts } from "~/features/post/hooks/use-stable-paginated-posts";
import { PullToRefreshIndicator } from "~/features/post/pull-to-refresh";
import roundedIcon from "../../../../assets/rounded-icon.png";

export default function Home() {
  const convex = useConvex();
  const inset = useSafeAreaInsets();
  const [pullToRefreshState, setPullToRefreshState] =
    useState<PullToRefreshState>("idle");
  const scrollViewRef = useRef<ScrollView>(null);

  // eslint-disable-next-line no-restricted-syntax -- Registers the home tab's external scroll-to-top command.
  useEffect(() => {
    return setScrollHomeFeedToTopHandler(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
  }, []);

  function fetchPage(paginationOpts: {
    cursor: string | null;
    numItems: number;
  }) {
    return convex.query(api.posts.queries.getFriendsFeedPaginated, {
      paginationOpts,
    });
  }

  const { posts, loadingStatus, loadMore, refresh, setPostLikedByMe } =
    useStablePaginatedPosts(fetchPage, "friends-feed");

  return (
    <PostList
      posts={posts}
      loadingStatus={loadingStatus}
      onEndReached={loadMore}
      onRefresh={refresh}
      onPullToRefreshStateChange={setPullToRefreshState}
      onPostLikedByMeChange={setPostLikedByMe}
      ListHeaderComponent={
        <ListHeader
          pullToRefreshState={pullToRefreshState}
          topPadding={inset.top}
        />
      }
      emptyText="No posts from friends yet."
      refScrollView={scrollViewRef}
      showEndMessage={true}
    />
  );
}

function ListHeader({
  pullToRefreshState,
  topPadding,
}: {
  pullToRefreshState: PullToRefreshState;
  topPadding: number;
}) {
  return (
    <View className="items-center" style={{ paddingTop: topPadding }}>
      <HeaderLogo pullToRefreshState={pullToRefreshState} />
    </View>
  );
}

function HeaderLogo({
  pullToRefreshState,
}: {
  pullToRefreshState: PullToRefreshState;
}) {
  return (
    <View
      className="items-center justify-center"
      style={{ height: 48, width: 48 }}
    >
      <HeaderLogoContent pullToRefreshState={pullToRefreshState} />
    </View>
  );
}

function HeaderLogoContent({
  pullToRefreshState,
}: {
  pullToRefreshState: PullToRefreshState;
}) {
  if (pullToRefreshState !== "idle") {
    return <PullToRefreshIndicator state={pullToRefreshState} />;
  }

  return (
    <Image
      accessibilityLabel="Ruby"
      source={roundedIcon}
      style={{ borderRadius: 24, height: 48, width: 48 }}
    />
  );
}
