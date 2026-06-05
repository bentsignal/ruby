import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
// eslint-disable-next-line no-restricted-imports -- Expo Router profile screens fetch after route params are available.
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

import { api } from "@acme/convex/api";

import { BackButton } from "~/components/back-button";
import { SafeAreaView } from "~/components/safe-area-view";
import { useAuthStore } from "~/features/auth/store";
import { PostList } from "~/features/post/components/post-list";
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
  const { data: result } = useQuery({
    ...convexQuery(api.profile.getByUsername, { username }),
    select: (profile) => profile,
  });
  const { data: posts } = useQuery({
    ...convexQuery(api.posts.getByUsername, { username }),
    enabled: !!username,
    select: (profilePosts) => profilePosts,
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
        <View className="flex flex-col gap-4">
          <View className="flex-row items-center justify-between px-4">
            <BackButton />
            <MoreButton />
          </View>
          <View className="mx-4 flex-row items-center gap-4">
            <PFP variant="md" />
            <View className="flex flex-col">
              <Name />
              <Username />
            </View>
          </View>
          <Bio className="mx-4" />
          <UserProvidedLink className="mx-4" />
          <PrimaryButton className="mx-4" />
          <View className="bg-border h-px" />
        </View>
      </ProfileStore>
      <PostList posts={posts ?? []} topInset={false} />
    </SafeAreaView>
  );
}
