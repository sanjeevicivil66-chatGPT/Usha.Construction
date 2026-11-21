import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { runMigrations } from "./db/migrations.js";

export function openDatabase(databasePath: string) {
  if (databasePath !== ":memory:") mkdirSync(dirname(resolve(databasePath)), { recursive: true });
  const db = new Database(databasePath);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  try {
    runMigrations(db);
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}
