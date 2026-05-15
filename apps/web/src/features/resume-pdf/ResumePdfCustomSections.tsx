import { type CustomSection, type Settings } from '@/types/cv'
import { cleanList, cleanText } from '@/features/resume-formatting'
import { ResumePdfBullets, ResumePdfParagraph, ResumePdfSection } from './ResumePdfSection'
import { type PdfStyles } from './types'

export function ResumePdfCustomSections({ items, styles, settings }: { items: CustomSection[]; styles: PdfStyles; settings: Settings }) {
  const mode = settings.descriptionMode.customSections
  const visible = settings.bulletVisibility.customSections

  return (
    <>
      {items.filter((item) => hasCustomSectionContent(item, visible)).map((item) => (
        <ResumePdfSection key={item.id} title={cleanText(item.title)} styles={styles}>
          {mode === 'paragraph'
            ? <ResumePdfParagraph bullets={item.bullets} styles={styles} visible={visible} />
            : <ResumePdfBullets bullets={item.bullets} styles={styles} visible={visible} />
          }
        </ResumePdfSection>
      ))}
    </>
  )
}

function hasCustomSectionContent(item: CustomSection, bulletsVisible: boolean) {
  return Boolean(cleanText(item.title) && bulletsVisible && cleanList(item.bullets).length > 0)
}
