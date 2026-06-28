import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { usePaginatedQuery } from "convex/react";

import type { Relationship } from "@acme/convex/friends/types";
import { POST_FEED_PAGE_SIZE } from "@acme/config/posts";
import { api } from "@acme/convex/api";

import { BackButton } from "~/components/back-button";
import { SafeAreaView } from "~/components/safe-area-view";
import { useAuthStore } from "~/features/auth/store";
import { PostList } from "~/features/post/components/post-list";
import { PostListStore } from "~/features/post/post-list-store";
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
  const { data: result } = useQuery({
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
          <ProfilePostList />
        </MobileProfileFeedStore>
      </ProfileStore>
    </SafeAreaView>
  );
}

function ProfilePostList() {
  const name = useProfileStore((store) => store.name);
  const username = useProfileStore((store) => store.username);
  const relationship = useProfileStore((store) => store.relationship);
  const emptyMessage = getEmptyPostsMessage(relationship, name);
  const canViewPosts = canViewProfilePosts(relationship);
  const handleScroll = useMobileProfileFeedStore((store) => store.handleScroll);
  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.queries.getByUsername,
    canViewPosts ? { username, order: "newest first" } : "skip",
    { initialNumItems: POST_FEED_PAGE_SIZE },
  );
  const visiblePosts = canViewPosts ? posts : [];
  const loadingStatus = canViewPosts ? status : "Exhausted";

  return (
    <PostListStore
      loadingStatus={loadingStatus}
      loadMore={() => {
        if (canViewPosts) loadMore(POST_FEED_PAGE_SIZE);
      }}
      onScroll={handleScroll}
      posts={visiblePosts}
    >
      <View className="relative flex-1">
        <PostList
          emptyMarker={emptyMessage.marker}
          emptyText={emptyMessage.description}
          emptyTitle={emptyMessage.title}
          headerBottomSpacing={16}
          ListHeaderComponent={<ProfileHeader />}
        />
        <CompactProfileHeader />
      </View>
    </PostListStore>
  );
}

function canViewProfilePosts(relationship: Relationship | undefined) {
  return relationship === "friends" || relationship === "my-profile";
}

function getEmptyPostsMessage(
  relationship: Relationship | undefined,
  name: string,
) {
  if (relationship === "friends" || relationship === "my-profile") {
    return {
      marker: "dot" as const,
      title: `${name} hasn't posted yet.`,
      description: "When they share something, it will show up here.",
    };
  }

  if (relationship === "pending-outgoing") {
    return {
      marker: "lock" as const,
      title: `Only friends can see ${name}'s posts.`,
      description:
        "Your request is pending. If they accept, you will see what they share here.",
    };
  }

  if (relationship === "pending-incoming") {
    return {
      marker: "lock" as const,
      title: `Only friends can see ${name}'s posts.`,
      description: "Accept their friend request to see what they share here.",
    };
  }

  return {
    marker: "lock" as const,
    title: `Only friends can see ${name}'s posts.`,
    description: "Send a friend request to see what they share.",
  };
}

function ProfileHeader() {
  return (
    <View className="w-full flex-col gap-4">
      <View className="flex-row items-center justify-between px-2">
        <BackButton />
        <MoreButton />
      </View>
      <View className="mx-2 flex-row items-center gap-4">
        <PFP variant="md" />
        <View className="min-w-0 flex-1 flex-col">
          <Name numberOfLines={1} />
          <Username numberOfLines={1} />
        </View>
      </View>
      <Bio className="mx-2" />
      <UserProvidedLink className="mx-2" />
      <PrimaryButton className="mx-2" />
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
      className="bg-background/95 border-border absolute top-0 right-0 left-0 z-20 border-b px-2 pt-3 pb-2"
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
