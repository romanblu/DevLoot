import { spawnSync } from "node:child_process";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

const rawName = process.argv.slice(2).join(" ").trim();
if (!rawName) {
  console.error('Usage: npm run feature:start -- "<feature name>"');
  process.exit(1);
}

const slug = slugify(rawName);
const branch = `feature/${slug || "feature"}`;

run("git", ["status"]);
run("git", ["checkout", "-b", branch]);

console.log("");
console.log(`Created branch: ${branch}`);
console.log("");
console.log("Next steps:");
console.log("- Update `.cursor/rules/current-feature.mdc` (Goals/Notes)");
console.log("- Implement the feature");
console.log("- Run: npm run feature:test");
