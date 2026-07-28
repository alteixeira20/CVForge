import { type CVState } from '@/types/cv'

export type AnalyzerLanguage = 'en' | 'pt-PT' | 'neutral'

const EN_ACTION_VERBS = [
  'automated', 'built', 'coordinated', 'created', 'delivered', 'designed',
  'developed', 'drove', 'implemented', 'improved', 'increased', 'launched',
  'led', 'managed', 'optimized', 'owned', 'reduced', 'resolved', 'scaled',
  'shipped', 'streamlined',
]

const PT_ACTION_VERBS = [
  'aumentei', 'automatizei', 'construí', 'coordenei', 'criei', 'desenvolvi',
  'entreguei', 'geri', 'implementei', 'liderei', 'lancei', 'melhorei',
  'otimizei', 'reduzi', 'resolvi', 'simplifiquei',
]

const SECTION_PATTERNS = {
  en: {
    workExperience: /\b(experience|employment|work)\b/i,
    education: /\b(education|training|qualifications?|academic)\b/i,
    projects: /\b(projects?|portfolio)\b/i,
    skills: /\b(skills?|competencies|technologies|aptitudes)\b/i,
  },
  'pt-PT': {
    workExperience: /\b(experi[eê]ncia(?:\s+profissional)?|historial\s+profissional)\b/i,
    education: /\b(forma[cç][aã]o(?:\s+acad[eé]mica)?|educa[cç][aã]o|qualifica[cç][oõ]es)\b/i,
    projects: /\b(projetos?|portef[oó]lio)\b/i,
    skills: /\b(compet[eê]ncias|aptid[oõ]es|tecnologias|conhecimentos)\b/i,
  },
} as const

export function selectAnalyzerLanguage(
  state: CVState,
  visibleText: string,
  explicitLanguage?: AnalyzerLanguage,
): AnalyzerLanguage {
  if (explicitLanguage) return explicitLanguage

  const headings = Object.values(state.settings.sectionTitles).join(' ')
  const sample = `${headings}\n${visibleText}`.toLowerCase()
  const ptEvidence = evidenceCount(sample, [
    /\bexperi[eê]ncia profissional\b/g,
    /\bforma[cç][aã]o acad[eé]mica\b/g,
    /\bcompet[eê]ncias\b/g,
    /\baptid[oõ]es\b/g,
    /\bidiomas\b/g,
    /\bcertifica[cç][oõ]es\b/g,
    /\b(resumo|perfil|educa[cç][aã]o|projetos?|tecnologias)\b/g,
    new RegExp(`\\b(${PT_ACTION_VERBS.join('|')})\\b`, 'g'),
  ])
  const enEvidence = evidenceCount(sample, [
    /\bwork experience\b/g,
    /\bprofessional summary\b/g,
    /\b(education|projects?|skills|languages|certifications)\b/g,
    new RegExp(`\\b(${EN_ACTION_VERBS.join('|')})\\b`, 'g'),
  ])

  if (ptEvidence >= 2 && ptEvidence > enEvidence) return 'pt-PT'
  if (enEvidence >= 2 && enEvidence >= ptEvidence) return 'en'
  return 'neutral'
}

export function actionLanguagePoints(state: CVState, language: AnalyzerLanguage) {
  const bullets = collectBullets(state).filter((bullet) => bullet.trim())
  if (!bullets.length) return { points: 0, actionLed: 0, total: 0, language }
  if (language === 'neutral') {
    return { points: 3, actionLed: 0, total: bullets.length, language }
  }

  const verbs = language === 'pt-PT' ? PT_ACTION_VERBS : EN_ACTION_VERBS
  const actionPattern = new RegExp(`^(${verbs.join('|')})\\b`, 'i')
  const actionLed = bullets.filter((bullet) => actionPattern.test(bullet.trim())).length
  const ratio = actionLed / bullets.length
  return {
    points: ratio >= 0.6 ? 6 : ratio >= 0.3 ? 3 : actionLed > 0 ? 1 : 0,
    actionLed,
    total: bullets.length,
    language,
  }
}

export function recognizableSectionHeadings(state: CVState, language: AnalyzerLanguage) {
  if (language === 'neutral') {
    const allPresent = [
      state.settings.sectionTitles.workExperience,
      state.settings.sectionTitles.education,
      state.settings.sectionTitles.projects,
      state.settings.sectionTitles.skills,
    ].every((title) => title.trim().length > 0)
    return { recognized: allPresent, fallback: true }
  }

  const patterns = SECTION_PATTERNS[language]
  const titles = state.settings.sectionTitles
  return {
    recognized: patterns.workExperience.test(titles.workExperience)
      && patterns.education.test(titles.education)
      && patterns.projects.test(titles.projects)
      && patterns.skills.test(titles.skills),
    fallback: false,
  }
}

export function languageLabel(language: AnalyzerLanguage) {
  if (language === 'pt-PT') return 'Portuguese (Portugal)'
  if (language === 'en') return 'English'
  return 'language-neutral fallback'
}

function evidenceCount(text: string, patterns: RegExp[]) {
  return patterns.reduce((total, pattern) => total + (text.match(pattern)?.length ?? 0), 0)
}

function collectBullets(state: CVState) {
  return [
    ...state.resume.workExperience.flatMap((item) => item.bullets),
    ...state.resume.projects.flatMap((item) => item.bullets),
    ...state.resume.customSections.flatMap((item) => item.bullets),
  ]
}
