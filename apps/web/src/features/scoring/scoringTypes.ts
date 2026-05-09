export type ScoreStatus = 'pass' | 'warn' | 'fail'

export interface ScoreIssue {
  id: string
  label: string
  detail: string
  status: ScoreStatus
  points: number
  maxPoints: number
}

export interface ScoreResult {
  score: number
  maxScore: number
  issues: ScoreIssue[]
}
