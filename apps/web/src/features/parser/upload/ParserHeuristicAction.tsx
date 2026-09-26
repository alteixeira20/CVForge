'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCV } from '@/context/CVContext'
import { markCVImported } from '@/features/builder/workbench/importExpansion'
import { Icon } from '@/components/ui/Icon'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { ImportReviewTable } from '@/features/import-export/ImportReviewTable'
import { type HeuristicResult } from './parserTypes'

export function ParserHeuristicAction({ result }: { result: HeuristicResult }) {
  const { replaceState } = useCV()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleImport = () => {
    if (window.confirm('Create an editable draft from this PDF? Current builder data will be replaced.')) {
      replaceState(result.draft)
      markCVImported(result.draft)
      alert('Draft created. You have been switched to the Builder view.')
      router.push('/builder')
    }
  }

  return (
    <WorkbenchSectionCard
      title="Best-Effort Draft Review"
      icon="shield"
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      status={`Confidence: ${result.confidence}%`}
      className="border-molten/30 shadow-molten/5"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs text-ink-3 leading-relaxed">
            Review what CVForge found before replacing your Builder data.
            External PDF import is heuristic and may be incomplete.
          </p>
        </div>

        <ImportReviewTable result={result} />

        {result.warnings.map(warning => (
          <p key={warning} className="text-[10px] text-amber-200 italic font-medium">{warning}</p>
        ))}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleImport}
            className="btn w-full justify-center bg-molten/10 border-molten/30 text-molten hover:bg-molten/20 hover:border-molten/50 transition-[background-color,border-color] font-semibold"
          >
            <Icon name="plus" size={14} />
            Create Editable Draft
          </button>
          
          <p className="text-[9px] text-ink-4 text-center mt-4">
            After import, review and correct every section before exporting.
          </p>
        </div>
      </div>
    </WorkbenchSectionCard>
  )
}
