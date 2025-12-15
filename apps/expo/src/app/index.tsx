import { Text, View } from "react-native";
import { useQuery } from "convex/react";

import { api } from "@acme/convex/api";

export default function Home() {
  const posts = useQuery(api.posts.getAll);
  return (
    <View className="flex flex-col gap-2">
      {posts?.map((post) => (
        <View key={post._id} className="flex flex-col gap-2">
          <Text className="px-4 text-red-500">{post.title}</Text>
          <Text className="text-white">{post.content}</Text>
        </View>
      ))}
    </View>
  );
}
