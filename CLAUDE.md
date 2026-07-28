# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Identity

CVForge is a local-first, browser-only CV builder, PDF exporter, and parser diagnostics tool. No accounts, no backend, no server-side storage. All user data lives in `localStorage` or is embedded in exported PDFs.

## Commands

**Run before suggesting done — do NOT run without user permission:**
- `pnpm lint` — ESLint across the monorepo
- `pnpm typecheck` — `tsc --noEmit` across the monorepo
- `pnpm build` — production Next.js build (catches type errors lint misses)
- `make check` — runs all three above in sequence

**Never run without explicit user request:**
- `git commit` / `git stash` / `git reset`
- `pnpm install` / `make install`
- `make dev` / `make start` / `docker build` / `docker up`

**Useful read-only commands:**
- `make status` — git status + web process + Docker status in one shot
- `rg <symbol>` — preferred over `grep` for symbol lookup across the repo

## Monorepo Layout

```
apps/web/          Next.js app (the only app)
  src/
    app/           Next.js App Router pages (builder, parser, resume-import)
    context/       Global state (CVContext)
    features/      Feature modules (builder, parser, resume-pdf, import-export, scoring)
    types/cv.ts    Single Zod schema file — the data contract for the entire app
    lib/           Utilities (storage, cvState, exportCVState, importCVState, parser)
    components/    Shared UI primitives (workbench shell, form controls, section cards)
    styles/        Global CSS tokens and workspace styles
  public/brand/    SVG brand assets
Makefile           Developer commands (see above)
Dockerfile         Production Docker image
```

## State Architecture

**Single state object:** `CVState = { resume: Resume, settings: Settings, schemaVersion, updatedAt }`

- `Resume` holds profile, workExperience, education, projects, skills, languages, customSections.
- `Settings` holds all PDF rendering controls: themeColor, fontFamily, fontSize, spacings, section order, visibility, description modes, section titles.
- Both are defined with Zod in `apps/web/src/types/cv.ts`. This is the authoritative schema.

**Reducer pattern:**
- `CVContext.tsx` provides state + dispatch.
- `cvReducer.ts` handles all mutations.
- `useCVActions.ts` wraps dispatch into typed action helpers — prefer this over raw dispatch.
- State is persisted to `localStorage` on every change via `lib/storage.ts`.

**Schema versioning and migration:**
- `CURRENT_CV_SCHEMA_VERSION` is exported from `types/cv.ts` — the single source of truth for the current version string.
- `CVStateSchema` uses `z.literal(CURRENT_CV_SCHEMA_VERSION)` for `schemaVersion`, so states saved by a newer build are rejected rather than silently loaded.
- `lib/cvMigrations.ts` exports `migrateCVState(input: unknown): unknown`. Call it before `parseCVState` on any externally-sourced state (localStorage, JSON import, PDF attachment restore). It stamps the current version on missing/older states and passes newer states through for Zod to reject safely.

**Before adding a settings field:** Add to `SettingsSchema` in `types/cv.ts`, add a default in `defaultSettings`, update `cvReducer.ts` if a dedicated action is needed, then consume in `resumePdfStyles.ts`.

## PDF Pipeline

**Two distinct pipelines — never conflate them:**

1. **Builder preview** — `ResumePdfDocument` renders to a blob URL → `usePdfCanvasPreview.tsx` feeds it to `pdfjs-dist` → paints to canvas in `PdfCanvasPreview.tsx`. This is flicker-free. The preview blob must NOT contain embedded session data. Zoom and fit state live in `useZoomControl.ts`; device pixel ratio tracking lives in `useDevicePixelRatio.ts` — both are in `features/builder/workbench/`.

2. **Download export** — `DownloadPdfButton.tsx` calls `@react-pdf/renderer` to generate the PDF, then `embedCVStateAttachment.ts` uses `pdf-lib` to attach the session JSON. Only the downloaded file carries the embedded session.

**Style generation:** `createResumePdfStyles(settings)` in `resumePdfStyles.ts` derives all PDF layout values from `settings` at render time. All spacing, colors, and typography flow through this function. When adding a new PDF-visible setting, this is where it gets consumed.

**PDF font reality:** There are no embedded font assets. `resolvePdfFont()` maps the user's chosen font name to one of three PDF core fonts: Helvetica (default/sans), Times-Roman (serif), Courier (mono). Dates always use Courier. Font embedding is a deferred feature.

**ATS constraints that must be preserved on every PDF change:**
- All text (names, dates, bullets, skills, languages) must remain real `<Text>` / `<Link>` nodes.
- No sidebars, tables, hidden text, text-as-image, skill meters, or icon-only meaning.
- Decorative elements (bullet markers, section tick, rule) use `<View>` — never replace text content.

## Feature Module Conventions

**`features/builder/`** — one subdirectory per section editor (profile, work-experience, education, projects, skills, languages, custom-sections, settings). Workbench shell is in `workbench/`. Shared Builder hooks live in `hooks/`. Builder-specific context (BuilderAddFocusContext) lives in `context/`.

**`features/builder/workbench/`** — decomposed into:
- `builderSectionConfig.tsx` — static section metadata (BUILDER_SECTIONS, SECTION_CONFIG, SECTION_ID_MAP, STATIC_TITLES)
- `useBuilderSectionState.ts` — expandedIds + focusVersions state
- `useBuilderSectionActions.ts` — handleAdd, toggleVisibility, handleMove
- `BuilderSectionCard.tsx` — per-card render component (replaces `renderSectionCard` closure)
- `SectionReorderControls.tsx` — up/down arrow button pair
- `AddCustomSectionCard.tsx` — dashed CTA for adding the first custom section

**`features/builder/hooks/`** — `useDescriptionModeToggle(section)` — shared hook used by Work, Education, Projects, and Custom Section item editors.

**`features/resume-pdf/`** — one file per PDF region:
- `ResumePdfDocument.tsx` — page shell, section order/visibility loop
- `ResumePdfHeader.tsx` — accent rule, name, contact block, summary
- `ResumePdfEntry.tsx` — shared entry row (title, org, dates, subtitle)
- `ResumePdfSection.tsx` — section heading + `ResumePdfBullets` / `ResumePdfParagraph`
- `ResumePdfSkills.tsx`, `ResumePdfCustomSections.tsx` — section-specific renderers
- `resumePdfStyles.ts` — ALL style tokens live here; no inline styles elsewhere

**`lib/parser/`** — `heuristicResumeParser.ts` is the public orchestrator. Internal helpers live under `heuristic/`:
- `heuristicTypes.ts` — shared internal types
- `dateParsing.ts` — date range extraction
- `sectionDetection.ts` — line normalization, section heading matching, line predicates
- `profileExtraction.ts` — name and contact field extraction
- `sectionExtraction.ts` — work, education, projects, skills, languages, custom section builders

**`features/import-export/`** — `ImportModal.tsx` is the orchestrator. Presentational states are owned by separate components:
- `ImportFileDropzone.tsx` — file picker and privacy note
- `ImportConfirmStep.tsx` — shared confirm UI for JSON and PDF-embedded flows
- `PdfHeuristicReview.tsx` — best-effort draft review with confidence/warning display

**`context/`** — `cvActions.ts` defines action type strings; `cvStateUpdates.ts` / `cvSkillsUpdates.ts` contain pure reducer helpers; `sectionItemFactories.ts` creates blank section items.

## Core Product Rules

- **No backend data.** CV data never leaves the browser unless the user exports it.
- **Embedded sessions.** Session JSON is attached to downloaded PDFs only — never to the preview blob.
- **Parser.** Heuristic local checks. Never claim ATS guarantee or exact server-side simulation.
- **Import.** External PDF import is best-effort and must show a review UI before replacing Builder state.
- **No fake UI.** No `href="#"`, no placeholder text, no "Save to server", no "Share", no "RoadForge / roadmap / phase / sprint / backlog" copy.
- **Typography.** No em dashes (`—`) or en dashes (`–`). ASCII hyphens (`-`) only.

## Before Editing

1. Read `docs/current-focus.md` — tells you what is active and what is deferred.
2. Read only the relevant files from the Source Map in `docs/agent-handoff.md`.
3. Use `rg` to find exact symbols rather than browsing the tree.
4. Keep changes surgical — do not touch files outside the task scope.

## Style Rules

- Functions roughly under 25 lines, few parameters.
- No clever inline code — prefer named variables and explicit logic.
- Use `cleanText()` / `cleanList()` from `lib/resume-formatting.ts` for all content guards.
- No new dependencies without explicit approval.
- Shared primitives in `components/shared/` before creating new ones.
