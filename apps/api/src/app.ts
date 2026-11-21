import Fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import cookie from "@fastify/cookie";
import swagger from "@fastify/swagger";
import type Database from "better-sqlite3";
import { ErrorEnvelopeSchema } from "@usha/contracts";
import { HttpError } from "./lib/http-error.js";
import { registerHealthRoutes } from "./modules/health/routes.js";
import { registerAuthRoutes } from "./modules/auth/routes.js";
import { registerEnquiryRoutes } from "./modules/enquiries/routes.js";

export async function buildApp(options: { db: Database.Database; adminOrigin?: string; logger?: boolean; secureCookies?: boolean }): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? false,
    trustProxy: false,
    bodyLimit: 1_048_576,
    genReqId: request => {
      const supplied = request.headers["x-request-id"];
      return typeof supplied === "string" && /^[A-Za-z0-9._:-]{8,100}$/.test(supplied)
        ? supplied
        : crypto.randomUUID();
    }
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: { defaultSrc: ["'self'"], objectSrc: ["'none'"], frameAncestors: ["'none'"], baseUri: ["'self'"] }
    }
  });
  await app.register(cookie);
  await app.register(cors, {
    origin: options.adminOrigin ? [options.adminOrigin] : false,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  });
  await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
  await app.register(swagger, {
    openapi: {
      info: { title: "USHA Construction API", version: "1.0.0", description: "Owner-operated USHA platform API" },
      tags: [
        { name: "system", description: "Service health and metadata" },
        { name: "admin-auth", description: "Owner authentication" },
        { name: "public-enquiries", description: "Consent-based public lead capture" }
      ]
    }
  });

  app.setErrorHandler((error, request, reply) => {
    const candidate = error as { statusCode?: unknown; message?: unknown };
    const candidateStatus = candidate.statusCode;
    const statusCode = error instanceof HttpError ? error.statusCode
      : typeof candidateStatus === "number" && candidateStatus >= 400 && candidateStatus < 600 ? candidateStatus : 500;
    const code = error instanceof HttpError ? error.code
      : statusCode === 400 ? "validation_error"
      : statusCode === 413 ? "payload_too_large"
      : statusCode === 429 ? "rate_limited"
      : "internal_error";
    const message = statusCode >= 500 ? "An unexpected server error occurred."
      : typeof candidate.message === "string" ? candidate.message : "Request failed.";
    const payload = { error: { code, message, requestId: request.id } };
    ErrorEnvelopeSchema.parse(payload);
    if (statusCode >= 500) request.log.error({ err: error, requestId: request.id }, "Unhandled API error");
    return reply.code(statusCode).send(payload);
  });

  await registerHealthRoutes(app);
  await registerAuthRoutes(app, {
    db: options.db,
    adminOrigin: options.adminOrigin,
    secureCookies: options.secureCookies ?? false
  });
  await registerEnquiryRoutes(app, options.db);

  app.get("/api/v1/openapi.json", { schema: { hide: true } }, async (_request, reply) => {
    return reply.type("application/json").send(app.swagger());
  });

  app.setNotFoundHandler(async (request, reply) => reply.code(404).send({
    error: { code: "not_found", message: "The requested resource was not found.", requestId: request.id }
  }));

  return app;
}
