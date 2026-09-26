import { describe, expect, it } from 'vitest'
import { scoreCV } from '@/features/scoring/scoreCV'
import { parseHeuristicResume } from './heuristicResumeParser'

// Text as the Analyzer's line builder produces it from a CVForge-style PDF:
// contact details on one line, an unheaded summary, organization lines above
// "role + right-aligned dates" lines, wrapped bullets, and a date inside a
// bullet. Anonymised fixture.
const CVFORGE_LAYOUT = [
  'Jordan Avery',
  'jordan.avery@example.org +44 7700 900123 Zürich, Switzerland',
  'https://www.linkedin.com/in/jordan-avery/ https://github.com/jordanavery',
  'Backend-focused software engineer completing an intensive systems programming curriculum,',
  'with hands-on experience building Unix systems, parsers, and automation-heavy backends in C and Python.',
  'Strong emphasis on correctness, testing, and predictable behaviour under real constraints.',
  'PROFESSIONAL EXPERIENCE',
  'Self-employed',
  'Private Chef Aug 2023 - Sep 2025',
  '• Designed and delivered personalized dining experiences for private clients while independently developing',
  'technical skills.',
  '• Stepped away in Sep 2025 to pursue full-time software engineering training and systems programming.',
  'Harbour Kitchen',
  'Chef & Consulting Jan 2019 - Feb 2023',
  '• Led kitchen operations and process optimization, building spreadsheet-based cost and supplier analysis tools',
  'that improved food-cost control, efficiency, and profitability while supporting high-pressure daily service',
  'and special events.',
  'EDUCATION',
  'Example Coding School',
  'Software Engineering Oct 2024 - Present',
  '• Completed 12+ peer-reviewed C projects including a Unix shell, memory allocators, graphics',
  'rendering, and network programming.',
  'PROJECTS',
  'CVForge 2025',
  'https://github.com/jordanavery/cvforge',
  '• Extended an open-source resume builder into a self-hosted ATS evaluation suite.',
  'MiniShell 2025',
  'https://github.com/jordanavery/minishell',
  '• Built a Unix shell in C using POSIX APIs with Bash-aligned behavior.',
  'SKILLS',
  'Technical:',
  '• C, POSIX, Python, Docker, Git',
  'LANGUAGES',
  'English - Native',
  'French - Fluent',
].join('\n')

function parse(text: string) {
  const result = parseHeuristicResume(text)
  if (!result) throw new Error('expected a parse result')
  return result
}

function issueStatus(text: string, id: string) {
  const result = parse(text)
  return scoreCV(result.draft, text, { includeExtraction: false }).issues.find((issue) => issue.id === id)?.status
}

describe('heuristic resume parser on a CVForge-style layout', () => {
  it('reads the location from the combined contact line, including accented names', () => {
    expect(parse(CVFORGE_LAYOUT).draft.resume.profile.location).toBe('Zürich, Switzerland')
  })

  it('reads the unheaded paragraph before the first section as the summary', () => {
    const { summary } = parse(CVFORGE_LAYOUT).draft.resume.profile
    expect(summary).toMatch(/^Backend-focused software engineer/)
    expect(summary).toMatch(/real constraints\.$/)
    expect(summary).not.toContain('@')
  })

  it('builds one work entry per job with role, organization, and dates from header lines', () => {
    const work = parse(CVFORGE_LAYOUT).draft.resume.workExperience
    expect(work.map(({ role, company, startDate, endDate, isCurrent }) => ({ role, company, startDate, endDate, isCurrent })))
      .toEqual([
        { role: 'Private Chef', company: 'Self-employed', startDate: 'Aug 2023', endDate: 'Sep 2025', isCurrent: false },
        { role: 'Chef & Consulting', company: 'Harbour Kitchen', startDate: 'Jan 2019', endDate: 'Feb 2023', isCurrent: false },
      ])
  })

  it('joins wrapped bullet lines and never starts an entry from a bullet date', () => {
    const [first, second] = parse(CVFORGE_LAYOUT).draft.resume.workExperience
    expect(first.bullets).toEqual([
      'Designed and delivered personalized dining experiences for private clients while independently developing technical skills.',
      'Stepped away in Sep 2025 to pursue full-time software engineering training and systems programming.',
    ])
    expect(second.bullets).toHaveLength(1)
    expect(second.bullets[0]).toMatch(/and special events\.$/)
  })

  it('reads education and projects from the same layout', () => {
    const { education, projects } = parse(CVFORGE_LAYOUT).draft.resume
    expect(education.map(({ school, degree, startDate, endDate }) => ({ school, degree, startDate, endDate })))
      .toEqual([{ school: 'Example Coding School', degree: 'Software Engineering', startDate: 'Oct 2024', endDate: 'Present' }])
    expect(projects.map(({ name, link, startDate }) => ({ name, link, startDate }))).toEqual([
      { name: 'CVForge', link: 'https://github.com/jordanavery/cvforge', startDate: '2025' },
      { name: 'MiniShell', link: 'https://github.com/jordanavery/minishell', startDate: '2025' },
    ])
  })

  it('passes the role and date, location, and summary checks that previously failed', () => {
    expect(issueStatus(CVFORGE_LAYOUT, 'roles-dates')).toBe('pass')
    expect(issueStatus(CVFORGE_LAYOUT, 'location')).toBe('pass')
    expect(issueStatus(CVFORGE_LAYOUT, 'summary')).toBe('pass')
  })
})

describe('heuristic resume parser on other common layouts', () => {
  it('keeps "Role at Company" headers with a separate date line', () => {
    const text = [
      'Sam Rivera',
      'sam@example.org',
      'Leeds, United Kingdom',
      'Experience',
      'Senior Developer at Northwind Ltd',
      'March 2021 - Present',
      '- Shipped a billing platform used by 40 teams.',
      'Developer at Contoso',
      '2018 - 2021',
      '- Maintained internal tooling.',
    ].join('\n')
    const { profile, workExperience } = parse(text).draft.resume
    expect(profile.location).toBe('Leeds, United Kingdom')
    expect(workExperience.map(({ role, company, startDate, endDate, isCurrent }) => ({ role, company, startDate, endDate, isCurrent })))
      .toEqual([
        { role: 'Senior Developer', company: 'Northwind Ltd', startDate: 'March 2021', endDate: 'Present', isCurrent: true },
        { role: 'Developer', company: 'Contoso', startDate: '2018', endDate: '2021', isCurrent: false },
      ])
  })

  it('handles date-first headers and role lines above the company', () => {
    const text = [
      'Experience',
      'Jan 2020 - Dec 2022',
      'Data Analyst',
      'Fabrikam Inc',
      '• Built weekly revenue dashboards.',
      'Jun 2018 - Dec 2019',
      'Research Intern',
      'Tailspin Labs',
      '• Cleaned survey data.',
    ].join('\n')
    const work = parse(text).draft.resume.workExperience
    expect(work.map(({ role, company, startDate, endDate }) => ({ role, company, startDate, endDate }))).toEqual([
      { role: 'Data Analyst', company: 'Fabrikam Inc', startDate: 'Jan 2020', endDate: 'Dec 2022' },
      { role: 'Research Intern', company: 'Tailspin Labs', startDate: 'Jun 2018', endDate: 'Dec 2019' },
    ])
  })

  it('splits one-line "Role | Company | dates" headers without bullets', () => {
    const text = [
      'Experience',
      'Product Engineer | Example Co | 2022 - Present',
      'QA Engineer | Other Co | 2019 - 2022',
    ].join('\n')
    const work = parse(text).draft.resume.workExperience
    expect(work.map(({ role, company, startDate, endDate }) => ({ role, company, startDate, endDate }))).toEqual([
      { role: 'Product Engineer', company: 'Example Co', startDate: '2022', endDate: 'Present' },
      { role: 'QA Engineer', company: 'Other Co', startDate: '2019', endDate: '2022' },
    ])
  })

  it('still reads a headed summary and leaves location empty when none is present', () => {
    const text = [
      'Taylor Brooks',
      'taylor@example.org',
      'Summary',
      'Platform engineer focused on reliable delivery pipelines and clear documentation.',
      'Experience',
      'Platform Engineer',
      'Contoso',
      '2020 - 2024',
    ].join('\n')
    const { profile } = parse(text).draft.resume
    expect(profile.summary).toBe('Platform engineer focused on reliable delivery pipelines and clear documentation.')
    expect(profile.location).toBe('')
  })
})

describe('heuristic skill extraction', () => {
  it('keeps parenthetical groups, drops category labels, and joins wrapped lines', () => {
    const text = [
      'Skills',
      'Technical:',
      '• C (systems programming, POSIX, memory management); Python (data pipelines, scripting);',
      '• Linux/Unix systems; Docker; Git/GitHub; CLI tooling & Makefiles; testing &',
      'correctness (Valgrind, custom test suites).',
    ].join('\n')
    expect(parse(text).draft.resume.skills.technical).toEqual([
      'C (systems programming, POSIX, memory management)',
      'Python (data pipelines, scripting)',
      'Linux/Unix systems',
      'Docker',
      'Git/GitHub',
      'CLI tooling & Makefiles',
      'testing & correctness (Valgrind, custom test suites)',
    ])
  })

  it('still splits a plain comma-separated list', () => {
    expect(parse('Skills\nTypeScript, React, PostgreSQL').draft.resume.skills.technical)
      .toEqual(['TypeScript', 'React', 'PostgreSQL'])
  })
})
