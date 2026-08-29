/* eslint-disable */
import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  GenericDataModel,
  GenericDatabaseReader,
  GenericDatabaseWriter,
  GenericMutationCtx,
  GenericQueryCtx,
  GenericActionCtx,
  TableNamesInDataModel,
  VectorIndexNames,
} from "convex/server";
import type { GenericId } from "convex/values";
import type schema from "../schema.js";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 */
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;

/**
 * An identifier for a document of a specific type.
 */
export type Id<TableName extends TableNames> = GenericId<TableName>;

/**
 * A type describing your entire Convex data model.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

/**
 * A utility for reading data from Convex.
 */
export type DatabaseReader = GenericDatabaseReader<DataModel>;

/**
 * A utility for writing data to Convex.
 */
export type DatabaseWriter = GenericDatabaseWriter<DataModel>;

/**
 * Context for a query function.
 */
export type QueryCtx = GenericQueryCtx<DataModel>;

/**
 * Context for a mutation function.
 */
export type MutationCtx = GenericMutationCtx<DataModel>;

/**
 * Context for an action function.
 */
export type ActionCtx = GenericActionCtx<DataModel>;
