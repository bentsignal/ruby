"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { Bookmark, Heart, MessageCircle, Share } from "lucide-react";

import { api } from "@acme/convex/api";

export default function HomePage() {
  const convex = useConvex();

  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await convex.query(api.posts.getAll),
  });

  const posts = data ?? [];

  return (
    <div className="mx-auto mb-24 flex max-w-2xl flex-col gap-6 p-4">
      {posts.map((post) => (
        <article
          key={post._id}
          className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4"
        >
          <div className="flex items-center gap-3">
            {post.profile.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.profile.image}
                alt={post.profile.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-sm font-medium">
                  {post.profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-1 flex-col">
              <span className="font-semibold">{post.profile.name}</span>
              <span className="text-muted-foreground text-sm">
                @{post.profile.username}
              </span>
            </div>
            <span className="text-muted-foreground text-xs">
              {new Date(post._creationTime).toLocaleDateString()}
            </span>
          </div>

          {post.imageUrls.length > 0 && post.imageUrls[0] && (
            <div className="bg-muted relative w-full overflow-hidden rounded-lg">
              <Image
                src={post.imageUrls[0]}
                alt={post.caption ?? "Post image"}
                width={800}
                height={600}
                className="object-cover"
              />
            </div>
          )}

          {post.caption && (
            <p className="text-sm leading-relaxed">{post.caption}</p>
          )}

          <div className="flex items-center gap-6">
            <button className="text-muted-foreground hover:text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <button className="text-muted-foreground hover:text-foreground flex items-center gap-2">
              <Share className="h-5 w-5" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
