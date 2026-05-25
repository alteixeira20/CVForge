import { scoreCV } from '@/features/scoring/scoreCV'
import { isEmptyCV } from '@/lib/cvState'
import { isCvForgeGenerated } from '@/lib/parser/cvForgeDetection'
import { type CVState } from '@/types/cv'
import { type ParserDocument } from '../upload/parserTypes'
import { type ParserAnalysisTarget } from './parserAnalysisTypes'

export function resolveParserAnalysisTarget(
  state: CVState,
  document: ParserDocument | null,
  fromBuilder: boolean
): ParserAnalysisTarget {
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
