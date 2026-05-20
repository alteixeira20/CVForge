import { type DateRange } from './heuristicTypes'

export function extractDateRange(line: string): DateRange | null {
  const datePart = String.raw`(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}\/\d{1,2}|\d{4}|Present|Current|Now`
  const range = new RegExp(`(${datePart})\\s*(?:-|to)\\s*(${datePart})`, 'i').exec(line)
  if (range) return toDateRange(range[1], range[2], range[0])

  const single = new RegExp(`\\b(${datePart})\\b`, 'i').exec(line)
  if (!single) return null
  return toDateRange(single[1], '', single[0])
}

function toDateRange(start: string, end: string, raw: string): DateRange {
  const normalizedEnd = normalizePresent(end)
  return {
    startDate: normalizePresent(start),
    endDate: normalizedEnd,
    isCurrent: normalizedEnd === 'Present',
    raw,
  }
}

function normalizePresent(value: string) {
  return /^(present|current|now)$/i.test(value.trim()) ? 'Present' : value.trim()
}

export function isOnlyDateLine(line: string, dateRaw?: string) {
  if (!dateRaw) return false
  return line.trim().toLowerCase() === dateRaw.trim().toLowerCase()
}

export function firstDate(lines: string[]) {
  return lines.map(extractDateRange).find(Boolean) ?? null
}
