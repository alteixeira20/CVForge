'use client'

import { useState } from 'react'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { type ParserAnalysisTarget } from './parserAnalysisTypes'

export function BuilderSourceNotice({ analysis }: { analysis: ParserAnalysisTarget }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <WorkbenchSectionCard
      title={analysis.target.label}
      icon="users"
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      status="No upload"
    >
      <div className="space-y-3">
        <p className="text-xs text-ink-3 leading-relaxed">
          {analysis.target.description}
        </p>
        {analysis.isEmpty && (
          <p className="text-xs text-amber-200 leading-relaxed font-medium">
            The current Builder CV is empty. Add profile details or a section in Builder, then return here for more useful analysis.
          </p>
        )}
      </div>
    </WorkbenchSectionCard>
  )
}
