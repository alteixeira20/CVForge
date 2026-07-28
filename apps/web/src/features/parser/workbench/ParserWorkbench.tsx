'use client'

import { useSearchParams } from 'next/navigation'
import { AppHeader } from '@/components/layout/AppHeader'
import { EmberBackground } from '@/components/ui/EmberBackground'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'
import { useCV } from '@/context/CVContext'
import { ExtractionDiagnostics } from '../diagnostics/ExtractionDiagnostics'
import { TextPreview } from '../diagnostics/TextPreview'
import { ScorePanel } from '../score/ScorePanel'
import { SourcePdfPreview } from '../source/SourcePdfPreview'
import { PdfUploadPanel } from '../upload/PdfUploadPanel'
import { ParserRestoreAction } from '../upload/ParserRestoreAction'
import { ParserHeuristicAction } from '../upload/ParserHeuristicAction'
import { type ParserDocument } from '../upload/parserTypes'
import { useParserDocument } from '../upload/useParserDocument'
import { BuilderSourceNotice } from './BuilderSourceNotice'
import { type ParserAnalysisTarget } from './parserAnalysisTypes'
import { resolveParserAnalysisTarget } from './resolveParserAnalysisTarget'

import { Icon } from '@/components/ui/Icon'
import { WorkbenchHeader } from '@/components/shared/workbench/WorkbenchHeader'

export function ParserWorkbench() {
  const { state } = useCV()
  const searchParams = useSearchParams()
  const fromBuilder = searchParams.get('source') === 'builder'
  const { document, isAnalyzing, handleFile, clearDocument } = useParserDocument()
  const analysis = resolveParserAnalysisTarget(state, document, fromBuilder)

  return (
    <div className="app-shell h-screen overflow-hidden">
      <EmberBackground subdued />
      <AppHeader title="CV Analyzer" />
      <WorkbenchShell
        leftPanel={(
          <ParserAnalysisPanel
            document={document}
            isAnalyzing={isAnalyzing}
            analysis={analysis}
            onFile={handleFile}
            onClearFile={clearDocument}
          />
        )}
        rightPanel={<SourcePdfPreview document={document} />}
        leftLabel="Analysis"
        rightLabel="Source"
        variant="builder"
      />
    </div>
  )
}

function ParserAnalysisPanel(props: {
  document: ParserDocument | null
  isAnalyzing: boolean
  analysis: ParserAnalysisTarget
  onFile: (file: File) => void
  onClearFile: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col" aria-busy={props.isAnalyzing}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <WorkbenchHeader
          eyebrow="Workbench / Analyzer"
          title="Analyze your CV"
          description="Inspect a PDF locally for extraction quality and actionable CV improvements. CVForge PDFs may restore an embedded session; external PDFs create review-first drafts."
          actions={props.document && (
            <button 
              type="button" 
              onClick={props.onClearFile} 
              className="btn sm bg-bg-3 border-border-strong hover:border-border px-3"
            >
              <Icon name="x" size={13} />
              <span className="hidden sm:inline">Clear PDF</span>
            </button>
          )}
        />

        <div className="p-5 lg:p-8 pt-6 space-y-6 pb-20">
          <PdfUploadPanel isAnalyzing={props.isAnalyzing} onFile={props.onFile} />
          
          {!props.document && <BuilderSourceNotice analysis={props.analysis} />}
          
          {props.document?.embeddedState && (
            <ParserRestoreAction embeddedState={props.document.embeddedState} />
          )}
          
          {!props.document?.embeddedState && props.document?.heuristic && (
            <ParserHeuristicAction result={props.document.heuristic} />
          )}
          
          <ExtractionDiagnostics document={props.document} />
          <ScorePanel result={props.analysis.score} target={props.analysis.target} />
          <TextPreview document={props.document} />
        </div>
      </div>
    </div>
  )
}
