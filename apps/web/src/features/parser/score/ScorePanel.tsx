'use client'

import { useState } from 'react'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { type ScoreIssue, type ScoreResult } from '@/features/scoring/scoringTypes'

export interface ScorePanelTarget {
  label: string
  description: string
  caveat: string
}

export function ScorePanel({ result, target }: { result: ScoreResult | null; target: ScorePanelTarget }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <WorkbenchSectionCard
      title="Heuristic Analysis"
      icon="spark"
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      status={result ? `${result.score}/100` : 'No score'}
    >
      <div className="space-y-6">
        <ScoreHeader result={result} target={target} />
        {result ? (
          <div className="space-y-3">
            {result.issues.map((issue) => <ScoreIssueRow key={issue.id} issue={issue} />)}
          </div>
        ) : (
          <p className="text-xs text-ink-3 leading-relaxed">
            This upload produced extraction diagnostics only. CVForge is not scoring your current Builder CV as a stand-in for this PDF.
          </p>
        )}
        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-4 pt-2">
          Local rule-based diagnostics, not a hiring outcome guarantee.
        </p>
      </div>
    </WorkbenchSectionCard>
  )
}

function ScoreHeader({ result, target }: { result: ScoreResult | null; target: ScorePanelTarget }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-ember font-semibold">{target.label}</p>
        {result && <strong className="text-2xl text-ember font-bold">{result.score}</strong>}
      </div>
      <div className="space-y-2">
        <p className="text-xs text-ink-3 leading-relaxed">
          {target.description}
        </p>
        <p className="text-[10px] text-ink-4 leading-relaxed italic">{target.caveat}</p>
      </div>
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
