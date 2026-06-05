// eslint-disable-next-line no-restricted-imports -- This feed is client-loaded until the home route has a loader.
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

import type { UIPost } from "@acme/convex/types";
import { api } from "@acme/convex/api";

import { Post } from "./post";

export function PostList({ username }: { username?: string }) {
  if (username) return <UserPostList username={username} />;
  return <AllPostList />;
}

function AllPostList() {
  const { data: posts } = useQuery({
    ...convexQuery(api.posts.getAll, {}),
    select: (data) => data,
  });

  return <PostListItems posts={posts ?? []} />;
}

function UserPostList({ username }: { username: string }) {
  const { data: posts } = useQuery({
    ...convexQuery(api.posts.getByUsername, { username }),
    select: (data) => data,
  });

  return <PostListItems posts={posts ?? []} />;
}

function PostListItems({ posts }: { posts: UIPost[] }) {
  return (
    <div className="mx-auto mb-24 flex max-w-2xl flex-col gap-6 p-4">
      {posts.length === 0 && (
        <div className="border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm">
          No posts yet.
        </div>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
