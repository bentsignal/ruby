import type { UIPost } from "@acme/convex/posts/types";

import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";
import { PostStore } from "../store";
import { PostActions } from "./post-actions";
import { PostCaption } from "./post-caption";
import { PostDate } from "./post-date";
import { PostMediaGrid } from "./post-media-grid";

export function Post({ post }: { post: UIPost }) {
  return (
    <PostStore post={post}>
      <article className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4">
        <ProfileStore profile={post.creator}>
          <div className="flex items-center gap-3">
            <PFP variant="sm" />
            <div className="flex flex-col">
              <Name className="text-sm font-bold" />
              <Username className="text-muted-foreground text-xs font-semibold" />
            </div>
            <PostDate />
          </div>
        </ProfileStore>
        <PostMediaGrid />
        <PostCaption />
        <PostActions />
      </article>
    </PostStore>
  );
}
