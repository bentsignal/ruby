import { Platform, Text } from "react-native";
import { router } from "expo-router";
// eslint-disable-next-line no-restricted-imports -- Expo Router tab screens fetch after auth context is mounted.
import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import { api } from "@acme/convex/api";
import { Button, ButtonText } from "@acme/ui-mobile/button";

import { SafeAreaView } from "~/components/safe-area-view";
import { PostList } from "~/features/post/components/post-list";

export default function Home() {
  const convex = useConvex();

  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await convex.query(api.posts.getAll),
    select: (posts) => posts,
  });

  const posts = data ?? [];

  return (
    <SafeAreaView className="flex-1">
      {__DEV__ && (
        <Button onPress={() => router.push("/_sitemap")}>
          <ButtonText>Sitemap</ButtonText>
        </Button>
      )}
      {__DEV__ && Platform.OS === "android" && (
        <Text className="bg-card border-border m-3 rounded-lg border p-3 text-center text-red-500">
          Make sure to run `nr android:forward` before trying to sign in.
        </Text>
      )}
      <PostList posts={posts} />
    </SafeAreaView>
  );
}
