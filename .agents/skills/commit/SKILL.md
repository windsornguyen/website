---
name: commit
description: Partition website changes into small Conventional Commit commits. Use when the user asks to commit, checkpoint, save progress, or run /commit.
---

# Commit

## Rules

- Never push unless the user asks.
- Never commit secrets. Treat `.env` as local-only.
- Preserve user edits. If a dirty file has unrelated hunks, stage only the relevant hunks.
- Commit messages are one-line Conventional Commits: `type(scope): summary`.
- Keep the subject under 72 characters. No body unless the user asks.
- Do not use "and" in the subject. Split the commit instead.

## Workflow

1. Inspect:
   - `git status -sb`
   - `git diff`
   - `git diff --staged`
   - `git log --oneline -8`
2. Group changes by intent.
3. Stage precisely with file-level or patch staging.
4. Run fast checks when practical:
   - `pnpm check`
   - `pnpm test`
5. Commit each group separately.
6. Re-check `git status -sb`.

## Commit Types

- `feat`: new user-visible behavior or content.
- `fix`: bug fix.
- `refactor`: behavior-preserving code cleanup.
- `docs`: documentation.
- `test`: tests only.
- `chore`: tooling, config, generated maintenance.
- `ci`: GitHub Actions or deploy plumbing.
