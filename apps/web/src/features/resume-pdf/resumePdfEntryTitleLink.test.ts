import { describe, expect, it } from 'vitest'
import { defaultSettings } from '@/types/cv/defaults'
import { createResumePdfStyles } from './resumePdfStyles'

describe('PDF entry title link styles', () => {
  it('provides an entryTitleLink style with no underline and the theme color', () => {
    const settings = { ...defaultSettings, themeColor: '#1a2b3c' }
    const styles = createResumePdfStyles(settings)

    expect(styles.entryTitleLink).toMatchObject({
      color: '#1a2b3c',
      textDecoration: 'none',
      fontWeight: 600,
    })
  })

  it('entryTitleLink color tracks the theme color setting', () => {
    const redStyles = createResumePdfStyles({ ...defaultSettings, themeColor: '#ff0000' })
    const blueStyles = createResumePdfStyles({ ...defaultSettings, themeColor: '#0000ff' })

    expect(redStyles.entryTitleLink).toMatchObject({ color: '#ff0000' })
    expect(blueStyles.entryTitleLink).toMatchObject({ color: '#0000ff' })
  })
})
