import type { UIPost } from "@acme/convex/posts/types";

import { QuickLink } from "~/components/quick-link";
import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";
import { PostMedia } from "../media/components/post-media";
import { PostStore } from "../store";
import { PostActions } from "./post-actions";
import { PostCaption } from "./post-caption";
import { PostMoreButton } from "./post-more-button";

export function Post({ post }: { post: UIPost }) {
  return (
    <PostStore post={post}>
      <article className="flex flex-col gap-3">
        <ProfileStore profile={post.creator}>
          <div className="flex items-center gap-3">
            <QuickLink
              to="/$username"
              params={{ username: post.creator.username }}
              className="flex min-w-0 items-center gap-3"
            >
              <PFP variant="sm" />
              <div className="flex min-w-0 flex-col">
                <Name className="text-sm leading-tight font-bold" />
                <Username className="text-muted-foreground truncate text-xs leading-tight font-medium" />
              </div>
            </QuickLink>
            <div className="-mr-2 ml-auto shrink-0">
              <PostMoreButton />
            </div>
          </div>
        </ProfileStore>
        <PostMedia />
        <PostCaption />
        <PostActions />
      </article>
    </PostStore>
  );
}
