#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-}"
DOCKER_PORT="${DOCKER_PORT:-3030}"
CURRENT_STEP="initialization"

finish() {
  status=$?
  if [[ "${status}" -eq 0 ]]; then
    echo
    echo "RELEASE CHECK PASSED"
    echo "Origin: ${SITE_URL}"
    echo "Docker port: ${DOCKER_PORT}"
  else
    echo
    echo "RELEASE CHECK FAILED during: ${CURRENT_STEP}" >&2
  fi
}
trap finish EXIT
trap 'exit 130' INT TERM HUP

CURRENT_STEP="production origin validation"
node - "${SITE_URL}" "${ALLOW_INVALID_SITE_URL:-0}" <<'NODE'
const [value, allowInvalid] = process.argv.slice(2)
if (!value) throw new Error('NEXT_PUBLIC_SITE_URL is required for release-check.')
const blocked = ['YOUR-CONFIRMED-DOMAIN', 'replace-with-confirmed-production-origin', 'YOUR_PRODUCTION_ORIGIN']
if (blocked.some((item) => value.includes(item))) throw new Error('Production origin contains a placeholder.')
const url = new URL(value)
if (url.protocol !== 'https:') throw new Error('Production release-check requires an https origin.')
if (url.pathname !== '/' || url.search || url.hash) throw new Error('Production origin must not include a path, query, or fragment.')
if (['localhost', '127.0.0.1', '::1'].includes(url.hostname)) throw new Error('Production origin must not use localhost.')
if (url.hostname.endsWith('.invalid') && allowInvalid !== '1') {
  throw new Error('.invalid is allowed only when ALLOW_INVALID_SITE_URL=1 is explicitly set for CI.')
}
NODE

cd "${REPOSITORY_ROOT}"

CURRENT_STEP="frozen dependency install"
pnpm install --frozen-lockfile

CURRENT_STEP="em dash policy"
pnpm check:em-dash

CURRENT_STEP="commit message policy"
pnpm check:commits

CURRENT_STEP="lint"
pnpm lint

CURRENT_STEP="TypeScript"
pnpm typecheck

CURRENT_STEP="production build"
NEXT_PUBLIC_SITE_URL="${SITE_URL}" pnpm build
bash scripts/prepare-standalone.sh

CURRENT_STEP="production artifact assertions"
NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
  ALLOW_INVALID_SITE_URL="${ALLOW_INVALID_SITE_URL:-0}" \
  bash scripts/assert-release-artifacts.sh

CURRENT_STEP="production dependency audit"
pnpm audit-prod

CURRENT_STEP="unit tests"
pnpm test:unit

CURRENT_STEP="required Playwright browsers"
pnpm --filter web exec playwright install chromium firefox webkit

CURRENT_STEP="Chromium and axe validation"
pnpm test:e2e:chromium

CURRENT_STEP="Firefox and WebKit critical smoke"
bash scripts/cross-browser-check.sh

CURRENT_STEP="Docker validation"
NEXT_PUBLIC_SITE_URL="${SITE_URL}" DOCKER_PORT="${DOCKER_PORT}" bash scripts/docker-check.sh
