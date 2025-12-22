import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import { api } from "@acme/convex/api";

interface Post {
  title: string;
  content: string;
}

export default function Posts() {
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

const Post = ({ post }: { post?: Post }) => (
  <View className="bg-muted mx-4 flex flex-col gap-2 rounded-md p-4">
    <Text className="text-muted-foreground font-bold">{post?.title}</Text>
    <Text className="text-muted-foreground">{post?.content}</Text>
  </View>
);
