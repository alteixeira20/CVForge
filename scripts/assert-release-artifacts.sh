#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_ROOT="${REPOSITORY_ROOT}/apps/web/.next"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-}"
ALLOW_INVALID="${ALLOW_INVALID_SITE_URL:-0}"

node - "${BUILD_ROOT}" "${SITE_URL}" "${ALLOW_INVALID}" <<'NODE'
const fs = require('node:fs')
const path = require('node:path')

const [buildRoot, siteUrl, allowInvalid] = process.argv.slice(2)
const requiredRoots = ['server', 'static'].map((name) => path.join(buildRoot, name))
if (requiredRoots.some((root) => !fs.existsSync(root))) {
  throw new Error('Production artifacts are missing. Run pnpm build first.')
}

const standaloneRoot = path.join(buildRoot, 'standalone')
const scanRoots = fs.existsSync(standaloneRoot)
  ? [...requiredRoots, standaloneRoot]
  : requiredRoots
const blocked = [
  'localhost:3000',
  'YOUR-CONFIRMED-DOMAIN',
  'replace-with-confirmed-production-origin',
  'YOUR_PRODUCTION_ORIGIN',
  'https://cvforge.example.com',
]
if (allowInvalid !== '1') blocked.push('https://cvforge.example.invalid')
if (!siteUrl) throw new Error('NEXT_PUBLIC_SITE_URL is required for artifact assertions.')

let expectedOriginFound = false
const expectedOrigin = Buffer.from(siteUrl)
const blockedBuffers = blocked.map((value) => [value, Buffer.from(value)])

function scanDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      scanDirectory(entryPath)
      continue
    }
    if (!entry.isFile()) continue
    const contents = fs.readFileSync(entryPath)
    expectedOriginFound ||= contents.includes(expectedOrigin)
    for (const [value, pattern] of blockedBuffers) {
      if (contents.includes(pattern)) {
        throw new Error(`Release artifact assertion failed: found blocked value '${value}'.`)
      }
    }
  }
}

scanRoots.forEach(scanDirectory)
if (!expectedOriginFound) {
  throw new Error(`Release artifact assertion failed: expected canonical origin '${siteUrl}' was not found.`)
}
NODE

echo "Release artifacts contain the expected origin and no blocked placeholders."
