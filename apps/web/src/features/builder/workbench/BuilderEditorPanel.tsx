import { BuilderSectionList } from './BuilderSectionList'

export function BuilderEditorPanel() {
  return (
    <div className="p-24 lg:p-40 space-y-48 pb-80">
      <header className="workspace-head">
        <div className="crumbline">Workbench / Builder</div>
        <h1>CV Builder</h1>
        <p className="muted text-sm">Edit your CV sections below. Changes are saved locally.</p>
      </header>

      <BuilderSectionList />
    </div>
  )
}
