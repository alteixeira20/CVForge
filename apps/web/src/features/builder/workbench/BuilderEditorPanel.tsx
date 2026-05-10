import { BuilderSectionList } from './BuilderSectionList'
import { ImportExportActions } from '@/features/import-export/ImportExportActions'

export function BuilderEditorPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto p-16 lg:p-24 pb-16">
        <header className="workspace-head compact">
          <div className="crumbline">Workbench / Builder</div>
          <h1>CV Builder</h1>
          <p className="muted text-sm">Edit your CV sections below. Changes are saved locally.</p>
        </header>

        <div className="mt-24">
          <BuilderSectionList />
        </div>
      </div>

      <ImportExportActions />
    </div>
  )
}
