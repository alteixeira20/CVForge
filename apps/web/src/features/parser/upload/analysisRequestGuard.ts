export function isCurrentAnalysisRequest(
  requestGeneration: number,
  currentGeneration: number,
  signal: AbortSignal,
) {
  return requestGeneration === currentGeneration && !signal.aborted
}
