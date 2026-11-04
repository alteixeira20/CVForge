import { describe, expect, it } from 'vitest'
import { resolveEntryLink } from './resolveEntryLink'

describe('resolveEntryLink', () => {
  it('returns null for empty, whitespace, or absent input', () => {
    expect(resolveEntryLink(undefined)).toBeNull()
    expect(resolveEntryLink(null)).toBeNull()
    expect(resolveEntryLink('')).toBeNull()
    expect(resolveEntryLink('   ')).toBeNull()
  })

  it('returns a valid HTTPS URL unchanged', () => {
    expect(resolveEntryLink('https://github.com/user/repo')).toBe('https://github.com/user/repo')
    expect(resolveEntryLink('https://example.com/path?q=1')).toBe('https://example.com/path?q=1')
  })

  it('returns a valid HTTP URL unchanged', () => {
    expect(resolveEntryLink('http://intranet.local/page')).toBe('http://intranet.local/page')
  })

  it('prepends https:// to scheme-less GitHub-style URLs', () => {
    expect(resolveEntryLink('github.com/user/repo')).toBe('https://github.com/user/repo')
    expect(resolveEntryLink('www.example.com')).toBe('https://www.example.com/')
  })

  it('prepends https:// to bare domain-like strings', () => {
    expect(resolveEntryLink('acme.com')).toBe('https://acme.com/')
    expect(resolveEntryLink('company.io/careers')).toBe('https://company.io/careers')
  })

  it('rejects javascript: and data: protocols', () => {
    expect(resolveEntryLink('javascript:alert(1)')).toBeNull()
    expect(resolveEntryLink('data:text/html,<script>evil</script>')).toBeNull()
    expect(resolveEntryLink('file:///etc/passwd')).toBeNull()
    expect(resolveEntryLink('ftp://ftp.example.com')).toBeNull()
  })

  it('rejects malformed or hostless values', () => {
    expect(resolveEntryLink('not a url at all')).toBeNull()
    expect(resolveEntryLink('://noscheme')).toBeNull()
  })

  it('handles trailing whitespace around a valid URL', () => {
    expect(resolveEntryLink('  https://github.com/user/repo  ')).toBe('https://github.com/user/repo')
  })
})
