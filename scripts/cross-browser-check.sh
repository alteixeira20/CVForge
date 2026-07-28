#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLAYWRIGHT_IMAGE="mcr.microsoft.com/playwright:v1.62.0-noble"
OUTPUT_LOG="$(mktemp)"

cleanup() {
  unlink "${OUTPUT_LOG}" 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT TERM HUP

cd "${REPOSITORY_ROOT}"
set +e
pnpm test:e2e:cross-browser 2>&1 | tee "${OUTPUT_LOG}"
native_status=${PIPESTATUS[0]}
set -e
if [[ "${native_status}" -eq 0 ]]; then
  exit 0
fi

if ! rg -i \
  "host system is missing dependencies|error while loading shared libraries|browser closed.*missing" \
  "${OUTPUT_LOG}" >/dev/null; then
  echo "Cross-browser tests failed for an application or test reason; Docker fallback was not used." >&2
  exit "${native_status}"
fi

echo "Native Firefox/WebKit launch dependencies are unavailable; retrying in ${PLAYWRIGHT_IMAGE}."
docker run --rm --ipc=host \
  --user "$(id -u):$(id -g)" \
  --env HOME=/tmp \
  --env CI=1 \
  --volume "${REPOSITORY_ROOT}:/work" \
  --workdir /work \
  "${PLAYWRIGHT_IMAGE}" \
  bash -lc "corepack pnpm@10.5.2 --filter web exec playwright test --project=firefox-smoke --project=webkit-smoke"
