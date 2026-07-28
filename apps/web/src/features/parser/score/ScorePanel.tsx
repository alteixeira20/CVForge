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
  const orderedIssues = result ? [...result.issues].sort(compareIssues) : []

  return (
    <WorkbenchSectionCard
      title="ATS-Style CV Analysis"
      icon="spark"
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      status={result ? `${result.score}/100 · ${result.band}` : 'No score'}
    >
      <div className="space-y-6">
        <ScoreHeader result={result} target={target} />
        {result ? (
          <>
            <DimensionGrid result={result} />
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">Prioritized checks</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-3">
                  High-priority gaps appear first. Every score comes from the explicit checks below.
                </p>
              </div>
              {orderedIssues.map((issue) => <ScoreIssueRow key={issue.id} issue={issue} />)}
            </div>
          </>
        ) : (
          <p className="text-xs text-ink-3 leading-relaxed">
            This upload produced extraction analysis only. CVForge is not scoring your current Builder CV as a stand-in for this PDF.
          </p>
        )}
        <p className="pt-2 text-[10px] uppercase tracking-[0.18em] text-ink-4">
          Local rule-based best-practice signals · scoring method v{result?.methodVersion ?? 2}
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
        {result && (
          <div className="text-right">
            <strong className="block text-2xl font-bold text-ember">{result.score}</strong>
            <span className="text-[10px] text-ink-4">{result.band}</span>
          </div>
        )}
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

function DimensionGrid({ result }: { result: ScoreResult }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Analysis dimensions">
      {result.dimensions.map((dimension) => (
        <div
          key={dimension.id}
          className="rounded-lg border border-border-faint bg-bg-inset/30 p-4"
          data-analysis-dimension={dimension.id}
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xs font-semibold text-ink">{dimension.label}</h3>
            <strong className="text-sm text-ember">{dimension.score}</strong>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-ink-4">{dimension.summary}</p>
        </div>
      ))}
    </div>
  )
}

function ScoreIssueRow({ issue }: { issue: ScoreIssue }) {
  return (
    <article className="rounded-lg border border-border-faint bg-bg-inset/20 p-4 text-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h4 className="font-medium text-ink">{issue.label}</h4>
          {issue.status !== 'pass' && (
            <span className={priorityClassName(issue.priority)}>
              {issue.priority} priority
            </span>
          )}
        </div>
        <span className={`${statusClassName(issue.status)} shrink-0`}>
          {issue.points}/{issue.maxPoints}
        </span>
      </div>
      <dl className="mt-3 space-y-2 leading-relaxed">
        <div>
          <dt className="sr-only">Detected</dt>
          <dd className="text-ink-2">{issue.detected}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-ink-3">Why it matters: </dt>
          <dd className="inline text-ink-4">{issue.why}</dd>
        </div>
        {issue.status !== 'pass' && (
          <div>
            <dt className="inline font-medium text-ember">Improve: </dt>
            <dd className="inline text-ink-3">{issue.suggestion}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}

function statusClassName(status: ScoreIssue['status']) {
  if (status === 'pass') return 'text-green-300'
  if (status === 'warn') return 'text-amber-200'
  return 'text-red-300'
}

function priorityClassName(priority: ScoreIssue['priority']) {
  const color = priority === 'high'
    ? 'border-red-400/20 text-red-200'
    : priority === 'medium'
      ? 'border-amber-400/20 text-amber-200'
      : 'border-border text-ink-4'
  return `rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${color}`
}

function compareIssues(left: ScoreIssue, right: ScoreIssue) {
  const statusOrder = { fail: 0, warn: 1, pass: 2 }
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return statusOrder[left.status] - statusOrder[right.status] ||
    priorityOrder[left.priority] - priorityOrder[right.priority]
}
