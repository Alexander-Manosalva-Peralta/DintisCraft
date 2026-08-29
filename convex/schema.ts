import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Esquema general de base de datos para la API de Convex
 */
export default defineSchema({
  // Colección principal de recursos / elementos de la API
  items: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("archived")
    ),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
    userId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creation_time", ["createdAt"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_user", ["userId"]),

  // Colección de usuarios y autenticación de la API
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("guest")),
    apiKey: v.optional(v.string()),
    isActive: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_apiKey", ["apiKey"]),

  // Colección de eventos de webhooks recibidos
  webhooks: defineTable({
    source: v.string(),
    event: v.string(),
    payload: v.any(),
    status: v.union(
      v.literal("received"),
      v.literal("processed"),
      v.literal("failed")
    ),
    receivedAt: v.number(),
  })
    .index("by_source", ["source"])
    .index("by_event", ["event"])
    .index("by_receivedAt", ["receivedAt"]),

  // Registro de logs y métricas de llamadas a la API
  api_logs: defineTable({
    endpoint: v.string(),
    method: v.string(),
    status: v.number(),
    durationMs: v.optional(v.number()),
    ip: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});
