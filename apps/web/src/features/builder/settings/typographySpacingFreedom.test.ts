import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  defaultCVState,
  defaultSettings,
  parseCVState,
  type CVState,
} from '@/types/cv'
import {
  lineHeightToLineSpacing,
  lineSpacingToLineHeight,
  scaleBulletRowMargin,
  MIN_PDF_LINE_HEIGHT,
  DEFAULT_PDF_LINE_HEIGHT,
  MAX_PDF_LINE_HEIGHT,
} from '@/features/resume-pdf/resumePdfLayoutHelpers'
import { createResumePdfStyles } from '@/features/resume-pdf/resumePdfStyles'
import { importCVState } from '@/features/import-export/importCVState'
import { storage } from '@/lib/storage'

describe('Typography and spacing freedom', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  describe('A. Mapping and conversion behavior', () => {
    it('maps user-facing Line Spacing 0 to validated MIN_PDF_LINE_HEIGHT (0.85)', () => {
      expect(MIN_PDF_LINE_HEIGHT).toBe(0.85)
      expect(DEFAULT_PDF_LINE_HEIGHT).toBe(1.5)
      expect(MAX_PDF_LINE_HEIGHT).toBe(2.0)
      expect(lineSpacingToLineHeight(0)).toBe(0.85)
    })

    it('interpolates intermediate and default values smoothly', () => {
      expect(lineSpacingToLineHeight(0.1)).toBe(0.98)
      expect(lineSpacingToLineHeight(0.25)).toBe(1.175)
      expect(lineSpacingToLineHeight(0.5)).toBe(1.5)
      expect(lineSpacingToLineHeight(0.75)).toBe(1.75)
      expect(lineSpacingToLineHeight(1.0)).toBe(2.0)
    })

    it('inverts internal lineHeight values back to user-facing Line Spacing', () => {
      expect(lineHeightToLineSpacing(0.85)).toBe(0)
      expect(lineHeightToLineSpacing(0.98)).toBe(0.1)
      expect(lineHeightToLineSpacing(1.175)).toBe(0.25)
      expect(lineHeightToLineSpacing(1.5)).toBe(0.5)
      expect(lineHeightToLineSpacing(1.75)).toBe(0.75)
      expect(lineHeightToLineSpacing(2.0)).toBe(1.0)
    })

    it('defensively clamps out-of-range or non-finite inputs', () => {
      expect(lineSpacingToLineHeight(-0.5)).toBe(0.85)
      expect(lineSpacingToLineHeight(1.5)).toBe(2.0)
      expect(lineSpacingToLineHeight(Number.NaN)).toBe(1.5)

      expect(lineHeightToLineSpacing(0.5)).toBe(0)
      expect(lineHeightToLineSpacing(2.5)).toBe(1.0)
      expect(lineHeightToLineSpacing(Number.NaN)).toBe(0.5)
    })

    it('handles legacy and transitional lineHeight values gracefully', () => {
      // Transitional 1.0 maps to ~0.12 in UI
      expect(lineHeightToLineSpacing(1.0)).toBe(0.12)
      // Historical default 1.5 maps to exactly 0.5
      expect(lineHeightToLineSpacing(1.5)).toBe(0.5)
    })
  })

  describe('B. Bullet spacing scaling', () => {
    it('scales bullet margin smoothly from 0pt at tightest to 1pt at default', () => {
      expect(scaleBulletRowMargin(0.85)).toBe(0)
      expect(scaleBulletRowMargin(1.175)).toBe(0.5)
      expect(scaleBulletRowMargin(1.5)).toBe(1.0)
      expect(scaleBulletRowMargin(1.75)).toBe(1.5)
      expect(scaleBulletRowMargin(2.0)).toBe(2.0)
    })

    it('clamps bullet margin defensively on non-finite or out-of-range values', () => {
      expect(scaleBulletRowMargin(Number.NaN)).toBe(1.0)
      expect(scaleBulletRowMargin(0.2)).toBe(0)
      expect(scaleBulletRowMargin(3.0)).toBe(2.0)
    })
  })

  describe('C. Existing saved state compatibility', () => {
    it('loads a legacy CV with lineHeight 1.5 and computes display Line Spacing 0.5', () => {
      const savedCV = JSON.parse(JSON.stringify(defaultCVState)) as CVState
      savedCV.settings.lineHeight = 1.5

      const parsed = parseCVState(savedCV)
      expect(parsed).not.toBeNull()
      expect(parsed!.settings.lineHeight).toBe(1.5)
      expect(lineHeightToLineSpacing(parsed!.settings.lineHeight)).toBe(0.5)
    })

    it('retains stored lineHeight 1.5 on default settings reset', () => {
      expect(defaultSettings.lineHeight).toBe(1.5)
      expect(lineHeightToLineSpacing(defaultSettings.lineHeight)).toBe(0.5)
    })
  })

  describe('D. PDF style behavior with internal lineHeight 0.85', () => {
    it('allows page, bullets, paragraphs, and multi-line text to reach 0.85 without hidden floors', () => {
      const styles = createResumePdfStyles({
        ...defaultSettings,
        lineHeight: 0.85,
        languageLineHeight: 0.85,
      })

      expect(styles.page.lineHeight).toBe(0.85)
      expect(styles.bulletText.lineHeight).toBe(0.85)
      expect(styles.paragraph.lineHeight).toBe(0.85)
      expect(styles.summary.lineHeight).toBe(0.85)
      expect(styles.skillLabel.lineHeight).toBe(0.85)
      expect(styles.skillValues.lineHeight).toBe(0.85)
      expect(styles.entryTitle.lineHeight).toBe(0.85)
      expect(styles.entrySubtitle.lineHeight).toBe(0.85)
      expect(styles.languageText.lineHeight).toBe(0.85)
    })

    it('sets bulletRow marginBottom to 0 at Line Spacing 0', () => {
      const styles = createResumePdfStyles({
        ...defaultSettings,
        lineHeight: 0.85,
      })

      expect(styles.bulletRow.marginBottom).toBe(0)
    })

    it('adjusts bullet marker offset at compressed lineHeight to maintain alignment', () => {
      const tightStyles = createResumePdfStyles({
        ...defaultSettings,
        lineHeight: 0.85,
      })
      const defaultStyles = createResumePdfStyles({
        ...defaultSettings,
        lineHeight: 1.5,
      })

      expect(tightStyles.bulletMarker.marginTop).toBe(3)
      expect(defaultStyles.bulletMarker.marginTop).toBe(6)
    })
  })

  describe('E. Zero spacing', () => {
    it('renders section spacing as genuinely 0 when sectionSpacing is 0', () => {
      const styles = createResumePdfStyles({
        ...defaultSettings,
        sectionSpacing: 0,
      })

      expect(styles.section.marginTop).toBe(0)
    })

    it('renders profile spacing as genuinely 0 when profileSpacing is 0', () => {
      const styles = createResumePdfStyles({
        ...defaultSettings,
        profileSpacing: 0,
      })

      expect(styles.header.marginBottom).toBe(0)
    })

    it('honors zero on all advanced spacing controls', () => {
      const styles = createResumePdfStyles({
        ...defaultSettings,
        topBarHeight: 0,
        contactGap: 0,
        summaryGap: 0,
        titleMetaGap: 0,
        descriptionGap: 0,
        workEntryGap: 0,
        educationEntryGap: 0,
        projectEntryGap: 0,
      })

      expect(styles.accentRule.height).toBe(0)
      expect(styles.contactWrap.columnGap).toBe(0)
      expect(styles.summary.marginTop).toBe(0)
      expect(styles.entrySubtitle.marginTop).toBe(0)
      expect(styles.bulletList.marginTop).toBe(0)
      expect(styles.paragraph.marginTop).toBe(0)
      expect(styles.workEntryGroup.marginBottom).toBe(0)
      expect(styles.educationEntryGroup.marginBottom).toBe(0)
      expect(styles.projectEntryGroup.marginBottom).toBe(0)
    })
  })

  describe('F. Defaults preservation', () => {
    it('maintains expected default spacings and typography values numerically and visually', () => {
      const styles = createResumePdfStyles(defaultSettings)

      expect(styles.section.marginTop).toBe(12)
      expect(styles.header.marginBottom).toBe(8)
      expect(styles.page.lineHeight).toBe(1.5)
      expect(styles.entryTitle.lineHeight).toBe(1.3)
      expect(styles.entrySubtitle.lineHeight).toBe(1.35)
      expect(styles.bulletRow.marginBottom).toBe(1.0)
      expect(styles.bulletMarker.marginTop).toBe(6)
    })
  })

  describe('G. Persistence and backup preservation', () => {
    it('persists and restores custom Line Spacing 0 through storage and JSON import', async () => {
      const values = new Map<string, string>()
      vi.stubGlobal('window', {
        localStorage: {
          getItem: (key: string) => values.get(key) ?? null,
          setItem: (key: string, value: string) => values.set(key, value),
          removeItem: (key: string) => values.delete(key),
        },
      })

      const customState = JSON.parse(JSON.stringify(defaultCVState)) as CVState
      customState.settings.lineHeight = lineSpacingToLineHeight(0) // tightest spacing (0.85)
      customState.settings.sectionSpacing = 0
      customState.settings.profileSpacing = 0

      expect(storage.setCVState(customState)).toBe(true)
      const restored = storage.getCVState()
      expect(restored).not.toBeNull()
      expect(restored!.settings.lineHeight).toBe(0.85)
      expect(lineHeightToLineSpacing(restored!.settings.lineHeight)).toBe(0)
      expect(restored!.settings.sectionSpacing).toBe(0)
      expect(restored!.settings.profileSpacing).toBe(0)

      const imported = await importCVState({
        text: async () => JSON.stringify(customState),
      })
      expect(imported.settings.lineHeight).toBe(0.85)
      expect(lineHeightToLineSpacing(imported.settings.lineHeight)).toBe(0)
      expect(imported.settings.sectionSpacing).toBe(0)
      expect(imported.settings.profileSpacing).toBe(0)
    })
  })
})
