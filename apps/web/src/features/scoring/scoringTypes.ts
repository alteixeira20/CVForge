export type ScoreStatus = 'pass' | 'warn' | 'fail'
export type ScorePriority = 'high' | 'medium' | 'low'
export type ScoreDimensionId =
  | 'completeness'
  | 'structure'
  | 'clarity'
  | 'impact'
  | 'ats-compatibility'
  | 'parseability'

export interface ScoreIssue {
  id: string
  label: string
  detail: string
  detected: string
  why: string
  suggestion: string
  dimension: ScoreDimensionId
  priority: ScorePriority
  status: ScoreStatus
  points: number
  maxPoints: number
}

export interface ScoreDimension {
  id: ScoreDimensionId
  label: string
  score: number
  weight: number
  summary: string
}

export interface ScoreResult {
  score: number
  maxScore: number
  band: 'Strong signals' | 'Solid foundation' | 'Needs attention' | 'Limited signals'
  methodVersion: 3
  language: 'English' | 'Portuguese (Portugal)' | 'Language-neutral fallback'
  methodology: string
  dimensions: ScoreDimension[]
  issues: ScoreIssue[]
}
