import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("127.0.0.1"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_PATH: z.string().min(1).optional(),
  ADMIN_ORIGIN: z.string().url().optional()
});

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    throw new Error("Invalid API configuration: " + parsed.error.issues.map(issue => issue.path.join(".")).join(", "));
  }
  const value = parsed.data;
  if (value.NODE_ENV === "production" && !value.DATABASE_PATH) {
    throw new Error("DATABASE_PATH must point to durable persistent storage in production.");
  }
  return {
    mode: value.NODE_ENV,
    host: value.HOST,
    port: value.PORT,
    databasePath: value.DATABASE_PATH ?? "./data/usha-dev.sqlite",
    adminOrigin: value.ADMIN_ORIGIN
  } as const;
}
