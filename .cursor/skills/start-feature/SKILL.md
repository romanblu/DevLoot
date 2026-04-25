---
name: start-feature
description: Start a new feature branch and set up the feature workflow. Use when the user says start feature, begin feature, create feature branch, or kick off a new task.
---

# Start feature

## Workflow (repo standard)

1. Create a new branch named `feature/<slug>` (or `fix/<slug>` for bugs).
2. Document the feature in `.cursor/rules/current-feature.mdc` (Goals/Notes).
3. Implement the feature with minimal unrelated refactors.

## Preferred commands

- Create branch via script:
  - `npm run feature:start -- "<feature name>"`
- Or manually:
  - `git checkout -b feature/<slug>`

## Output expectations

When starting a feature, output:
- The chosen branch name
- What file(s) you updated for documentation
- The next 1-2 concrete implementation steps
