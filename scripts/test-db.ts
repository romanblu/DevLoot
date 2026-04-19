/**
 * Smoke-test the database: connection, row counts, and a snapshot of main tables.
 * Run from repo root: `npm run test:db`
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

function section(title: string) {
  console.log(`\n${"=".repeat(60)}\n${title}\n${"=".repeat(60)}`);
}

async function main() {
  section("Connection");
  const ping = await prisma.$queryRaw<{ one: number }[]>`
    SELECT 1::int AS one
  `;
  console.log("SELECT 1:", ping[0]?.one);

  section("Row counts");
  const [
    userCount,
    itemTypeCount,
    collectionCount,
    itemCount,
    linkCount,
    tagCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.itemCollection.count(),
    prisma.tag.count(),
  ]);
  console.log(
    JSON.stringify(
      {
        User: userCount,
        ItemType: itemTypeCount,
        Collection: collectionCount,
        Item: itemCount,
        ItemCollection: linkCount,
        Tag: tagCount,
      },
      null,
      2,
    ),
  );

  section("Demo user (demo@devloot.io)");
  const demo = await prisma.user.findUnique({
    where: { email: "demo@devloot.io" },
    select: {
      id: true,
      email: true,
      name: true,
      isPro: true,
      emailVerified: true,
      passwordHash: true,
    },
  });
  if (!demo) {
    console.log("Not found — run `npm run db:seed` to create the demo user.");
  } else {
    const { passwordHash, ...rest } = demo;
    console.log(
      JSON.stringify(
        { ...rest, passwordHashStored: Boolean(passwordHash) },
        null,
        2,
      ),
    );
  }

  section("Item types (system)");
  const itemTypes = await prisma.itemType.findMany({
    where: { userId: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true, icon: true, color: true, isSystem: true },
  });
  console.log(JSON.stringify(itemTypes, null, 2));

  section("Collections (with item count via ItemCollection)");
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      _count: { select: { items: true } },
    },
  });
  console.log(
    JSON.stringify(
      collections.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        isFavorite: c.isFavorite,
        itemCount: c._count.items,
      })),
      null,
      2,
    ),
  );

  section("Sample items (first 8 by title)");
  const items = await prisma.item.findMany({
    orderBy: { title: "asc" },
    take: 8,
    select: {
      id: true,
      title: true,
      contentType: true,
      itemTypeId: true,
      url: true,
      language: true,
    },
  });
  console.log(JSON.stringify(items, null, 2));

  section("Sanity checks");
  const checks: string[] = [];
  if (itemTypeCount < 7) {
    checks.push(`WARN: expected at least 7 system ItemType rows, got ${itemTypeCount}`);
  } else {
    checks.push(`OK: ItemType count >= 7 (${itemTypeCount})`);
  }
  if (demo && itemCount >= 18) {
    checks.push(`OK: seeded demo data likely present (Item count ${itemCount})`);
  } else if (demo && itemCount > 0) {
    checks.push(`INFO: demo user exists; Item count ${itemCount} (full seed targets 18)`);
  } else if (!demo) {
    checks.push("INFO: no demo user — run `npm run db:seed` if you expect one");
  }
  checks.push(`ItemCollection rows (item↔collection): ${linkCount}`);
  checks.forEach((c) => console.log(c));

  console.log("\nDatabase snapshot complete.\n");
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
