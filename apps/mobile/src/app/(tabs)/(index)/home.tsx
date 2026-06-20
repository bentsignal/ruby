import type { ScrollView } from "react-native";
import { useEffect, useRef } from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePaginatedQuery } from "convex/react";

import { POST_FEED_PAGE_SIZE } from "@acme/config/posts";
import { api } from "@acme/convex/api";

import { PostList } from "~/features/post/components/post-list";
import { setScrollHomeFeedToTopHandler } from "~/features/post/home-feed-scroll";
import { PostListStore } from "~/features/post/post-list-store";
import roundedIcon from "../../../../assets/rounded-icon.png";

export default function Home() {
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.queries.getFeed,
    { order: "oldest first" },
    { initialNumItems: POST_FEED_PAGE_SIZE },
  );

  // eslint-disable-next-line no-restricted-syntax -- Registers the home tab's external scroll-to-top command.
  useEffect(() => {
    return setScrollHomeFeedToTopHandler(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
  }, []);

  return (
    <PostListStore
      loadingStatus={status}
      loadMore={() => loadMore(POST_FEED_PAGE_SIZE)}
      posts={posts}
      refScrollView={scrollViewRef}
    >
      <PostList
        ListHeaderComponent={<HomeFeedHeader />}
        emptyText="No posts from friends yet."
        showEndMessage={true}
      />
    </PostListStore>
  );
}

function HomeFeedHeader() {
  const inset = useSafeAreaInsets();

  return (
    <View className="items-center" style={{ paddingTop: inset.top }}>
      <HeaderLogo />
    </View>
  );
}

function HeaderLogo() {
  return (
    <View
      className="items-center justify-center"
      style={{ height: 48, width: 48 }}
    >
      <Image
        accessibilityLabel="Ruby"
        source={roundedIcon}
        style={{ borderRadius: 24, height: 48, width: 48 }}
      />
    </View>
  );
}
