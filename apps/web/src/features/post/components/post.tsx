import { Image } from "@unpic/react";
import { Bookmark, Heart, MessageCircle, Share } from "lucide-react";

import type { UIPost } from "@acme/convex/types";

import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";

export function Post({ post }: { post: UIPost }) {
  return (
    <article className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4">
      <ProfileStore profile={post.creator}>
        <div className="flex items-center gap-3">
          <PFP variant="sm" />
          <div className="flex flex-col">
            <Name className="text-sm font-bold" />
            <Username className="text-muted-foreground text-xs font-semibold" />
          </div>
          <span className="text-muted-foreground ml-auto text-xs">
            {new Date(post._creationTime).toLocaleDateString()}
          </span>
        </div>
      </ProfileStore>

      <PostMediaGrid post={post} />
      <PostCaption caption={post.caption} />

      <div className="flex items-center gap-6">
        <button className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2">
          <Heart className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2">
          <MessageCircle className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2">
          <Bookmark className="h-5 w-5" />
        </button>
        <div className="flex-1" />
        <button className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2">
          <Share className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}

type PostMediaItem = ReturnType<typeof getPostMediaItems>[number];

function getPostMediaItems(post: UIPost) {
  return [
    ...post.files.map((file) => ({
      alt: post.caption ?? file.fileName,
      mediaType: file.mediaType,
      url: file.url,
    })),
    ...post.images.map((image) => ({
      alt: image.alt ?? post.caption ?? "",
      mediaType: "image" as const,
      url: image.url,
    })),
  ];
}

function PostMediaGrid({ post }: { post: UIPost }) {
  const mediaItems = getPostMediaItems(post);

  if (mediaItems.length === 0) return null;

  return (
    <div className="grid gap-2">
      {mediaItems.map((media, index) => (
        <PostMediaItem key={`${media.url}-${index}`} media={media} />
      ))}
    </div>
  );
}

function PostMediaItem({ media }: { media: PostMediaItem }) {
  if (media.mediaType === "video") {
    return (
      <div className="bg-muted relative w-full overflow-hidden rounded-lg">
        <video
          className="max-h-[640px] w-full object-cover"
          controls
          playsInline
          src={media.url}
        />
      </div>
    );
  }

  return (
    <div className="bg-muted relative w-full overflow-hidden rounded-lg">
      <Image
        alt={media.alt}
        className="object-cover"
        height={600}
        layout="constrained"
        src={media.url}
        width={800}
      />
    </div>
  );
}

function PostCaption({ caption }: { caption?: string }) {
  if (!caption) return null;
  return <p className="text-sm leading-relaxed">{caption}</p>;
}
