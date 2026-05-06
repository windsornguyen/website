#!/usr/bin/env bash
# Usage:
#   pnpm ship pr [--base main] [--head current-branch] [--dry-run]
set -euo pipefail

target="${1:-}"
shift || true

case "$target" in
  pr | promote)
    tsx scripts/promote.ts "$@"
    ;;

  *)
    echo "Usage: pnpm ship <pr|promote> [--base main] [--head branch] [--dry-run]" >&2
    exit 1
    ;;
esac
