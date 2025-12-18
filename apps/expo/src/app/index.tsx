import { Text, TouchableOpacity, View } from "react-native";
import { useConvexAuth, useQuery } from "convex/react";

import { api } from "@acme/convex/api";

import { Login } from "~/components/login";
import { authClient } from "~/lib/auth-client";

export default function Home() {
  const posts = useQuery(api.posts.getAll);
  const { isAuthenticated } = useConvexAuth();
  const user = authClient.useSession();
  console.log(user);
  if (!isAuthenticated) {
    return <Login />;
  }
  return (
    <View className="flex flex-col gap-2">
      <TouchableOpacity
        className="bg-primary my-2 rounded-md p-2"
        onPress={() => authClient.signOut()}
      >
        <Text>Sign Out</Text>
      </TouchableOpacity>
      {posts?.map((post) => (
        <View key={post._id} className="flex flex-col gap-2">
          <Text className="px-4 text-red-500">{post.title}</Text>
          <Text className="text-white">{post.content}</Text>
        </View>
      ))}
    </View>
  );
}
