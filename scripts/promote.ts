#!/usr/bin/env -S tsx
// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { spawnSync } from "node:child_process";

type ChangelogSection =
  | "Features"
  | "Bug Fixes"
  | "Refactors"
  | "Performance"
  | "Documentation"
  | "Tests"
  | "Chores";

type ConventionalCommitType = keyof typeof TYPE_TO_SECTION;

type ParsedCommit = {
  section: ChangelogSection;
  bullet: string;
};

const SECTION_ORDER: readonly ChangelogSection[] = [
  "Features",
  "Bug Fixes",
  "Refactors",
  "Performance",
  "Documentation",
  "Tests",
  "Chores",
];

const TYPE_TO_SECTION = {
  feat: "Features",
  fix: "Bug Fixes",
  refactor: "Refactors",
  perf: "Performance",
  docs: "Documentation",
  test: "Tests",
  chore: "Chores",
  ci: "Chores",
  style: "Chores",
} as const satisfies Record<string, ChangelogSection>;

const scopedCommitPattern = /^([a-z]+)\(([^)]+)\):\s+(.+)$/;
const unscopedCommitPattern = /^([a-z]+):\s+(.+)$/;

function readFlag(name: string, fallback: string): string {
  const index = process.argv.indexOf(name);

  if (index === -1) {
    return fallback;
  }

  const value = process.argv[index + 1];
  if (!value) {
    throw new Error(`Missing value for ${name}`);
  }

  return value;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function run(program: string, args: string[]): string {
  const result = spawnSync(program, args, {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
  });

  if (result.status === 0) {
    return result.stdout.trim();
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  const exitCode = result.status ?? 1;
  throw new Error(`${program} failed with exit code ${exitCode}`);
}

function runPassthrough(program: string, args: string[]): void {
  const result = spawnSync(program, args, {
    stdio: "inherit",
  });

  if (result.status === 0) {
    return;
  }

  const exitCode = result.status ?? 1;
  throw new Error(`${program} failed with exit code ${exitCode}`);
}

function repositorySlug(): string {
  const remoteUrl = run("git", ["remote", "get-url", "origin"]);
  const httpsMatch = remoteUrl.match(/^https:\/\/github\.com\/(.+?)(?:\.git)?$/);

  if (httpsMatch) {
    return httpsMatch[1];
  }

  const sshMatch = remoteUrl.match(/^git@github\.com:(.+?)(?:\.git)?$/);
  if (sshMatch) {
    return sshMatch[1];
  }

  throw new Error(`Could not parse GitHub repository from origin URL: ${remoteUrl}`);
}

function currentBranch(): string {
  const branch = run("git", ["branch", "--show-current"]);

  if (!branch) {
    throw new Error("Could not determine current branch.");
  }

  return branch;
}

function isKnownType(value: string): value is ConventionalCommitType {
  return value in TYPE_TO_SECTION;
}

function parseCommit(repo: string, line: string): ParsedCommit {
  const firstSpace = line.indexOf(" ");
  const hash = line.slice(0, firstSpace);
  const subject = line.slice(firstSpace + 1);
  const shortHash = hash.slice(0, 7);
  const commitUrl = `https://github.com/${repo}/commit/${hash}`;

  const scopedMatch = subject.match(scopedCommitPattern);
  if (scopedMatch) {
    const rawType = scopedMatch[1];
    const section = isKnownType(rawType) ? TYPE_TO_SECTION[rawType] : "Chores";
    const scope = scopedMatch[2];
    const description = scopedMatch[3];
    const bullet = `- **${scope}:** ${description} ([${shortHash}](${commitUrl}))`;

    return { section, bullet };
  }

  const unscopedMatch = subject.match(unscopedCommitPattern);
  if (unscopedMatch) {
    const rawType = unscopedMatch[1];
    const section = isKnownType(rawType) ? TYPE_TO_SECTION[rawType] : "Chores";
    const description = unscopedMatch[2];
    const bullet = `- ${description} ([${shortHash}](${commitUrl}))`;

    return { section, bullet };
  }

  return {
    section: "Chores",
    bullet: `- ${subject} ([${shortHash}](${commitUrl}))`,
  };
}

function commitLines(base: string, head: string): string[] {
  const output = run("git", ["log", "--format=%H %s", `${base}..${head}`]);

  if (!output) {
    return [];
  }

  return output.split("\n");
}

function buildPrBody(repo: string, base: string, head: string, commits: string[]): string {
  const sections: Partial<Record<ChangelogSection, string[]>> = {};

  for (const line of commits) {
    const parsed = parseCommit(repo, line);
    const existing = sections[parsed.section] ?? [];
    existing.push(parsed.bullet);
    sections[parsed.section] = existing;
  }

  const lines: string[] = [
    "## Summary",
    "",
    `Changes from \`${base}\` to \`${head}\`, grouped by conventional commit type.`,
    "",
    `Full diff: [${base}...${head}](https://github.com/${repo}/compare/${base}...${head})`,
  ];

  for (const section of SECTION_ORDER) {
    const bullets = sections[section];
    if (!bullets || bullets.length === 0) {
      continue;
    }

    lines.push("", `## ${section}`, "");
    lines.push(...bullets);
  }

  lines.push(
    "",
    "## Test plan",
    "",
    "- [ ] `pnpm check`",
    "- [ ] `pnpm test`",
    "- [ ] Preview deployment smoke test",
  );

  const body = lines.join("\n");

  return body;
}

function prTitle(head: string): string {
  const cleaned = head
    .replace(/^feat\//, "")
    .replace(/^fix\//, "")
    .replace(/^chore\//, "")
    .replace(/-/g, " ");

  return `chore: promote ${cleaned}`;
}

function main(): void {
  const base = readFlag("--base", "main");
  const head = readFlag("--head", currentBranch());
  const dryRun = hasFlag("--dry-run");
  const repo = repositorySlug();

  runPassthrough("git", ["fetch", "origin", base]);

  const commits = commitLines(`origin/${base}`, head);
  if (commits.length === 0) {
    throw new Error(`${head} has no commits to promote over ${base}.`);
  }

  const body = buildPrBody(repo, base, head, commits);

  if (dryRun) {
    process.stdout.write(`${body}\n`);
    return;
  }

  runPassthrough("git", ["push", "-u", "origin", head]);

  const title = readFlag("--title", prTitle(head));
  const url = run("gh", [
    "pr",
    "create",
    "--repo",
    repo,
    "--base",
    base,
    "--head",
    head,
    "--title",
    title,
    "--body",
    body,
  ]);

  process.stdout.write(`${url}\n`);
}

main();
