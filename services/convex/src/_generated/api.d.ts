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
import type * as auth_shared from "../auth_shared.js";
import type * as bunny from "../bunny.js";
import type * as features_files_upload_http from "../features/files/upload_http.js";
import type * as features_files_upload_session from "../features/files/upload_session.js";
import type * as features_files_validators from "../features/files/validators.js";
import type * as features_friends_validators from "../features/friends/validators.js";
import type * as features_images_validators from "../features/images/validators.js";
import type * as features_permissions_validators from "../features/permissions/validators.js";
import type * as features_posts_create from "../features/posts/create.js";
import type * as features_posts_read from "../features/posts/read.js";
import type * as features_posts_validators from "../features/posts/validators.js";
import type * as features_profile_validators from "../features/profile/validators.js";
import type * as features_trips_validators from "../features/trips/validators.js";
import type * as fileMutations from "../fileMutations.js";
import type * as files from "../files.js";
import type * as friends from "../friends.js";
import type * as http from "../http.js";
import type * as limiter from "../limiter.js";
import type * as permissions from "../permissions.js";
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
  auth_shared: typeof auth_shared;
  bunny: typeof bunny;
  "features/files/upload_http": typeof features_files_upload_http;
  "features/files/upload_session": typeof features_files_upload_session;
  "features/files/validators": typeof features_files_validators;
  "features/friends/validators": typeof features_friends_validators;
  "features/images/validators": typeof features_images_validators;
  "features/permissions/validators": typeof features_permissions_validators;
  "features/posts/create": typeof features_posts_create;
  "features/posts/read": typeof features_posts_read;
  "features/posts/validators": typeof features_posts_validators;
  "features/profile/validators": typeof features_profile_validators;
  "features/trips/validators": typeof features_trips_validators;
  fileMutations: typeof fileMutations;
  files: typeof files;
  friends: typeof friends;
  http: typeof http;
  limiter: typeof limiter;
  permissions: typeof permissions;
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
