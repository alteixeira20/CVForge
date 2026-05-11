'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCV } from '@/context/CVContext'
import { Icon } from '@/components/ui/Icon'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { type HeuristicResult } from './parserTypes'

export function ParserHeuristicAction({ result }: { result: HeuristicResult }) {
  const { replaceState } = useCV()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleImport = () => {
    if (window.confirm('Create an editable draft from this PDF? Current builder data will be replaced.')) {
      replaceState(result.draft)
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

        <DraftReviewTable result={result} />

        {result.warnings.map(warning => (
          <p key={warning} className="text-[10px] text-amber-200 italic font-medium">{warning}</p>
        ))}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleImport}
            className="btn w-full justify-center bg-molten/10 border-molten/30 text-molten hover:bg-molten/20 hover:border-molten/50 transition-all font-semibold"
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

function DraftReviewTable({ result }: { result: HeuristicResult }) {
  const profile = result.profileFields.length ? result.profileFields.join(', ') : 'None detected'
  const sections = result.sectionSummaries.length ? result.sectionSummaries : []

  return (
    <div className="space-y-12">
      <div className="border border-border-faint rounded-lg overflow-hidden text-xs">
        <ReviewRow label="Profile fields" value={profile} />
        <ReviewRow
          label="Detected sections"
          value={sections.length ? sections.map((section) => section.label).join(', ') : 'None detected'}
        />
        <ReviewRow
          label="Entries"
          value={`Work ${result.stats.workEntries}, education ${result.stats.educationEntries}, projects ${result.stats.projectEntries}`}
        />
        <ReviewRow
          label="Parser signals"
          value={`Dates ${result.stats.dateRanges}, custom sections ${result.stats.customSections}, unmapped samples ${result.stats.unmappedLines}`}
        />
        <ReviewRow label="Import behavior" value="Uncertain titles, employers, schools, and dates are left blank." />
      </div>

      {sections.length > 0 && (
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.key} className="border border-border-faint rounded-lg p-10 text-xs">
              <div className="flex items-center justify-between gap-12">
                <span className="font-medium text-ink">{section.label}</span>
                <span className="text-ink-4">{section.itemCount} signal{section.itemCount === 1 ? '' : 's'}</span>
              </div>
              {section.preview && <p className="text-ink-3 mt-4 leading-relaxed">{section.preview}</p>}
            </div>
          ))}
        </div>
      )}

      {result.unmappedText && (
        <div className="border border-border-faint rounded-lg p-10 text-xs">
          <span className="font-medium text-ink">Unmapped text sample</span>
          <p className="text-ink-3 mt-4 leading-relaxed">{result.unmappedText}</p>
        </div>
      )}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-12 border-b border-border-faint last:border-b-0 p-10">
      <span className="text-ink-4">{label}</span>
      <span className="text-ink-2">{value}</span>
    </div>
  )
}
