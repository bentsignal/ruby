/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as bunny from "../bunny.js";
import type * as fileMutations from "../fileMutations.js";
import type * as files from "../files.js";
import type * as friends from "../friends.js";
import type * as http from "../http.js";
import type * as limiter from "../limiter.js";
import type * as posts from "../posts.js";
import type * as profile from "../profile.js";
import type * as types from "../types.js";
import type * as uploadthing from "../uploadthing.js";
import type * as urls from "../urls.js";
import type * as utils from "../utils.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  bunny: typeof bunny;
  fileMutations: typeof fileMutations;
  files: typeof files;
  friends: typeof friends;
  http: typeof http;
  limiter: typeof limiter;
  posts: typeof posts;
  profile: typeof profile;
  types: typeof types;
  uploadthing: typeof uploadthing;
  urls: typeof urls;
  utils: typeof utils;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
};
