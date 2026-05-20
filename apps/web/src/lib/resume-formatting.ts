export function hasText(value: string | null | undefined) {
  return Boolean(value?.trim())
}

export function cleanText(value: string | null | undefined) {
  return value?.trim() ?? ''
}

export function joinNonEmpty(values: Array<string | null | undefined>, separator = ' | ') {
  return values.map(cleanText).filter(Boolean).join(separator)
}

export function cleanList(values: string[]) {
  return values.map(cleanText).filter(Boolean)
}

export function formatDateRange(startDate: string, endDate: string, isCurrent = false) {
  const start = cleanText(startDate)
  const end = isCurrent ? 'Present' : cleanText(endDate)

  if (start && end) return `${start} - ${end}`
  if (start) return start
  if (end) return isCurrent ? end : `Until ${end}`
  return ''
}
