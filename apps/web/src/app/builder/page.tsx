import type { Metadata } from 'next'
import { BuilderWorkbench } from '@/features/builder/workbench/BuilderWorkbench'

export const metadata: Metadata = {
  title: 'Builder',
  description: 'Build, preview, back up, and export a structured CV locally in your browser.',
}

export default function BuilderPage() {
  return <BuilderWorkbench />
}
