# Current Focus: Manual QA and Post-Refactor Validation

## 1. Current State

CVForge has completed a full pre-QA architecture refactoring sprint. The codebase is now in its post-refactor state, waiting for validation and manual QA.

### Architecture refactoring (completed)
- **Parser split**: `heuristicResumeParser.ts` is now an orchestrator. Internal logic lives in `lib/parser/heuristic/` (heuristicTypes, dateParsing, sectionDetection, profileExtraction, sectionExtraction).
- **ImportModal split**: `ImportModal.tsx` orchestrates state. `ImportFileDropzone`, `ImportConfirmStep`, and `PdfHeuristicReview` own the three presentational states.
- **PDF preview hooks extracted**: `useZoomControl.ts` and `useDevicePixelRatio.ts` extracted from `PdfCanvasPreview.tsx` into standalone files in `features/builder/workbench/`.
- **Folder renames**: `features/builder/work/` renamed to `features/builder/work-experience/`.
- **File moves**: `features/resume-formatting.ts` moved to `lib/resume-formatting.ts`; `context/BuilderAddFocusContext.tsx` moved to `features/builder/context/BuilderAddFocusContext.tsx`.
- **Schema migration**: `lib/cvMigrations.ts` added. `migrateCVState()` runs before `parseCVState` on all external state sources. `CURRENT_CV_SCHEMA_VERSION` is the single version constant. `CVStateSchema.schemaVersion` uses `z.literal()` so states from newer builds are rejected, not silently loaded.
- **Pre-QA hygiene**: `.gitignore` updated; `crypto.randomUUID()` adopted for ID generation; empty `Badge.tsx` deleted; Homepage ThemeToggle inline style replaced with Tailwind class.

### Prior sprint (still in the build)
- Advanced PDF layout settings, section reordering/visibility, inline editable section titles, and 10 professional color presets.
- Builder Workbench modularity: `BuilderSectionList.tsx` decomposed into config, hook, and card component files.
- Accessibility: Enter-to-blur inputs, `focus-visible` ring, `aria-label`/`aria-pressed` throughout.
- PDF parity confirmed: accent stripe, always-mono dates, `<View>` bullet markers, all 9 layout settings wired.

## 2. What to Do Next

**Immediate - Validation:**
- Run `make check` (typecheck + lint + build) to surface any type or lint errors from all refactoring slices.
- Manual QA: open the live Builder, fill in representative CV data, spot-check the PDF preview canvas, and compare against a downloaded PDF. The two paths are designed to stay visually aligned. `pdf-mockup/` has been removed as a root-level working artifact.

**PDF Phase 2 Refinements (deferred):**
- `sectionTitleText.letterSpacing`: 1.2 -> 1.3
- `skillLabel`: add `paddingTop: 1.5`, `letterSpacing: 0.2`
- `entrySubtitle.marginBottom`: 2 -> 3
- `dateSize` offset: -1.5 -> -2 (gives 9pt at default font size 11pt)

## 3. Genuinely Deferred (Do Not Implement Unless Instructed)

- **Font embedding**: Geist Sans / Geist Mono as real PDF font assets (Phase 3 of PDF work).
- **Photo support**: User photo upload and photo-layout PDF template.
- **Drag-and-drop section reordering**: Arrow-based reorder is shipped; drag-and-drop is a UX enhancement for later.
- **Richer parser extraction and scoring**: Heuristic checks remain minimal by design.
- **Website/marketing polish**: Landing page copy and visual improvements.
- **Root architecture cleanup**: Monorepo tooling, Docker CI, deployment polish.

## 4. Constraints (Do Not Touch List)

- Do NOT implement product or UI code when asked to audit or document.
- Do NOT redesign the core product layout or Workbench shell.
- Do NOT add database, backend, or account-related language to documentation.
- Maintain the local-first, browser-only product identity.
