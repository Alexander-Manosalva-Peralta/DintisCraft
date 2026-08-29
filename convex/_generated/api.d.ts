/* eslint-disable */
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as http from "../http.js";
import type * as items from "../items.js";
import type * as users from "../users.js";
import type * as webhooks from "../webhooks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 */
export declare const api: FilterApi<
  ApiFromModules<{
    actions: typeof actions;
    http: typeof http;
    items: typeof items;
    users: typeof users;
    webhooks: typeof webhooks;
  }>,
  FunctionReference<any, "public">
>;

export declare const internal: FilterApi<
  ApiFromModules<{
    actions: typeof actions;
    http: typeof http;
    items: typeof items;
    users: typeof users;
    webhooks: typeof webhooks;
  }>,
  FunctionReference<any, "internal">
>;
