import type { Doc } from "../../_generated/dataModel";
import type { UIImage } from "../../types";
import type { AuthedQueryCtx } from "../../utils";
import { DeletedProfile, getPublicProfile } from "../../profile";

export async function getUIPosts(ctx: AuthedQueryCtx, posts: Doc<"posts">[]) {
  return await Promise.all(
    posts.map(async (post) => {
      const profile = await ctx.db.get(post.profileId);
      const { imagesIds, ...rest } = post;
      const imageResults = await Promise.all(
        (imagesIds ?? []).map(async (imageId) => {
          return await ctx.db.get(imageId);
        }),
      );
      const images = imageResults
        .filter((image) => image !== null)
        .map((image) => ({
          url: image.url,
        })) satisfies UIImage[];
      const fileResults = await Promise.all(
        (post.fileIds ?? []).map(async (fileId) => {
          return await ctx.db.get(fileId);
        }),
      );
      const files = fileResults
        .filter((file) => file !== null)
        .map(({ uploadToken: _uploadToken, ...file }) => file);
      return {
        ...rest,
        creator: profile ? getPublicProfile(profile) : DeletedProfile,
        files,
        images,
      };
    }),
  );
}
