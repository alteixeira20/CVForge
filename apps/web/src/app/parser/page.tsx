import { Suspense } from 'react'
import { ParserWorkbench } from '@/features/parser/workbench/ParserWorkbench'

export default function ParserPage() {
  return (
    <Suspense fallback={<div className="app-shell" />}>
      <ParserWorkbench />
    </Suspense>
  )
}
