export type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'awards'
  | 'publications'
  | 'volunteering'
  | 'custom'

export interface DetectedSection {
  key: SectionKey
  label: string
  content: string
}

export interface DateRange {
  startDate: string
  endDate: string
  isCurrent: boolean
  raw: string
}

export interface CurrentSection {
  key: SectionKey
  label: string
  lines: string[]
}

export interface ParserStats {
  workEntries: number
  educationEntries: number
  projectEntries: number
  dateRanges: number
  customSections: number
  unmappedLines: number
}

export interface EntryLine {
  text: string
  bullet: boolean
}
