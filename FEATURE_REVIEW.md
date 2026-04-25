# Feature review

- Generated: 2026-04-24T08:25:46.792Z
- Branch: `main`

## Working tree
```txt
 M package.json
?? .cursor/skills/
?? scripts/feature/
```

## Diff summary
```txt
 package.json | 7 ++++++-
 1 file changed, 6 insertions(+), 1 deletion(-)
```

## Diff (full)
```diff
diff --git a/package.json b/package.json
index 21d46a6..7048029 100644
--- a/package.json
+++ b/package.json
@@ -13,7 +13,12 @@
     "db:studio": "prisma studio",
     "db:status": "prisma migrate status",
     "db:seed": "prisma db seed",
-    "test:db": "tsx scripts/test-db.ts"
+    "test:db": "tsx scripts/test-db.ts",
+
+    "feature:start": "tsx scripts/feature/start.ts",
+    "feature:test": "npm run lint && npm run build",
+    "feature:review": "tsx scripts/feature/review.ts",
+    "feature:complete": "tsx scripts/feature/complete.ts"
   },
   "dependencies": {
     "@prisma/adapter-pg": "^7.7.0",
```
