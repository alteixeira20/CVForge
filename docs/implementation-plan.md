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
- [ ] Major section reordering.

Current limitations:
- The preview does not apply every setting in the schema.
- The preview is not real PDF generation.

## Phase 4: Parser & Engine (Planned)

- [ ] Add local PDF extraction.
- [ ] Implement standalone ATS scoring module.
- [ ] Build Parser Workbench UI (Scorecard, Issues, Side-by-side view).

Current parser status:
- `/parser` has responsive shell UI only.
- Upload, extraction, diagnostics, and ATS scoring are not implemented.

## Phase 5: Import, Export, and Launch (Planned)

- [ ] Real PDF generation via `@react-pdf/renderer`.
- [ ] JSON export and restore flow.
- [ ] PDF upload flow.
- [ ] Builder-to-parser handoff.
- [ ] Final visual polish and performance audit.

Current import status:
- `/resume-import` has static placeholder cards only.

## UI Implementation Checklist

Use this checklist before closing any UI slice:
- Does every visible block help the user understand or complete the task?
- Is there any filler copy, decorative empty space, or oversized container that can be removed?
- Does the feature use existing form, section, and workbench primitives where practical?
- Does the responsive behavior come from layout rules rather than duplicated UI?
- Does the feature remain usable on mobile, tablet, and desktop?
- Does Builder or Parser still follow the shared workbench contract?
