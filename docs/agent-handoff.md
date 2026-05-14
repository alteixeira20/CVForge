# CVForge Agent Handoff

## Source Map

### App Routes
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/builder/page.tsx`
- `apps/web/src/app/parser/page.tsx`
- `apps/web/src/app/resume-import/page.tsx`

### State and Persistence
- `apps/web/src/context/CVContext.tsx`
- `apps/web/src/context/cvReducer.ts`
- `apps/web/src/types/cv.ts`
- `apps/web/src/lib/cvState.ts`
- `apps/web/src/lib/storage.ts`

### Builder Workbench
- `apps/web/src/features/builder/workbench/BuilderWorkbench.tsx`
- `apps/web/src/features/builder/workbench/BuilderEditorPanel.tsx`
- `apps/web/src/features/builder/workbench/BuilderPreviewPanel.tsx`
- `apps/web/src/features/builder/workbench/BuilderSectionList.tsx`
- `apps/web/src/features/builder/workbench/BuilderEntryModal.tsx`

### Builder Section Editors
- `apps/web/src/features/builder/profile/ProfileEditor.tsx`
- `apps/web/src/features/builder/work/WorkExperienceEditor.tsx`
- `apps/web/src/features/builder/education/EducationEditor.tsx`
- `apps/web/src/features/builder/projects/ProjectsEditor.tsx`
- `apps/web/src/features/builder/skills/SkillListEditor.tsx`
- `apps/web/src/features/builder/languages/LanguagesEditor.tsx`
- `apps/web/src/features/builder/custom-sections/CustomSectionsEditor.tsx`
- `apps/web/src/features/builder/settings/SettingsEditor.tsx`

### PDF Preview and Export
- `apps/web/src/features/resume-pdf/ResumePdfDocument.tsx`
- `apps/web/src/features/resume-pdf/DownloadPdfButton.tsx`
- `apps/web/src/features/resume-pdf/embedCVStateAttachment.ts`
- `apps/web/src/features/resume-formatting.ts`

### Parser Workbench
- `apps/web/src/features/parser/workbench/ParserWorkbench.tsx`
- `apps/web/src/features/parser/upload/PdfUploadPanel.tsx`
- `apps/web/src/features/parser/upload/ParserHeuristicAction.tsx`
- `apps/web/src/features/parser/upload/ParserRestoreAction.tsx`
- `apps/web/src/features/parser/diagnostics/ExtractionDiagnostics.tsx`
- `apps/web/src/features/parser/diagnostics/TextPreview.tsx`
- `apps/web/src/features/parser/source/SourcePdfPreview.tsx`
- `apps/web/src/lib/parser/heuristicResumeParser.ts`
- `apps/web/src/features/scoring/scoreCV.ts`

### Shared UI Primitives
- `apps/web/src/components/shared/workbench/WorkbenchShell.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchPanel.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchHeader.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchActionGroup.tsx`
- `apps/web/src/components/shared/workbench/PreviewCanvas.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchSectionCard.tsx`
- `apps/web/src/components/shared/form/FormField.tsx`
- `apps/web/src/components/shared/sections/SectionCard.tsx`

### Branding and Theme
- `apps/web/src/components/ui/Brand.tsx`
- `apps/web/src/components/ui/BrandMark.tsx`
- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/layout/AppHeader.tsx`
- `apps/web/src/context/ThemeContext.tsx`
- `apps/web/public/brand/`
- `apps/web/src/styles/workspace.css`

### Styles
- `apps/web/src/styles/tokens.css`
- `apps/web/src/styles/base.css`
- `apps/web/src/styles/ui.css`
- `apps/web/src/styles/site.css`
- `apps/web/src/styles/workspace.css`
- `apps/web/src/styles/modals.css`

### Documentation
- `README.md`
- `docs/product-scope.md`
- `docs/implementation-plan.md`
- `docs/clean-room.md`
- `CLAUDE.md`
- `docs/agent-handoff.md`
- `docs/agent-workflow.md`
- `docs/current-qa-plan.md`
- `docs/current-focus.md`

### Tooling
- `Makefile`
- `package.json`
- `apps/web/package.json`
- `Dockerfile`
- `docker-compose.yml`

## Recent Completed Work
- Major visual alignment for Builder, Parser, and Forge Apps branding.
- Full implementation of Builder sections and shared workbench primitives.
- Integration of parser scoring and diagnostic signals.

## Known Current Issue
The Builder PDF preview iframe visibly flashes/reloads when the underlying blob URL is updated during active typing. A calm preview update strategy (longer idle debounce + manual refresh) is required.