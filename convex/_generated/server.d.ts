/* eslint-disable */
import type {
  ActionBuilder,
  AnyDataModel,
  GenericActionCtx,
  GenericHttpActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 */
export declare const query: QueryBuilder<DataModel, "public">;

/**
 * Define an internal query function.
 */
export declare const internalQuery: QueryBuilder<DataModel, "internal">;

/**
 * Define a mutation in this Convex app's public API.
 */
export declare const mutation: MutationBuilder<DataModel, "public">;

/**
 * Define an internal mutation function.
 */
export declare const internalMutation: MutationBuilder<DataModel, "internal">;

/**
 * Define an action in this Convex app's public API.
 */
export declare const action: ActionBuilder<DataModel, "public">;

/**
 * Define an internal action function.
 */
export declare const internalAction: ActionBuilder<DataModel, "internal">;

/**
 * Define an HTTP action.
 */
export declare const httpAction: HttpActionBuilder;

/**
 * Type-safe mutation context.
 */
export type MutationCtx = GenericMutationCtx<DataModel>;

/**
 * Type-safe query context.
 */
export type QueryCtx = GenericQueryCtx<DataModel>;

/**
 * Type-safe action context.
 */
export type ActionCtx = GenericActionCtx<DataModel>;

/**
 * Type-safe HTTP action context.
 */
export type HttpActionCtx = GenericHttpActionCtx;
