import { type ScoreIssue, type ScoreResult } from '@/features/scoring/scoringTypes'

export interface ScorePanelTarget {
  label: string
  description: string
  caveat: string
}

export function ScorePanel({ result, target }: { result: ScoreResult | null; target: ScorePanelTarget }) {
  return (
    <section className="panel p-20 bg-bg-2 border border-border rounded-xl space-y-16">
      <ScoreHeader result={result} target={target} />
      {result ? (
        <div className="space-y-8">
          {result.issues.map((issue) => <ScoreIssueRow key={issue.id} issue={issue} />)}
        </div>
      ) : (
        <p className="text-xs text-ink-3 leading-relaxed">
          This upload produced extraction diagnostics only. CVForge is not scoring your current Builder CV as a stand-in for this PDF.
        </p>
      )}
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-4">
        Local rule-based diagnostics, not a hiring outcome guarantee.
      </p>
    </section>
  )
}

function ScoreHeader({ result, target }: { result: ScoreResult | null; target: ScorePanelTarget }) {
  return (
    <div className="flex items-end justify-between gap-16">
      <div>
        <h2 className="text-sm font-semibold text-ink">Heuristic Analysis</h2>
        <p className="text-[10px] uppercase tracking-[0.16em] text-ember mt-2">{target.label}</p>
        <p className="text-xs text-ink-3 mt-4">
          {target.description}
        </p>
        <p className="text-[10px] text-ink-4 mt-3 leading-relaxed">{target.caveat}</p>
      </div>
      {result && <strong className="text-3xl text-ember">{result.score}</strong>}
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
