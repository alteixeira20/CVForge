import { Text, View } from '@react-pdf/renderer'
import { type Skills } from '@/types/cv'
import { cleanList } from '@/features/resume-formatting'
import { ResumePdfSection } from './ResumePdfSection'
import { type PdfStyles } from './types'

export function hasPdfSkills(skills: Skills) {
  return cleanList(buildTechnicalSkills(skills)).length > 0
    || cleanList(skills.soft).length > 0
}

export function ResumePdfSkills({ skills, styles, title = 'Skills' }: { skills: Skills; styles: PdfStyles; title?: string }) {
  const technical = cleanList(buildTechnicalSkills(skills))
  const soft = cleanList(skills.soft)

  if (technical.length === 0 && soft.length === 0) return null

  return (
    <ResumePdfSection title={title} styles={styles}>
      <View>
        {technical.length > 0 && (
          <SkillRow label="Technical Skills" values={technical} styles={styles} isLast={soft.length === 0} />
        )}
        {soft.length > 0 && (
          <SkillRow label="Ways of Working" values={soft} styles={styles} isLast />
        )}
      </View>
    </ResumePdfSection>
  )
}

function SkillRow({ label, values, styles, isLast }: { label: string; values: string[]; styles: PdfStyles; isLast: boolean }) {
  return (
    <View style={isLast ? styles.skillRowLast : styles.skillRow}>
      <Text style={styles.skillLabel}>{label}</Text>
      <Text style={styles.skillValues}>{values.join(', ')}</Text>
    </View>
  )
}

function buildTechnicalSkills(skills: Skills) {
  return [
    ...skills.featured,
    ...skills.featuredWithRating.map((item) => item.skill),
    ...skills.technical,
  ]
}
