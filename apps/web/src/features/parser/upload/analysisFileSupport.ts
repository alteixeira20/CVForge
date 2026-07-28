export const SUPPORTED_ANALYSIS_FORMATS = ['PDF'] as const
export const ANALYSIS_FILE_ACCEPT = 'application/pdf,.pdf'

export function isSupportedAnalysisFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}
