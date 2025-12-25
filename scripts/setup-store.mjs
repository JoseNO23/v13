// scripts/setup-store.mjs
const isWin = process.platform === "win32";
console.log("Store de PNPM recomendado por SO (ejecuta uno, manualmente):\n");
if (isWin) {
  console.log('Windows: pnpm config set store-dir "%LOCALAPPDATA%\\\\pnpm\\\\store" --global');
} else {
  console.log('macOS:   pnpm config set store-dir "$HOME/Library/pnpm/store" --global');
}
console.log("\nVer ruta actual del store:");
console.log("pnpm store path\n");
