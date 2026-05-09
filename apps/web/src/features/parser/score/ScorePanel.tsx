import { type ScoreIssue, type ScoreResult } from '@/features/scoring/scoringTypes'

export function ScorePanel({ result }: { result: ScoreResult }) {
  return (
    <section className="panel p-20 bg-bg-2 border border-border rounded-xl space-y-16">
      <ScoreHeader result={result} />
      <div className="space-y-8">
        {result.issues.map((issue) => <ScoreIssueRow key={issue.id} issue={issue} />)}
      </div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-4">
        Local ATS-style diagnostic, not a hiring outcome guarantee.
      </p>
    </section>
  )
}

function ScoreHeader({ result }: { result: ScoreResult }) {
  return (
    <div className="flex items-end justify-between gap-16">
      <div>
        <h2 className="text-sm font-semibold text-ink">Heuristic Analysis</h2>
        <p className="text-xs text-ink-3 mt-4">
          Local, rule-based checks. Not a hiring guarantee or server-side ATS simulation.
        </p>
      </div>
      <strong className="text-3xl text-ember">{result.score}</strong>
    </div>
  )
}

function ScoreIssueRow({ issue }: { issue: ScoreIssue }) {
  return (
    <div className="border border-border-faint rounded-lg p-10 text-xs">
      <div className="flex items-center justify-between gap-12">
        <span className="font-medium text-ink">{issue.label}</span>
        <span className={statusClassName(issue.status)}>{issue.points}/{issue.maxPoints}</span>
      </div>
      <p className="text-ink-3 mt-4">{issue.detail}</p>
    </div>
  )
}

function statusClassName(status: ScoreIssue['status']) {
  if (status === 'pass') return 'text-green-300'
  if (status === 'warn') return 'text-amber-200'
  return 'text-red-300'
}
