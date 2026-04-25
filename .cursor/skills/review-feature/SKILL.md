---
name: review-feature
description: Write a clear review explaining what a feature does and how well it was implemented (correctness, DX, security, performance, tests). Use when the user says review feature, explain the feature, or assess implementation quality.
---

# Review feature

## Inputs to gather

- `.cursor/rules/current-feature.mdc` (goal + acceptance criteria)
- The code diff on the current branch
- Any relevant UI routes/screens touched

## Preferred command

- Generate a diff report:
  - `npm run feature:review` (writes `FEATURE_REVIEW.md`)

## Review format

Use this structure:

### Summary
- What the feature does (1-3 bullets)

### What changed
- Key files/modules touched
- Data flow or API changes (if any)

### Quality assessment
- Correctness & edge cases
- Security & auth checks (if applicable)
- Performance (rerenders, query patterns, caching)
- Maintainability (readability, consistency with repo patterns)

### Test status
- `npm run feature:test`: pass/fail and what was fixed

### Follow-ups (optional)
- Small, non-scope-creep improvements that are safe to defer
