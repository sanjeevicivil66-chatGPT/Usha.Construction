import { createHash } from "node:crypto";
import type Database from "better-sqlite3";

export type Migration = { version: number; name: string; sql: string };

export const BASELINE_SCHEMA = `
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
`;

export const MIGRATIONS: Migration[] = [
  { version: 1, name: "initial-platform-schema", sql: BASELINE_SCHEMA },
  { version: 2, name: "normalized-fields-activity-and-outbox", sql: `
ALTER TABLE customers ADD COLUMN display_name TEXT;
ALTER TABLE customers ADD COLUMN email_normalized TEXT;
ALTER TABLE customers ADD COLUMN phone_normalized TEXT;
ALTER TABLE customers ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE projects ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE leads ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE leads ADD COLUMN attribution_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(attribution_json));
ALTER TABLE follow_ups ADD COLUMN project_id TEXT REFERENCES projects(id);
ALTER TABLE quotations ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE quotations ADD COLUMN issued_snapshot_json TEXT CHECK(issued_snapshot_json IS NULL OR json_valid(issued_snapshot_json));
ALTER TABLE invoices ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE invoices ADD COLUMN issued_snapshot_json TEXT CHECK(issued_snapshot_json IS NULL OR json_valid(issued_snapshot_json));
ALTER TABLE audit_events ADD COLUMN correlation_id TEXT;
ALTER TABLE audit_events ADD COLUMN changed_fields_json TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(changed_fields_json));
CREATE INDEX idx_customers_email_normalized ON customers(email_normalized);
CREATE INDEX idx_customers_phone_normalized ON customers(phone_normalized);
CREATE INDEX idx_projects_customer_updated ON projects(customer_id, updated_at);
CREATE INDEX idx_leads_customer_updated ON leads(customer_id, updated_at);
CREATE INDEX idx_followups_project_due ON follow_ups(project_id, status, due_at);
CREATE INDEX idx_quotations_customer_created ON quotations(customer_id, created_at);
CREATE INDEX idx_invoices_customer_status ON invoices(customer_id, status, created_at);
CREATE INDEX idx_payments_invoice_received ON payments(invoice_id, received_at);
CREATE INDEX idx_audit_entity_created ON audit_events(entity_type, entity_id, created_at);
CREATE TABLE activity_events (
  id TEXT PRIMARY KEY,
  actor_admin_id TEXT REFERENCES admin_users(id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(metadata_json)),
  correlation_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_activity_entity_created ON activity_events(entity_type, entity_id, created_at);
CREATE TABLE idempotency_keys (
  scope TEXT NOT NULL,
  key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_json TEXT CHECK(response_json IS NULL OR json_valid(response_json)),
  response_status INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  PRIMARY KEY(scope, key)
);
CREATE INDEX idx_idempotency_expiry ON idempotency_keys(expires_at);
CREATE TABLE quote_versions (
  id TEXT PRIMARY KEY,
  quotation_id TEXT NOT NULL REFERENCES quotations(id),
  version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL CHECK(json_valid(snapshot_json)),
  created_by TEXT REFERENCES admin_users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(quotation_id, version)
);
CREATE TABLE invoice_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  position INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL CHECK(json_valid(snapshot_json)),
  UNIQUE(invoice_id, position)
);
CREATE TABLE outbox_attempts (
  id TEXT PRIMARY KEY,
  outbox_id TEXT NOT NULL REFERENCES email_outbox(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('started','accepted','failed')),
  provider_message_id TEXT,
  error_code TEXT,
  attempted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(outbox_id, attempt_number)
);
CREATE INDEX idx_outbox_attempts_outbox ON outbox_attempts(outbox_id, attempt_number);
CREATE TRIGGER audit_events_no_update BEFORE UPDATE ON audit_events BEGIN SELECT RAISE(ABORT, 'audit events are append-only'); END;
CREATE TRIGGER audit_events_no_delete BEFORE DELETE ON audit_events BEGIN SELECT RAISE(ABORT, 'audit events are append-only'); END;
CREATE TRIGGER quote_versions_no_update BEFORE UPDATE ON quote_versions BEGIN SELECT RAISE(ABORT, 'quote versions are immutable'); END;
CREATE TRIGGER quote_versions_no_delete BEFORE DELETE ON quote_versions BEGIN SELECT RAISE(ABORT, 'quote versions are immutable'); END;
CREATE TRIGGER invoice_items_no_update BEFORE UPDATE ON invoice_items BEGIN SELECT RAISE(ABORT, 'issued invoice items are immutable'); END;
CREATE TRIGGER invoice_items_no_delete BEFORE DELETE ON invoice_items BEGIN SELECT RAISE(ABORT, 'issued invoice items are immutable'); END;
` },
  { version: 3, name: "admin-session-idle-expiry", sql: "ALTER TABLE admin_sessions ADD COLUMN last_seen_at TEXT;" }
];

function checksum(sql: string): string {
  return createHash("sha256").update(sql).digest("hex");
}

function tableExists(db: Database.Database, name: string): boolean {
  return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name));
}

export function runMigrations(db: Database.Database, migrations: Migration[] = MIGRATIONS): void {
  db.pragma("foreign_keys = ON");
  if (!tableExists(db, "schema_migrations")) {
    db.exec("CREATE TABLE schema_migrations (version INTEGER PRIMARY KEY, checksum TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  } else {
    const columns = db.prepare("PRAGMA table_info(schema_migrations)").all() as Array<{ name: string }>;
    if (!columns.some(column => column.name === "checksum")) {
      db.exec("ALTER TABLE schema_migrations ADD COLUMN checksum TEXT");
      const legacy = db.prepare("SELECT version FROM schema_migrations").all() as Array<{ version: number }>;
      if (legacy.some(row => row.version === 1)) {
        for (const name of ["customers", "projects", "leads", "quotations", "invoices", "audit_events"]) {
          if (!tableExists(db, name)) throw new Error("Legacy schema is incomplete; restore from backup before migration.");
        }
        db.prepare("UPDATE schema_migrations SET checksum = ? WHERE version = 1").run("legacy-baseline-v1");
      }
    }
  }

  const knownVersions = migrations.map(item => item.version);
  if (new Set(knownVersions).size !== knownVersions.length || knownVersions.some((version, index) => version !== index + 1)) {
    throw new Error("Migration versions must be unique, ordered and contiguous from 1.");
  }
  const latest = (db.prepare("SELECT COALESCE(MAX(version), 0) AS version FROM schema_migrations").get() as { version: number }).version;
  if (latest > migrations.length) throw new Error("Database schema is newer than this application release.");

  for (const migration of migrations) {
    const expected = checksum(migration.sql);
    const applied = db.prepare("SELECT checksum FROM schema_migrations WHERE version = ?").get(migration.version) as { checksum: string | null } | undefined;
    if (applied) {
      if (applied.checksum === "legacy-baseline-v1" && migration.version === 1) continue;
      if (applied.checksum !== expected) throw new Error("Migration checksum mismatch at version " + migration.version + ".");
      continue;
    }
    const apply = db.transaction(() => {
      db.exec(migration.sql);
      db.prepare("INSERT INTO schema_migrations(version, checksum) VALUES (?, ?)").run(migration.version, expected);
    });
    apply();
  }
}
