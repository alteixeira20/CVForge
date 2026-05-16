'use client'

import { type HeuristicResult } from '@/lib/parser/heuristicResumeParser'

export function ImportReviewTable({ result }: { result: HeuristicResult }) {
  const profile = result.profileFields.length ? result.profileFields.join(', ') : 'None detected'
  const sections = result.sectionSummaries.length ? result.sectionSummaries : []

  return (
    <div className="space-y-6">
      <div className="border border-border-faint rounded-lg overflow-hidden text-[11px] leading-normal">
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
          value={`Dates ${result.stats.dateRanges}, unmapped signals ${result.stats.unmappedLines}`}
        />
      </div>

      {sections.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-4 font-semibold px-1">Structure Preview</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sections.slice(0, 4).map((section) => (
              <div key={section.key} className="border border-border-faint rounded-lg p-3 text-[10px] bg-bg-inset/30">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-semibold text-ink-2 truncate">{section.label}</span>
                  <span className="text-ink-4 shrink-0">{section.itemCount}</span>
                </div>
                {section.preview && <p className="text-ink-4 truncate italic">{section.preview}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-4 border-b border-border-faint last:border-b-0 p-3">
      <span className="text-ink-4 font-medium">{label}</span>
      <span className="text-ink-2 truncate" title={value}>{value}</span>
    </div>
  )
}
