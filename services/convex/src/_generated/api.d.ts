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
import type * as files_bunny from "../files/bunny.js";
import type * as files_http from "../files/http.js";
import type * as files_internal from "../files/internal.js";
import type * as files_mutations from "../files/mutations.js";
import type * as files_types from "../files/types.js";
import type * as files_upload_http from "../files/upload_http.js";
import type * as files_upload_session from "../files/upload_session.js";
import type * as files_validators from "../files/validators.js";
import type * as friends_helpers from "../friends/helpers.js";
import type * as friends_mutations from "../friends/mutations.js";
import type * as friends_types from "../friends/types.js";
import type * as friends_validators from "../friends/validators.js";
import type * as http from "../http.js";
import type * as likes_mutations from "../likes/mutations.js";
import type * as likes_validators from "../likes/validators.js";
import type * as limiter from "../limiter.js";
import type * as permissions_helpers from "../permissions/helpers.js";
import type * as permissions_queries from "../permissions/queries.js";
import type * as permissions_validators from "../permissions/validators.js";
import type * as places_actions from "../places/actions.js";
import type * as places_google from "../places/google.js";
import type * as places_types from "../places/types.js";
import type * as places_validation from "../places/validation.js";
import type * as places_validators from "../places/validators.js";
import type * as posts_mutations from "../posts/mutations.js";
import type * as posts_queries from "../posts/queries.js";
import type * as posts_read from "../posts/read.js";
import type * as posts_types from "../posts/types.js";
import type * as posts_validation from "../posts/validation.js";
import type * as posts_validators from "../posts/validators.js";
import type * as profile_helpers from "../profile/helpers.js";
import type * as profile_mutations from "../profile/mutations.js";
import type * as profile_queries from "../profile/queries.js";
import type * as profile_types from "../profile/types.js";
import type * as profile_validators from "../profile/validators.js";
import type * as urls from "../urls.js";
import type * as utils from "../utils.js";
import type * as waitlist_mutations from "../waitlist/mutations.js";
import type * as waitlist_queries from "../waitlist/queries.js";
import type * as waitlist_validators from "../waitlist/validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "files/bunny": typeof files_bunny;
  "files/http": typeof files_http;
  "files/internal": typeof files_internal;
  "files/mutations": typeof files_mutations;
  "files/types": typeof files_types;
  "files/upload_http": typeof files_upload_http;
  "files/upload_session": typeof files_upload_session;
  "files/validators": typeof files_validators;
  "friends/helpers": typeof friends_helpers;
  "friends/mutations": typeof friends_mutations;
  "friends/types": typeof friends_types;
  "friends/validators": typeof friends_validators;
  http: typeof http;
  "likes/mutations": typeof likes_mutations;
  "likes/validators": typeof likes_validators;
  limiter: typeof limiter;
  "permissions/helpers": typeof permissions_helpers;
  "permissions/queries": typeof permissions_queries;
  "permissions/validators": typeof permissions_validators;
  "places/actions": typeof places_actions;
  "places/google": typeof places_google;
  "places/types": typeof places_types;
  "places/validation": typeof places_validation;
  "places/validators": typeof places_validators;
  "posts/mutations": typeof posts_mutations;
  "posts/queries": typeof posts_queries;
  "posts/read": typeof posts_read;
  "posts/types": typeof posts_types;
  "posts/validation": typeof posts_validation;
  "posts/validators": typeof posts_validators;
  "profile/helpers": typeof profile_helpers;
  "profile/mutations": typeof profile_mutations;
  "profile/queries": typeof profile_queries;
  "profile/types": typeof profile_types;
  "profile/validators": typeof profile_validators;
  urls: typeof urls;
  utils: typeof utils;
  "waitlist/mutations": typeof waitlist_mutations;
  "waitlist/queries": typeof waitlist_queries;
  "waitlist/validators": typeof waitlist_validators;
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
