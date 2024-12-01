/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as champions from "../champions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
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
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  actionCache: {
    cache: {
      get: FunctionReference<
        "mutation",
        "internal",
        { args: any; name: string; ttl: number | null },
        any | null
      >;
      put: FunctionReference<
        "mutation",
        "internal",
        { args: any; name: string; ttl: number | null; value: any },
        null
      >;
    };
    crons: {
      purge: FunctionReference<
        "mutation",
        "internal",
        { expiresAt?: number },
        null
      >;
    };
    lib: {
      fetch: FunctionReference<
        "action",
        "internal",
        { args: any; fn: string; name: string; ttl: number | null },
        any
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        { args: any; name: string },
        null
      >;
      removeAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number; name?: string },
        null
      >;
    };
  };
};
