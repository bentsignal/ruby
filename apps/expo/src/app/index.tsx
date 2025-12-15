import { Text, View } from "react-native";
import { useQuery } from "convex/react";

import { api } from "@acme/backend/api";

export default function Home() {
  const posts = useQuery(api.posts.getAll);
  return posts?.map((post) => (
    <View key={post._id} className="flex flex-col gap-2">
      <Text>{post.title}</Text>
      <Text>{post.content}</Text>
    </View>
  ));
}
