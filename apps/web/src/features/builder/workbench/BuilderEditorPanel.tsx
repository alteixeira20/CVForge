import { BuilderSectionList } from './BuilderSectionList'
import { ImportExportActions } from '@/features/import-export/ImportExportActions'

export function BuilderEditorPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 px-5 lg:px-8 py-3 lg:py-4 bg-bg/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="workspace-head compact !mb-0">
              <div className="crumbline hidden lg:block">Builder Workbench</div>
              <h1>Craft your CV</h1>
              <p className="muted text-[11px] leading-relaxed max-w-sm mt-1 hidden lg:block">
                Edit your CV sections below. All changes are saved in your browser, so saving a JSON backup is recommended.
              </p>
            </div>
            <div className="pt-1">
              <ImportExportActions />
            </div>
          </div>
        </header>

        <div className="p-5 lg:p-8 pt-6 pb-20">
          <BuilderSectionList />
        </div>
      </div>
    </div>
  )
}
