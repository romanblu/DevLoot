<!-- BEGIN:nextjs-agent-rules -->

# Next.js: read bundled docs before coding

Before changing routing, data fetching, config, or APIs, open the **version-matched** docs shipped with this install:

`node_modules/next/dist/docs/`

Training data can lag the framework you have installed; those files are the source of truth for this repo.

<!-- END:nextjs-agent-rules -->

# DevLoot

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links, and custom types.

## Stack

- **Next.js** 16.x (App Router), **React** 19, **TypeScript** (strict)
- **Tailwind CSS** v4
- Path alias: `@/*` → `src/*`

## Project rules (read when planning or implementing)

| File | Purpose |
|------|---------|
| `.cursor/rules/project-overview.mdc` | Product, architecture, invariants, verification |
| `.cursor/rules/coding-standards.mdc` | TypeScript / React / Next conventions |
| `.cursor/rules/ai-interactions.mdc` | Agent scope, tooling, communication |
| `.cursor/rules/current-feature.mdc` | Active feature goal, scope, acceptance criteria |

Add your own instructions **outside** the `nextjs-agent-rules` markers above so future Next.js tooling can update only that block.

## Layout

- App routes and UI: `src/app/`
- Shared code: prefer `src/lib/`, `src/components/` as the app grows

## Commands

- `npm run dev` — local dev server
- `npm run lint` — ESLint (`eslint-config-next`)
- `npm run build` — production build + type check via Next
- `npm run start` — run production build locally
