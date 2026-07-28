#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_PORT="${DOCKER_PORT:-3030}"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}"
IMAGE_NAME="${DOCKER_IMAGE:-cvforge:check}"
CONTAINER_NAME="cvforge-check-${$}-${RANDOM}"
BASE_URL="http://127.0.0.1:${DOCKER_PORT}"

if [[ ! "${DOCKER_PORT}" =~ ^[0-9]+$ ]] || (( DOCKER_PORT < 1 || DOCKER_PORT > 65535 )); then
  echo "DOCKER_PORT must be an available port between 1 and 65535." >&2
  exit 1
fi
if ! node - "127.0.0.1" "${DOCKER_PORT}" <<'NODE'
const net = require('node:net')
const [host, rawPort] = process.argv.slice(2)
const server = net.createServer()
server.once('error', () => process.exit(1))
server.listen(Number(rawPort), host, () => server.close(() => process.exit(0)))
NODE
then
  echo "Port ${DOCKER_PORT} is already in use; refusing to affect the existing process." >&2
  exit 1
fi

cleanup() {
  docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
}
trap cleanup EXIT
trap 'exit 130' INT TERM HUP

echo "Building ${IMAGE_NAME} for ${SITE_URL}..."
docker build \
  --build-arg "NEXT_PUBLIC_SITE_URL=${SITE_URL}" \
  --build-arg "RELEASE_ID=${RELEASE_ID:-local-check}" \
  --tag "${IMAGE_NAME}" \
  "${REPOSITORY_ROOT}"

echo "Starting isolated validation container ${CONTAINER_NAME} on ${BASE_URL}..."
docker run --detach \
  --name "${CONTAINER_NAME}" \
  --publish "127.0.0.1:${DOCKER_PORT}:3000" \
  --env "HOSTNAME=0.0.0.0" \
  --env "PORT=3000" \
  "${IMAGE_NAME}" >/dev/null

ready=0
consecutive_ready=0
for _attempt in $(seq 1 60); do
  if node -e "fetch('${BASE_URL}/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"; then
    consecutive_ready=$((consecutive_ready + 1))
    if [[ "${consecutive_ready}" -ge 2 ]]; then
      ready=1
      break
    fi
  else
    consecutive_ready=0
  fi
  sleep 1
done
if [[ "${ready}" != "1" ]]; then
  echo "CVForge did not become ready within 60 seconds." >&2
  docker logs --tail 100 "${CONTAINER_NAME}" >&2 || true
  exit 1
fi

node - "${BASE_URL}" <<'NODE'
const base = process.argv[2];

async function fetchWithRetry(path, options) {
  let lastError
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(base + path, options)
      if (response.status < 500 || attempt === 5) return response
      lastError = new Error(`${path} returned transient status ${response.status}`)
    } catch (error) {
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * attempt))
  }
  throw lastError
}

(async () => {
  const ok = [
    '/', '/builder', '/analyzer', '/health', '/robots.txt', '/sitemap.xml',
    '/site.webmanifest', '/opengraph-image',
  ]
  for (const path of ok) {
    const response = await fetchWithRetry(path)
    if (!response.ok) throw new Error(`${path} returned ${response.status}`)
    console.log(response.status, path)
  }
  for (const [path, status, location] of [
    ['/parser', 308, '/analyzer'],
    ['/resume-import', 307, '/builder'],
  ]) {
    const response = await fetchWithRetry(path, { redirect: 'manual' })
    if (response.status !== status || response.headers.get('location') !== location) {
      throw new Error(`${path} redirect mismatch: ${response.status} ${response.headers.get('location')}`)
    }
    console.log(response.status, path, '->', location)
  }
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
NODE

echo "Docker validation passed; the isolated container will now be removed."
