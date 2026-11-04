/**
 * Normalizes a user-supplied entry link to an absolute HTTPS URL suitable for
 * use as a PDF hyperlink annotation, or returns null when the value is absent,
 * unsafe, or malformed.
 *
 * Accepted inputs:
 *   - Scheme-prefixed HTTPS/HTTP URLs: returned verbatim (HTTP is kept as-is
 *     because some intranet/company URLs are HTTP-only).
 *   - Scheme-less GitHub/host-like strings such as "github.com/user/repo" or
 *     "www.example.com": scheme "https://" is prepended.
 *
 * Rejected inputs:
 *   - Empty or whitespace-only strings.
 *   - Any non-HTTP/HTTPS protocol ("javascript:", "data:", "file:", etc.).
 *   - Strings that cannot be parsed as a valid URL after normalization.
 */
export function resolveEntryLink(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null

  // Reject any explicit non-http/https scheme (javascript:, data:, file:, ...).
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(trimmed) && !/^https?:/i.test(trimmed)) {
    return null
  }

  // Prepend scheme for scheme-less host-like strings.
  const withScheme = /^https?:/i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const parsed = new URL(withScheme)
    // Confirm the resolved protocol is safe.
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
    // Require a non-empty hostname to reject bare-scheme or invalid inputs.
    if (!parsed.hostname) return null
    return parsed.href
  } catch {
    return null
  }
}
