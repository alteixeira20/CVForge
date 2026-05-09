# Product Scope: CVForge

## 1. Purpose

CVForge is a local-first CV builder for creating structured resumes in the browser. The project is being rebuilt with a clean, inspectable codebase while adding parser, ATS-style diagnostics, backup/restore, and PDF export work in small slices.

The near-term goal is a maintainable builder that can be self-hosted without a database or account system.

## 2. Implemented Scope

The current app includes:
- A Next.js app shell in `apps/web`.
- A Zod CV contract in `apps/web/src/types/cv.ts`.
- Reducer-based CV state in `apps/web/src/context/CVContext.tsx`.
- Browser persistence through `localStorage`.
- A responsive workbench shell for builder and parser pages.
- Builder sections for profile, settings, work experience, education, projects, skills, custom sections, and languages.
- A CSS-based live preview placeholder.
- JSON backup export and validated restore.
- PDF export generated from current CV state.
- Local PDF upload, source preview, text extraction, and parser diagnostics.
- ATS-style local scoring with transparent checks.

## 3. Planned Scope

Planned but not implemented:
- Major section reordering.
- Builder-to-parser handoff.
- Importing parsed PDF content into the builder.
- Richer parser and scoring checks.

## 4. Current Limitations

- Parser extraction depends on selectable PDF text and may fail for scanned or protected PDFs.
- The CSS live preview is still separate from the generated PDF renderer.
- Settings exist for section order and visibility, but not all settings are applied in the current preview.
- Data is saved only in the current browser's `localStorage`.
- There is no server-side persistence, authentication, or database.

## 5. MVP Status

### Implemented
- Local builder sections listed above.
- Responsive workbench shell.
- Basic typography, spacing, color, and A4/Letter settings.
- Browser-only persistence.
- JSON backup and restore.
- PDF download.
- Local PDF parser diagnostics.
- ATS-style scoring.

### Planned
- Section reordering.
- Builder-to-parser handoff.
- Parsed PDF import into builder fields.

## 6. Product Principles

- No account requirement in the local-first implementation.
- Local browser storage by default.
- Clear separation between implemented behavior and planned behavior.
- Small feature folders and focused components.
- Validation after each implementation slice.

## 7. Forge App Principles

CVForge should follow the same product rules as future Forge tools:
- Practical before decorative.
- Useful to everyday users, not only programmers.
- Free to use and straightforward to self-host.
- Clear enough for non-technical users to operate.
- Inspectable enough for technical users to modify or contribute.

UI rules:
- Avoid shallow filler content.
- Avoid oversized empty containers that do not help the task.
- Every visible block should explain state, collect input, show output, or support navigation.
- Prefer responsive layout techniques over duplicated mobile/desktop UI.
- Keep the interface dense enough to be useful and calm enough to scan.

## 8. Workbench Contract

Builder and Parser must use the same workbench template so they feel like modes of one tool.

- Builder left panel: editing workbench.
- Builder right panel: generated CV/PDF preview.
- Parser left panel: diagnostics/parser workbench.
- Parser right panel: uploaded/source PDF preview.

The layout should remain visually consistent across mobile, tablet, and desktop. Mobile can switch panels, but it should not duplicate the feature UI or hide core workflows behind unrelated screens.
