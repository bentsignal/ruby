import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import { api } from "@acme/convex/api";

import { PostList } from "~/features/post/molecules/post-list";

export default function Home() {
  const convex = useConvex();

  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await convex.query(api.posts.getAll),
  });

  const posts = data ?? [];

  return <PostList posts={posts} />;
}
