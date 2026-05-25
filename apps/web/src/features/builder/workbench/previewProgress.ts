import { type RenderProgress } from './pdfPreviewTypes'

export function progressPct(p: RenderProgress | null): number {
  if (!p || p.stage === 'preparing') return 20
  const frac = p.pagesTotal > 0 ? p.pagesDone / p.pagesTotal : 0
  return Math.round(25 + frac * 65)
}

export function stageLabel(p: RenderProgress | null): string {
  if (!p || p.stage === 'preparing') return 'Preparing document'
  const { pagesDone, pagesTotal } = p
  if (pagesTotal > 1 && pagesDone > 0 && pagesDone < pagesTotal) {
    return `Rendering page ${pagesDone} of ${pagesTotal}`
  }
  return 'Rendering pages'
}
