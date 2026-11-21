import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { openDatabase } from "./db.js";
import { BASELINE_SCHEMA, MIGRATIONS, runMigrations } from "./db/migrations.js";

test("fresh database applies ordered checksummed migrations", () => {
  const db = openDatabase(":memory:");
  const rows = db.prepare("SELECT version, checksum FROM schema_migrations ORDER BY version").all() as Array<{version:number;checksum:string}>;
  assert.deepEqual(rows.map(row => row.version), [1, 2, 3]);
  assert.ok(rows.every(row => /^[a-f0-9]{64}$/.test(row.checksum)));
  assert.equal(db.pragma("foreign_keys", { simple: true }), 1);
  db.close();
});

test("legacy version-1 database upgrades and preserves existing rows", () => {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  db.exec("CREATE TABLE schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  db.exec(BASELINE_SCHEMA);
  db.prepare("INSERT INTO schema_migrations(version) VALUES (1)").run();
  db.prepare("INSERT INTO customers(id, record_json) VALUES (?, ?)").run("customer-1", JSON.stringify({name:"Existing record"}));
  runMigrations(db);
  const row = db.prepare("SELECT id, record_json, version FROM customers WHERE id = ?").get("customer-1") as {id:string;record_json:string;version:number};
  assert.equal(row.id, "customer-1");
  assert.equal(JSON.parse(row.record_json).name, "Existing record");
  assert.equal(row.version, 1);
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM schema_migrations").get() as {count:number}).count, 3);
  db.close();
});

test("migration replay is idempotent and checksum drift is rejected", () => {
  const db = openDatabase(":memory:");
  runMigrations(db);
  db.prepare("UPDATE schema_migrations SET checksum = ? WHERE version = 2").run("tampered");
  assert.throws(() => runMigrations(db), /checksum mismatch at version 2/);
  db.close();
});

test("failed migration rolls back DDL and its version record", () => {
  const db = new Database(":memory:");
  const broken = [...MIGRATIONS.slice(0, 1), { version: 2, name: "broken", sql: "CREATE TABLE should_rollback(id TEXT); THIS IS NOT SQL;" }];
  assert.throws(() => runMigrations(db, broken));
  assert.equal((db.prepare("SELECT COUNT(*) AS count FROM schema_migrations").get() as {count:number}).count, 1);
  assert.equal(Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='should_rollback'").get()), false);
  db.close();
});

test("audit events, quote versions and invoice snapshots are append-only", () => {
  const db = openDatabase(":memory:");
  db.prepare("INSERT INTO customers(id, record_json) VALUES (?, ?)").run("customer-1", "{}");
  db.prepare("INSERT INTO quotations(id, customer_id, record_json) VALUES (?, ?, ?)").run("quote-1", "customer-1", "{}");
  db.prepare("INSERT INTO invoices(id, customer_id, record_json) VALUES (?, ?, ?)").run("invoice-1", "customer-1", "{}");
  db.prepare("INSERT INTO audit_events(id, action, entity_type) VALUES (?, ?, ?)").run("audit-1", "created", "customer");
  db.prepare("INSERT INTO quote_versions(id, quotation_id, version, snapshot_json) VALUES (?, ?, ?, ?)").run("quote-version-1", "quote-1", 1, "{}");
  db.prepare("INSERT INTO invoice_items(id, invoice_id, position, snapshot_json) VALUES (?, ?, ?, ?)").run("invoice-item-1", "invoice-1", 1, "{}");
  assert.throws(() => db.prepare("UPDATE audit_events SET action = 'changed' WHERE id = 'audit-1'").run(), /append-only/);
  assert.throws(() => db.prepare("DELETE FROM audit_events WHERE id = 'audit-1'").run(), /append-only/);
  assert.throws(() => db.prepare("UPDATE quote_versions SET snapshot_json = '{}' WHERE id = 'quote-version-1'").run(), /immutable/);
  assert.throws(() => db.prepare("DELETE FROM invoice_items WHERE id = 'invoice-item-1'").run(), /immutable/);
  db.close();
});
