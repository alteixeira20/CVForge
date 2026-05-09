import { Text, View } from '@react-pdf/renderer'
import { type Skills } from '@/types/cv'
import { ResumePdfSection } from './ResumePdfSection'
import { type PdfStyles } from './types'

export function hasPdfSkills(skills: Skills) {
  return skills.featuredWithRating.length > 0 || skills.technical.length > 0 || skills.soft.length > 0
}

export function ResumePdfSkills({ skills, styles }: { skills: Skills; styles: PdfStyles }) {
  return (
    <ResumePdfSection title="Skills" styles={styles}>
      <View>
        {skills.featuredWithRating.map((item) => (
          <Text key={item.skill}>{item.skill}{item.rating ? ` (${item.rating}/5)` : ''}</Text>
        ))}
        {skills.technical.length > 0 && <Text>Technical: {skills.technical.join(', ')}</Text>}
        {skills.soft.length > 0 && <Text>Soft: {skills.soft.join(', ')}</Text>}
      </View>
    </ResumePdfSection>
  )
}
