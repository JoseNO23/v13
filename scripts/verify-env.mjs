// scripts/verify-env.mjs
import fs from "node:fs";
import crypto from "node:crypto";

const p = "apps/api/.env";
if (!fs.existsSync(p)) {
  console.error("❌ Falta apps/api/.env");
  process.exit(1);
}
const buf = fs.readFileSync(p);
const sha = crypto.createHash("sha256").update(buf).digest("hex");
console.log("✅ .env OK · Ruta:", p, "· Bytes:", buf.length, "· SHA256:", sha);
console.log("Ejecuta este mismo comando en la otra máquina y compara el SHA.");
