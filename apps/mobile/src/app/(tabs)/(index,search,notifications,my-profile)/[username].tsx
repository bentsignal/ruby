import { useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useConvex } from "convex/react";

import { api } from "@acme/convex/api";

import type { PullToRefreshState } from "~/features/post/pull-to-refresh";
import { BackButton } from "~/components/back-button";
import { SafeAreaView } from "~/components/safe-area-view";
import { useAuthStore } from "~/features/auth/store";
import { PostList } from "~/features/post/components/post-list";
import { useStablePaginatedPosts } from "~/features/post/hooks/use-stable-paginated-posts";
import { PullToRefreshOverlay } from "~/features/post/pull-to-refresh";
import { AccountNotFound } from "~/features/profile/components/account-not-found";
import { MoreButton } from "~/features/profile/components/buttons/more-button";
import { PrimaryButton } from "~/features/profile/components/buttons/primary-button";
import { Bio } from "~/features/profile/components/info/bio";
import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { UserProvidedLink } from "~/features/profile/components/info/user-provided-link";
import { Username } from "~/features/profile/components/info/username";
import { ProfileLoading } from "~/features/profile/components/profile-loading";
import { ProfileStore } from "~/features/profile/store";

export default function ProfileByUsername() {
  const { username } = useLocalSearchParams<{ username: string }>();

  const router = useRouter();
  const imNotSignedIn = useAuthStore((s) => s.imSignedIn === false);
  const { data: result, refetch: refetchProfile } = useQuery({
    ...convexQuery(api.profile.queries.getByUsername, { username }),
    select: (profile) => profile,
  });

  if (imNotSignedIn) {
    router.push("/login");
    return null;
  }

  if (!username) {
    return <AccountNotFound />;
  }

  if (result === undefined) {
    return <ProfileLoading />;
  }

  if (result === null) {
    return <AccountNotFound />;
  }

  const { info: profile, relationship } = result;

  return (
    <SafeAreaView className="flex-1">
      <ProfileStore profile={profile} relationship={relationship}>
        <ProfilePostList refetchProfile={refetchProfile} username={username} />
      </ProfileStore>
    </SafeAreaView>
  );
}

function ProfilePostList({
  refetchProfile,
  username,
}: {
  refetchProfile: () => Promise<unknown>;
  username: string;
}) {
  const convex = useConvex();
  const [showStickyProfile, setShowStickyProfile] = useState(false);
  const [pullToRefreshState, setPullToRefreshState] =
    useState<PullToRefreshState>("idle");
  const stickyOpacity = useSharedValue(0);
  function fetchPage(paginationOpts: {
    cursor: string | null;
    numItems: number;
  }) {
    return convex.query(api.posts.queries.getByUsernamePaginated, {
      username,
      paginationOpts,
    });
  }

  const { posts, loadingStatus, loadMore, refresh, setPostLikedByMe } =
    useStablePaginatedPosts(fetchPage, username);

  async function refreshPage() {
    await Promise.all([refresh(), refetchProfile()]);
  }

  function handleScroll(event: {
    nativeEvent: { contentOffset: { y: number } };
  }) {
    const nextShowStickyProfile = event.nativeEvent.contentOffset.y > 112;
    setShowStickyProfile((current) => {
      if (current === nextShowStickyProfile) return current;
      return nextShowStickyProfile;
    });
    stickyOpacity.value = withTiming(nextShowStickyProfile ? 1 : 0, {
      duration: 160,
    });
  }

  return (
    <View className="relative flex-1">
      <PostList
        posts={posts}
        loadingStatus={loadingStatus}
        onEndReached={loadMore}
        onRefresh={refreshPage}
        onScroll={handleScroll}
        onPullToRefreshStateChange={setPullToRefreshState}
        onPostLikedByMeChange={setPostLikedByMe}
        ListHeaderComponent={<ProfileHeader />}
      />
      <PullToRefreshOverlay state={pullToRefreshState} />
      <CompactProfileHeader
        stickyOpacity={stickyOpacity}
        visible={showStickyProfile}
      />
    </View>
  );
}

function ProfileHeader() {
  return (
    <View className="w-full flex-col gap-4">
      <View className="flex-row items-center justify-between px-4">
        <BackButton />
        <MoreButton />
      </View>
      <View className="mx-4 flex-row items-center gap-4">
        <PFP variant="md" />
        <View className="min-w-0 flex-1 flex-col">
          <Name numberOfLines={1} />
          <Username numberOfLines={1} />
        </View>
      </View>
      <Bio className="mx-4" />
      <UserProvidedLink className="mx-4" />
      <PrimaryButton className="mx-4" />
      <View className="bg-border h-px" />
    </View>
  );
}

function CompactProfileHeader({
  stickyOpacity,
  visible,
}: {
  stickyOpacity: { value: number };
  visible: boolean;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: stickyOpacity.value,
  }));

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      className="bg-background/95 border-border absolute top-0 right-0 left-0 z-20 border-b px-4 pt-3 pb-2"
      style={animatedStyle}
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <PFP variant="xs" />
        <View className="min-w-0 flex-1">
          <Name className="text-base leading-5" numberOfLines={1} />
          <Username className="text-sm leading-4" numberOfLines={1} />
        </View>
        <MoreButton />
      </View>
    </Animated.View>
  );
}
