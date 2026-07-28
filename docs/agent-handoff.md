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
- `apps/web/src/types/cv.ts` (Zod schemas + `CURRENT_CV_SCHEMA_VERSION`)
- `apps/web/src/lib/cvState.ts`
- `apps/web/src/lib/storage.ts`
- `apps/web/src/lib/cvMigrations.ts` (run `migrateCVState` before `parseCVState` on all external state)

### Builder Workbench
- `apps/web/src/features/builder/workbench/BuilderWorkbench.tsx`
- `apps/web/src/features/builder/workbench/BuilderEditorPanel.tsx`
- `apps/web/src/features/builder/workbench/BuilderPreviewPanel.tsx`
- `apps/web/src/features/builder/workbench/BuilderSectionList.tsx`
- `apps/web/src/features/builder/workbench/BuilderEntryModal.tsx`
- `apps/web/src/features/builder/workbench/builderSectionConfig.tsx` (static section metadata)
- `apps/web/src/features/builder/workbench/BuilderSectionCard.tsx` (per-card render component)
- `apps/web/src/features/builder/workbench/SectionReorderControls.tsx` (up/down button pair)
- `apps/web/src/features/builder/workbench/AddCustomSectionCard.tsx` (CTA for adding first custom section)
- `apps/web/src/features/builder/workbench/useBuilderSectionState.ts` (expandedIds + focusVersions)
- `apps/web/src/features/builder/workbench/useBuilderSectionActions.ts` (handleAdd, toggleVisibility, handleMove)
- `apps/web/src/features/builder/hooks/useDescriptionModeToggle.ts` (shared mode toggle for item editors)

### Builder Context
- `apps/web/src/features/builder/context/BuilderAddFocusContext.tsx`

### Builder Section Editors
- `apps/web/src/features/builder/profile/ProfileEditor.tsx`
- `apps/web/src/features/builder/work-experience/WorkExperienceEditor.tsx`
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
- `apps/web/src/lib/resume-formatting.ts` (cleanText, cleanList, formatDateRange, joinNonEmpty)
- `apps/web/src/features/builder/workbench/PdfCanvasPreview.tsx` (canvas render + dock UI)
- `apps/web/src/features/builder/workbench/useZoomControl.ts` (zoom/fit state)
- `apps/web/src/features/builder/workbench/useDevicePixelRatio.ts` (DPR tracking)

### Parser Workbench
- `apps/web/src/features/parser/workbench/ParserWorkbench.tsx`
- `apps/web/src/features/parser/upload/PdfUploadPanel.tsx`
- `apps/web/src/features/parser/upload/ParserHeuristicAction.tsx`
- `apps/web/src/features/parser/upload/ParserRestoreAction.tsx`
- `apps/web/src/features/parser/diagnostics/ExtractionDiagnostics.tsx`
- `apps/web/src/features/parser/diagnostics/TextPreview.tsx`
- `apps/web/src/features/parser/source/SourcePdfPreview.tsx`
- `apps/web/src/lib/parser/heuristicResumeParser.ts` (public orchestrator)
- `apps/web/src/lib/parser/heuristic/heuristicTypes.ts`
- `apps/web/src/lib/parser/heuristic/dateParsing.ts`
- `apps/web/src/lib/parser/heuristic/sectionDetection.ts`
- `apps/web/src/lib/parser/heuristic/profileExtraction.ts`
- `apps/web/src/lib/parser/heuristic/sectionExtraction.ts`
- `apps/web/src/lib/parser/extractCVForgeAttachment.ts`
- `apps/web/src/features/scoring/scoreCV.ts`

### Import and Export
- `apps/web/src/features/import-export/ImportModal.tsx` (orchestrator)
- `apps/web/src/features/import-export/ImportFileDropzone.tsx`
- `apps/web/src/features/import-export/ImportConfirmStep.tsx`
- `apps/web/src/features/import-export/PdfHeuristicReview.tsx`
- `apps/web/src/features/import-export/ImportReviewTable.tsx`
- `apps/web/src/features/import-export/importCVState.ts`

### Shared UI Primitives
- `apps/web/src/components/shared/workbench/WorkbenchShell.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchPanel.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchHeader.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchActionGroup.tsx`
- `apps/web/src/components/shared/workbench/PreviewCanvas.tsx`
- `apps/web/src/components/shared/workbench/WorkbenchSectionCard.tsx`
- `apps/web/src/components/shared/form/FormField.tsx`
- `apps/web/src/components/shared/sections/RepeatableSectionEditor.tsx`
- `apps/web/src/components/shared/sections/SectionItemHeader.tsx`
- `apps/web/src/components/shared/sections/HoldDeleteButton.tsx`

### Branding and Theme
- `apps/web/src/components/ui/Brand.tsx`
- `apps/web/src/components/ui/BrandMark.tsx`
- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/layout/AppHeader.tsx`
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

### Architecture Refactoring (pre-QA)
- `heuristicResumeParser.ts` split into orchestrator + `lib/parser/heuristic/` submodules (types, date parsing, section detection, profile extraction, section extraction).
- `ImportModal.tsx` split: orchestrator retains state; `ImportFileDropzone`, `ImportConfirmStep`, and `PdfHeuristicReview` own presentational states.
- `PdfCanvasPreview.tsx` zoom/DPR logic extracted: `useZoomControl.ts` and `useDevicePixelRatio.ts` live alongside the component in `features/builder/workbench/`.
- `features/builder/work/` renamed to `features/builder/work-experience/` to match the data model key.
- `features/resume-formatting.ts` moved to `lib/resume-formatting.ts` (no feature dependency).
- `context/BuilderAddFocusContext.tsx` moved to `features/builder/context/BuilderAddFocusContext.tsx`.
- `lib/cvMigrations.ts` added: `migrateCVState()` runs before `parseCVState` on localStorage restore, JSON import, and PDF attachment restore. `CURRENT_CV_SCHEMA_VERSION` exported from `types/cv.ts`. `CVStateSchema.schemaVersion` uses `z.literal(CURRENT_CV_SCHEMA_VERSION)` to reject states saved by a newer build.
- Pre-QA hygiene: `.gitignore` updated, `crypto.randomUUID()` adopted for ID generation, empty `Badge.tsx` deleted, Homepage ThemeToggle inline style replaced with Tailwind class.

### Prior Sprint
- Major visual alignment for Builder, Parser, and Forge Apps branding.
- Full implementation of Builder sections and shared workbench primitives.
- Integration of parser scoring and diagnostic signals.
- PDF.js canvas preview pipeline replacing the iframe: flicker-free, zoom/fit controls.
- Builder Workbench polish: repeatable item cards, shared expand/collapse, hold-to-delete, inline editable section titles, description format toggle, compact Settings panels, and 10 professional color presets.
- Advanced PDF layout settings: 9 controls (theme color, font family/size, page size, section heading weight, top accent bar toggle and height, per-section gaps, compact mode) all wired to `resumePdfStyles.ts`.
- Builder section reordering (up/down arrows) and per-section visibility toggles driven by `settings.sectionOrder` and `settings.visibleSections`.
- Builder Workbench modularity: decomposed `BuilderSectionList.tsx` into config, hook, and component files.
- `RepeatableSectionEditor` API simplified: dead props removed, `focusLatestVersion` effect kept inline.
- Education location field added; `useDescriptionModeToggle` hook extracted from Work/Edu/Projects/Custom editors.
- Accessibility polish: Enter-to-blur on text/number inputs (with `isComposing` guard), `focus-visible:outline-none` on all form fields, `EditableSectionTitle` keyboard-navigable, `aria-label`/`aria-pressed` on action buttons throughout.
- Dead code removed: `SectionCard.tsx`, `useExpandedItem.ts`, `FONT_FAMILY_OPTIONS`, `styles.entryGroup`, "Entry gap" UI control (schema key kept for backward compat).
- PDF parity confirmed: accent stripe, always-mono dates, `<View>` bullet markers, nested language proficiency `<Text>`, all 9 advanced settings wired.