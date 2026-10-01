import { describe, expect, it } from 'vitest'
import { defaultSettings } from '@/types/cv/defaults'
import { createResumePdfStyles } from './resumePdfStyles'

describe('PDF horizontal layout invariants', () => {
  it('bounds the page content and all shared horizontal rows to printable width', () => {
    const styles = createResumePdfStyles(defaultSettings)

    expect(styles.pageContent).toMatchObject({ width: '100%', maxWidth: '100%', minWidth: 0 })
    expect(styles.contentBounds).toMatchObject({ width: '100%', maxWidth: '100%', minWidth: 0 })
    expect(styles.section).toMatchObject({ width: '100%', maxWidth: '100%', minWidth: 0 })
    expect(styles.entryRow).toMatchObject({ width: '100%', maxWidth: '100%', minWidth: 0 })
    expect(styles.bulletRow).toMatchObject({ width: '100%', maxWidth: '100%', minWidth: 0 })
    expect(styles.skillRow).toMatchObject({ width: '100%', maxWidth: '100%', minWidth: 0 })
    expect(styles.skillRowLast).toMatchObject({ width: '100%', maxWidth: '100%', minWidth: 0 })
    expect(styles.contactWrap).toMatchObject({ width: '100%', maxWidth: '100%', minWidth: 0 })
  })

  it('lets flexible text columns shrink below intrinsic content width', () => {
    const styles = createResumePdfStyles(defaultSettings)

    expect(styles.skillValues).toMatchObject({ minWidth: 0, flexBasis: 0, flexGrow: 1, flexShrink: 1 })
    expect(styles.bulletText).toMatchObject({ minWidth: 0, flexBasis: 0, flexGrow: 1, flexShrink: 1 })
    expect(styles.entryTitle).toMatchObject({ minWidth: 0, flexBasis: 0, flexGrow: 1, flexShrink: 1 })
    expect(styles.contactValue).toMatchObject({ minWidth: 0, flexShrink: 1 })
    expect(styles.contactItem).toMatchObject({ minWidth: 0, flexShrink: 1 })
  })
})
