'use client'

import { useSearchParams } from 'next/navigation'
import { AppHeader } from '@/components/layout/AppHeader'
import { WorkbenchShell } from '@/components/shared/workbench/WorkbenchShell'
import { useCV } from '@/context/CVContext'
import { scoreCV } from '@/features/scoring/scoreCV'
import { isCvForgeGenerated } from '@/lib/parser/cvForgeDetection'
import { isEmptyCV } from '@/lib/cvState'
import { type CVState } from '@/types/cv'
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
  const searchParams = useSearchParams()
  const fromBuilder = searchParams.get('source') === 'builder'
  const { document, handleFile, clearDocument } = useParserDocument()
  const analysis = resolveAnalysisTarget(state, document, fromBuilder)

  return (
    <div className="app-shell">
      <AppHeader title="Parser Diagnostics" />
      <WorkbenchShell
        leftPanel={(
          <ParserAnalysisPanel
            document={document}
            analysis={analysis}
            onFile={handleFile}
            onClearFile={clearDocument}
          />
        )}
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
  onClearFile: () => void
}) {
  return (
    <div className="p-24 lg:p-40 space-y-32 pb-80">
      <ParserHeader />
      <PdfUploadPanel onFile={props.onFile} />
      {props.document && (
        <button type="button" onClick={props.onClearFile} className="btn w-full justify-center">
          Clear uploaded PDF
        </button>
      )}
      {!props.document && <BuilderSourceNotice analysis={props.analysis} />}
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
        You can also analyze the current Builder CV without uploading a file.
      </p>
    </header>
  )
}

type ParserAnalysisTarget = {
  score: ReturnType<typeof scoreCV> | null
  isEmpty: boolean
  target: {
    label: string
    description: string
    caveat: string
  }
}

function BuilderSourceNotice({ analysis }: { analysis: ParserAnalysisTarget }) {
  return (
    <section className="panel p-20 bg-bg-2 border border-border rounded-xl space-y-8">
      <div className="flex items-center justify-between gap-16">
        <h2 className="text-sm font-semibold text-ink">{analysis.target.label}</h2>
        <span className="text-[10px] uppercase tracking-[0.16em] text-ink-4">No upload</span>
      </div>
      <p className="text-xs text-ink-3 leading-relaxed">
        {analysis.target.description}
      </p>
      {analysis.isEmpty && (
        <p className="text-xs text-amber-200 leading-relaxed">
          The current Builder CV is empty. Add profile details or a section in Builder, then return here for more useful diagnostics.
        </p>
      )}
    </section>
  )
}

function resolveAnalysisTarget(state: CVState, document: ParserDocument | null, fromBuilder: boolean): ParserAnalysisTarget {
  if (!document?.extraction) {
    return {
      score: scoreCV(state),
      isEmpty: isEmptyCV(state),
      target: {
        label: 'Current Builder CV',
        description: fromBuilder
          ? 'These checks use the active CV from Builder. No PDF was uploaded and no server storage is used.'
          : 'These checks use the CV currently stored in the Builder. Upload a PDF to analyze a file instead.',
        caveat: 'Uploaded PDF results are not mixed into this score until CVForge has a restored session or best-effort draft to evaluate.',
      },
    }
  }

  const extractedText = document.extraction.text
  const isForge = isCvForgeGenerated(document.extraction.metadata)

  if (document.embeddedState) {
    return {
      score: scoreCV(document.embeddedState, extractedText),
      isEmpty: false,
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
      isEmpty: false,
      target: {
        label: 'Best-Effort External PDF Draft',
        description: 'These checks use the conservative draft parsed from the uploaded external PDF.',
        caveat: 'The draft may be incomplete or wrong. Review imported fields before using them.',
      },
    }
  }

  return {
    score: null,
    isEmpty: false,
    target: {
      label: isForge ? 'CVForge PDF Extraction Only' : 'Raw PDF Extraction Only',
      description: 'CVForge extracted text from this PDF, but there is no structured CV draft to score.',
      caveat: 'The current Builder CV is intentionally not scored as a proxy for this upload.',
    },
  }
}

