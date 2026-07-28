import { File } from 'node:buffer'
import { describe, expect, it } from 'vitest'
import { isCurrentAnalysisRequest } from '@/features/parser/upload/analysisRequestGuard'
import { MAX_ANALYSIS_FILE_BYTES, MAX_ANALYSIS_PAGES } from './analysisLimits'
import { validateAnalysisFile, validateAnalysisPageCount } from './analysisFileValidation'

describe('analysis file validation', () => {
  it('accepts a PDF extension, MIME type, and magic signature', async () => {
    expect(await validateAnalysisFile(pdfFile())).toBeNull()
  })

  it.each([
    [new File([''], 'empty.pdf', { type: 'application/pdf' }), 'empty'],
    [new File(['not pdf'], 'renamed.pdf', { type: 'application/pdf' }), 'signature'],
    [new File(['%PDF-1.7'], 'resume.txt', { type: 'text/plain' }), 'PDF files only'],
    [new File(['%PDF-1.7'], 'resume.pdf', { type: 'text/plain' }), 'unsupported type'],
  ])('rejects unsupported or malformed input', async (file, message) => {
    expect(await validateAnalysisFile(file)).toContain(message)
  })

  it('rejects files over 15 MB and PDFs over 20 pages', async () => {
    const oversized = new File(
      [new Uint8Array(MAX_ANALYSIS_FILE_BYTES + 1)],
      'large.pdf',
      { type: 'application/pdf' },
    )
    expect(await validateAnalysisFile(oversized)).toContain('15 MB')
    expect(validateAnalysisPageCount(MAX_ANALYSIS_PAGES + 1)).toContain('20 pages')
  })

  it('prevents an older or cancelled request from becoming current', () => {
    const current = new AbortController()
    const cancelled = new AbortController()
    cancelled.abort()
    expect(isCurrentAnalysisRequest(2, 2, current.signal)).toBe(true)
    expect(isCurrentAnalysisRequest(1, 2, current.signal)).toBe(false)
    expect(isCurrentAnalysisRequest(2, 2, cancelled.signal)).toBe(false)
  })
})

function pdfFile() {
  return new File(['%PDF-1.7\ncontent'], 'resume.pdf', { type: 'application/pdf' })
}
