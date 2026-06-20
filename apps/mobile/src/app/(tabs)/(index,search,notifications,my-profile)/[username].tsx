import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useConvex } from "convex/react";

import { api } from "@acme/convex/api";

import { BackButton } from "~/components/back-button";
import { SafeAreaView } from "~/components/safe-area-view";
import { useAuthStore } from "~/features/auth/store";
import { PostList } from "~/features/post/components/post-list";
import {
  PostListStore,
  usePostListStore,
} from "~/features/post/post-list-store";
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
import {
  MobileProfileFeedStore,
  useMobileProfileFeedStore,
} from "~/features/profile/mobile-profile-feed-store";
import { ProfileStore, useProfileStore } from "~/features/profile/store";

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
        <MobileProfileFeedStore stickyThreshold={112}>
          <ProfilePostList onRefreshProfile={refetchProfile} />
        </MobileProfileFeedStore>
      </ProfileStore>
    </SafeAreaView>
  );
}

function ProfilePostList({
  onRefreshProfile,
}: {
  onRefreshProfile: () => unknown;
}) {
  const convex = useConvex();
  const username = useProfileStore((store) => store.username);
  const handleScroll = useMobileProfileFeedStore((store) => store.handleScroll);

  return (
    <PostListStore
      fetchPage={(paginationOpts) =>
        convex.query(api.posts.queries.getByUsernamePaginated, {
          username,
          paginationOpts,
        })
      }
      onRefresh={onRefreshProfile}
      onScroll={handleScroll}
      resetKey={username}
    >
      <View className="relative flex-1">
        <PostList ListHeaderComponent={<ProfileHeader />} />
        <ProfileRefreshOverlay />
        <CompactProfileHeader />
      </View>
    </PostListStore>
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

function ProfileRefreshOverlay() {
  const state = usePostListStore((store) => store.pullToRefreshState);
  return <PullToRefreshOverlay state={state} />;
}

function CompactProfileHeader() {
  const stickyOpacity = useMobileProfileFeedStore(
    (store) => store.stickyOpacity,
  );
  const visible = useMobileProfileFeedStore((store) => store.showStickyProfile);
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
