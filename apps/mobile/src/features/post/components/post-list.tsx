import type { ReactElement } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { LegendList } from "@legendapp/list";

import type { UIPost } from "@acme/convex/posts/types";

import type { PostListLoadingStatus } from "~/features/post/hooks/use-stable-paginated-posts";
import { LoadingSpinner } from "~/components/loading-spinner";
import { Post } from "~/features/post/components/post";
import { usePostListStore } from "~/features/post/post-list-store";
import { useColor } from "~/hooks/use-color";

interface PostListProps {
  contentTopPadding?: number;
  ListHeaderComponent?: ReactElement;
  emptyText?: string;
  showEndMessage?: boolean;
}

function PostList({
  contentTopPadding = 0,
  ListHeaderComponent,
  emptyText = "No posts yet.",
  showEndMessage = false,
}: PostListProps) {
  const inset = useSafeAreaInsets();
  const posts = usePostListStore((store) => store.posts);
  const loadingStatus = usePostListStore((store) => store.loadingStatus);
  const loadMore = usePostListStore((store) => store.loadMore);
  const handleMomentumScrollEnd = usePostListStore(
    (store) => store.handleMomentumScrollEnd,
  );
  const handleScroll = usePostListStore((store) => store.handleScroll);
  const handleScrollEndDrag = usePostListStore(
    (store) => store.handleScrollEndDrag,
  );
  const refScrollView = usePostListStore((store) => store.refScrollView);
  const showLoadingSpinner =
    loadingStatus === "LoadingFirstPage" || loadingStatus === "LoadingMore";
  const shouldShowEndMessage =
    showEndMessage && loadingStatus === "Exhausted" && posts.length > 0;

  return (
    <LegendList
      data={posts}
      renderItem={(props) => <Post key={props.item._id} post={props.item} />}
      keyExtractor={keyExtractor}
      onEndReached={loadMore}
      onEndReachedThreshold={1.5}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      onScroll={handleScroll}
      onScrollEndDrag={handleScrollEndDrag}
      scrollEventThrottle={16}
      maintainVisibleContentPosition={true}
      refScrollView={refScrollView}
      style={{ flex: 1 }}
      ListHeaderComponent={<PostListHeader component={ListHeaderComponent} />}
      ListHeaderComponentStyle={{ width: "100%" }}
      ListEmptyComponent={
        <PostListEmpty loadingStatus={loadingStatus} emptyText={emptyText} />
      }
      ItemSeparatorComponent={PostSeparator}
      ListFooterComponent={
        <PostListFooter
          showEndMessage={shouldShowEndMessage}
          showLoadingSpinner={showLoadingSpinner}
        />
      }
      contentContainerStyle={{
        paddingTop: contentTopPadding,
        paddingBottom: inset.bottom + 128,
      }}
      recycleItems={true}
    />
  );
}

function PostListHeader({ component }: { component?: ReactElement }) {
  if (!component) return null;

  return (
    <View className="w-full">
      {component}
      <View className="h-8" />
    </View>
  );
}

function PostListEmpty({
  emptyText,
  loadingStatus,
}: {
  emptyText: string;
  loadingStatus: PostListLoadingStatus;
}) {
  if (loadingStatus === "LoadingFirstPage") return null;

  return (
    <View className="border-border bg-card mx-4 rounded-lg border p-6">
      <Text className="text-muted-foreground text-center text-sm">
        {emptyText}
      </Text>
    </View>
  );
}

function PostListFooter({
  showEndMessage,
  showLoadingSpinner,
}: {
  showEndMessage: boolean;
  showLoadingSpinner: boolean;
}) {
  if (showLoadingSpinner) {
    return (
      <View className="my-4 h-10 w-full items-center justify-center">
        <LoadingSpinner />
      </View>
    );
  }

  if (!showEndMessage) return null;

  return (
    <View className="flex-row items-center gap-5 px-2 pt-16 pb-12">
      <GradientDivider direction="right" />
      <Text className="text-muted-foreground shrink-0 text-center text-sm">
        You're all caught up for now.
      </Text>
      <GradientDivider direction="left" />
    </View>
  );
}

function GradientDivider({ direction }: { direction: "left" | "right" }) {
  const border = useColor("border");
  const startOpacity = direction === "right" ? 0 : 1;
  const endOpacity = direction === "right" ? 1 : 0;

  return (
    <View className="h-px flex-1">
      <Svg height="1" width="100%">
        <Defs>
          <LinearGradient
            id={`feed-end-${direction}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <Stop offset="0" stopColor={border} stopOpacity={startOpacity} />
            <Stop offset="1" stopColor={border} stopOpacity={endOpacity} />
          </LinearGradient>
        </Defs>
        <Rect fill={`url(#feed-end-${direction})`} height="1" width="100%" />
      </Svg>
    </View>
  );
}

function PostSeparator() {
  return <View className="h-10" />;
}

function keyExtractor(post: UIPost) {
  return post._id;
}

export { PostList };
