import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

function runCapture(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { encoding: "utf8", shell: true });
  if (res.status !== 0) {
    process.stderr.write(res.stderr || "");
    process.exit(res.status ?? 1);
  }
  return (res.stdout || "").trimEnd();
}

const now = new Date().toISOString();
const branch = runCapture("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
const status = runCapture("git", ["status", "--porcelain=v1"]);
const summary = runCapture("git", ["diff", "--stat"]);
const diff = runCapture("git", ["diff"]);

const body = [
  `# Feature review`,
  ``,
  `- Generated: ${now}`,
  `- Branch: \`${branch}\``,
  ``,
  `## Working tree`,
  status ? "```txt\n" + status + "\n```" : "_Clean_",
  ``,
  `## Diff summary`,
  summary ? "```txt\n" + summary + "\n```" : "_No diff_",
  ``,
  `## Diff (full)`,
  diff ? "```diff\n" + diff + "\n```" : "_No diff_",
  ``,
].join("\n");

writeFileSync("FEATURE_REVIEW.md", body, "utf8");
console.log("Wrote FEATURE_REVIEW.md");
