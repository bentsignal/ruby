import type { Doc } from "../_generated/dataModel";
import type { AuthedQueryCtx } from "../utils";
import { DeletedProfile, getPublicProfile } from "../profile/helpers";

export async function getUIPosts(ctx: AuthedQueryCtx, posts: Doc<"posts">[]) {
  return await Promise.all(
    posts.map(async (post) => {
      const profile = await ctx.db.get(post.profileId);
      const fileResults = await Promise.all(
        (post.attachments ?? []).map(async (fileId) => {
          return await ctx.db.get(fileId);
        }),
      );
      const files = fileResults
        .filter((file) => file !== null)
        .map(({ uploadToken: _uploadToken, ...file }) => file);
      const myLike = await ctx.db
        .query("likes")
        .withIndex("by_profile_post", (q) =>
          q.eq("profileId", ctx.myProfile._id).eq("postId", post._id),
        )
        .first();
      return {
        ...post,
        creator: profile ? getPublicProfile(profile) : DeletedProfile,
        files,
        likedByMe: myLike !== null,
      };
    }),
  );
}
