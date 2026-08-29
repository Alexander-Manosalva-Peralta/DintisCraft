import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * Acción de Convex para procesar tareas asíncronas externas (IA, Fetch, APIs)
 */
export const processTask = action({
  args: {
    taskName: v.string(),
    payload: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<any> => {
    const { taskName, payload } = args;

    // Ejecutar lógica externa o llamadas HTTP
    const timestamp = Date.now();
    const resultData = {
      taskName,
      status: "completed",
      processedAt: timestamp,
      receivedPayload: payload || null,
    };

    // Guardar resultado como item en Convex
    const savedItem: any = await ctx.runMutation((api as any).items.create, {
      title: `Task: ${taskName}`,
      description: `Procesado exitosamente a las ${new Date(timestamp).toISOString()}`,
      status: "active",
      category: "tasks",
      metadata: resultData,
    });

    return {
      success: true,
      result: resultData,
      savedItem,
    };
  },
});
