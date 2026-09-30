import { describe, expect, it } from 'vitest'
import {
  defaultCVState,
  type CVState,
  type CustomSection,
  type Education,
  type Language,
  type Project,
  type WorkExperience,
} from '@/types/cv'
import { cvReducer } from './cvReducer'
import { removeSectionItem } from './cvStateUpdates'

function createTestCVState(): CVState {
  return JSON.parse(JSON.stringify(defaultCVState)) as CVState
}

function makeWork(id: string, company = 'Acme'): WorkExperience {
  return {
    id,
    company,
    role: 'Engineer',
    location: 'Remote',
    startDate: '2020-01',
    endDate: '2021-01',
    isCurrent: false,
    bullets: [],
  }
}

function makeEdu(id: string, school = 'MIT'): Education {
  return {
    id,
    school,
    degree: 'BS',
    location: 'Boston',
    startDate: '2016-09',
    endDate: '2020-06',
    details: [],
  }
}

function makeProject(id: string, name = 'Project'): Project {
  return {
    id,
    name,
    link: 'https://example.com',
    startDate: '2021-01',
    endDate: '2021-06',
    bullets: [],
  }
}

function makeLang(id: string, name = 'English'): Language {
  return {
    id,
    name,
    proficiency: 'Fluent',
  }
}

function makeCustom(id: string, title = 'Publications'): CustomSection {
  return {
    id,
    title,
    bullets: [],
  }
}

describe('cvStateUpdates: removeSectionItem', () => {
  it('removes the first item from a section', () => {
    const state = createTestCVState()
    state.resume.workExperience = [
      makeWork('work-1', 'Company A'),
      makeWork('work-2', 'Company B'),
      makeWork('work-3', 'Company C'),
    ]

    const next = removeSectionItem(state, 'workExperience', 'work-1')
    expect(next.resume.workExperience.map((item) => item.id)).toEqual(['work-2', 'work-3'])
  })

  it('removes a middle item from a section', () => {
    const state = createTestCVState()
    state.resume.workExperience = [
      makeWork('work-1', 'Company A'),
      makeWork('work-2', 'Company B'),
      makeWork('work-3', 'Company C'),
    ]

    const next = removeSectionItem(state, 'workExperience', 'work-2')
    expect(next.resume.workExperience.map((item) => item.id)).toEqual(['work-1', 'work-3'])
  })

  it('removes the last item from a section', () => {
    const state = createTestCVState()
    state.resume.workExperience = [
      makeWork('work-1', 'Company A'),
      makeWork('work-2', 'Company B'),
      makeWork('work-3', 'Company C'),
    ]

    const next = removeSectionItem(state, 'workExperience', 'work-3')
    expect(next.resume.workExperience.map((item) => item.id)).toEqual(['work-1', 'work-2'])
  })

  it('deletes when only one item exists, leaving the section array empty', () => {
    const state = createTestCVState()
    state.resume.education = [makeEdu('edu-1', 'MIT')]

    const next = removeSectionItem(state, 'education', 'edu-1')
    expect(next.resume.education).toEqual([])
  })

  it('deletes a newly created empty custom section', () => {
    const state = createTestCVState()
    const newSection = makeCustom('custom-1', 'New Custom Section')
    state.resume.customSections = [newSection]

    const next = removeSectionItem(state, 'customSections', newSection.id)
    expect(next.resume.customSections).toEqual([])
  })

  it('handles removing non-existent id gracefully without mutating items', () => {
    const state = createTestCVState()
    state.resume.languages = [makeLang('lang-1', 'English')]

    const next = removeSectionItem(state, 'languages', 'non-existent-id')
    expect(next.resume.languages.map((item) => item.id)).toEqual(['lang-1'])
  })

  it('does not mutate the original state object', () => {
    const state = createTestCVState()
    state.resume.projects = [
      makeProject('proj-1', 'Project 1'),
      makeProject('proj-2', 'Project 2'),
    ]

    const next = removeSectionItem(state, 'projects', 'proj-1')
    expect(state.resume.projects).toHaveLength(2)
    expect(next.resume.projects).toHaveLength(1)
    expect(state).not.toBe(next)
    expect(state.resume).not.toBe(next.resume)
  })

  it('supports all 5 repeatable section keys', () => {
    const state = createTestCVState()
    state.resume.workExperience = [makeWork('w-1')]
    state.resume.education = [makeEdu('e-1')]
    state.resume.projects = [makeProject('p-1')]
    state.resume.languages = [makeLang('l-1')]
    state.resume.customSections = [makeCustom('c-1')]

    let current = removeSectionItem(state, 'workExperience', 'w-1')
    expect(current.resume.workExperience).toHaveLength(0)

    current = removeSectionItem(current, 'education', 'e-1')
    expect(current.resume.education).toHaveLength(0)

    current = removeSectionItem(current, 'projects', 'p-1')
    expect(current.resume.projects).toHaveLength(0)

    current = removeSectionItem(current, 'languages', 'l-1')
    expect(current.resume.languages).toHaveLength(0)

    current = removeSectionItem(current, 'customSections', 'c-1')
    expect(current.resume.customSections).toHaveLength(0)
  })

  it('works via cvReducer with REMOVE_SECTION_ITEM action', () => {
    const state = createTestCVState()
    state.resume.education = [
      makeEdu('edu-1', 'Porto'),
      makeEdu('edu-2', 'Lisboa'),
    ]

    const next = cvReducer(state, {
      type: 'REMOVE_SECTION_ITEM',
      sectionKey: 'education',
      id: 'edu-1',
    })

    expect(next.resume.education.map((item) => item.id)).toEqual(['edu-2'])
  })
})
