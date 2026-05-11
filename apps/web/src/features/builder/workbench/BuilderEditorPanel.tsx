import { BuilderSectionList } from './BuilderSectionList'
import { ImportExportActions } from '@/features/import-export/ImportExportActions'
import { WorkbenchHeader } from '@/components/shared/workbench/WorkbenchHeader'

export function BuilderEditorPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <WorkbenchHeader
          eyebrow="Builder Workbench"
          title="Craft your CV"
          description="Edit your CV sections below. All changes are saved in your browser, so saving a JSON backup is recommended."
          actions={<ImportExportActions />}
        />

        <div className="p-5 lg:p-8 pt-6 pb-20">
          <BuilderSectionList />
        </div>
      </div>
    </div>
  )
}
