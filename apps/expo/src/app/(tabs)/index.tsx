import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import { api } from "@acme/convex/api";

interface Post {
  title: string;
  content: string;
}

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex flex-col gap-2 px-4"
      style={{ paddingTop: insets.top }}
    >
      <Posts />
    </View>
  );
}

function Posts() {
  const convex = useConvex();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await convex.query(api.posts.getAll),
  });

  if (isLoading || !posts) {
    return Array.from({ length: 10 }).map((_, index) => <Post key={index} />);
  }

  return posts.map((post) => <Post key={post._id} post={post} />);
}

const Post = ({ post }: { post?: Post }) => {
  return (
    <View className="bg-card border-border flex flex-col gap-2 rounded-md border p-4 shadow">
      <Text className="text-card-foreground font-bold">{post?.title}</Text>
      <Text className="text-card-foreground">{post?.content}</Text>
    </View>
  );
};
