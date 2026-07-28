import {
  type ScoreDimensionId,
  type ScoreIssue,
  type ScorePriority,
  type ScoreStatus,
} from './scoringTypes'

interface ScoreIssueInput {
  id: string
  label: string
  detected: string
  why: string
  suggestion: string
  dimension: ScoreDimensionId
  priority: ScorePriority
  status: ScoreStatus
  points: number
  maxPoints: number
}

export function createIssue(input: ScoreIssueInput): ScoreIssue {
  return {
    ...input,
    detail: input.suggestion,
  }
}

export function binaryIssue(
  input: Omit<ScoreIssueInput, 'status' | 'points'> & { passed: boolean },
) {
  return createIssue({
    ...input,
    status: input.passed ? 'pass' : 'fail',
    points: input.passed ? input.maxPoints : 0,
  })
}

export function measuredIssue(
  input: Omit<ScoreIssueInput, 'status'>,
) {
  const status: ScoreStatus = input.points >= input.maxPoints
    ? 'pass'
    : input.points > 0
      ? 'warn'
      : 'fail'
  return createIssue({ ...input, status })
}
