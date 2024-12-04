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
import type * as crons from "../crons.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_rateLimiter from "../lib/rateLimiter.js";
import type * as lib_riotApi from "../lib/riotApi.js";
import type * as lib_utils from "../lib/utils.js";
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
  crons: typeof crons;
  "lib/constants": typeof lib_constants;
  "lib/rateLimiter": typeof lib_rateLimiter;
  "lib/riotApi": typeof lib_riotApi;
  "lib/utils": typeof lib_utils;
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
