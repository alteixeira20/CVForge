#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_ROOT="${REPOSITORY_ROOT}/apps/web/.next"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-}"
ALLOW_INVALID="${ALLOW_INVALID_SITE_URL:-0}"

if [[ ! -d "${BUILD_ROOT}/server" || ! -d "${BUILD_ROOT}/static" ]]; then
  echo "Production artifacts are missing. Run pnpm build first." >&2
  exit 1
fi

scan_roots=("${BUILD_ROOT}/server" "${BUILD_ROOT}/static")
[[ -d "${BUILD_ROOT}/standalone" ]] && scan_roots+=("${BUILD_ROOT}/standalone")

blocked_patterns=(
  "localhost:3000"
  "YOUR-CONFIRMED-DOMAIN"
  "replace-with-confirmed-production-origin"
  "YOUR_PRODUCTION_ORIGIN"
  "https://cvforge.example.com"
)

for pattern in "${blocked_patterns[@]}"; do
  if rg -uuu -g '!**/node_modules/**' -F -l -- "${pattern}" "${scan_roots[@]}" >/dev/null; then
    echo "Release artifact assertion failed: found blocked value '${pattern}'." >&2
    exit 1
  fi
done

if [[ "${ALLOW_INVALID}" != "1" ]] \
  && rg -uuu -g '!**/node_modules/**' -F -l -- "https://cvforge.example.invalid" "${scan_roots[@]}" >/dev/null; then
  echo "Release artifact assertion failed: CI-only canonical origin found in a production build." >&2
  exit 1
fi

if [[ -z "${SITE_URL}" ]] || ! rg -uuu -g '!**/node_modules/**' -F -l -- "${SITE_URL}" "${scan_roots[@]}" >/dev/null; then
  echo "Release artifact assertion failed: expected canonical origin '${SITE_URL}' was not found." >&2
  exit 1
fi

echo "Release artifacts contain the expected origin and no blocked placeholders."
