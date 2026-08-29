import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { corsHeaders, handleOptions, jsonResponse, errorResponse } from "./cors";

const http = httpRouter();

/**
 * ----------------------------------------------------
 * ROOT & HEALTH CHECK ENDPOINTS
 * ----------------------------------------------------
 */
http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async () => {
    return jsonResponse({
      name: "apiconvex",
      version: "1.0.0",
      description: "Convex REST API & Real-time Database",
      cloudUrl: "https://colorless-anteater-240.convex.cloud",
      httpActionsUrl: "https://colorless-anteater-240.convex.site",
      endpoints: [
        { method: "GET", path: "/api/health", description: "Health check" },
        { method: "GET", path: "/api/items", description: "List items (query: limit, status, category)" },
        { method: "POST", path: "/api/items", description: "Create item" },
        { method: "GET", path: "/api/stats", description: "Database metrics and counts" },
        { method: "POST", path: "/api/webhooks", description: "Receive and log webhooks" },
        { method: "POST", path: "/api/users", description: "Create user / generate API key" },
        { method: "GET", path: "/api/users", description: "List registered users" },
        { method: "POST", path: "/api/tasks", description: "Trigger asynchronous background task" },
      ],
      timestamp: Date.now(),
    });
  }),
});

http.route({
  path: "/api",
  method: "GET",
  handler: httpAction(async () => {
    return jsonResponse({
      status: "online",
      service: "apiconvex",
      timestamp: Date.now(),
    });
  }),
});

http.route({
  path: "/api/health",
  method: "GET",
  handler: httpAction(async () => {
    return jsonResponse({
      status: "healthy",
      service: "apiconvex",
      cloudUrl: "https://colorless-anteater-240.convex.cloud",
      httpActionsUrl: "https://colorless-anteater-240.convex.site",
      timestamp: Date.now(),
      version: "1.0.0",
    });
  }),
});

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return jsonResponse({
      status: "healthy",
      service: "apiconvex",
      timestamp: Date.now(),
    });
  }),
});

/**
 * ----------------------------------------------------
 * CORS PREFLIGHT (OPTIONS)
 * ----------------------------------------------------
 */
http.route({ path: "/", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });
http.route({ path: "/api", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });
http.route({ path: "/api/health", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });
http.route({ path: "/health", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });
http.route({ path: "/api/items", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });
http.route({ path: "/api/stats", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });
http.route({ path: "/api/webhooks", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });
http.route({ path: "/api/users", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });
http.route({ path: "/api/tasks", method: "OPTIONS", handler: httpAction(async () => handleOptions()) });

/**
 * ----------------------------------------------------
 * ITEMS CRUD ENDPOINTS
 * ----------------------------------------------------
 */

// GET /api/items - Listar elementos
http.route({
  path: "/api/items",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const limitParam = url.searchParams.get("limit");
      const statusParam = url.searchParams.get("status");
      const categoryParam = url.searchParams.get("category");
      const userIdParam = url.searchParams.get("userId");

      const limit = limitParam ? parseInt(limitParam, 10) : 50;
      const status =
        statusParam && ["draft", "active", "archived"].includes(statusParam)
          ? (statusParam as "draft" | "active" | "archived")
          : undefined;
      const category = categoryParam || undefined;
      const userId = userIdParam || undefined;

      const items = await ctx.runQuery((api as any).items.list, {
        limit,
        status,
        category,
        userId,
      });

      return jsonResponse({
        success: true,
        count: items.length,
        data: items,
      });
    } catch (err: any) {
      return errorResponse(err.message || "Error al listar items", 500);
    }
  }),
});

// POST /api/items - Crear elemento
http.route({
  path: "/api/items",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { title, description, content, status, category, tags, metadata, userId } = body;

      if (!title || typeof title !== "string") {
        return errorResponse("El campo 'title' es requerido y debe ser texto", 400);
      }

      const result = await ctx.runMutation((api as any).items.create, {
        title: title.trim(),
        description: description || undefined,
        content: content || undefined,
        status: status && ["draft", "active", "archived"].includes(status) ? status : "active",
        category: category || undefined,
        tags: Array.isArray(tags) ? tags : undefined,
        metadata: metadata || undefined,
        userId: userId || undefined,
      });

      return jsonResponse({ success: true, data: result }, 201);
    } catch (err: any) {
      return errorResponse(err.message || "Error al crear item", 400);
    }
  }),
});

/**
 * ----------------------------------------------------
 * STATS ENDPOINT
 * ----------------------------------------------------
 */
http.route({
  path: "/api/stats",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const stats = await ctx.runQuery((api as any).items.getStats, {});
      return jsonResponse({ success: true, data: stats });
    } catch (err: any) {
      return errorResponse(err.message || "Error al obtener estadísticas", 500);
    }
  }),
});

/**
 * ----------------------------------------------------
 * WEBHOOKS ENDPOINT
 * ----------------------------------------------------
 */
http.route({
  path: "/api/webhooks",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { source, event, payload } = body;

      if (!source || !event) {
        return errorResponse("'source' y 'event' son requeridos", 400);
      }

      const result = await ctx.runMutation((api as any).webhooks.record, {
        source: String(source),
        event: String(event),
        payload: payload ?? body,
      });

      return jsonResponse({ success: true, data: result }, 201);
    } catch (err: any) {
      return errorResponse(err.message || "Error al registrar webhook", 400);
    }
  }),
});

/**
 * ----------------------------------------------------
 * USERS & AUTH ENDPOINTS
 * ----------------------------------------------------
 */
http.route({
  path: "/api/users",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { name, email, role, metadata } = body;

      if (!name || !email) {
        return errorResponse("'name' y 'email' son requeridos", 400);
      }

      const result = await ctx.runMutation((api as any).users.create, {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        role: role && ["admin", "user", "guest"].includes(role) ? role : "user",
        metadata: metadata || undefined,
      });

      return jsonResponse({ success: true, data: result }, 201);
    } catch (err: any) {
      return errorResponse(err.message || "Error al crear usuario", 400);
    }
  }),
});

http.route({
  path: "/api/users",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const limitParam = url.searchParams.get("limit");
      const limit = limitParam ? parseInt(limitParam, 10) : 20;

      const users = await ctx.runQuery((api as any).users.list, { limit });
      return jsonResponse({ success: true, count: users.length, data: users });
    } catch (err: any) {
      return errorResponse(err.message || "Error al listar usuarios", 500);
    }
  }),
});

/**
 * ----------------------------------------------------
 * ASYNC TASKS ENDPOINT
 * ----------------------------------------------------
 */
http.route({
  path: "/api/tasks",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { taskName, payload } = body;

      if (!taskName) {
        return errorResponse("'taskName' es requerido", 400);
      }

      const result = await ctx.runAction((api as any).actions.processTask, {
        taskName: String(taskName),
        payload: payload || undefined,
      });

      return jsonResponse({ success: true, data: result }, 200);
    } catch (err: any) {
      return errorResponse(err.message || "Error al procesar tarea", 500);
    }
  }),
});

export default http;
