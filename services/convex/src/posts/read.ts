import type { Doc, Id } from "../_generated/dataModel";
import type { AuthedQueryCtx } from "../utils";
import { DeletedProfile, getPublicProfile } from "../profile/helpers";

export async function getUIPosts(
  ctx: AuthedQueryCtx,
  posts: Doc<"posts">[],
  options?: {
    profilesById?: Map<Id<"profiles">, Doc<"profiles">>;
  },
) {
  const profilesById = new Map(options?.profilesById);
  const missingProfileIds = Array.from(
    new Set(
      posts
        .map((post) => post.profileId)
        .filter((profileId) => !profilesById.has(profileId)),
    ),
  );

  const missingProfiles = await Promise.all(
    missingProfileIds.map(async (profileId) => {
      return await ctx.db.get(profileId);
    }),
  );

  for (const profile of missingProfiles) {
    if (profile) profilesById.set(profile._id, profile);
  }

  return await Promise.all(
    posts.map(async (post) => {
      const profile = profilesById.get(post.profileId);
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
