import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { usePaginatedQuery } from "convex/react";

import { POST_FEED_PAGE_SIZE } from "@acme/config/posts";
import { api } from "@acme/convex/api";

import { SafeAreaView } from "~/components/safe-area-view";
import { useAuthStore } from "~/features/auth/store";
import { PostList } from "~/features/post/components/post-list";
import { PostListStore } from "~/features/post/post-list-store";
import { MyProfileButtons } from "~/features/profile/components/buttons/my-profile-buttons";
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

export default function MyProfile() {
  const myProfile = useAuthStore((s) => s.myProfile);

  if (!myProfile) {
    return <ProfileLoading />;
  }

  return (
    <SafeAreaView className="flex-1">
      <ProfileStore profile={myProfile} relationship="my-profile">
        <MobileProfileFeedStore stickyThreshold={96}>
          <MyProfilePostList />
        </MobileProfileFeedStore>
      </ProfileStore>
    </SafeAreaView>
  );
}

function MyProfilePostList() {
  const username = useProfileStore((store) => store.username);
  const handleScroll = useMobileProfileFeedStore((store) => store.handleScroll);
  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.queries.getByUsername,
    { username, order: "newest first" },
    { initialNumItems: POST_FEED_PAGE_SIZE },
  );

  return (
    <PostListStore
      loadingStatus={status}
      loadMore={() => loadMore(POST_FEED_PAGE_SIZE)}
      onScroll={handleScroll}
      posts={posts}
    >
      <View className="relative flex-1">
        <PostList
          headerBottomSpacing={16}
          ListHeaderComponent={<ProfileHeader />}
        />
        <CompactProfileHeader />
      </View>
    </PostListStore>
  );
}

function ProfileHeader() {
  return (
    <View className="w-full flex-col gap-4 pt-4">
      <View className="mx-2 flex-row items-center gap-4">
        <PFP variant="md" />
        <View className="min-w-0 flex-1 flex-col">
          <Name numberOfLines={1} />
          <Username numberOfLines={1} />
        </View>
      </View>
      <Bio className="mx-2" />
      <UserProvidedLink className="mx-2" />
      <MyProfileButtons className="mx-2" />
      <View className="bg-border h-px" />
    </View>
  );
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
        <PFP variant="xs" />
        <View className="min-w-0 flex-1">
          <Name className="text-base leading-5" numberOfLines={1} />
          <Username className="text-sm leading-4" numberOfLines={1} />
        </View>
      </View>
    </Animated.View>
  );
}
