export interface RenderedPage {
  canvas: HTMLCanvasElement
  baseWidth: number
  baseHeight: number
}

export type RenderStage = 'preparing' | 'rendering'

export interface RenderProgress {
  stage: RenderStage
  pagesDone: number
  pagesTotal: number
}
