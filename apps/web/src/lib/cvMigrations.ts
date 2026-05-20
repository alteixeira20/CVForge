import { CURRENT_CV_SCHEMA_VERSION } from '@/types/cv'

// Numeric semver comparison to avoid string-sort pitfalls (e.g. '1.0.10' vs '1.0.9').
// Returns negative if a < b, 0 if equal, positive if a > b.
function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (diff !== 0) return diff
  }
  return 0
}

/**
 * Runs before parseCVState/Zod validation on any externally-sourced CV state
 * (localStorage restore, JSON import, PDF attachment restore).
 *
 * - Not an object: returned unchanged so Zod fails safely.
 * - Newer than current: returned unchanged; Zod validation will fail naturally
 *   and the caller surfaces it as an import error.
 * - Already current: returned unchanged.
 * - Missing schemaVersion or older: stamps schemaVersion and applies any
 *   ordered field migrations needed up to the current version.
 */
export function migrateCVState(input: unknown): unknown {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return input

  const obj = input as Record<string, unknown>
  const version = typeof obj.schemaVersion === 'string' ? obj.schemaVersion : null

  if (version !== null && compareVersions(version, CURRENT_CV_SCHEMA_VERSION) > 0) {
    // State is from a newer build - do not attempt downgrade.
    return input
  }

  if (version === CURRENT_CV_SCHEMA_VERSION) {
    return input
  }

  // version is null (missing) or an older semver string.
  // Apply migrations in ascending order. Zod .default() handles missing fields
  // within each sub-schema, so individual field migrations are only needed for
  // renamed or structurally changed fields.
  let state = { ...obj }

  // v0 -> v1.0.0
  // No field renames or removals were made at this version. The only
  // normalization needed is stamping schemaVersion so future migrations
  // can rely on it being present.
  state = { ...state, schemaVersion: CURRENT_CV_SCHEMA_VERSION }

  return state
}
