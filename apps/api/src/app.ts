import Fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import type Database from "better-sqlite3";

export async function buildApp(options: { db: Database.Database; adminOrigin?: string; logger?: boolean }): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger ?? false, trustProxy: false, bodyLimit: 1_048_576 });
  await app.register(helmet, { contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], objectSrc: ["'none'"], frameAncestors: ["'none'"], baseUri: ["'self'"] } } });
  await app.register(cors, { origin: options.adminOrigin ? [options.adminOrigin] : false, credentials: true, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] });
  await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
  app.get("/health", async () => ({ status: "ok", service: "usha-api" }));
  app.get("/api/v1/health", async () => ({ status: "ok", database: options.db.open ? "connected" : "unavailable" }));
  app.setNotFoundHandler(async (_request, reply) => reply.code(404).send({ error: "not_found" }));
  return app;
}
