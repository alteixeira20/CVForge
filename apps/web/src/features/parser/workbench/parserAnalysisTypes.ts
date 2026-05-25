import { type scoreCV } from '@/features/scoring/scoreCV'

export type ParserAnalysisTarget = {
  score: ReturnType<typeof scoreCV> | null
  isEmpty: boolean
  target: {
    label: string
    description: string
    caveat: string
  }
}
