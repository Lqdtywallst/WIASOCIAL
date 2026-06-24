import { readFileSync } from "fs";
import { join } from "path";
import pg from "pg";

const projectRef = "birkkohkenkxcpuhhyih";
const password = process.env.SUPABASE_DB_PASSWORD?.trim();
const poolerHost = process.env.SUPABASE_POOLER_HOST ?? "aws-1-ap-northeast-1.pooler.supabase.com";
const poolerPort = process.env.SUPABASE_POOLER_PORT ?? "6543";

if (!password) {
  console.error("Falta SUPABASE_DB_PASSWORD en .env.local");
  process.exit(1);
}

const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@${poolerHost}:${poolerPort}/postgres`;

async function main() {
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const files = [
    "supabase/ai-features-migration.sql",
    "supabase/persistence-fixes-migration.sql",
  ];

  for (const file of files) {
    const sql = readFileSync(join(process.cwd(), file), "utf8");
    console.log(`Ejecutando ${file}...`);
    await client.query(sql);
  }
  await client.end();
  console.log("Migracion de persistencia completada.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
