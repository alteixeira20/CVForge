import { type DescriptionMode } from '@/types/cv'
import { ResumePdfBullets, ResumePdfParagraph } from './ResumePdfSection'
import { type createResumePdfStyles } from './resumePdfStyles'

type Styles = ReturnType<typeof createResumePdfStyles>

export function renderDescription(
  bullets: string[],
  mode: DescriptionMode,
  visible: boolean,
  styles: Styles,
) {
  if (mode === 'paragraph') {
    return <ResumePdfParagraph bullets={bullets} styles={styles} visible={visible} />
  }
  return <ResumePdfBullets bullets={bullets} styles={styles} visible={visible} />
}
