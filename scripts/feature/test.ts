import { spawnSync } from "node:child_process";

function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

run("npm", ["run", "lint"]);
run("npm", ["run", "build"]);
