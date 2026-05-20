'use client'

import { type HeuristicResult } from '@/lib/parser/heuristicResumeParser'
import { Icon } from '@/components/ui/Icon'
import { ImportReviewTable } from './ImportReviewTable'

interface PdfHeuristicReviewProps {
  result: HeuristicResult
  onConfirm: () => void
  onCancel: () => void
}

export function PdfHeuristicReview({ result, onConfirm, onCancel }: PdfHeuristicReviewProps) {
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-4">
        <div className="flex items-start gap-10 p-4 rounded-lg bg-bg-2 border border-border-faint">
          <Icon name="shield" size={16} className="text-molten mt-1 shrink-0" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-ink">Best-Effort Draft Review</h3>
            <p className="text-[11px] text-ink-3 leading-relaxed">
              External PDF import is heuristic and may be incomplete. If the CV uses complex layouts, fields may be missing.{' '}
              <span className="font-semibold text-ink">Manual review is required.</span>
            </p>
          </div>
        </div>

        <ImportReviewTable result={result} />

        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-ink-4 uppercase tracking-widest font-semibold">
            Confidence: {result.confidence}%
          </span>
          <div className="flex gap-2">
            {result.warnings.slice(0, 1).map((w) => (
              <span key={w} className="text-[10px] text-amber-200 italic">{w}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" onClick={onConfirm} className="btn primary w-full justify-center h-11">
          Create Editable Draft
        </button>
        <button type="button" onClick={onCancel} className="btn w-full justify-center h-11">
          Cancel
        </button>
      </div>
    </div>
  )
}
