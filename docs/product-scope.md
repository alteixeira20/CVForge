# Product Scope: CVForge

## 1. Purpose

CVForge is a local-first CV Builder and ATS-style CV Analyzer for creating and improving structured resumes in the browser. The codebase keeps parser internals, local analysis, backup/restore, and PDF export in focused slices.

The near-term goal is a maintainable builder that can be self-hosted without a database or account system.

## 2. Implemented Scope

The current app includes:
- A Next.js app shell in `apps/web`.
- A Zod CV contract in `apps/web/src/types/cv.ts`.
- Reducer-based CV state in `apps/web/src/context/CVContext.tsx`.
- Browser persistence through `localStorage`.
- A responsive workbench shell for Builder and Analyzer pages.
- Builder sections for profile, settings, work experience, education, projects, skills, custom sections, and languages.
- Major section reordering and visibility toggles.
- A high-fidelity PDF-backed live preview for the current builder state.
- Advanced PDF layout controls: theme color, font family/size, page size, section heading weight, top accent bar (toggle and height), per-section vertical gaps, and compact mode.
- JSON backup export and validated restore (the simplest reliable session portability path).
- PDF export generated from current CV state with embedded session metadata.
- Local PDF upload, source preview, and raw text extraction.
- Direct analysis of the current Builder CV in Analyzer without PDF download/upload.
- CVForge-generated PDF detection and session restoration.
- Best-effort heuristic parsing for external PDFs with a structured draft review before replacement.
- Extraction confidence kept separate from CV quality scoring.
- Uploaded PDF analysis scores the embedded CVForge session or best-effort draft when one exists, not unrelated current Builder data.
- Scoring method v3 with explicitly weighted whole-number dimensions for completeness,
  structure, clarity, impact, ATS-style compatibility, and PDF parseability when
  applicable.
- Contextual quantified-impact detection that distinguishes measurable outcomes from
  versions, years, tiers, protocols, and model numbers.
- English and Portuguese (Portugal) headings/action-language diagnostics, plus a
  language-neutral fallback for other languages.
- PDF extraction signals for selectable text, text density, empty pages, repeated page
  edges, fragmentation, possible reading-order/multi-column issues, replacement
  characters, symbol noise, and large page counts.
- PDF validation and processing limits: PDF only, 15 MB, 20 pages, signature validation,
  sequential extraction, cancellation, and stale-result protection.
- Prioritized checks with detected evidence summaries, why-it-matters copy, and concrete improvement suggestions.
- Canonical `/analyzer` route with permanent `/parser` compatibility redirect.
- Shared metadata URL source, canonical metadata, robots, sitemap, JSON-LD, and generated social image.

## 3. Planned Scope

Planned but not implemented (Pinned Future Slices):
- Drag-and-drop section reordering (arrow-based reordering is shipped; drag-and-drop is a UX enhancement).
- PDF font embedding (Geist Sans / Geist Mono as real PDF assets).
- Photo support and photo-layout PDF template.
- PDF Phase 2 visual refinements (letter-spacing, subtitle margin, date size).
- Richer parser extraction and field-level Analyzer evidence.
- DOCX and plain-text analysis after a local, robust, tested extraction path is chosen.

## 4. Current Limitations

- Analyzer extraction supports PDF only, up to 15 MB and 20 pages, and depends on
  selectable text.
- Scanned, image-only, or protected PDFs may produce no text. CVForge does not use cloud OCR.
- Builder preview and PDF export use the same document model and are designed to remain visually aligned.
- Session restoration from PDF works only for CVForge-generated files when an embedded session attachment is present.
- External PDF draft import is heuristic and may create incomplete or inaccurate fields.
- Extraction confidence is separate from CV quality analysis.
- Data is saved only in the current browser's `localStorage`.
- Persisted state is migrated to the current schema version before validation; states saved by a newer build are rejected rather than silently loaded.
- Current Builder CV analysis in Analyzer uses in-browser state only and does not upload CV data.
- English and PT-PT are the explicitly tested diagnostic languages. Other languages use
  language-neutral checks; no claim of multilingual accuracy is made for them.
- Column and reading-order diagnostics are warning signals, not perfect layout detection.
- ATS-style checks are deterministic best-practice signals, not commercial ATS
  equivalence, guaranteed acceptance, universal compatibility, or hiring predictions.
- CVForge does not perform AI analysis, OCR, DOCX analysis, or cloud translation.
- There is no server-side persistence, authentication, or database.

## 5. Scoring Method Version 3

Method v3 remains deterministic, whole-number, explainable, and locally computed. It
changes v2 in these material ways:

- Uploaded PDF results weight Parseability 22%, Completeness 18%, Impact 18%, Structure
  16%, Clarity 16%, and ATS-style compatibility 10%.
- Structured Builder results omit Parseability and weight Completeness 23%, Impact 23%,
  Structure 20%, Clarity 20%, and ATS-style compatibility 14%.
- Builder length and density use normalized visible CV text rather than serialized JSON.
- Quantified impact requires contextual measurable-outcome evidence such as percentage,
  currency, time/latency reduction, scale, throughput, audience, financial, quality, or
  delivery-frequency language. A bare year, version, tier, protocol, or model number
  receives no impact credit.
- PDF Parseability includes selectable-text coverage and density plus warning signals
  for empty pages, repeated page edges, excessive fragments, suspicious reading order,
  replacement characters, symbol noise, and very large page counts.
- English and Portuguese (Portugal) have explicit section-heading and action-language
  dictionaries. Structured CV state uses an explicit supported language when one is
  available; otherwise heading/content evidence selects English or PT-PT; ambiguous and
  other-language content uses neutral checks. Lack of English words alone is not a
  penalty.
- Findings are ordered by priority, warnings follow improvements, and passed checks are
  collapsed. Each non-pass finding identifies evidence, why it matters, an action, and
  the affected dimension.

The weights express product priorities, not scientific or proprietary ATS precision.
The method does not predict recruiter decisions, guarantee acceptance, or reproduce a
commercial ATS implementation.

## 6. MVP Status

### Implemented
- Local builder sections listed above.
- Responsive workbench shell.
- Basic typography, spacing, color, and A4/Letter settings.
- Section reordering and visibility.
- Browser-only persistence (Private, local-first).
- JSON backup and restore (the simplest reliable restore path).
- PDF download with embedded session restore.
- High-fidelity PDF-backed live preview.
- Local PDF extraction and ATS-style analysis.
- Builder-to-Analyzer handoff for analyzing the current local Builder CV.
- Structured review before importing an external PDF draft.
- Explainable multidimensional local scoring and prioritized issue rows, not real ATS guarantees.

### Planned
- Richer parser extraction and Analyzer evidence.
- Drag-and-drop section reordering.
- PDF font embedding (Geist Sans / Geist Mono).
- Photo support and photo-layout PDF template.

## 7. Product Principles

- No account requirement in the local-first implementation.
- Local browser storage by default.
- Clear separation between implemented behavior and planned behavior.
- Small feature folders and focused components.
- Validation after each implementation slice.

## 8. Anvilary Product Family

CVForge sits within Anvilary Labs → Anvilary Tools → CVForge and follows the shared Anvilary product rules:
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

## 9. Workbench Contract

Builder and Analyzer must use the same workbench template so they feel like modes of one tool.

- Builder left panel: editing workbench.
- Builder right panel: generated CV/PDF preview.
- Analyzer left panel: analysis and parser controls.
- Analyzer right panel: uploaded/source PDF preview.

The layout should remain visually consistent across mobile, tablet, and desktop. Mobile can switch panels, but it should not duplicate the feature UI or hide core workflows behind unrelated screens.
