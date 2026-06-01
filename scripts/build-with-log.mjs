import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import path from "node:path";

const logPath = path.resolve(process.cwd(), "build.log");
const logStream = createWriteStream(logPath, { flags: "a" });

function logLine(line) {
  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] ${line}\n`);
}

const nextBin = path.resolve(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next"
);

logLine("Starting next build");

const child = spawn(nextBin, ["build", "--debug"], {
  stdio: ["ignore", "pipe", "pipe"],
  env: {
    ...process.env,
    DEBUG: "next:*",
  },
  shell: process.platform === "win32",
  windowsHide: true,
});

child.stdout.on("data", (data) => {
  const text = data.toString().trimEnd();
  if (text) {
    text.split(/\r?\n/).forEach(logLine);
  }
});

child.stderr.on("data", (data) => {
  const text = data.toString().trimEnd();
  if (text) {
    text.split(/\r?\n/).forEach((line) => logLine(`ERR: ${line}`));
  }
});

child.on("close", (code) => {
  logLine(`Build exited with code ${code ?? "unknown"}`);
  logStream.end();
  process.exit(code ?? 1);
});
