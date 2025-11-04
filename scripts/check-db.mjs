import 'dotenv/config';
import { Client } from "pg";
import fs from "node:fs";
const envFile = "./apps/api/.env";
if (!fs.existsSync(envFile)) { console.error("❌ Falta apps/api/.env. Ejecuta: pnpm run setup:env"); process.exit(1); }
const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ Falta DATABASE_URL en apps/api/.env"); process.exit(1); }
const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
(async () => {
  try { await client.connect(); const r = await client.query("select 1 as ok"); console.log("✅ Conexión OK ·", r.rows[0]); }
  catch (e) { console.error("❌ Error de conexión:", e.message); process.exit(1); }
  finally { await client.end(); }
})();

