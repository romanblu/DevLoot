import { spawnSync } from "node:child_process";

function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

run("npm", ["run", "feature:test"]);
run("npm", ["run", "feature:review"]);

console.log("");
console.log("Complete checklist:");
console.log("- Review FEATURE_REVIEW.md (paste into Cursor chat if desired)");
console.log("- Update `.cursor/rules/current-feature.mdc` History + mark status");
console.log("- Ask before committing (per repo rules)");
