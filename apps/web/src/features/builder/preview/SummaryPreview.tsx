import { type Settings } from '@/types/cv'
import { PreviewSection } from './PreviewSection'

export function SummaryPreview({ summary, settings }: { summary: string; settings: Settings }) {
  return (
    <PreviewSection title="Professional Summary" settings={settings} marginTop={settings.profileSpacing}>
      <p
        className="leading-relaxed text-gray-700 whitespace-pre-wrap mt-8"
        style={{ fontSize: settings.fontSize, lineHeight: settings.lineHeight }}
      >
        {summary}
      </p>
    </PreviewSection>
  )
}
