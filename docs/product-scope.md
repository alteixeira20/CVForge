# Product Scope: CVForge

## 1. Purpose

CVForge is a local-first CV builder for creating structured resumes in the browser. The project is being rebuilt with a clean, inspectable codebase while adding parser, local heuristic diagnostics, backup/restore, and PDF export work in small slices.

The near-term goal is a maintainable builder that can be self-hosted without a database or account system.

## 2. Implemented Scope

The current app includes:
- A Next.js app shell in `apps/web`.
- A Zod CV contract in `apps/web/src/types/cv.ts`.
- Reducer-based CV state in `apps/web/src/context/CVContext.tsx`.
- Browser persistence through `localStorage`.
- A responsive workbench shell for builder and parser pages.
- Builder sections for profile, settings, work experience, education, projects, skills, custom sections, and languages.
- Major section reordering and visibility toggles.
- A high-fidelity PDF-backed live preview for the current builder state.
- Advanced PDF layout controls: theme color, font family/size, page size, section heading weight, top accent bar (toggle and height), per-section vertical gaps, and compact mode.
- JSON backup export and validated restore (the simplest reliable session portability path).
- PDF export generated from current CV state with embedded session metadata.
- Local PDF upload, source preview, and raw text extraction.
- Direct analysis of the current Builder CV in Parser without PDF download/upload.
- CVForge-generated PDF detection and session restoration.
- Best-effort heuristic parsing for external PDFs with a structured draft review before replacement.
- Parser reliability scoring and CV diagnostics presented as local rule-based signals.
- Uploaded PDF analysis scores the embedded CVForge session or best-effort draft when one exists, not unrelated current Builder data.
- Local heuristic scoring and transparent diagnostic checks.

## 3. Planned Scope

Planned but not implemented (Pinned Future Slices):
- Drag-and-drop section reordering (arrow-based reordering is shipped; drag-and-drop is a UX enhancement).
- PDF font embedding (Geist Sans / Geist Mono as real PDF assets).
- Photo support and photo-layout PDF template.
- PDF Phase 2 visual refinements (letter-spacing, subtitle margin, date size).
- Website/marketing polish.
- Richer parser extraction and scoring checks.

## 4. Current Limitations

- Parser extraction depends on selectable PDF text and may fail for scanned or protected PDFs.
- Builder preview and PDF export both use the same high-fidelity model, ensuring visual consistency.
- Session restoration from PDF works only for CVForge-generated files when an embedded session attachment is present.
- External PDF draft import is heuristic and may create incomplete or inaccurate fields.
- Parser reliability is separate from CV quality diagnostics.
- Data is saved only in the current browser's `localStorage`.
- Persisted state is migrated to the current schema version before validation; states saved by a newer build are rejected rather than silently loaded.
- Current Builder CV analysis in Parser uses in-browser state only and does not upload CV data.
- There is no server-side persistence, authentication, or database.

## 5. MVP Status

### Implemented
- Local builder sections listed above.
- Responsive workbench shell.
- Basic typography, spacing, color, and A4/Letter settings.
- Section reordering and visibility.
- Browser-only persistence (Private, local-first).
- JSON backup and restore (the simplest reliable restore path).
- PDF download with embedded session restore.
- High-fidelity PDF-backed live preview.
- Local PDF parser diagnostics (heuristic).
- Builder-to-parser handoff for analyzing the current local Builder CV.
- Structured review before importing an external PDF draft.
- Local rule-based scoring and issue rows, not real ATS guarantees.

### Planned
- Richer parser extraction and scoring checks.
- Drag-and-drop section reordering.
- PDF font embedding (Geist Sans / Geist Mono).
- Photo support and photo-layout PDF template.

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
