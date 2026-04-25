---
name: complete-feature
description: Finish a feature by running checks, producing a review summary, updating current-feature history, and preparing to commit/merge (without committing automatically). Use when the user says complete feature, finish up, or prepare to merge.
---

# Complete feature

## Completion steps (repo standard)

1. Run repo checks:
   - `npm run feature:test`
2. Generate a review artifact:
   - `npm run feature:review` (creates `FEATURE_REVIEW.md`)
3. Update `.cursor/rules/current-feature.mdc`:
   - Mark status (Completed)
   - Add a dated History entry describing what shipped
4. Ask before committing, and only commit once build passes.

## Output expectations

Return:
- Check results
- A short “what shipped” summary
- Any known limitations / deferred work
