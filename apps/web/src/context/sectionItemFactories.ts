import { type CustomSection, type Education, type Language, type Project, type WorkExperience } from '@/types/cv'
import { type RepeatableSectionKey } from './cvActions'

export type RepeatableSectionItem = WorkExperience | Education | Project | Language | CustomSection

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 11)
}

export function createSectionItem(sectionKey: RepeatableSectionKey): RepeatableSectionItem {
  const id = createId()

  switch (sectionKey) {
    case 'workExperience':
      return { id, company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, bullets: [] }
    case 'education':
      return { id, school: '', degree: '', location: '', startDate: '', endDate: '', details: [] }
    case 'projects':
      return { id, name: '', link: '', startDate: '', endDate: '', bullets: [] }
    case 'languages':
      return { id, name: '', proficiency: '' }
    case 'customSections':
      return { id, title: '', bullets: [] }
  }
}
