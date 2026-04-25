---
name: test-feature
description: Run the standard repo checks for a feature (lint + build) and fix failures. Use when the user says test feature, run checks, verify build, or make sure it passes CI.
---

# Test feature

## Standard verification

Run:
- `npm run feature:test` (preferred)

This runs:
- `npm run lint`
- `npm run build` (includes `prisma generate && next build`)

## Fix loop

If a check fails:
1. Read the error output carefully.
2. Fix the smallest cause.
3. Re-run `npm run feature:test`.

## Output expectations

Return:
- What failed (lint/build)
- The root cause you found
- The exact changes you made to fix it
