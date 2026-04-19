/**
 * Smoke-test the database connection (run from repo root: `npm run test:db`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.join(scriptDir, "..", ".env");
if (fs.existsSync(rootEnv)) {
  loadEnv({ path: rootEnv, override: true });
} else {
  loadEnv({ path: path.join(process.cwd(), ".env"), override: true });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set (copy .env.example → .env).");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const ping = await prisma.$queryRaw<{ one: number }[]>`
    SELECT 1::int AS one
  `;
  console.log("SELECT 1:", ping[0]?.one);

  const itemTypeCount = await prisma.itemType.count();
  console.log("ItemType count:", itemTypeCount);

  console.log("Database connection OK.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
