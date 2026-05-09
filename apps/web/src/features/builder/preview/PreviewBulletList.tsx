import { type Settings } from '@/types/cv'

interface PreviewBulletListProps {
  bullets: string[]
  settings: Settings
}

export function PreviewBulletList({ bullets, settings }: PreviewBulletListProps) {
  const visibleBullets = bullets.filter((bullet) => bullet.trim())

  if (visibleBullets.length === 0) return null

  return (
    <ul className="list-disc pl-16 space-y-2 mt-4">
      {visibleBullets.map((bullet, i) => (
        <li
          key={i}
          className="text-gray-700"
          style={{ fontSize: Math.max(8, settings.fontSize - 1), lineHeight: settings.lineHeight }}
        >
          {bullet}
        </li>
      ))}
    </ul>
  )
}
