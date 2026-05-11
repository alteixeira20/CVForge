'use client'

import { useState } from 'react'
import { WorkbenchSectionCard } from '@/components/shared/workbench/WorkbenchSectionCard'
import { type ParserDocument } from '../upload/parserTypes'

export function TextPreview({ document }: { document: ParserDocument | null }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const text = document?.extraction?.text.trim()

  return (
    <WorkbenchSectionCard
      title="Extracted Text"
      icon="fold"
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      status={text ? 'Preview available' : 'Empty'}
    >
      {text ? (
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed text-ink-3 font-mono bg-bg-inset p-4 rounded border border-border-faint">
          {text}
        </pre>
      ) : (
        <p className="text-xs text-ink-3">No extracted text is available yet.</p>
      )}
    </WorkbenchSectionCard>
  )
}
