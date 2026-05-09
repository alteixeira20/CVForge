'use client'

import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { type HeuristicResult } from './parserTypes'

export function ParserHeuristicAction({ result }: { result: HeuristicResult }) {
  const { replaceState } = useCV()

  const handleImport = () => {
    if (window.confirm('Create an editable draft from this PDF? Current builder data will be replaced.')) {
      replaceState(result.draft)
      alert('Draft created. You have been switched to the Builder view.')
      // Simple navigation if possible, otherwise user can click Builder tab
      window.location.hash = '#builder' // Heuristic for single-page apps or manual switch
    }
  }

  return (
    <div className="panel p-20 bg-bg-2 border border-border rounded-xl space-y-16">
      <div className="flex items-start justify-between gap-16">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-ink">Best-Effort Draft</h2>
          <p className="text-xs text-ink-3 leading-relaxed">
            We found some fields in this PDF. You can create an editable draft to jumpstart your CV.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-ink-4">Confidence</span>
          <div className="text-lg font-bold text-molten">{result.confidence}%</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        {result.detectedFields.map(field => (
          <span key={field} className="text-[9px] px-6 py-2 bg-bg-3 border border-border rounded text-ink-3">
            {field}
          </span>
        ))}
      </div>

      {result.warnings.map(warning => (
        <p key={warning} className="text-[10px] text-amber-200 italic">{warning}</p>
      ))}

      <button
        type="button"
        onClick={handleImport}
        className="btn w-full justify-center"
        style={{ borderColor: 'var(--molten)', color: 'var(--molten)' }}
      >
        <Icon name="plus" size={14} />
        Create Editable Draft
      </button>
      
      <p className="text-[9px] text-ink-4 text-center">
        Review all fields before using. Works best with text-based resumes.
      </p>
    </div>
  )
}
