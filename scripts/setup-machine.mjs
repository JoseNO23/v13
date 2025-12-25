// scripts/setup-machine.mjs
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const PLATFORM_FILE = path.join(".cache", "last-platform.txt");
const PLATFORM = process.platform; // 'win32' | 'darwin' | 'linux'
fs.mkdirSync(".cache", { recursive: true });

let last = null;
if (fs.existsSync(PLATFORM_FILE)) {
  last = fs.readFileSync(PLATFORM_FILE, "utf8").trim();
}

const hasNodeModules = fs.existsSync("node_modules");

// Regenera node_modules si cambió el SO
if (last && last !== PLATFORM && hasNodeModules) {
  console.log(`⚠️ Detectado cambio de SO (${last} → ${PLATFORM}). Regenerando node_modules...`);
  try {
    if (PLATFORM === "win32") {
      execSync('powershell -NoProfile -Command "Remove-Item -Recurse -Force node_modules"', { stdio: "inherit" });
    } else {
      execSync("rm -rf node_modules", { stdio: "inherit" });
    }
  } catch (e) {
    console.warn("No se pudo borrar node_modules automáticamente:", e.message);
  }
}

// Si no hay node_modules, instala
if (!fs.existsSync("node_modules")) {
  console.log("ℹ️ node_modules no existe. Instalando dependencias...");
  execSync("pnpm install", { stdio: "inherit" });
}

fs.writeFileSync(PLATFORM_FILE, PLATFORM);
console.log(`✅ Plataforma actual registrada: ${PLATFORM}`);
