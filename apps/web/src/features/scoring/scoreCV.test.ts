import { describe, expect, it } from 'vitest'
import { defaultCVState, type CVState } from '@/types/cv'
import { analyzeExtractionEvidence, type PdfPageEvidence } from '@/lib/parser/extractionDiagnostics'
import { scoreCV } from './scoreCV'
import { normalizedVisibleText } from './visibleText'

describe('scoreCV scoring method v3', () => {
  it('scores an empty CV poorly and deterministically', () => {
    const first = scoreCV(freshState())
    const second = scoreCV(freshState())
    expect(first).toEqual(second)
    expect(first.methodVersion).toBe(3)
    expect(first.score).toBeLessThan(40)
  })

  it('improves predictably from incomplete to minimally complete to strong English', () => {
    const incomplete = freshState()
    incomplete.resume.profile.name = 'Alex Morgan'

    const minimal = freshState()
    minimal.resume.profile = {
      ...minimal.resume.profile,
      name: 'Alex Morgan',
      email: 'alex@example.com',
      phone: '+351 910 000 000',
      location: 'Lisbon, Portugal',
      summary: 'Product engineer focused on reliable web applications and clear collaboration across delivery teams.',
    }
    minimal.resume.workExperience = [workEntry('Built reliable internal tools for the product team.')]
    minimal.resume.education = [{
      id: 'education-1',
      school: 'University',
      degree: 'Computer Science',
      location: 'Lisbon',
      startDate: '2016',
      endDate: '2019',
      details: [],
    }]
    minimal.resume.skills.technical = ['TypeScript']

    const strong = strongEnglishState()
    expect(scoreCV(incomplete).score).toBeLessThan(scoreCV(minimal).score)
    expect(scoreCV(minimal).score).toBeLessThan(scoreCV(strong).score)
    expect(scoreCV(strong).score).toBeGreaterThanOrEqual(80)
  })

  it('scores a strong PT-PT CV without an English-language collapse', () => {
    const english = scoreCV(strongEnglishState())
    const portuguese = scoreCV(strongPortugueseState())
    expect(portuguese.language).toBe('Portuguese (Portugal)')
    expect(portuguese.score).toBeGreaterThanOrEqual(75)
    expect(Math.abs(english.score - portuguese.score)).toBeLessThanOrEqual(8)
  })

  it('does not award quantified-impact credit for irrelevant digits', () => {
    const state = strongEnglishState()
    state.resume.workExperience[0].bullets = [
      'Migrated the interface to React 18.',
      'Released version 2 in 2024.',
    ]
    state.resume.workExperience[1].bullets = ['Maintained HTTP 2 services for the Tier 1 team.']
    state.resume.projects[0].bullets = ['Upgraded the project to version 2 in 2024.']
    const metric = scoreCV(state).issues.find((issue) => issue.id === 'metrics')
    expect(metric).toMatchObject({ points: 0, status: 'fail' })
  })

  it('uses normalized visible content rather than serialized hidden state', () => {
    const state = strongEnglishState()
    state.settings.visibleSections.projects = false
    state.resume.projects = [{
      id: 'hidden-project',
      name: 'Hidden project',
      link: '',
      startDate: '',
      endDate: '',
      bullets: ['x'.repeat(12_000)],
    }]
    const visible = normalizedVisibleText(state)
    expect(visible).not.toContain('Hidden project')
    expect(visible.length).toBeLessThan(6_000)
    expect(scoreCV(state).issues.find((issue) => issue.id === 'compactness')?.points).toBe(6)
  })

  it('reduces parseability when extraction is malformed or image-only', () => {
    const healthyPages = [
      page('Alex Morgan\nExperience\nBuilt reliable products for 12,000 users. '.repeat(12)),
      page('Education\nSkills\nTypeScript React PostgreSQL '.repeat(12)),
    ]
    const brokenPages = [
      page('� � ☠', { fragmentedLineRatio: 0.9, possibleColumnOrder: true }),
      page(''),
    ]
    const healthy = scoreWithPages(strongEnglishState(), healthyPages)
    const broken = scoreWithPages(strongEnglishState(), brokenPages)
    expect(dimensionScore(broken, 'parseability')).toBeLessThan(dimensionScore(healthy, 'parseability'))
    expect(broken.issues.find((issue) => issue.id === 'extraction-empty-pages')?.status).not.toBe('pass')
  })
})

function scoreWithPages(state: CVState, pages: PdfPageEvidence[]) {
  const text = pages.map((page) => page.text).join('\n')
  return scoreCV(state, text, {
    includeExtraction: true,
    extraction: {
      pageCount: pages.length,
      text,
      pageTexts: pages.map((page) => page.text),
      pages,
      metadata: {},
      diagnostics: analyzeExtractionEvidence(pages),
      warnings: [],
    },
  })
}

function dimensionScore(result: ReturnType<typeof scoreCV>, id: string) {
  return result.dimensions.find((dimension) => dimension.id === id)?.score ?? 0
}

function page(text: string, overrides: Partial<PdfPageEvidence> = {}): PdfPageEvidence {
  const lines = text.split('\n').filter(Boolean)
  return {
    text,
    lineCount: lines.length,
    itemCount: lines.length,
    fragmentedLineRatio: 0,
    possibleColumnOrder: false,
    ...overrides,
  }
}

function freshState(): CVState {
  return JSON.parse(JSON.stringify(defaultCVState)) as CVState
}

function strongEnglishState() {
  const state = freshState()
  state.resume.profile = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    phone: '+351 910 000 000',
    location: 'Lisbon, Portugal',
    website: 'https://alex.example.com',
    github: 'https://github.com/alex',
    linkedin: 'https://linkedin.com/in/alex',
    summary: 'Product engineer with eight years of experience delivering reliable web platforms, accessible interfaces, and measurable operational improvements.',
  }
  state.resume.workExperience = [
    workEntry('Reduced checkout errors by 32% while delivering a clearer customer experience.'),
    {
      ...workEntry('Led a platform migration that supported 12,000 active users across three regions.'),
      id: 'work-2',
      company: 'Northstar',
      role: 'Senior Engineer',
    },
  ]
  state.resume.education = [{
    id: 'education-1',
    school: 'University of Lisbon',
    degree: 'Computer Science',
    location: 'Lisbon',
    startDate: '2012',
    endDate: '2016',
    details: ['Distributed systems and human-computer interaction.'],
  }]
  state.resume.projects = [{
    id: 'project-1',
    name: 'Release Platform',
    link: 'https://alex.example.com/releases',
    startDate: '2023',
    endDate: '2024',
    bullets: ['Automated delivery workflows to support 12 releases per month with clear rollback controls.'],
  }]
  state.resume.skills.technical = ['TypeScript', 'React', 'PostgreSQL', 'Accessibility']
  return state
}

function strongPortugueseState() {
  const state = strongEnglishState()
  state.resume.profile.summary = 'Engenheiro de produto com oito anos de experiência na entrega de plataformas web fiáveis, interfaces acessíveis e melhorias operacionais mensuráveis.'
  state.resume.workExperience = [
    workEntry('Reduzi os erros de checkout em 32% e melhorei a experiência dos clientes.'),
    {
      ...workEntry('Liderei uma migração de plataforma utilizada por 12 mil clientes em três regiões.'),
      id: 'work-2',
      company: 'Northstar',
      role: 'Engenheiro Sénior',
    },
  ]
  state.resume.projects[0].bullets = ['Automatizei as entregas para suportar 12 lançamentos por mês com controlos claros de reversão.']
  state.settings.sectionTitles = {
    workExperience: 'Experiência Profissional',
    education: 'Formação Académica',
    projects: 'Projetos',
    skills: 'Competências',
    languages: 'Idiomas',
    customSections: 'Certificações',
  }
  return state
}

function workEntry(bullet: string) {
  return {
    id: 'work-1',
    company: 'Anvilary',
    role: 'Product Engineer',
    location: 'Lisbon',
    startDate: '2020',
    endDate: '',
    isCurrent: true,
    bullets: [bullet],
  }
}
