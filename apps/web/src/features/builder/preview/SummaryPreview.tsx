import { type Settings } from '@/types/cv'
import { cleanText } from '@/features/resume-formatting'
import { PreviewSection } from './PreviewSection'

export function SummaryPreview({ summary, settings }: { summary: string; settings: Settings }) {
  const text = cleanText(summary)
  if (!text) return null

  return (
    <PreviewSection title="Professional Summary" settings={settings} marginTop={settings.profileSpacing}>
      <p
        className="leading-relaxed text-gray-700 whitespace-pre-wrap mt-8"
        style={{ fontSize: settings.fontSize, lineHeight: settings.lineHeight }}
      >
        {text}
      </p>
    </PreviewSection>
  )
}
