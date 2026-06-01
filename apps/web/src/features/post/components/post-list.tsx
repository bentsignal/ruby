// eslint-disable-next-line no-restricted-imports -- This feed is client-loaded until the home route has a loader.
import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import { api } from "@acme/convex/api";

import { Post } from "./post";

export function PostList() {
  const convex = useConvex();

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await convex.query(api.posts.getAll),
    select: (data) => data,
  });

  return (
    <div className="mx-auto mb-24 flex max-w-2xl flex-col gap-6 p-4">
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
