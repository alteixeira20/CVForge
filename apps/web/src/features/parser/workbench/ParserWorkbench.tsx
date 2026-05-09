'use client'

import { AppHeader } from '@/components/layout/AppHeader'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'
import { useCV } from '@/context/CVContext'
import { scoreCV } from '@/features/scoring/scoreCV'
import { isCvForgeGenerated } from '@/lib/parser/cvForgeDetection'
import { ExtractionDiagnostics } from '../diagnostics/ExtractionDiagnostics'
import { TextPreview } from '../diagnostics/TextPreview'
import { ScorePanel } from '../score/ScorePanel'
import { SourcePdfPreview } from '../source/SourcePdfPreview'
import { PdfUploadPanel } from '../upload/PdfUploadPanel'
import { ParserRestoreAction } from '../upload/ParserRestoreAction'
import { ParserHeuristicAction } from '../upload/ParserHeuristicAction'
import { type ParserDocument } from '../upload/parserTypes'
import { useParserDocument } from '../upload/useParserDocument'

export function ParserWorkbench() {
  const { state } = useCV()
  const { document, handleFile } = useParserDocument()
  const extraction = document?.extraction
  const extractedText = extraction?.text ?? ''
  const isForge = extraction ? isCvForgeGenerated(extraction.metadata) : false
  const score = scoreCV(state, extractedText, Boolean(document), isForge)

  return (
    <div className="app-shell">
      <AppHeader title="Parser Diagnostics" />
      <WorkbenchShell
        leftPanel={<ParserAnalysisPanel document={document} score={score} onFile={handleFile} />}
        rightPanel={<SourcePdfPreview document={document} />}
        leftLabel="Analysis"
        rightLabel="Source"
      />
    </div>
  )
}

function ParserAnalysisPanel(props: {
  document: ParserDocument | null
  score: ReturnType<typeof scoreCV>
  onFile: (file: File) => void
}) {
  return (
    <div className="p-24 lg:p-40 space-y-32 pb-80">
      <ParserHeader />
      <PdfUploadPanel onFile={props.onFile} />
      {props.document?.embeddedState && <ParserRestoreAction embeddedState={props.document.embeddedState} />}
      {!props.document?.embeddedState && props.document?.heuristic && (
        <ParserHeuristicAction result={props.document.heuristic} />
      )}
      <ExtractionDiagnostics document={props.document} />
      <ScorePanel result={props.score} />
      <TextPreview document={props.document} />
    </div>
  )
}

function ParserHeader() {
  return (
    <header className="workspace-head">
      <div className="crumbline">Workbench / Parser</div>
      <h1>Parser Diagnostics</h1>
      <p className="muted text-sm">
        Upload a PDF for best-effort local diagnostics. 
        Note: For full session restoration, use the JSON Backup/Restore tool.
      </p>
    </header>
  )
}
