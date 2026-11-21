import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import argon2 from "argon2";
import type Database from "better-sqlite3";
import { z } from "zod";

const SESSION_COOKIE = "usha_admin_session";
const CSRF_COOKIE = "usha_admin_csrf";
const SESSION_SECONDS = 8 * 60 * 60;
const IDLE_MINUTES = 30;
const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(200) }).strict();
const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(200), newPassword: z.string().min(14).max(200) }).strict();
const loginJsonSchema = {
  type: "object", additionalProperties: false, required: ["email", "password"],
  properties: { email: { type: "string", format: "email", maxLength: 254 }, password: { type: "string", minLength: 1, maxLength: 200 } }
};
const changePasswordJsonSchema = {
  type: "object", additionalProperties: false, required: ["currentPassword", "newPassword"],
  properties: { currentPassword: { type: "string", minLength: 1, maxLength: 200 }, newPassword: { type: "string", minLength: 14, maxLength: 200 } }
};

type Owner = { id: string; email: string; password_hash: string };
type Session = { id_hash: string; admin_user_id: string; csrf_token_hash: string; expires_at: string; last_seen_at: string | null };

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const token = () => randomBytes(32).toString("base64url");
const equal = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};
const failure = (request: FastifyRequest, reply: FastifyReply, status: number, code: string, message: string) =>
  reply.code(status).send({ error: { code, message, requestId: request.id } });

function clearCookies(reply: FastifyReply, secure: boolean): void {
  reply.clearCookie(SESSION_COOKIE, { path: "/", httpOnly: true, secure, sameSite: "strict" });
  reply.clearCookie(CSRF_COOKIE, { path: "/", httpOnly: false, secure, sameSite: "strict" });
}

function setCookies(reply: FastifyReply, session: string, csrf: string, secure: boolean): void {
  reply.setCookie(SESSION_COOKIE, session, { path: "/", httpOnly: true, secure, sameSite: "strict", maxAge: SESSION_SECONDS });
  reply.setCookie(CSRF_COOKIE, csrf, { path: "/", httpOnly: false, secure, sameSite: "strict", maxAge: SESSION_SECONDS });
}

function requireOrigin(request: FastifyRequest, origin: string | undefined, reply: FastifyReply): boolean {
  if (!origin || request.headers.origin !== origin) {
    failure(request, reply, origin ? 403 : 503, origin ? "origin_not_allowed" : "admin_origin_not_configured",
      origin ? "Request origin is not allowed." : "Admin origin is not configured.");
    return false;
  }
  return true;
}

function findSession(db: Database.Database, request: FastifyRequest): { owner: Owner; session: Session } | null {
  const raw = request.cookies[SESSION_COOKIE];
  if (!raw) return null;
  const session = db.prepare(`
    SELECT s.id_hash, s.admin_user_id, s.csrf_token_hash, s.expires_at, s.last_seen_at,
           u.id, u.email, u.password_hash
    FROM admin_sessions s JOIN admin_users u ON u.id = s.admin_user_id
    WHERE s.id_hash = ?
  `).get(hash(raw)) as (Session & Owner) | undefined;
  if (!session) return null;
  const now = Date.now();
  if (Date.parse(session.expires_at) <= now ||
      (session.last_seen_at && now - Date.parse(session.last_seen_at) > IDLE_MINUTES * 60_000)) {
    db.prepare("DELETE FROM admin_sessions WHERE id_hash = ?").run(session.id_hash);
    return null;
  }
  db.prepare("UPDATE admin_sessions SET last_seen_at = ? WHERE id_hash = ?").run(new Date(now).toISOString(), session.id_hash);
  return { owner: { id: session.id, email: session.email, password_hash: session.password_hash }, session };
}

function requireCsrf(request: FastifyRequest, reply: FastifyReply, session: Session): boolean {
  const cookie = request.cookies[CSRF_COOKIE];
  const header = request.headers["x-csrf-token"];
  if (!cookie || typeof header !== "string" || !equal(cookie, header) || !equal(hash(cookie), session.csrf_token_hash)) {
    failure(request, reply, 403, "csrf_validation_failed", "CSRF validation failed.");
    return false;
  }
  return true;
}

export async function registerAuthRoutes(app: FastifyInstance, options: {
  db: Database.Database; adminOrigin?: string; secureCookies: boolean
}): Promise<void> {
  const { db, adminOrigin, secureCookies } = options;

  app.post("/api/v1/admin/auth/login", {
    config: { rateLimit: { max: 5, timeWindow: 15 * 60 * 1000 } },
    schema: { tags: ["admin-auth"], summary: "Owner login", body: loginJsonSchema }
  }, async (request, reply) => {
    if (!requireOrigin(request, adminOrigin, reply)) return;
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) return failure(request, reply, 400, "invalid_login", "Email or password is invalid.");
    const owner = db.prepare("SELECT id, email, password_hash FROM admin_users WHERE email = ? COLLATE NOCASE AND role = 'owner'").get(parsed.data.email) as Owner | undefined;
    const valid = owner ? await argon2.verify(owner.password_hash, parsed.data.password).catch(() => false) : false;
    if (!owner || !valid) return failure(request, reply, 401, "invalid_credentials", "Email or password is incorrect.");

    const sessionToken = token();
    const csrfToken = token();
    const now = new Date();
    const expires = new Date(now.getTime() + SESSION_SECONDS * 1000).toISOString();
    const idHash = hash(sessionToken);
    const csrfHash = hash(csrfToken);
    const create = db.transaction(() => {
      db.prepare("INSERT INTO admin_sessions(id_hash, admin_user_id, csrf_token_hash, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)").run(idHash, owner.id, csrfHash, expires, now.toISOString());
      db.prepare("UPDATE admin_users SET last_login_at = ? WHERE id = ?").run(now.toISOString(), owner.id);
      db.prepare("INSERT INTO audit_events(id, actor_admin_id, action, entity_type, entity_id, metadata_json) VALUES (?, ?, ?, ?, ?, ?)").run(randomUUID(), owner.id, "admin.login", "admin_user", owner.id, "{}");
    });
    create();
    setCookies(reply, sessionToken, csrfToken, secureCookies);
    return reply.send({ authenticated: true, owner: { id: owner.id, email: owner.email }, csrfToken });
  });

  app.get("/api/v1/admin/auth/me", async (request, reply) => {
    const found = findSession(db, request);
    if (!found) return failure(request, reply, 401, "authentication_required", "Owner authentication is required.");
    return reply.send({ authenticated: true, owner: { id: found.owner.id, email: found.owner.email } });
  });

  app.post("/api/v1/admin/auth/logout", async (request, reply) => {
    if (!requireOrigin(request, adminOrigin, reply)) return;
    const found = findSession(db, request);
    if (!found) { clearCookies(reply, secureCookies); return reply.code(204).send(); }
    if (!requireCsrf(request, reply, found.session)) return;
    const remove = db.transaction(() => {
      db.prepare("DELETE FROM admin_sessions WHERE id_hash = ?").run(found.session.id_hash);
      db.prepare("INSERT INTO audit_events(id, actor_admin_id, action, entity_type, entity_id, metadata_json) VALUES (?, ?, ?, ?, ?, ?)").run(randomUUID(), found.owner.id, "admin.logout", "admin_user", found.owner.id, "{}");
    });
    remove();
    clearCookies(reply, secureCookies);
    return reply.code(204).send();
  });

  app.post("/api/v1/admin/auth/change-password", {
    schema: { tags: ["admin-auth"], summary: "Change owner password", body: changePasswordJsonSchema }
  }, async (request, reply) => {
    if (!requireOrigin(request, adminOrigin, reply)) return;
    const found = findSession(db, request);
    if (!found) return failure(request, reply, 401, "authentication_required", "Owner authentication is required.");
    if (!requireCsrf(request, reply, found.session)) return;
    const parsed = changePasswordSchema.safeParse(request.body);
    if (!parsed.success) return failure(request, reply, 400, "invalid_password", "New password must contain at least 14 characters.");
    const valid = await argon2.verify(found.owner.password_hash, parsed.data.currentPassword).catch(() => false);
    if (!valid) return failure(request, reply, 401, "invalid_current_password", "Current password is incorrect.");
    const nextHash = await argon2.hash(parsed.data.newPassword, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
    const update = db.transaction(() => {
      db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(nextHash, found.owner.id);
      db.prepare("DELETE FROM admin_sessions WHERE admin_user_id = ?").run(found.owner.id);
      db.prepare("INSERT INTO audit_events(id, actor_admin_id, action, entity_type, entity_id, metadata_json) VALUES (?, ?, ?, ?, ?, ?)").run(randomUUID(), found.owner.id, "admin.password_changed", "admin_user", found.owner.id, "{}");
    });
    update();
    clearCookies(reply, secureCookies);
    return reply.send({ changed: true, reauthenticationRequired: true });
  });
}
