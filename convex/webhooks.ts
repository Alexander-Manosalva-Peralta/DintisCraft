import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Registra un webhook entrante en la base de datos
 */
export const record = mutation({
  args: {
    source: v.string(),
    event: v.string(),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("webhooks", {
      source: args.source,
      event: args.event,
      payload: args.payload,
      status: "received",
      receivedAt: Date.now(),
    });

    return { success: true, webhookId: id };
  },
});

/**
 * Lista los eventos de webhook recibidos
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    if (args.source) {
      const source = args.source;
      return await ctx.db
        .query("webhooks")
        .withIndex("by_source", (q) => q.eq("source", source))
        .order("desc")
        .take(limit);
    }
    return await ctx.db.query("webhooks").order("desc").take(limit);
  },
});
