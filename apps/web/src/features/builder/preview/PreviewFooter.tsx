import { type Settings } from '@/types/cv'

export function PreviewFooter({ settings }: { settings: Settings }) {
  return (
    <div className="mt-auto p-20 border-t border-gray-50 flex justify-between items-center grayscale opacity-50 select-none">
      <span className="text-[9px] text-gray-400 font-mono uppercase tracking-tighter italic">
        Clean-Room Build Prototype
      </span>
      <div className="flex gap-8 text-[9px] text-gray-400 font-mono uppercase">
        <span>{settings.documentSize}</span>
        <span>•</span>
        <span>{settings.localePreset}</span>
      </div>
    </div>
  )
}
