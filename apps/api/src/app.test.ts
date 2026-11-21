import test from "node:test";
import assert from "node:assert/strict";
import { openDatabase } from "./db.js";
import { buildApp } from "./app.js";

test("legacy health endpoint remains compatible", async () => {
  const db = openDatabase(":memory:");
  const app = await buildApp({ db });
  const response = await app.inject({ method: "GET", url: "/health" });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { status: "ok", service: "usha-api" });
  await app.close();
  db.close();
});

test("versioned health returns request correlation ID", async () => {
  const db = openDatabase(":memory:");
  const app = await buildApp({ db });
  const response = await app.inject({ method: "GET", url: "/api/v1/health", headers: { "x-request-id": "test-req-123456" } });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().requestId, "test-req-123456");
  await app.close();
  db.close();
});

test("unknown routes return stable error envelope with request ID", async () => {
  const db = openDatabase(":memory:");
  const app = await buildApp({ db });
  const response = await app.inject({ method: "GET", url: "/not-here" });
  assert.equal(response.statusCode, 404);
  assert.deepEqual(Object.keys(response.json().error).sort(), ["code", "message", "requestId"]);
  assert.equal(response.json().error.code, "not_found");
  await app.close();
  db.close();
});

test("OpenAPI document is generated from registered route schemas", async () => {
  const db = openDatabase(":memory:");
  const app = await buildApp({ db });
  const response = await app.inject({ method: "GET", url: "/api/v1/openapi.json" });
  assert.equal(response.statusCode, 200);
  const document = response.json();
  assert.equal(document.info.title, "USHA Construction API");
  assert.ok(document.paths["/api/v1/health"]);
  await app.close();
  db.close();
});
