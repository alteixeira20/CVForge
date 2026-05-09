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

## Phase 3: Builder Interface (In Progress)

- [x] Core form primitives (`TextInput`, `TextArea`, `FormField`).
- [x] Profile editor.
- [x] Settings editor for A4/Letter, color, spacing, and typography.
- [x] Generic Repeatable Section engine.
- [x] Work Experience & Education editors.
- [x] Projects & Languages editors.
- [x] Skills editor.
- [x] Custom Section editor.
- [x] Dynamic visual CV preview placeholder.
- [x] JSON backup export and validated restore (Reliable).
- [x] PDF download generated from current CV state with embedded session.
- [x] Major section reordering and visibility.

Current limitations:
- The preview does not apply every setting in the schema.
- The CSS preview is separate from PDF generation.
- Session restoration from PDF works only for CVForge files; generic PDF-to-builder import is not implemented.

## Phase 4: Parser & Engine (In Progress)

- [x] Add local PDF upload and text extraction.
- [x] Implement standalone local heuristic scoring module.
- [x] Detect CVForge-generated PDFs and restore sessions from embedded attachments.
- [x] Build Parser Workbench UI with source preview, diagnostics, and scorecard.
- [ ] Add richer parser diagnostics and field-level extraction.

Current parser status:
- `/parser` extracts selectable PDF text locally with `pdfjs-dist`.
- Scanned or protected PDFs may produce no text or an extraction error.
- Parser diagnostics are heuristic and do not auto-fill builder fields.

## Phase 5: Import, Export, and Launch (In Progress)

- [x] Real PDF generation via `@react-pdf/renderer`.
- [x] JSON export and restore flow.
- [x] PDF upload flow.
- [ ] Builder-to-parser handoff.
- [ ] Final visual polish and performance audit.

Current import status:
- `/resume-import` exposes the same validated JSON backup/restore action as the builder.
- PDF-to-builder import is not implemented.

## UI Implementation Checklist

Use this checklist before closing any UI slice:
- Does every visible block help the user understand or complete the task?
- Is there any filler copy, decorative empty space, or oversized container that can be removed?
- Does the feature use existing form, section, and workbench primitives where practical?
- Does the responsive behavior come from layout rules rather than duplicated UI?
- Does the feature remain usable on mobile, tablet, and desktop?
- Does Builder or Parser still follow the shared workbench contract?
