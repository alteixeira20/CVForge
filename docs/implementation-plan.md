# Implementation Plan

This plan tracks implemented work separately from planned work. Each implementation slice should end with:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Phase 1: Foundation (Completed)

- [x] Scaffold root monorepo (pnpm).
- [x] Establish `.gitignore` and `tmp/` reference quarantine.
- [x] Rebuild Forge-family design tokens and atoms for this app.
- [x] Implement responsive `WorkbenchShell` and layout hook.

Workbench contract:
- Builder and Parser share the same workbench template.
- Builder left panel is for editing.
- Builder right panel is for generated CV/PDF preview.
- Parser left panel is for diagnostics and parser controls.
- Parser right panel is for uploaded/source PDF preview.
- Mobile, tablet, and desktop should feel like the same tool with responsive panel behavior.

## Phase 2: Core State & Types (Completed)

- [x] Define Zod schemas for the full CV contract.
- [x] Implement reducer-based state management in `CVContext`.
- [x] Add automated `localStorage` persistence with safe validation.

Implementation notes:
- CV schema location: `apps/web/src/types/cv.ts`.
- State provider location: `apps/web/src/context/CVContext.tsx`.
- Storage helper location: `apps/web/src/lib/storage.ts`.
- Current CV storage key: `cvforge:state`.

## Phase 3: Builder Interface (Completed)

- [x] Core form primitives (`TextInput`, `TextArea`, `FormField`).
- [x] Profile editor.
- [x] Settings editor for A4/Letter, color, spacing, and typography.
- [x] Generic Repeatable Section engine.
- [x] Work Experience & Education editors (Education includes location field).
- [x] Projects & Languages editors.
- [x] Skills editor.
- [x] Custom Section editor.
- [x] Dynamic visual CV preview for the current builder state using a PDF.js canvas pipeline.
- [x] JSON backup export and validated restore (Reliable).
- [x] PDF download generated from current CV state with embedded session.
- [x] Section visibility and bullet visibility controls.
- [x] Section reordering (up/down arrow controls) via `settings.sectionOrder`.
- [x] Advanced PDF layout settings: 9 controls (theme color, font family/size, page size, heading weight, accent bar, per-section gaps, compact mode).
- [x] Builder Workbench modularity: decomposed into config, hook, and card component files.
- [x] `RepeatableSectionEditor` API simplified: dead props removed.
- [x] `useDescriptionModeToggle` hook shared across Work, Education, Projects, and Custom Section editors.
- [x] Accessibility: Enter-to-blur inputs, `focus-visible:outline-none`, keyboard-navigable section title editing, `aria-label`/`aria-pressed` on action buttons.
- [x] Dead code removed: `SectionCard.tsx`, `useExpandedItem.ts`, `FONT_FAMILY_OPTIONS`, `styles.entryGroup`.

Current limitations:
- Session restoration from PDF works only for CVForge files with an embedded attachment.
- External PDF-to-builder draft import is heuristic and requires review.
- PDF font embedding (Geist Sans / Geist Mono) is deferred.

## Phase 4: Parser & Engine (In Progress)

- [x] Add local PDF upload and text extraction.
- [x] Implement standalone local heuristic scoring module.
- [x] Detect CVForge-generated PDFs and restore sessions from embedded attachments.
- [x] Implement best-effort heuristic import for external PDFs.
- [x] Add structured review before replacing Builder data with an external PDF draft.
- [x] Keep uploaded PDF draft/session scoring separate from unrelated current Builder state.
- [x] Build Parser Workbench UI with source preview, diagnostics, and scorecard.
- [ ] Add richer parser diagnostics and field-level extraction.

Current parser status:
- `/parser` extracts selectable PDF text locally with `pdfjs-dist`.
- Scanned or protected PDFs may produce no text or an extraction error.
- Parser diagnostics are heuristic and are not real ATS guarantees.
- CVForge PDFs with embedded session attachments can restore builder state.
- External PDFs can create best-effort editable drafts, but imported fields must be reviewed.
- Parser reliability describes extraction and draft confidence. It is separate from CV quality checks.

## Phase 5: Import, Export, and Launch (In Progress)

- [x] Real PDF generation via `@react-pdf/renderer`.
- [x] JSON export and restore flow.
- [x] PDF upload flow.
- [x] High-fidelity session restoration from CVForge PDFs.
- [x] Best-effort heuristic import from external PDFs.
- [x] Builder-to-parser handoff for analyzing the current local Builder CV.
- [ ] Final visual polish and performance audit.

Current import status:
- JSON backup/restore is accessible within the Builder.
- Current Builder CV analysis is accessible from Builder without PDF export/upload.
- PDF restoration and heuristic import are accessible within the Parser.
- Standalone `/resume-import` route is deprecated.

## Phase 6: Pre-QA Architecture Refactoring (Completed)

- [x] Split `heuristicResumeParser.ts` into orchestrator + `lib/parser/heuristic/` submodules (CVF-101).
- [x] Split `ImportModal.tsx` into `ImportFileDropzone`, `ImportConfirmStep`, `PdfHeuristicReview` (CVF-102).
- [x] Extract `useZoomControl.ts` and `useDevicePixelRatio.ts` from `PdfCanvasPreview.tsx` (CVF-103).
- [x] Rename `features/builder/work/` to `features/builder/work-experience/` (CVF-104).
- [x] Move `features/resume-formatting.ts` to `lib/resume-formatting.ts` (CVF-105).
- [x] Move `context/BuilderAddFocusContext.tsx` to `features/builder/context/BuilderAddFocusContext.tsx` (CVF-106).
- [x] Add schema migration system: `lib/cvMigrations.ts`, `CURRENT_CV_SCHEMA_VERSION`, `z.literal` version guard, migration wired before `parseCVState` on all external state sources (CVF-107).
- [x] Pre-QA hygiene: `.gitignore` updated, `crypto.randomUUID()` for IDs, empty `Badge.tsx` deleted, Homepage ThemeToggle Tailwind conversion (CVF-201/204).

Pending:
- [ ] Run `make check` (typecheck + lint + build) — validation gate before manual QA.
- [ ] Manual QA against `docs/current-qa-plan.md`.

## UI Implementation Checklist

Use this checklist before closing any UI slice:
- Does every visible block help the user understand or complete the task?
- Is there any filler copy, decorative empty space, or oversized container that can be removed?
- Does the feature use existing form, section, and workbench primitives where practical?
- Does the responsive behavior come from layout rules rather than duplicated UI?
- Does the feature remain usable on mobile, tablet, and desktop?
- Does Builder or Parser still follow the shared workbench contract?
