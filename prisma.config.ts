import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Neon: use a direct (non-pooled) URL for Prisma CLI (`migrate`, `db execute`, etc.).
 * Falls back to `DATABASE_URL` so local setups with a single URL still work.
 * Runtime app code uses `DATABASE_URL` (pooled recommended) in `src/lib/prisma.ts`.
 */
function databaseUrlForCli(): string {
  const url =
    process.env.DIRECT_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim();
  if (url) {
    return url;
  }
  // `prisma generate` does not connect to the database; a placeholder satisfies config validation
  // so CI / `next build` can run without secrets. Use real URLs for migrate, studio, db execute, etc.
  return "postgresql://placeholder:placeholder@127.0.0.1:5432/postgres";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrlForCli(),
  },
});
