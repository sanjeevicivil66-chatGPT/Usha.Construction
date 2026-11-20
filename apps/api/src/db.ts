import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const migration = `
CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('owner')), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, last_login_at TEXT);
CREATE TABLE IF NOT EXISTS admin_sessions (id_hash TEXT PRIMARY KEY, admin_user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE, csrf_token_hash TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions(expires_at);
CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, record_json TEXT NOT NULL CHECK(json_valid(record_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id), record_json TEXT NOT NULL CHECK(json_valid(record_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, customer_id TEXT REFERENCES customers(id), project_id TEXT REFERENCES projects(id), stage TEXT NOT NULL DEFAULT 'new', source TEXT NOT NULL DEFAULT 'website', record_json TEXT NOT NULL CHECK(json_valid(record_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_leads_stage_updated ON leads(stage, updated_at);
CREATE TABLE IF NOT EXISTS follow_ups (id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE, due_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', record_json TEXT NOT NULL CHECK(json_valid(record_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_followups_due ON follow_ups(status, due_at);
CREATE TABLE IF NOT EXISTS quotations (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id), project_id TEXT REFERENCES projects(id), status TEXT NOT NULL DEFAULT 'draft', total_minor INTEGER NOT NULL DEFAULT 0 CHECK(total_minor >= 0), currency TEXT NOT NULL DEFAULT 'INR', record_json TEXT NOT NULL CHECK(json_valid(record_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS quotation_items (id TEXT PRIMARY KEY, quotation_id TEXT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE, position INTEGER NOT NULL, record_json TEXT NOT NULL CHECK(json_valid(record_json)), UNIQUE(quotation_id, position));
CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, quotation_id TEXT REFERENCES quotations(id), customer_id TEXT NOT NULL REFERENCES customers(id), project_id TEXT REFERENCES projects(id), status TEXT NOT NULL DEFAULT 'draft', total_minor INTEGER NOT NULL DEFAULT 0 CHECK(total_minor >= 0), paid_minor INTEGER NOT NULL DEFAULT 0 CHECK(paid_minor >= 0 AND paid_minor <= total_minor), currency TEXT NOT NULL DEFAULT 'INR', record_json TEXT NOT NULL CHECK(json_valid(record_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, invoice_id TEXT NOT NULL REFERENCES invoices(id), amount_minor INTEGER NOT NULL CHECK(amount_minor > 0), received_at TEXT NOT NULL, record_json TEXT NOT NULL CHECK(json_valid(record_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS email_outbox (id TEXT PRIMARY KEY, customer_id TEXT REFERENCES customers(id), related_type TEXT, related_id TEXT, status TEXT NOT NULL DEFAULT 'queued', provider_message_id TEXT, record_json TEXT NOT NULL CHECK(json_valid(record_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS smtp_settings (id TEXT PRIMARY KEY CHECK(id = 'primary'), public_config_json TEXT NOT NULL CHECK(json_valid(public_config_json)), encrypted_secret TEXT, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS content_posts (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')), markdown_path TEXT NOT NULL, published_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit_events (id TEXT PRIMARY KEY, actor_admin_id TEXT REFERENCES admin_users(id), action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT, metadata_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(metadata_json)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);
INSERT OR IGNORE INTO schema_migrations(version) VALUES (1);
`;

export function openDatabase(databasePath: string) {
  if (databasePath !== ":memory:") mkdirSync(dirname(resolve(databasePath)), { recursive: true });
  const db = new Database(databasePath);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  db.exec(migration);
  return db;
}
