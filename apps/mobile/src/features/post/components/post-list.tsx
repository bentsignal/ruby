import type { PaginationStatus } from "convex/react";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { scheduleOnUI } from "react-native-worklets";
import { LegendList } from "@legendapp/list";
import { LockKeyhole, Radio } from "lucide-react-native";

import type { UIPost } from "@acme/convex/posts/types";

import { LoadingSpinner } from "~/components/loading-spinner";
import { Post } from "~/features/post/components/post";
import { usePostListStore } from "~/features/post/post-list-store";
import { useColor } from "~/hooks/use-color";

interface PostListProps {
  contentTopPadding?: number;
  headerBottomSpacing?: number;
  ListHeaderComponent?: ReactElement;
  emptyMarker?: "dot" | "lock";
  emptyTitle?: string;
  emptyText?: string;
  showEndMessage?: boolean;
}

export function PostList({
  contentTopPadding = 0,
  headerBottomSpacing = 32,
  ListHeaderComponent,
  emptyMarker = "dot",
  emptyTitle,
  emptyText = "No posts yet.",
  showEndMessage = false,
}: PostListProps) {
  const inset = useSafeAreaInsets();
  const posts = usePostListStore((store) => store.posts);
  const loadingStatus = usePostListStore((store) => store.loadingStatus);
  const loadMore = usePostListStore((store) => store.loadMore);
  const onScroll = usePostListStore((store) => store.onScroll);
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
      onScroll={onScroll}
      scrollEventThrottle={16}
      maintainVisibleContentPosition={true}
      refScrollView={refScrollView}
      style={{ flex: 1 }}
      ListHeaderComponent={
        <PostListHeader
          bottomSpacing={headerBottomSpacing}
          component={ListHeaderComponent}
        />
      }
      ListHeaderComponentStyle={{ width: "100%" }}
      ListEmptyComponent={
        <PostListEmpty
          emptyMarker={emptyMarker}
          emptyText={emptyText}
          emptyTitle={emptyTitle}
          loadingStatus={loadingStatus}
        />
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

function PostListHeader({
  bottomSpacing,
  component,
}: {
  bottomSpacing: number;
  component?: ReactElement;
}) {
  if (!component) return null;

  return (
    <View className="w-full">
      {component}
      <View style={{ height: bottomSpacing }} />
    </View>
  );
}

function PostListEmpty({
  emptyMarker,
  emptyText,
  emptyTitle,
  loadingStatus,
}: {
  emptyMarker: "dot" | "lock";
  emptyText: string;
  emptyTitle?: string;
  loadingStatus: PaginationStatus;
}) {
  if (loadingStatus === "LoadingFirstPage") return null;

  return (
    <View className="items-center px-8 pt-10 pb-16">
      <EmptyMarker marker={emptyMarker} />
      <EmptyTitle>{emptyTitle}</EmptyTitle>
      <Text className="text-muted-foreground mt-2 max-w-72 text-center text-[13px] leading-5">
        {emptyText}
      </Text>
    </View>
  );
}

function EmptyMarker({ marker }: { marker: "dot" | "lock" }) {
  const primary = useColor("primary");
  const mutedForeground = useColor("muted-foreground");

  if (marker === "lock") {
    return <LockKeyhole color={primary} size={26} strokeWidth={2} />;
  }

  return (
    <View
      className="rounded-full"
      style={{
        backgroundColor: mutedForeground,
        height: 7,
        opacity: 0.5,
        width: 7,
      }}
    />
  );
}

function EmptyTitle({ children }: { children?: string }) {
  if (!children) return null;

  return (
    <Text className="text-foreground mt-5 max-w-72 text-center text-[15px] leading-5 font-semibold">
      {children}
    </Text>
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

  return <LiveEdgeFooter />;
}

function LiveEdgeFooter() {
  const primary = useColor("primary");
  const opacity = useSharedValue(0.45);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // eslint-disable-next-line no-restricted-syntax -- Starts a native UI-thread animation for the live feed edge indicator.
  useEffect(() => {
    function breathe() {
      "worklet";
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1400 }),
          withTiming(0.45, { duration: 1800 }),
        ),
        -1,
        true,
      );
    }
    scheduleOnUI(breathe);
  }, [opacity]);

  return (
    <View className="flex-row items-center gap-5 px-2 pt-16 pb-12">
      <GradientDivider direction="right" />
      <View className="flex-row items-center gap-2">
        <Animated.View style={animatedStyle}>
          <Radio color={primary} size={14} strokeWidth={2.4} />
        </Animated.View>
        <Text className="text-muted-foreground shrink-0 text-center text-sm">
          New updates will appear here
        </Text>
      </View>
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
  return (
    <View className="h-9 justify-center px-4">
      <FadedDivider />
    </View>
  );
}

function FadedDivider() {
  const border = useColor("border");

  return (
    <View className="h-px w-full">
      <Svg height="1" width="100%">
        <Defs>
          <LinearGradient id="post-separator" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={border} stopOpacity={0} />
            <Stop offset="0.08" stopColor={border} stopOpacity={0.46} />
            <Stop offset="0.5" stopColor={border} stopOpacity={0.62} />
            <Stop offset="0.92" stopColor={border} stopOpacity={0.46} />
            <Stop offset="1" stopColor={border} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#post-separator)" height="1" width="100%" />
      </Svg>
    </View>
  );
}

function keyExtractor(post: UIPost) {
  return post._id;
}
