import type { FastifyInstance, FastifySchema } from "fastify";
import { HealthResponseSchema } from "@usha/contracts";
import { zodToJsonSchema } from "zod-to-json-schema";

const healthJsonSchema = zodToJsonSchema(HealthResponseSchema) as FastifySchema["response"];

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => ({ status: "ok", service: "usha-api" }));
  app.get("/api/v1/health", {
    schema: {
      tags: ["system"],
      summary: "API health",
      response: { 200: healthJsonSchema }
    }
  }, async request => HealthResponseSchema.parse({
    status: "ok",
    service: "usha-api",
    requestId: request.id
  }));
}
