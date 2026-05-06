---
name: pr
description: Create a GitHub pull request for a website feature branch. Use when the user asks to open a PR, create a pull request, or run /pr.
---

# Pull Request

## Rules

- Push only when the user asks.
- Use `gh` for GitHub operations.
- Do not force-push unless the user explicitly asks.
- The PR title is a Conventional Commit style title.
- The PR body is short and concrete: summary, test plan, risks.

## Workflow

1. Inspect:
   - `git status -sb`
   - `git diff`
   - `git diff --staged`
   - `git log --oneline origin/main..HEAD`
2. If the working tree is dirty, ask whether to commit it or leave it out.
3. Ensure the branch is pushed:
   - `git push -u origin HEAD`
4. Create the PR:
   - `gh pr create --base main --head HEAD --title "type(scope): summary" --body "..."`
5. Return the PR URL.

## Body Shape

```markdown
## Summary

- What changed.
- Why it changed.

## Test plan

- [ ] `pnpm check`
- [ ] `pnpm test`
- [ ] Preview deployment smoke test

## Notes

- Any rollout or env-var notes.
```
