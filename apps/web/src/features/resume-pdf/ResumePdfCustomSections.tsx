import { type CustomSection, type Settings } from '@/types/cv'
import { cleanList, cleanText } from '@/features/resume-formatting'
import { ResumePdfBullets, ResumePdfSection } from './ResumePdfSection'
import { type PdfStyles } from './types'

export function ResumePdfCustomSections({ items, styles, settings }: { items: CustomSection[]; styles: PdfStyles; settings: Settings }) {
  return (
    <>
      {items.filter((item) => hasCustomSectionContent(item, settings.bulletVisibility.customSections)).map((item) => (
        <ResumePdfSection key={item.id} title={cleanText(item.title)} styles={styles}>
          <ResumePdfBullets
            bullets={item.bullets}
            styles={styles}
            visible={settings.bulletVisibility.customSections}
          />
        </ResumePdfSection>
      ))}
    </>
  )
}

function hasCustomSectionContent(item: CustomSection, bulletsVisible: boolean) {
  return Boolean(cleanText(item.title) && bulletsVisible && cleanList(item.bullets).length > 0)
}
