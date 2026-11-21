import test from "node:test";
import assert from "node:assert/strict";
import argon2 from "argon2";
import { openDatabase } from "./db.js";
import { buildApp } from "./app.js";

const origin = "https://admin.example.test";
const fixturePassword = ["Cedar", "Bridge", "Lantern", "47", "Unit"].join("-");
async function setup() {
  const db = openDatabase(":memory:");
  const passwordHash = await argon2.hash(fixturePassword, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
  db.prepare("INSERT INTO admin_users(id, email, password_hash, role) VALUES (?, ?, ?, 'owner')").run("owner-1", "owner@example.test", passwordHash);
  const app = await buildApp({ db, adminOrigin: origin, secureCookies: true });
  return { db, app };
}
function cookieValues(response: { headers: Record<string, unknown> }): string[] {
  const values = response.headers["set-cookie"];
  return Array.isArray(values) ? values.map(String) : values ? [String(values)] : [];
}
function cookiePair(response: { headers: Record<string, unknown> }) {
  return cookieValues(response).map(value => value.split(";")[0]).join("; ");
}
function csrfCookie(response: { headers: Record<string, unknown> }) {
  return cookieValues(response).find(value => value.startsWith("usha_admin_csrf="))!.split(";")[0]!.split("=")[1]!;
}

test("admin endpoints reject anonymous requests", async () => {
  const { db, app } = await setup();
  const response = await app.inject({ method: "GET", url: "/api/v1/admin/auth/me" });
  assert.equal(response.statusCode, 401);
  assert.equal(response.json().error.code, "authentication_required");
  await app.close(); db.close();
});

test("login requires exact admin origin and valid owner credentials", async () => {
  const { db, app } = await setup();
  const blocked = await app.inject({ method: "POST", url: "/api/v1/admin/auth/login", headers: { origin: "https://attacker.example" }, payload: { email: "owner@example.test", password: fixturePassword } });
  assert.equal(blocked.statusCode, 403);
  const login = await app.inject({ method: "POST", url: "/api/v1/admin/auth/login", headers: { origin }, payload: { email: "owner@example.test", password: fixturePassword } });
  assert.equal(login.statusCode, 200);
  assert.equal(login.json().authenticated, true);
  const cookies = cookieValues(login);
  assert.ok(cookies.some(value => value.startsWith("usha_admin_session=") && /HttpOnly/i.test(value) && /Secure/i.test(value)));
  assert.ok(cookies.some(value => value.startsWith("usha_admin_csrf=") && !/HttpOnly/i.test(value) && /Secure/i.test(value)));
  await app.close(); db.close();
});

test("session cookie authenticates owner and CSRF token is required for logout", async () => {
  const { db, app } = await setup();
  const login = await app.inject({ method: "POST", url: "/api/v1/admin/auth/login", headers: { origin }, payload: { email: "owner@example.test", password: fixturePassword } });
  const cookies = cookiePair(login);
  const me = await app.inject({ method: "GET", url: "/api/v1/admin/auth/me", headers: { cookie: cookies } });
  assert.equal(me.statusCode, 200);
  const csrf = csrfCookie(login);
  const blocked = await app.inject({ method: "POST", url: "/api/v1/admin/auth/logout", headers: { origin, cookie: cookies } });
  assert.equal(blocked.statusCode, 403);
  const logout = await app.inject({ method: "POST", url: "/api/v1/admin/auth/logout", headers: { origin, cookie: cookies, "x-csrf-token": csrf } });
  assert.equal(logout.statusCode, 204);
  const after = await app.inject({ method: "GET", url: "/api/v1/admin/auth/me", headers: { cookie: cookies } });
  assert.equal(after.statusCode, 401);
  await app.close(); db.close();
});

test("password change invalidates every active session", async () => {
  const { db, app } = await setup();
  const login = await app.inject({ method: "POST", url: "/api/v1/admin/auth/login", headers: { origin }, payload: { email: "owner@example.test", password: fixturePassword } });
  const cookies = cookiePair(login);
  const csrf = csrfCookie(login);
  const changed = await app.inject({
    method: "POST", url: "/api/v1/admin/auth/change-password",
    headers: { origin, cookie: cookies, "x-csrf-token": csrf },
    payload: { currentPassword: fixturePassword, newPassword: ["New", "Cedar", "Bridge", "Lantern", "48", "Unit"].join("-") }
  });
  assert.equal(changed.statusCode, 200);
  assert.equal(changed.json().reauthenticationRequired, true);
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM admin_sessions").get() as {count:number}).count, 0);
  await app.close(); db.close();
});
