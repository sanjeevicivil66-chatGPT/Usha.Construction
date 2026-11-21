import { randomUUID } from "node:crypto";
import argon2 from "argon2";
import { loadConfig } from "../config.js";
import { openDatabase } from "../db.js";

const email = process.env.USHA_BOOTSTRAP_EMAIL?.trim();
const passphrase = process.env.USHA_BOOTSTRAP_PASSPHRASE;
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !passphrase || passphrase.length < 14 || passphrase.length > 200) {
  throw new Error("Set USHA_BOOTSTRAP_EMAIL and USHA_BOOTSTRAP_PASSPHRASE (14–200 characters) in the private process environment.");
}
const config = loadConfig();
const db = openDatabase(config.databasePath);
try {
  const count = (db.prepare("SELECT COUNT(*) AS count FROM admin_users WHERE role = 'owner'").get() as {count:number}).count;
  if (count > 0) throw new Error("An owner account already exists. Use the authenticated password-change flow.");
  const passwordHash = await argon2.hash(passphrase, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
  db.prepare("INSERT INTO admin_users(id, email, password_hash, role) VALUES (?, ?, ?, 'owner')").run(randomUUID(), email, passwordHash);
  process.stdout.write("Owner account provisioned. Remove bootstrap passphrase from the environment now.\n");
} finally {
  db.close();
}
