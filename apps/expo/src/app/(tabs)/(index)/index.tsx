// import { useQuery } from "@tanstack/react-query";
// import { useConvex } from "convex/react";

// import { api } from "@acme/convex/api";

import { Platform, Text } from "react-native";
import { router } from "expo-router";

import { Button, ButtonText } from "~/atoms/button";
import { SafeAreaView } from "~/components/safe-area-view";

// import { PostList } from "~/features/post/molecules/post-list";

export default function Home() {
  // const convex = useConvex();

  // const { data } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: async () => await convex.query(api.posts.getAll),
  // });

  // const posts = data ?? [];

  // return <PostList posts={posts} />;
  // return <PostList posts={[]} />;
  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
}
