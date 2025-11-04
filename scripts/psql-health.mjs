import 'dotenv/config';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

if (!process.env.DATABASE_URL) {
  console.error('❌ Falta DATABASE_URL. Crea apps/api/.env con la cadena de Neon.');
  process.exit(1);
}
if (!existsSync('sql/health.sql')) {
  console.error('❌ Falta sql/health.sql');
  process.exit(1);
}

const args = ['--dbname', process.env.DATABASE_URL, '-f', 'sql/health.sql'];
const child = spawn('psql', args, { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 1));

