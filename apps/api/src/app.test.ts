import test from "node:test";
import assert from "node:assert/strict";
import { openDatabase } from "./db.js";
import { buildApp } from "./app.js";

test("health endpoint returns minimal service status", async () => {
  const db = openDatabase(":memory:");
  const app = await buildApp({ db });
  const response = await app.inject({ method: "GET", url: "/health" });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { status: "ok", service: "usha-api" });
  await app.close();
  db.close();
});

test("initial schema creates core platform tables and enables foreign keys", () => {
  const db = openDatabase(":memory:");
  const tables = (db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{name:string}>).map(row => row.name);
  for (const name of ["admin_users","admin_sessions","leads","follow_ups","quotations","invoices","payments","audit_events"]) assert.ok(tables.includes(name), "missing table: " + name);
  assert.equal(db.pragma("foreign_keys", { simple: true }), 1);
  db.close();
});
