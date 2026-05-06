---
name: promote
description: Create a changelog-style PR from the current website branch by scraping Conventional Commits. Use when the user asks to promote, ship a feature branch, or run /promote.
allowed-tools: Bash(pnpm ship pr *)
argument-hint: "[--base main] [--head branch] [--dry-run]"
---

# Promote

## Purpose

Create a PR whose body is generated from the branch's Conventional Commits.

This is for feature branches into `main`. It is not a release promotion.
Release PRs are handled by release-please after commits land on `main`.

## Command

Run:

```bash
pnpm ship pr $ARGUMENTS
```

Useful variants:

```bash
pnpm ship pr --dry-run
pnpm ship pr --base main
pnpm ship pr --base main --head feat/comments
```

If the command fails, report the error and stop. If it succeeds, return the PR URL.
