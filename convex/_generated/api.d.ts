/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as champions from "../champions.js";
import type * as lib_api from "../lib/api.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_rateLimiter from "../lib/rateLimiter.js";
import type * as matches from "../matches.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  champions: typeof champions;
  "lib/api": typeof lib_api;
  "lib/constants": typeof lib_constants;
  "lib/rateLimiter": typeof lib_rateLimiter;
  matches: typeof matches;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
