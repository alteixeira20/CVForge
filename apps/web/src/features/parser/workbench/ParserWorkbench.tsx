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
  const analysis = resolveAnalysisTarget(state, document)

  return (
    <div className="app-shell">
      <AppHeader title="Parser Diagnostics" />
      <WorkbenchShell
        leftPanel={<ParserAnalysisPanel document={document} analysis={analysis} onFile={handleFile} />}
        rightPanel={<SourcePdfPreview document={document} />}
        leftLabel="Analysis"
        rightLabel="Source"
      />
    </div>
  )
}

function ParserAnalysisPanel(props: {
  document: ParserDocument | null
  analysis: ParserAnalysisTarget
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
      <ScorePanel result={props.analysis.score} target={props.analysis.target} />
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
        Upload a PDF for local extraction diagnostics. CVForge PDFs can restore
        embedded sessions; external PDFs can only create best-effort drafts that need review.
      </p>
    </header>
  )
}

type ParserAnalysisTarget = {
  score: ReturnType<typeof scoreCV> | null
  target: {
    label: string
    description: string
    caveat: string
  }
}

function resolveAnalysisTarget(state: ReturnType<typeof useCV>['state'], document: ParserDocument | null): ParserAnalysisTarget {
  if (!document?.extraction) {
    return {
      score: scoreCV(state),
      target: {
        label: 'Current Builder CV',
        description: 'These checks use the CV currently stored in the Builder.',
        caveat: 'Upload results are not mixed into this score until CVForge has a restored session or best-effort draft to evaluate.',
      },
    }
  }

  const extractedText = document.extraction.text
  const isForge = isCvForgeGenerated(document.extraction.metadata)

  if (document.embeddedState) {
    return {
      score: scoreCV(document.embeddedState, extractedText),
      target: {
        label: 'CVForge Embedded Session',
        description: 'These checks use the structured session embedded inside the uploaded CVForge PDF.',
        caveat: 'Parser reliability remains separate from these CV content checks.',
      },
    }
  }

  if (document.heuristic) {
    return {
      score: scoreCV(document.heuristic.draft, extractedText),
      target: {
        label: 'Best-Effort External PDF Draft',
        description: 'These checks use the conservative draft parsed from the uploaded external PDF.',
        caveat: 'The draft may be incomplete or wrong. Review imported fields before using them.',
      },
    }
  }

  return {
    score: null,
    target: {
      label: isForge ? 'CVForge PDF Extraction Only' : 'Raw PDF Extraction Only',
      description: 'CVForge extracted text from this PDF, but there is no structured CV draft to score.',
      caveat: 'The current Builder CV is intentionally not scored as a proxy for this upload.',
    },
  }
}
