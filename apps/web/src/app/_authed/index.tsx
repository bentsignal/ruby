import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";

import type { UIPost } from "@acme/convex/posts/types";
import { api } from "@acme/convex/api";

import logoSmall from "~/assets/logo-small.webp";
import { Post } from "~/features/post/components/post";

export const Route = createFileRoute("/_authed/")({
  loader: async ({ context }) => {
    const posts = await context.convexHttpClient.query(
      api.posts.queries.getFriendsFeedPaginated,
      {
        paginationOpts: {
          cursor: null,
          numItems: 20,
        },
      },
    );

    return { posts: posts.page };
  },
  component: HomePage,
});

function HomePage() {
  const posts = Route.useLoaderData({ select: (data) => data.posts });

  return <HomePostList posts={posts} />;
}

function HomePostList({ posts }: { posts: UIPost[] }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pt-6 pb-28">
      <Image
        src={logoSmall}
        alt="Ruby"
        className="mx-auto mb-6 size-12 rounded-full"
        height={48}
        layout="fixed"
        width={48}
      />
      <HomePosts posts={posts} />
    </div>
  );
}

function HomePosts({ posts }: { posts: UIPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-10">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
      <div className="text-muted-foreground flex items-center gap-5 px-2 pt-16 pb-12 text-center text-sm">
        <div className="from-border h-px flex-1 bg-gradient-to-l to-transparent" />
        <p className="shrink-0">You're all caught up for now.</p>
        <div className="from-border h-px flex-1 bg-gradient-to-r to-transparent" />
      </div>
    </div>
  );
}
