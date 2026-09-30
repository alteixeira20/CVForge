export const MIN_PDF_LINE_HEIGHT = 0.7
export const ZERO_GAP_PDF_LINE_HEIGHT = MIN_PDF_LINE_HEIGHT
export const DEFAULT_PDF_LINE_HEIGHT = 1.5
export const MAX_PDF_LINE_HEIGHT = 2.0
export const DEFAULT_BULLET_ROW_MARGIN = 1.0

export function compact(value: number, offset: number, min: number, max: number) {
  return Math.min(Math.max(value + offset, min), max)
}

export function scaleSpacing(value: number, factor: number, min: number, max: number) {
  return Math.min(Math.max(value * factor, min), max)
}

/**
 * Maps user-facing extra line spacing (0.00 to 1.00) to internal lineHeight ratio (0.70 to 2.00).
 * Piecewise linear mapping:
 * - 0.00 -> 0.70 (optical zero gap, lines begin immediately after previous line ends)
 * - 0.50 -> 1.50 (historical default appearance)
 * - 1.00 -> 2.00 (maximum open leading)
 */
export function lineSpacingToLineHeight(lineSpacing: number): number {
  const safe = Number.isFinite(lineSpacing) ? lineSpacing : 0.5
  const clamped = Math.max(0, Math.min(1, safe))
  const height =
    clamped <= 0.5
      ? MIN_PDF_LINE_HEIGHT + (clamped / 0.5) * (DEFAULT_PDF_LINE_HEIGHT - MIN_PDF_LINE_HEIGHT)
      : DEFAULT_PDF_LINE_HEIGHT + ((clamped - 0.5) / 0.5) * (MAX_PDF_LINE_HEIGHT - DEFAULT_PDF_LINE_HEIGHT)
  return Math.round(height * 1000) / 1000
}

/**
 * Maps internal lineHeight ratio (0.70 to 2.00) back to user-facing line spacing (0.00 to 1.00).
 * Inverts lineSpacingToLineHeight:
 * - 0.70 -> 0.00
 * - 1.50 -> 0.50
 * - 2.00 -> 1.00
 */
export function lineHeightToLineSpacing(lineHeight: number): number {
  const safe = Number.isFinite(lineHeight) ? lineHeight : DEFAULT_PDF_LINE_HEIGHT
  const clamped = Math.max(MIN_PDF_LINE_HEIGHT, Math.min(MAX_PDF_LINE_HEIGHT, safe))
  const spacing =
    clamped <= DEFAULT_PDF_LINE_HEIGHT
      ? ((clamped - MIN_PDF_LINE_HEIGHT) / (DEFAULT_PDF_LINE_HEIGHT - MIN_PDF_LINE_HEIGHT)) * 0.5
      : 0.5 + ((clamped - DEFAULT_PDF_LINE_HEIGHT) / (MAX_PDF_LINE_HEIGHT - DEFAULT_PDF_LINE_HEIGHT)) * 0.5
  return Math.round(spacing * 100) / 100
}

/**
 * Computes bulletRow marginBottom based on internal lineHeight.
 * - Line Spacing 0.00 (lineHeight = 0.70) -> 0.0pt (no extra gap between bullets)
 * - Line Spacing 0.50 (lineHeight = 1.50) -> 1.0pt (historical default)
 * - Line Spacing 1.00 (lineHeight = 2.00) -> 2.0pt
 */
export function scaleBulletRowMargin(lineHeight: number): number {
  const safe = Number.isFinite(lineHeight) ? lineHeight : DEFAULT_PDF_LINE_HEIGHT
  const clamped = Math.max(MIN_PDF_LINE_HEIGHT, Math.min(MAX_PDF_LINE_HEIGHT, safe))
  const margin =
    clamped <= DEFAULT_PDF_LINE_HEIGHT
      ? ((clamped - MIN_PDF_LINE_HEIGHT) / (DEFAULT_PDF_LINE_HEIGHT - MIN_PDF_LINE_HEIGHT)) * DEFAULT_BULLET_ROW_MARGIN
      : DEFAULT_BULLET_ROW_MARGIN +
        ((clamped - DEFAULT_PDF_LINE_HEIGHT) / (MAX_PDF_LINE_HEIGHT - DEFAULT_PDF_LINE_HEIGHT)) * DEFAULT_BULLET_ROW_MARGIN
  return Math.round(margin * 100) / 100
}
