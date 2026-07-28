#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_ROOT="${REPOSITORY_ROOT}/apps/web"
SERVER_PATH="${WEB_ROOT}/.next/standalone/apps/web/server.js"
PID_DIR="${REPOSITORY_ROOT}/.pids"
LOG_DIR="${REPOSITORY_ROOT}/.logs"
PID_FILE="${PID_DIR}/preview.pid"
META_FILE="${PID_DIR}/preview.meta"
LOG_FILE="${LOG_DIR}/preview.log"
PREVIEW_PORT="${PREVIEW_PORT:-3030}"
PREVIEW_HOST="${PREVIEW_HOST:-127.0.0.1}"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://cvforge.alexandreteixeira.dev}"
PREVIEW_URL="http://${PREVIEW_HOST}:${PREVIEW_PORT}"

process_start_time() {
  sed -E 's/^[0-9]+ \(.*\) //' "/proc/$1/stat" 2>/dev/null | awk '{print $20}'
}

port_is_available() {
  node - "${PREVIEW_HOST}" "${PREVIEW_PORT}" <<'NODE'
const net = require('node:net')
const [host, rawPort] = process.argv.slice(2)
const server = net.createServer()
server.once('error', () => process.exit(1))
server.listen(Number(rawPort), host, () => server.close(() => process.exit(0)))
NODE
}

is_owned_process() {
  [[ -f "${PID_FILE}" && -f "${META_FILE}" ]] || return 1
  local pid stored_start current_start
  pid="$(<"${PID_FILE}")"
  [[ "${pid}" =~ ^[0-9]+$ ]] || return 1
  kill -0 "${pid}" 2>/dev/null || return 1
  stored_start="$(<"${META_FILE}")"
  current_start="$(process_start_time "${pid}")"
  [[ -n "${current_start}" && "${stored_start}" == "${current_start}" ]]
}

stop_preview() {
  if ! is_owned_process; then
    if [[ -f "${PID_FILE}" || -f "${META_FILE}" ]]; then
      echo "Preview PID metadata is stale or does not match CVForge; no process was stopped."
      rm -f "${PID_FILE}" "${META_FILE}"
    else
      echo "Production preview is not running."
    fi
    return 0
  fi

  local pid
  pid="$(<"${PID_FILE}")"
  echo "Stopping CVForge production preview (PID ${pid})..."
  kill -TERM -- "-${pid}" 2>/dev/null || kill -TERM "${pid}" 2>/dev/null || true
  for _attempt in $(seq 1 20); do
    kill -0 "${pid}" 2>/dev/null || break
    sleep 0.25
  done
  if kill -0 "${pid}" 2>/dev/null; then
    kill -KILL -- "-${pid}" 2>/dev/null || kill -KILL "${pid}" 2>/dev/null || true
  fi
  rm -f "${PID_FILE}" "${META_FILE}"
  echo "Production preview stopped."
}

case "${1:-}" in
  build)
    cd "${REPOSITORY_ROOT}"
    NEXT_PUBLIC_SITE_URL="${SITE_URL}" pnpm build
    bash scripts/prepare-standalone.sh
    NEXT_PUBLIC_SITE_URL="${SITE_URL}" bash scripts/assert-release-artifacts.sh
    echo "Production preview build is ready for ${SITE_URL}."
    ;;
  start)
    if [[ ! -f "${SERVER_PATH}" || ! -d "${WEB_ROOT}/.next/standalone/apps/web/.next/static" ]]; then
      echo "Prepared standalone output is missing. Run 'make preview-build' first." >&2
      exit 1
    fi
    if is_owned_process; then
      echo "Production preview is already running at ${PREVIEW_URL}."
      exit 0
    fi
    if ! port_is_available; then
      echo "Port ${PREVIEW_PORT} is already occupied; refusing to stop or replace that process." >&2
      exit 1
    fi
    mkdir -p "${PID_DIR}" "${LOG_DIR}"
    : > "${LOG_FILE}"
    setsid env \
      NODE_ENV=production \
      HOSTNAME="${PREVIEW_HOST}" \
      PORT="${PREVIEW_PORT}" \
      NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
      node "${SERVER_PATH}" >>"${LOG_FILE}" 2>&1 &
    preview_pid=$!
    echo "${preview_pid}" > "${PID_FILE}"
    process_start_time "${preview_pid}" > "${META_FILE}"
    ready=0
    for _attempt in $(seq 1 40); do
      if ! kill -0 "${preview_pid}" 2>/dev/null; then
        break
      fi
      if node -e "fetch('${PREVIEW_URL}/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"; then
        ready=1
        break
      fi
      sleep 0.25
    done
    if [[ "${ready}" != "1" ]]; then
      echo "Production preview failed to become ready. See ${LOG_FILE}." >&2
      stop_preview
      exit 1
    fi
    echo "CVForge standalone production preview started."
    echo "Test URL: ${PREVIEW_URL}"
    echo "Canonical origin embedded at build time: ${SITE_URL}"
    echo "Logs: ${LOG_FILE}"
    ;;
  stop)
    stop_preview
    ;;
  status)
    if is_owned_process; then
      echo "Production preview: running (PID $(<"${PID_FILE}"))"
      echo "Test URL: ${PREVIEW_URL}"
      echo "Canonical origin: ${SITE_URL}"
    else
      echo "Production preview: stopped"
    fi
    ;;
  logs)
    if [[ ! -f "${LOG_FILE}" ]]; then
      echo "Preview log does not exist. Run 'make preview-start' first." >&2
      exit 1
    fi
    tail -n 100 -f "${LOG_FILE}"
    ;;
  *)
    echo "Usage: scripts/preview.sh {build|start|stop|status|logs}" >&2
    exit 2
    ;;
esac
