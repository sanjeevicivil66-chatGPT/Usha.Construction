import { loadConfig } from "./config.js";
import { openDatabase } from "./db.js";
import { buildApp } from "./app.js";

const config = loadConfig();
const db = openDatabase(config.databasePath);
const app = await buildApp({ db, adminOrigin: config.adminOrigin, logger: config.mode !== "test" });
const close = async () => { await app.close(); db.close(); };
process.once("SIGINT", () => void close().finally(() => process.exit(0)));
process.once("SIGTERM", () => void close().finally(() => process.exit(0)));
try {
  await app.listen({ host: config.host, port: config.port });
} catch (error) {
  app.log.error(error);
  await close();
  process.exit(1);
}
