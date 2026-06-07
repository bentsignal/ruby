import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import type { UIProfile } from "./types";
import { getRelationshipHelper } from "../friends/helpers";
import { authedQuery } from "../utils";
import { getPublicProfile } from "./helpers";

export const getByUsername = authedQuery({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) return null;
    const { relationship } = await getRelationshipHelper({
      ctx,
      profileRequestingInfo: ctx.myProfile._id,
      otherProfile: profile._id,
    });
    return {
      info: getPublicProfile(profile),
      relationship,
    };
  },
});

export const getMine = authedQuery({
  handler: (ctx) => {
    return getPublicProfile(ctx.myProfile);
  },
});

export const search = authedQuery({
  args: {
    searchTerm: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const trimmedSearchTerm = args.searchTerm.trim();
    if (!trimmedSearchTerm) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      } satisfies {
        page: UIProfile[];
        isDone: boolean;
        continueCursor: string;
      };
    }

    const results = await ctx.db
      .query("profiles")
      .withSearchIndex("search_searchTerm", (q) =>
        q.search("searchTerm", trimmedSearchTerm),
      )
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: results.page.map(getPublicProfile),
    };
  },
});
