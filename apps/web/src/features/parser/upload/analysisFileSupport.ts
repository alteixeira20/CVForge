import {
  MAX_ANALYSIS_PAGES,
} from '@/lib/parser/analysisLimits'
export {
  MAX_ANALYSIS_FILE_BYTES,
  MAX_ANALYSIS_FILE_MEGABYTES,
} from '@/lib/parser/analysisLimits'
export { validateAnalysisFile } from '@/lib/parser/analysisFileValidation'

export const SUPPORTED_ANALYSIS_FORMATS = ['PDF'] as const
export const ANALYSIS_FILE_ACCEPT = 'application/pdf,.pdf'
export { MAX_ANALYSIS_PAGES }

export function isSupportedAnalysisFile(file: File) {
  return file.name.toLowerCase().endsWith('.pdf')
    && (!file.type || file.type === 'application/pdf' || file.type === 'application/x-pdf')
}
