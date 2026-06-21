import { ConvexError } from "convex/values";

import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import type { SeedMediaAsset, SeedProfile } from "./devSeedFixtures";
import { getOrderedProfileIds } from "./friends/helpers";

export async function createSeedProfile(
  ctx: MutationCtx,
  args: {
    fixture: SeedProfile;
    friendIndex: number;
    runLabel: string;
  },
) {
  const name = `${args.fixture.name} ${args.friendIndex + 1}`;
  const username = await getUniqueUsername(
    ctx,
    slugify(`${args.runLabel}-${args.fixture.name}-${args.friendIndex + 1}`),
  );

  return await ctx.db.insert("profiles", {
    userId: `seed:${args.runLabel}:${args.friendIndex + 1}`,
    name,
    username,
    image: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(username)}`,
    bio: args.fixture.bio,
    link: args.fixture.link,
    searchTerm: `${username} ${name}`,
  });
}

export async function ensureFriendship(
  ctx: MutationCtx,
  args: {
    friendId: Id<"profiles">;
    profileId: Id<"profiles">;
  },
) {
  const { profileIdA, profileIdB } = getOrderedProfileIds(
    args.profileId,
    args.friendId,
  );
  const existing = await ctx.db
    .query("friends")
    .withIndex("by_profileA", (q) => q.eq("profileIdA", profileIdA))
    .filter((q) => q.eq(q.field("profileIdB"), profileIdB))
    .first();

  if (existing) {
    if (existing.status !== "friends") {
      await ctx.db.patch(existing._id, { status: "friends" });
    }
    return false;
  }

  await ctx.db.insert("friends", {
    profileIdA,
    profileIdB,
    status: "friends",
    initiatedBy: args.profileId,
  });
  return true;
}

export async function createSeedFile(
  ctx: MutationCtx,
  args: {
    asset: SeedMediaAsset;
    friendId: Id<"profiles">;
    friendIndex: number;
    postIndex: number;
    runLabel: string;
  },
) {
  const url = args.asset.url.trim();
  if (!url) throw new ConvexError("Seed media asset URL cannot be empty");

  const mediaType = args.asset.mediaType ?? getMediaTypeFromUrl(url);
  const contentType =
    args.asset.contentType ??
    (mediaType === "image" ? "image/jpeg" : "video/mp4");
  const key =
    args.asset.key ??
    `seed/${args.runLabel}/${args.friendIndex + 1}-${args.postIndex + 1}-${getFileNameFromUrl(url)}`;

  return await ctx.db.insert("files", {
    contentType,
    fileName: args.asset.fileName ?? getFileNameFromUrl(url),
    key,
    mediaType,
    size: args.asset.size ?? 1,
    status: "uploaded",
    uploadedBy: args.friendId,
    url,
  });
}

export async function seedLikes(
  ctx: MutationCtx,
  args: {
    likesPerPost: number;
    postIds: Id<"posts">[];
    profileIds: Id<"profiles">[];
  },
) {
  let likeCount = 0;

  for (let postIndex = 0; postIndex < args.postIds.length; postIndex++) {
    const postId = args.postIds[postIndex];
    if (!postId) throw new ConvexError("Seed post not found");

    const likerIds = getSeedLikerIds({
      likesPerPost: args.likesPerPost,
      postIndex,
      profileIds: args.profileIds,
    });
    for (const profileId of likerIds) {
      const createdLike = await ensureLike(ctx, { postId, profileId });
      if (createdLike) likeCount++;
    }
  }

  return likeCount;
}

export async function wipeSeedData(ctx: MutationCtx) {
  const seedProfiles = (await ctx.db.query("profiles").collect()).filter(
    (profile) => profile.userId.startsWith("seed:"),
  );
  const seedProfileIdSet = new Set(seedProfiles.map((profile) => profile._id));
  const seedPosts = (await ctx.db.query("posts").collect()).filter((post) =>
    seedProfileIdSet.has(post.profileId),
  );
  const seedPostIdSet = new Set(seedPosts.map((post) => post._id));
  const seedFiles = (await ctx.db.query("files").collect()).filter((file) =>
    seedProfileIdSet.has(file.uploadedBy),
  );
  const seedFriends = (await ctx.db.query("friends").collect()).filter(
    (friendship) =>
      seedProfileIdSet.has(friendship.profileIdA) ||
      seedProfileIdSet.has(friendship.profileIdB),
  );
  const seedLikes = (await ctx.db.query("likes").collect()).filter(
    (like) =>
      seedProfileIdSet.has(like.profileId) || seedPostIdSet.has(like.postId),
  );
  const seedFeedItems = (await ctx.db.query("feedItems").collect()).filter(
    (feedItem) =>
      seedProfileIdSet.has(feedItem.profileId) ||
      seedProfileIdSet.has(feedItem.creatorProfileId) ||
      seedPostIdSet.has(feedItem.postId),
  );

  await Promise.all(seedLikes.map((like) => ctx.db.delete(like._id)));
  await Promise.all(
    seedFeedItems.map((feedItem) => ctx.db.delete(feedItem._id)),
  );
  await Promise.all(
    seedFriends.map((friendship) => ctx.db.delete(friendship._id)),
  );
  await Promise.all(seedPosts.map((post) => ctx.db.delete(post._id)));
  await Promise.all(seedFiles.map((file) => ctx.db.delete(file._id)));
  await Promise.all(seedProfiles.map((profile) => ctx.db.delete(profile._id)));

  return {
    feedItems: seedFeedItems.length,
    profiles: seedProfiles.length,
    friendships: seedFriends.length,
    posts: seedPosts.length,
    files: seedFiles.length,
    likes: seedLikes.length,
  };
}

function getSeedLikerIds(args: {
  likesPerPost: number;
  postIndex: number;
  profileIds: Id<"profiles">[];
}) {
  if (args.likesPerPost === 0) return [];

  const [viewerProfileId, ...friendIds] = args.profileIds;
  const includeViewer = args.postIndex % 3 === 0 && viewerProfileId;
  const friendOffset = args.postIndex % Math.max(friendIds.length, 1);
  const rotatedFriendIds = [
    ...friendIds.slice(friendOffset),
    ...friendIds.slice(0, friendOffset),
  ];

  return [
    ...(includeViewer ? [viewerProfileId] : []),
    ...rotatedFriendIds,
  ].slice(0, args.likesPerPost);
}

async function getUniqueUsername(ctx: MutationCtx, baseUsername: string) {
  const base = baseUsername.length > 0 ? baseUsername.slice(0, 30) : "seeduser";
  let suffix = 0;
  let candidate = base;

  while (
    await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", candidate))
      .first()
  ) {
    suffix++;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}

async function ensureLike(
  ctx: MutationCtx,
  args: {
    postId: Id<"posts">;
    profileId: Id<"profiles">;
  },
) {
  const existing = await ctx.db
    .query("likes")
    .withIndex("by_profile_post", (q) =>
      q.eq("profileId", args.profileId).eq("postId", args.postId),
    )
    .first();
  if (existing) return false;

  await ctx.db.insert("likes", {
    postId: args.postId,
    profileId: args.profileId,
  });
  return true;
}

function getMediaTypeFromUrl(url: string) {
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  if (
    path.endsWith(".mp4") ||
    path.endsWith(".mov") ||
    path.endsWith(".webm")
  ) {
    return "video";
  }
  return "image";
}

function getFileNameFromUrl(url: string) {
  const path = url.split("?")[0] ?? "";
  const fileName = path.split("/").pop()?.trim();
  return fileName && fileName.length > 0 ? fileName : "seed-media.jpg";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 40);
}
