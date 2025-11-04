import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));
(async () => {
  console.log("\n=== storiesV13 · Preparación de entorno (.env) ===");
  console.log("Requisito: tu cadena de Neon COMPLETA (incluye ?sslmode=require)\n");
  const url = (await ask("Pega tu DATABASE_URL de Neon: ")).trim();
  rl.close();
  if (!/^postgresql:\/\/.+/.test(url) || !url.includes("sslmode=require")) {
    console.error("\n❌ Cadena inválida o sin sslmode=require. Repite: pnpm run setup:env\n");
    process.exit(1);
  }
  const envPath = path.join(process.cwd(), "apps", "api", ".env");
  const content = `NODE_ENV=production\nDATABASE_URL="${url}"\n`;
  fs.writeFileSync(envPath, content, { encoding: "utf8" });
  console.log(`\n✅ .env creado en ${envPath}`);
  console.log("Siguiente:");
  console.log("   pnpm install");
  console.log("   pnpm run db:deploy\n");
})();

