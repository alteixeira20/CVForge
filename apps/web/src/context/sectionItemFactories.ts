import { type Education, type Language, type Project, type WorkExperience } from '@/types/cv'
import { type RepeatableSectionKey } from './cvActions'

export type RepeatableSectionItem = WorkExperience | Education | Project | Language

export function createSectionItem(sectionKey: RepeatableSectionKey): RepeatableSectionItem {
  const id = Math.random().toString(36).substring(2, 9)

  switch (sectionKey) {
    case 'workExperience':
      return { id, company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, bullets: [] }
    case 'education':
      return { id, school: '', degree: '', location: '', startDate: '', endDate: '', details: [] }
    case 'projects':
      return { id, name: '', link: '', startDate: '', endDate: '', bullets: [] }
    case 'languages':
      return { id, name: '', proficiency: '' }
  }
}
