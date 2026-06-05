// eslint-disable-next-line no-restricted-imports -- Expo Router tab screens fetch after auth context is mounted.
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

import { api } from "@acme/convex/api";

import { PostList } from "~/features/post/components/post-list";

export default function Home() {
  const { data } = useQuery({
    ...convexQuery(api.posts.getAll, {}),
    select: (posts) => posts,
  });

  const posts = data ?? [];

  return <PostList posts={posts} />;
}
