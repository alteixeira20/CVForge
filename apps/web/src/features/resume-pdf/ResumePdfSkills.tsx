import { Text, View } from '@react-pdf/renderer'
import { type Skills } from '@/types/cv'
import { cleanList } from '@/features/resume-formatting'
import { ResumePdfSection } from './ResumePdfSection'
import { type PdfStyles } from './types'

export function hasPdfSkills(skills: Skills) {
  return skills.featuredWithRating.some((item) => item.skill.trim())
    || cleanList(skills.featured).length > 0
    || cleanList(skills.technical).length > 0
    || cleanList(skills.soft).length > 0
}

export function ResumePdfSkills({ skills, styles, title = 'Skills' }: { skills: Skills; styles: PdfStyles; title?: string }) {
  const featured = [
    ...cleanList(skills.featured),
    ...skills.featuredWithRating
      .filter((item) => item.skill.trim())
      .map((item) => `${item.skill.trim()}${typeof item.rating === 'number' ? ` (${item.rating}/5)` : ''}`),
  ]
  const technical = cleanList(skills.technical)
  const soft = cleanList(skills.soft)

  return (
    <ResumePdfSection title={title} styles={styles}>
      <View>
        {featured.length > 0 && <Text>{featured.join(', ')}</Text>}
        {technical.length > 0 && <Text>Technical: {technical.join(', ')}</Text>}
        {soft.length > 0 && <Text>Soft: {soft.join(', ')}</Text>}
      </View>
    </ResumePdfSection>
  )
}
