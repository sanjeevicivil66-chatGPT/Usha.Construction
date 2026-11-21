import { z } from "zod";

export const ErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    requestId: z.string().min(1)
  })
});
export type ErrorEnvelope = z.infer<typeof ErrorEnvelopeSchema>;

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("usha-api"),
  requestId: z.string().min(1)
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).max(100_000).default(0)
}).strict();
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const IdempotencyKeySchema = z.string().trim().min(16).max(128)
  .regex(/^[A-Za-z0-9._:-]+$/, "Invalid idempotency key");
