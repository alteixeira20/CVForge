# CVForge Agent Handoff

## Source Map

### App Routes
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/builder/page.tsx`
- `apps/web/src/app/analyzer/page.tsx` (canonical Analyzer)
- `apps/web/src/app/parser/page.tsx` (permanent compatibility redirect)
- `apps/web/src/app/resume-import/page.tsx`
- `apps/web/src/app/robots.ts`
- `apps/web/src/app/sitemap.ts`
- `apps/web/src/app/opengraph-image.tsx`
- `apps/web/src/app/health/route.ts`
- `apps/web/src/app/error.tsx`
- `apps/web/src/app/global-error.tsx`
- `apps/web/src/app/not-found.tsx`

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

### Analyzer Workbench (internal parser modules)
- `apps/web/src/features/parser/workbench/ParserWorkbench.tsx`
- `apps/web/src/features/parser/upload/PdfUploadPanel.tsx`
- `apps/web/src/features/parser/upload/analysisFileSupport.ts` (PDF-only boundary)
- `apps/web/src/lib/parser/analysisFileValidation.ts`
- `apps/web/src/lib/parser/analysisLimits.ts`
- `apps/web/src/lib/parser/pdfExtraction.ts`
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
- `apps/web/src/features/scoring/scoreSignals.ts`
- `apps/web/src/features/scoring/scoringTypes.ts`
- `apps/web/src/features/scoring/languageSignals.ts`
- `apps/web/src/features/scoring/visibleResumeText.ts`

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

### Branding and Atmosphere
- `apps/web/src/components/ui/Brand.tsx`
- `apps/web/src/components/ui/EmberBackground.tsx`
- `apps/web/src/components/layout/SiteHeader.tsx`
- `apps/web/src/components/layout/AppHeader.tsx`
- `apps/web/src/components/layout/SiteFooter.tsx`
- `apps/web/public/brand/`
- `apps/web/src/styles/workspace.css`

### SEO
- `apps/web/src/lib/siteConfig.ts` (`NEXT_PUBLIC_SITE_URL` source of truth)
- `apps/web/src/components/seo/StructuredData.tsx`
- `apps/web/src/app/robots.ts`
- `apps/web/src/app/sitemap.ts`
- `apps/web/src/app/opengraph-image.tsx`

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
- `apps/web/playwright.config.ts`
- `apps/web/e2e/release-smoke.spec.ts`
- `apps/web/e2e/accessibility.spec.ts`
- `Dockerfile`
- `docker-compose.yml`
- `.github/workflows/validation.yml`
- `scripts/release-check.sh`
- `scripts/docker-check.sh`
- `scripts/preview.sh`
- `scripts/assert-release-artifacts.sh`
- `scripts/cross-browser-check.sh`

## Final Deployment-Hardening Pass

- Analyzer PDF input is limited to 15 MB and 20 pages and validated by extension,
  available MIME, signature, structure, and page count. Extraction runs sequentially,
  supports cancellation, releases PDF.js resources, and rejects stale generations.
- Scoring method v3 uses documented weights, normalized visible Builder text,
  contextual impact patterns, English and PT-PT headings/action verbs, neutral-language
  fallback, and expanded extraction-quality signals.
- Result order prioritizes problems and warnings; passed checks are collapsed. Every
  non-pass finding exposes priority, evidence, impact, action, and dimension.
- Current-version CV objects preserve unknown extension fields. Unit tests cover
  migrations, future-version rejection, malformed input, long accented content,
  settings/order/visibility/theme, storage, and quota failure.
- Axe covers the main homepage, Builder, Analyzer, and import-review states. Live regions
  announce analysis and import/export outcomes without changing the visual design.
- Production responses include CSP, nosniff, referrer, permissions, COOP, and CORP
  policies compatible with the local PDF worker, blob downloads/previews, fonts, and
  generated Open Graph route.
- `make release-check` is the single strict release gate. The standalone preview defaults
  to port 3030 and stops only its recorded process. Docker validation uses an isolated
  random container name and removes it on every exit path.
- GitHub Actions validates static checks, Chromium, Firefox/WebKit critical smoke, and
  Docker without secrets, publication, or deployment.
- Production deployment and rollback are owner operations documented in
  `docs/deployment.md`.

## Recent Completed Work

### Analyzer and SEO polish pass
- `/analyzer` is canonical; `/parser` permanently redirects and `/resume-import` keeps its Builder compatibility redirect.
- Header content is constrained to the site container and exposes Builder, Analyzer, Source, an explicit GitHub star handoff, and the primary Builder action.
- Hero copy, trust ordering, fictional Builder preview, and Analyzer insight preview now communicate the complete product in the first viewport.
- Analyzer scoring method v2 reports whole-number Completeness, Structure, Clarity, Impact, ATS-style compatibility, and conditional PDF Parseability dimensions.
- Prioritized checks include detected evidence summaries, why-it-matters context, and concrete improvement suggestions.
- PDF remains the only supported analysis format. Image-only PDFs receive actionable local-only guidance; DOCX, plain text, and cloud OCR remain unimplemented.
- Landing cards, preview chrome, footer, and outer workbench surfaces use a restrained transparent hierarchy so the forge atmosphere remains visible.
- Buttons move as complete surfaces, keep icon/text locked, return on press, preserve focus visibility, disable honestly, and remove transforms under reduced motion.
- `NEXT_PUBLIC_SITE_URL` drives metadata, canonical links, robots, sitemap, JSON-LD, and social URLs. The local fallback is `http://localhost:3000`.
- `/`, `/builder`, and `/analyzer` are the only indexable sitemap routes; each has unique metadata and meaningful visible content.
- Homepage JSON-LD and the generated 1200×630 Open Graph image contain only shipped, factual claims.
- Release smoke coverage now includes the full responsive matrix, header constraints, trust-row visibility, interactions, Analyzer routes/scoring/formats, metadata, JSON-LD, robots, sitemap, manifest, and social image.

### Ship-readiness pass (historical baseline)
- Responsive homepage navigation presented one primary Builder path, kept the then-named Parser secondary, and moved Source out of the smallest header while retaining it in the footer.
- Builder entry and import dialogs use responsive dimensions, a single assistive-technology-visible modal at a time, stacked scroll locking, reliable focus recovery, and trigger restoration.
- Builder and the then-named Parser navigation became route-aware with visible active treatment and `aria-current`.
- The landing page gained a clearer Builder-versus-Parser story, a shorter three-step workflow, six consolidated capability cards, and a concise Anvilary Labs → Anvilary Tools → CVForge footer.
- Workbench controls, text contrast, loading/error announcements, touch targets, reduced-motion handling, and compact-width layouts were hardened.
- Playwright release smoke coverage verifies route availability, horizontal overflow, modal focus/semantics, active navigation, reduced motion, persistence, JSON restore, embedded-PDF detection, and review-first external PDF import.
- Next.js, PostCSS, and Sharp received security-only patch updates; standalone tracing now includes Sharp's glibc and musl libvips runtimes for local and Alpine deployments.
- `make docker-check` uses Node's built-in `fetch`, removing an undeclared host `curl` dependency.

### Architecture Refactoring (pre-QA)
- `heuristicResumeParser.ts` split into orchestrator + `lib/parser/heuristic/` submodules (types, date parsing, section detection, profile extraction, section extraction).
- `ImportModal.tsx` split: orchestrator retains state; `ImportFileDropzone`, `ImportConfirmStep`, and `PdfHeuristicReview` own presentational states.
- `PdfCanvasPreview.tsx` zoom/DPR logic extracted: `useZoomControl.ts` and `useDevicePixelRatio.ts` live alongside the component in `features/builder/workbench/`.
- `features/builder/work/` renamed to `features/builder/work-experience/` to match the data model key.
- `features/resume-formatting.ts` moved to `lib/resume-formatting.ts` (no feature dependency).
- `context/BuilderAddFocusContext.tsx` moved to `features/builder/context/BuilderAddFocusContext.tsx`.
- `lib/cvMigrations.ts` added: `migrateCVState()` runs before `parseCVState` on localStorage restore, JSON import, and PDF attachment restore. `CURRENT_CV_SCHEMA_VERSION` exported from `types/cv.ts`. `CVStateSchema.schemaVersion` uses `z.literal(CURRENT_CV_SCHEMA_VERSION)` to reject states saved by a newer build.
- Pre-QA hygiene: `.gitignore` updated, `crypto.randomUUID()` adopted for ID generation, and the empty `Badge.tsx` deleted.

### Prior Sprint
- Major visual alignment for Builder, Parser, and the Anvilary product family.
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
