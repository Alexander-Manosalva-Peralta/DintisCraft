import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Crea un nuevo elemento en la base de datos
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("active"), v.literal("archived"))
    ),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const status = args.status ?? "active";

    const itemId = await ctx.db.insert("items", {
      title: args.title,
      description: args.description,
      content: args.content,
      status,
      category: args.category,
      tags: args.tags,
      metadata: args.metadata,
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });

    return {
      _id: itemId,
      title: args.title,
      status,
      createdAt: now,
    };
  },
});

/**
 * Lista elementos con filtros opcionales de estado, categoría, usuario y paginación
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("active"), v.literal("archived"))
    ),
    category: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    if (args.status) {
      const status = args.status;
      return await ctx.db
        .query("items")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .take(limit);
    }

    if (args.category) {
      const category = args.category;
      return await ctx.db
        .query("items")
        .withIndex("by_category", (q) => q.eq("category", category))
        .order("desc")
        .take(limit);
    }

    if (args.userId) {
      const userId = args.userId;
      return await ctx.db
        .query("items")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(limit);
    }

    return await ctx.db.query("items").order("desc").take(limit);
  },
});

/**
 * Obtiene un elemento por su ID
 */
export const getById = query({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Actualiza un elemento existente
 */
export const update = mutation({
  args: {
    id: v.id("items"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("active"), v.literal("archived"))
    ),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error(`Elemento con ID ${args.id} no encontrado`);
    }

    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...cleanUpdates,
      updatedAt: Date.now(),
    });

    return { success: true, updatedId: id };
  },
});

/**
 * Elimina un elemento por su ID
 */
export const remove = mutation({
  args: {
    id: v.id("items"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      return { success: false, error: "Not found" };
    }

    await ctx.db.delete(args.id);
    return { success: true, deletedId: args.id };
  },
});

/**
 * Estadísticas agregadas de la colección items
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("items").collect();
    const users = await ctx.db.query("users").collect();
    const webhooks = await ctx.db.query("webhooks").collect();

    const byStatus = {
      draft: 0,
      active: 0,
      archived: 0,
    };

    for (const item of items) {
      if (item.status in byStatus) {
        byStatus[item.status]++;
      }
    }

    return {
      totalItems: items.length,
      totalUsers: users.length,
      totalWebhooks: webhooks.length,
      statusBreakdown: byStatus,
      lastItem: items.length > 0 ? items[items.length - 1] : null,
    };
  },
});
