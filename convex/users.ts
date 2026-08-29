import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Crea o registra un nuevo usuario con una API Key
 */
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("user"), v.literal("guest"))
    ),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return existing;
    }

    const apiKey = `key_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
    const now = Date.now();

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role ?? "user",
      apiKey,
      isActive: true,
      metadata: args.metadata,
      createdAt: now,
    });

    return {
      _id: userId,
      name: args.name,
      email: args.email,
      apiKey,
      role: args.role ?? "user",
      createdAt: now,
    };
  },
});

/**
 * Lista usuarios registrados
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db.query("users").order("desc").take(limit);
  },
});

/**
 * Busca usuario por email
 */
export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

/**
 * Busca usuario por su API key
 */
export const getByApiKey = query({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_apiKey", (q) => q.eq("apiKey", args.apiKey))
      .first();
  },
});
