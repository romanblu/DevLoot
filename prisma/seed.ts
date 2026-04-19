/**
 * Database seed script (run with `npm run db:seed` → `prisma db seed`).
 *
 * Populates demo user, system item types, collections, and items per `.cursor/features/seed-spec.md`.
 * Idempotent: safe to re-run (upserts on stable ids).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
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

const DEMO_USER_ID = "user_seed_demo_devloot";
const DEMO_EMAIL = "demo@devloot.io";

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

async function seedDemoUser() {
  const passwordHash = await bcrypt.hash("12345678", 12);
  const emailVerified = new Date();
  return prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    create: {
      id: DEMO_USER_ID,
      email: DEMO_EMAIL,
      name: "Demo User",
      passwordHash,
      isPro: false,
      emailVerified,
    },
    update: {
      name: "Demo User",
      passwordHash,
      isPro: false,
      emailVerified,
    },
  });
}

type ItemUpsert = {
  id: string;
  title: string;
  itemTypeId: string;
  contentType: string;
  content?: string | null;
  url?: string | null;
  language?: string | null;
  description?: string | null;
};

async function upsertItem(userId: string, def: ItemUpsert) {
  await prisma.item.upsert({
    where: { id: def.id },
    create: {
      id: def.id,
      userId,
      title: def.title,
      itemTypeId: def.itemTypeId,
      contentType: def.contentType,
      content: def.content ?? null,
      url: def.url ?? null,
      language: def.language ?? null,
      description: def.description ?? null,
      isFavorite: false,
      isPinned: false,
    },
    update: {
      title: def.title,
      itemTypeId: def.itemTypeId,
      contentType: def.contentType,
      content: def.content ?? null,
      url: def.url ?? null,
      language: def.language ?? null,
      description: def.description ?? null,
    },
  });
}

async function linkItemToCollection(itemId: string, collectionId: string) {
  await prisma.itemCollection.upsert({
    where: {
      itemId_collectionId: { itemId, collectionId },
    },
    create: { itemId, collectionId },
    update: {},
  });
}

async function seedCollectionsAndItems(userId: string) {

  const colReact = "col_seed_react_patterns";
  const colAi = "col_seed_ai_workflows";
  const colDevops = "col_seed_devops";
  const colTerminal = "col_seed_terminal_commands";
  const colDesign = "col_seed_design_resources";

  await prisma.collection.upsert({
    where: { id: colReact },
    create: {
      id: colReact,
      userId,
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      defaultTypeId: "it_snippet",
      isFavorite: false,
    },
    update: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      defaultTypeId: "it_snippet",
      userId,
    },
  });

  await prisma.collection.upsert({
    where: { id: colAi },
    create: {
      id: colAi,
      userId,
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      defaultTypeId: "it_prompt",
      isFavorite: false,
    },
    update: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      defaultTypeId: "it_prompt",
      userId,
    },
  });

  await prisma.collection.upsert({
    where: { id: colDevops },
    create: {
      id: colDevops,
      userId,
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      defaultTypeId: "it_snippet",
      isFavorite: false,
    },
    update: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      defaultTypeId: "it_snippet",
      userId,
    },
  });

  await prisma.collection.upsert({
    where: { id: colTerminal },
    create: {
      id: colTerminal,
      userId,
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      defaultTypeId: "it_command",
      isFavorite: false,
    },
    update: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      defaultTypeId: "it_command",
      userId,
    },
  });

  await prisma.collection.upsert({
    where: { id: colDesign },
    create: {
      id: colDesign,
      userId,
      name: "Design Resources",
      description: "UI/UX resources and references",
      defaultTypeId: "it_link",
      isFavorite: false,
    },
    update: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      defaultTypeId: "it_link",
      userId,
    },
  });

  // --- React Patterns: 3 snippets ---
  await upsertItem(userId, {
    id: "seed_rp_hooks",
    title: "Custom hooks (useDebounce, useLocalStorage, etc.)",
    itemTypeId: "it_snippet",
    contentType: "text",
    language: "typescript",
    description: "Patterns for reusable React hooks.",
    content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return v;
}`,
  });
  await linkItemToCollection("seed_rp_hooks", colReact);

  await upsertItem(userId, {
    id: "seed_rp_components",
    title: "Component patterns (Context providers, compound components)",
    itemTypeId: "it_snippet",
    contentType: "text",
    language: "typescript",
    description: "Structuring components for clarity and reuse.",
    content: `import { createContext, useContext, type ReactNode } from "react";

const Ctx = createContext<string | null>(null);
export function Provider({ value, children }: { value: string; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error("Missing provider");
  return v;
}`,
  });
  await linkItemToCollection("seed_rp_components", colReact);

  await upsertItem(userId, {
    id: "seed_rp_utils",
    title: "Utility functions",
    itemTypeId: "it_snippet",
    contentType: "text",
    language: "typescript",
    description: "Small helpers you reach for often.",
    content: `export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}`,
  });
  await linkItemToCollection("seed_rp_utils", colReact);

  // --- AI Workflows: 3 prompts ---
  await upsertItem(userId, {
    id: "seed_ai_review",
    title: "Code review prompts",
    itemTypeId: "it_prompt",
    contentType: "text",
    description: "Structured review for PRs.",
    content: `You are a senior engineer. Review the diff for correctness, edge cases, security, and readability. Output: (1) summary (2) blocking issues (3) suggestions (4) test gaps.`,
  });
  await linkItemToCollection("seed_ai_review", colAi);

  await upsertItem(userId, {
    id: "seed_ai_docs",
    title: "Documentation generation",
    itemTypeId: "it_prompt",
    contentType: "text",
    description: "Turn code into clear docs.",
    content: `Given the following module API, produce: README sections (Overview, Install, Quickstart, API), with concise examples. Prefer accurate names from the code.`,
  });
  await linkItemToCollection("seed_ai_docs", colAi);

  await upsertItem(userId, {
    id: "seed_ai_refactor",
    title: "Refactoring assistance",
    itemTypeId: "it_prompt",
    contentType: "text",
    description: "Plan safe refactors.",
    content: `Analyze this function for complexity and coupling. Propose a refactor plan in steps, with risks and a suggested test checklist before each step.`,
  });
  await linkItemToCollection("seed_ai_refactor", colAi);

  // --- DevOps: 1 snippet, 1 command, 2 links ---
  await upsertItem(userId, {
    id: "seed_dev_snippet",
    title: "Docker & CI/CD snippet",
    itemTypeId: "it_snippet",
    contentType: "text",
    language: "dockerfile",
    description: "Multi-stage image sketch.",
    content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
CMD ["node", "server.js"]`,
  });
  await linkItemToCollection("seed_dev_snippet", colDevops);

  await upsertItem(userId, {
    id: "seed_dev_cmd",
    title: "Deployment script",
    itemTypeId: "it_command",
    contentType: "text",
    description: "Example deploy flow.",
    content: `docker build -t app:latest . && docker tag app:latest registry.example.com/app:latest && docker push registry.example.com/app:latest`,
  });
  await linkItemToCollection("seed_dev_cmd", colDevops);

  await upsertItem(userId, {
    id: "seed_dev_link1",
    title: "Docker documentation",
    itemTypeId: "it_link",
    contentType: "url",
    url: "https://docs.docker.com/",
    description: "Official Docker guides and reference.",
  });
  await linkItemToCollection("seed_dev_link1", colDevops);

  await upsertItem(userId, {
    id: "seed_dev_link2",
    title: "Kubernetes documentation",
    itemTypeId: "it_link",
    contentType: "url",
    url: "https://kubernetes.io/docs/home/",
    description: "Official Kubernetes docs.",
  });
  await linkItemToCollection("seed_dev_link2", colDevops);

  // --- Terminal Commands: 4 commands ---
  const terminalItems: ItemUpsert[] = [
    {
      id: "seed_term_git",
      title: "Git operations",
      itemTypeId: "it_command",
      contentType: "text",
      description: "Branching and history.",
      content: `git switch -c feature/foo
git rebase -i HEAD~5
git log --oneline --graph -n 20`,
    },
    {
      id: "seed_term_docker",
      title: "Docker commands",
      itemTypeId: "it_command",
      contentType: "text",
      description: "Containers and images.",
      content: `docker ps -a
docker compose up -d --build
docker system df`,
    },
    {
      id: "seed_term_proc",
      title: "Process management",
      itemTypeId: "it_command",
      contentType: "text",
      description: "Find and inspect processes.",
      content: `# macOS / Linux
lsof -i :3000
ps aux | head`,
    },
    {
      id: "seed_term_pkg",
      title: "Package manager utilities",
      itemTypeId: "it_command",
      contentType: "text",
      description: "npm / pnpm shortcuts.",
      content: `npm outdated
npm ls --depth=0
pnpm why <pkg>`,
    },
  ];
  for (const item of terminalItems) {
    await upsertItem(userId, item);
    await linkItemToCollection(item.id, colTerminal);
  }

  // --- Design Resources: 4 links ---
  const designLinks: ItemUpsert[] = [
    {
      id: "seed_des_tailwind",
      title: "Tailwind CSS documentation",
      itemTypeId: "it_link",
      contentType: "url",
      url: "https://tailwindcss.com/docs",
      description: "CSS/Tailwind references.",
    },
    {
      id: "seed_des_shadcn",
      title: "shadcn/ui",
      itemTypeId: "it_link",
      contentType: "url",
      url: "https://ui.shadcn.com/",
      description: "Component library built on Radix.",
    },
    {
      id: "seed_des_radix",
      title: "Radix UI",
      itemTypeId: "it_link",
      contentType: "url",
      url: "https://www.radix-ui.com/",
      description: "Accessible primitives for design systems.",
    },
    {
      id: "seed_des_lucide",
      title: "Lucide icons",
      itemTypeId: "it_link",
      contentType: "url",
      url: "https://lucide.dev/",
      description: "Icon set used across DevLoot.",
    },
  ];
  for (const item of designLinks) {
    await upsertItem(userId, item);
    await linkItemToCollection(item.id, colDesign);
  }
}

async function main() {
  await seedItemTypes();
  const demoUser = await seedDemoUser();
  await seedCollectionsAndItems(demoUser.id);
  console.log(
    `Seed complete: ${mockItemTypes.length} item types, demo user ${DEMO_EMAIL} (${demoUser.id}), 5 collections, 18 items (per seed-spec).`,
  );
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
