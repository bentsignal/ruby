// eslint-disable-next-line no-restricted-imports -- This feed is client-loaded until the home route has a loader.
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { Image } from "@unpic/react";

import type { UIPost } from "@acme/convex/types";
import { api } from "@acme/convex/api";

import logoSmall from "~/assets/logo-small.webp";
import { Post } from "~/features/post/components/post";

export const Route = createFileRoute("/_authed/")({
  component: HomePage,
});

function HomePage() {
  const { data: posts } = useQuery({
    ...convexQuery(api.posts.getAll, {}),
    select: (data) => data,
  });

  return <HomePostList posts={posts ?? []} />;
}

function HomePostList({ posts }: { posts: UIPost[] }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 pt-6 pb-28">
      <Image
        src={logoSmall}
        alt="Ruby"
        className="mx-auto size-12 rounded-full"
        height={48}
        layout="fixed"
        width={48}
      />
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
