import { ConvexError, v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import type { SeedMediaAsset } from "./devSeedFixtures";
import { internalMutation } from "./_generated/server";
import { env } from "./convex.env";
import {
  CAPTIONS,
  DEMO_MEDIA_ASSETS,
  LOCATIONS,
  PROFILE_FIXTURES,
} from "./devSeedFixtures";
import {
  createSeedFile,
  createSeedProfile,
  ensureFriendship,
  seedLikes,
  wipeSeedData as wipeSeedDataHelper,
} from "./devSeedWrites";

const DEFAULT_FRIEND_COUNT = 8;
const DEFAULT_POSTS_PER_FRIEND = 2;
const DEFAULT_LIKES_PER_POST = 3;
const MAX_FRIEND_COUNT = 30;
const MAX_POSTS_PER_FRIEND = 5;
const MAX_LIKES_PER_POST = 10;
const ATTACHMENT_COUNT_PATTERN = [1, 3, 0, 2, 1, 0];

const vSeedMediaAsset = v.object({
  url: v.string(),
  key: v.optional(v.string()),
  fileName: v.optional(v.string()),
  contentType: v.optional(v.string()),
  mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
  size: v.optional(v.number()),
});

interface SeedCounts {
  friendCount: number;
  likesPerPost: number;
  postsPerFriend: number;
}

export const seedFriendsAndPosts = internalMutation({
  args: {
    profileId: v.id("profiles"),
    friendCount: v.optional(v.number()),
    postsPerFriend: v.optional(v.number()),
    likesPerPost: v.optional(v.number()),
    mediaAssets: v.optional(v.array(vSeedMediaAsset)),
    runLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertNotProduction();

    const targetProfile = await ctx.db.get(args.profileId);
    if (!targetProfile) throw new ConvexError("Profile not found");

    const counts = getSeedCounts(args);
    const runLabel = getRunLabel(args.runLabel, {
      profileId: args.profileId,
      profileCreationTime: targetProfile._creationTime,
    });
    const content = await seedContent(ctx, {
      counts,
      mediaAssets: args.mediaAssets ?? DEMO_MEDIA_ASSETS,
      profileId: args.profileId,
      runLabel,
    });
    const likeCount = await seedLikes(ctx, {
      likesPerPost: counts.likesPerPost,
      postIds: content.postIds,
      profileIds: [args.profileId, ...content.friendIds],
    });

    return {
      runLabel,
      profileIds: content.friendIds,
      postIds: content.postIds,
      fileIds: content.fileIds,
      created: {
        profiles: content.friendIds.length,
        friendships: content.friendshipCount,
        posts: content.postIds.length,
        files: content.fileIds.length,
        likes: likeCount,
      },
    };
  },
});

export const wipeSeedData = internalMutation({
  args: {},
  handler: async (ctx) => {
    assertNotProduction();
    return { deleted: await wipeSeedDataHelper(ctx) };
  },
});

function assertNotProduction() {
  if (env.ENVIRONMENT === "production") {
    throw new ConvexError("Dev seed functions cannot run in production");
  }
}

function atCycle<T>(items: readonly T[], index: number) {
  const item = items[index % items.length];
  if (item === undefined) throw new ConvexError("Seed fixture is empty");
  return item;
}

function getSeedCounts(args: {
  friendCount?: number;
  likesPerPost?: number;
  postsPerFriend?: number;
}) {
  return {
    friendCount: normalizeCount({
      value: args.friendCount,
      defaultValue: DEFAULT_FRIEND_COUNT,
      max: MAX_FRIEND_COUNT,
      name: "friendCount",
    }),
    postsPerFriend: normalizeCount({
      value: args.postsPerFriend,
      defaultValue: DEFAULT_POSTS_PER_FRIEND,
      max: MAX_POSTS_PER_FRIEND,
      name: "postsPerFriend",
    }),
    likesPerPost: normalizeCount({
      value: args.likesPerPost,
      defaultValue: DEFAULT_LIKES_PER_POST,
      max: MAX_LIKES_PER_POST,
      name: "likesPerPost",
    }),
  };
}

function normalizeCount(args: {
  defaultValue: number;
  max: number;
  name: string;
  value?: number;
}) {
  const value = args.value ?? args.defaultValue;
  if (!Number.isInteger(value) || value < 0 || value > args.max) {
    throw new ConvexError(
      `${args.name} must be an integer from 0 to ${args.max}`,
    );
  }
  return value;
}

function getRunLabel(
  requestedRunLabel: string | undefined,
  args: {
    profileCreationTime: number;
    profileId: Id<"profiles">;
  },
) {
  const trimmedRunLabel = requestedRunLabel?.trim();
  return trimmedRunLabel && trimmedRunLabel.length > 0
    ? trimmedRunLabel
    : createRunLabel(args.profileId, args.profileCreationTime);
}

function createRunLabel(profileId: Id<"profiles">, creationTime: number) {
  return `seed-${slugify(String(profileId)).slice(0, 10)}-${Math.floor(creationTime)}`;
}

async function seedContent(
  ctx: MutationCtx,
  args: {
    counts: SeedCounts;
    mediaAssets: SeedMediaAsset[];
    profileId: Id<"profiles">;
    runLabel: string;
  },
) {
  const friendIds = new Array<Id<"profiles">>();
  const postIds = new Array<Id<"posts">>();
  const fileIds = new Array<Id<"files">>();
  let friendshipCount = 0;

  for (
    let friendIndex = 0;
    friendIndex < args.counts.friendCount;
    friendIndex++
  ) {
    const result = await seedFriendContent(ctx, { ...args, friendIndex });
    friendIds.push(result.friendId);
    postIds.push(...result.postIds);
    fileIds.push(...result.fileIds);
    if (result.createdFriendship) friendshipCount++;
  }

  return { friendIds, postIds, fileIds, friendshipCount };
}

async function seedFriendContent(
  ctx: MutationCtx,
  args: {
    counts: SeedCounts;
    friendIndex: number;
    mediaAssets: SeedMediaAsset[];
    profileId: Id<"profiles">;
    runLabel: string;
  },
) {
  const friendId = await createSeedProfile(ctx, {
    fixture: atCycle(PROFILE_FIXTURES, args.friendIndex),
    friendIndex: args.friendIndex,
    runLabel: args.runLabel,
  });
  const createdFriendship = await ensureFriendship(ctx, {
    profileId: args.profileId,
    friendId,
  });
  const { postIds, fileIds } = await seedPostsForFriend(ctx, {
    ...args,
    friendId,
  });

  return { friendId, postIds, fileIds, createdFriendship };
}

async function seedPostsForFriend(
  ctx: MutationCtx,
  args: {
    counts: SeedCounts;
    friendId: Id<"profiles">;
    friendIndex: number;
    mediaAssets: SeedMediaAsset[];
    runLabel: string;
  },
) {
  const postIds = new Array<Id<"posts">>();
  const fileIds = new Array<Id<"files">>();

  for (let postIndex = 0; postIndex < args.counts.postsPerFriend; postIndex++) {
    const attachmentIds = await createSeedAttachments(ctx, {
      ...args,
      postIndex,
    });
    fileIds.push(...attachmentIds);

    const postId = await ctx.db.insert("posts", {
      attachments: attachmentIds,
      caption: atCycle(CAPTIONS, args.friendIndex + postIndex),
      location: atCycle(LOCATIONS, args.friendIndex + postIndex),
      profileId: args.friendId,
    });
    postIds.push(postId);
  }

  return { postIds, fileIds };
}

async function createSeedAttachments(
  ctx: MutationCtx,
  args: {
    friendId: Id<"profiles">;
    friendIndex: number;
    mediaAssets: SeedMediaAsset[];
    postIndex: number;
    runLabel: string;
  },
) {
  if (args.mediaAssets.length === 0) return [];

  const attachmentCount = atCycle(
    ATTACHMENT_COUNT_PATTERN,
    args.friendIndex + args.postIndex,
  );
  const fileIds = new Array<Id<"files">>();

  for (
    let attachmentIndex = 0;
    attachmentIndex < attachmentCount;
    attachmentIndex++
  ) {
    fileIds.push(
      await createSeedFile(ctx, {
        asset: atCycle(
          args.mediaAssets,
          args.friendIndex + args.postIndex + attachmentIndex,
        ),
        friendId: args.friendId,
        friendIndex: args.friendIndex,
        postIndex: args.postIndex,
        runLabel: args.runLabel,
      }),
    );
  }

  return fileIds;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 40);
}
