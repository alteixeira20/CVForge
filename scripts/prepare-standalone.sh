#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_ROOT="${REPOSITORY_ROOT}/apps/web"
STANDALONE_ROOT="${WEB_ROOT}/.next/standalone/apps/web"

if [[ ! -f "${STANDALONE_ROOT}/server.js" ]]; then
  echo "Standalone server is missing. Run a production build first." >&2
  exit 1
fi
if [[ ! -d "${WEB_ROOT}/public" || ! -d "${WEB_ROOT}/.next/static" ]]; then
  echo "Public or .next/static assets are missing." >&2
  exit 1
fi

rm -rf "${STANDALONE_ROOT}/public" "${STANDALONE_ROOT}/.next/static"
mkdir -p "${STANDALONE_ROOT}/.next"
cp -R "${WEB_ROOT}/public" "${STANDALONE_ROOT}/public"
cp -R "${WEB_ROOT}/.next/static" "${STANDALONE_ROOT}/.next/static"

echo "Standalone assets prepared at ${STANDALONE_ROOT}."
