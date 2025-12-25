import { query } from "./_generated/server";
import { redactProfileData } from "./profile";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    const postsWithProfiles = await Promise.all(
      posts.map(async (post) => {
        const profile = await ctx.db.get(post.profileId);
        if (!profile) {
          return null;
        }
        return {
          ...post,
          profile: redactProfileData(profile),
        };
      }),
    );
    return postsWithProfiles.filter((post) => post !== null);
  },
});
