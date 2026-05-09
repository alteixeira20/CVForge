import { type ScoreIssue } from './scoringTypes'

export function createIssue(
  id: string,
  label: string,
  detail: string,
  passed: boolean,
  maxPoints: number,
): ScoreIssue {
  return {
    id,
    label,
    detail,
    status: passed ? 'pass' : 'fail',
    points: passed ? maxPoints : 0,
    maxPoints,
  }
}

export function createWarning(id: string, label: string, detail: string, points: number, maxPoints: number): ScoreIssue {
  return { id, label, detail, status: 'warn', points, maxPoints }
}
