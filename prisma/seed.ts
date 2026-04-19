/**
 * Database seed script (run with `npm run db:seed` → `prisma db seed`).
 *
 * Loads `.env` from the repo root, builds PrismaClient with the same pg adapter as the app,
 * then upserts rows so re-running the script is safe (idempotent).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { mockItemTypes } from "../src/lib/mock-data";

const seedDir = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.join(seedDir, "..", ".env");
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

async function seedItemTypes() {
  for (const t of mockItemTypes) {
    await prisma.itemType.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        name: t.name,
        icon: t.icon,
        color: t.color,
        isSystem: t.isSystem,
        userId: null,
      },
      update: {
        name: t.name,
        icon: t.icon,
        color: t.color,
        isSystem: t.isSystem,
        userId: null,
      },
    });
  }
}

async function main() {
  await seedItemTypes();
  console.log(`Seeded ${mockItemTypes.length} system item types from mockItemTypes.`);
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
