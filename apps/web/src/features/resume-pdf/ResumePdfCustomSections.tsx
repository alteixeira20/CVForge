import { type CustomSection } from '@/types/cv'
import { ResumePdfBullets, ResumePdfSection } from './ResumePdfSection'
import { type PdfStyles } from './types'

export function ResumePdfCustomSections({ items, styles }: { items: CustomSection[]; styles: PdfStyles }) {
  return (
    <>
      {items.filter(hasCustomSectionContent).map((item) => (
        <ResumePdfSection key={item.id} title={item.title || 'Custom Section'} styles={styles}>
          <ResumePdfBullets bullets={item.bullets} styles={styles} />
        </ResumePdfSection>
      ))}
    </>
  )
}

function hasCustomSectionContent(item: CustomSection) {
  return item.title.trim() || item.bullets.some((bullet) => bullet.trim())
}
