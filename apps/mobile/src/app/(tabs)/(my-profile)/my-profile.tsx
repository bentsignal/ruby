import type { LegendListRenderItemProps } from "@legendapp/list";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// eslint-disable-next-line no-restricted-imports -- This query depends on the profile loaded into the auth store.
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { LegendList } from "@legendapp/list";

import type { UIPost } from "@acme/convex/types";
import { api } from "@acme/convex/api";

import { SafeAreaView } from "~/components/safe-area-view";
import { useAuthStore } from "~/features/auth/store";
import { Post } from "~/features/post/components/post";
import { MyProfileButtons } from "~/features/profile/components/buttons/my-profile-buttons";
import { Bio } from "~/features/profile/components/info/bio";
import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { UserProvidedLink } from "~/features/profile/components/info/user-provided-link";
import { Username } from "~/features/profile/components/info/username";
import { ProfileLoading } from "~/features/profile/components/profile-loading";
import { ProfileStore } from "~/features/profile/store";

export default function MyProfile() {
  const myProfile = useAuthStore((s) => s.myProfile);
  const { data: posts } = useQuery({
    ...convexQuery(api.posts.getByUsername, {
      username: myProfile?.username ?? "",
    }),
    enabled: !!myProfile?.username,
    select: (profilePosts) => profilePosts,
  });

  if (!myProfile) {
    return <ProfileLoading />;
  }
  return (
    <SafeAreaView className="flex-1">
      <ProfileStore profile={myProfile} relationship={"my-profile"}>
        <View className="flex flex-col gap-4 pt-4">
          <View className="mx-4 flex-row items-center gap-4">
            <PFP variant="md" />
            <View className="flex flex-col">
              <Name />
              <Username />
            </View>
          </View>
          <Bio className="mx-4" />
          <UserProvidedLink className="mx-4" />
          <MyProfileButtons className="mx-4" />
          <View className="bg-border h-px" />
        </View>
      </ProfileStore>
      <ProfilePostList posts={posts ?? []} />
    </SafeAreaView>
  );
}

function ProfilePostList({ posts }: { posts: UIPost[] }) {
  const inset = useSafeAreaInsets();

  return (
    <LegendList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingBottom: inset.bottom + 24,
      }}
      recycleItems={true}
    />
  );
}

function renderItem(props: LegendListRenderItemProps<UIPost>) {
  return <Post post={props.item} />;
}

function keyExtractor(post: UIPost) {
  return post._id;
}
