import { describe, expect, it, vi } from 'vitest'
import { CVFORGE_ATTACHMENT_NAME, readCVForgeAttachment } from './extractCVForgeAttachment'

const bytes = new TextEncoder().encode('{"ok":true}')

function attachment(filename: string, content?: Uint8Array) {
  return { filename, rawFilename: filename, description: '', content }
}

describe('CVForge attachment lookup (PDF.js 6 Map API)', () => {
  it('reads inline content from the attachment Map', async () => {
    const pdf = {
      getAttachments: async () => new Map([[CVFORGE_ATTACHMENT_NAME, attachment(CVFORGE_ATTACHMENT_NAME, bytes)]]),
      getAttachmentContent: vi.fn(),
    }
    expect(await readCVForgeAttachment(pdf)).toEqual(bytes)
    expect(pdf.getAttachmentContent).not.toHaveBeenCalled()
  })

  it('fetches content on demand when the Map omits it', async () => {
    const pdf = {
      getAttachments: async () => new Map([[CVFORGE_ATTACHMENT_NAME, attachment(CVFORGE_ATTACHMENT_NAME)]]),
      getAttachmentContent: vi.fn(async () => bytes),
    }
    expect(await readCVForgeAttachment(pdf)).toEqual(bytes)
    expect(pdf.getAttachmentContent).toHaveBeenCalledWith(CVFORGE_ATTACHMENT_NAME)
  })

  it('matches by filename when the name-tree key differs', async () => {
    const pdf = {
      getAttachments: async () => new Map([['other-key', attachment(CVFORGE_ATTACHMENT_NAME)]]),
      getAttachmentContent: vi.fn(async (id: string) => (id === 'other-key' ? bytes : null)),
    }
    expect(await readCVForgeAttachment(pdf)).toEqual(bytes)
  })

  it('returns null without attachments or without a CVForge attachment', async () => {
    const none = { getAttachments: async () => null, getAttachmentContent: vi.fn() }
    const other = {
      getAttachments: async () => new Map([['invoice.xml', attachment('invoice.xml', bytes)]]),
      getAttachmentContent: vi.fn(),
    }
    expect(await readCVForgeAttachment(none)).toBeNull()
    expect(await readCVForgeAttachment(other)).toBeNull()
  })
})
