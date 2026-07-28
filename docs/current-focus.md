# Current Focus: Release Validation

## 1. Current State

CVForge is in release-readiness validation after its architecture and Anvilary frontend migrations.

Implemented release work:

- Responsive homepage hierarchy with one primary Builder path and a discoverable Parser path.
- Route-aware Builder and Parser navigation with visible active state and `aria-current`.
- Responsive entry/import dialogs with one active modal at a time.
- Shared focus trapping with forward/backward recovery, active-dialog Escape handling, focus restoration, and reference-counted body scroll locking.
- Dark-only Anvilary palette with the ember atmosphere retained at full landing intensity and subdued workbench intensity.
- Improved normal-text contrast, explicit transitions, semantic landmarks, route metadata, associated form labels, and parser loading/error announcements.
- Playwright production-server smoke coverage for responsive routes, dialog behavior, reduced motion, persistence, JSON backup/restore, embedded PDF session detection, and review-first external PDF import.
- Security-only dependency patches for Next.js, PostCSS, and Sharp, with explicit standalone tracing for Sharp's glibc and musl libvips runtimes.
- A non-root standalone Docker build whose routes, manifest, brand assets, and image optimizer have been exercised locally.

Protected state, PDF, parser, and scoring contracts remain unchanged.

## 2. Immediate Work

- Complete any desired Firefox, Safari, and assistive-technology spot checks; the automated release suite currently targets Chromium.
- Perform a final human comparison of exported PDFs against the in-app preview using representative real CV content.
- Review the release branch and deploy the exact reviewed commit through the target hosting environment.

## 3. Deferred Product Work

- PDF font embedding with real font assets.
- Photo support and a photo-layout PDF template.
- Drag-and-drop section reordering; arrow controls remain the supported implementation.
- Richer parser extraction and scoring checks.
- PDF Phase 2 typography refinements listed in `docs/implementation-plan.md`.

## 4. Constraints

- Preserve the CV schema, serialized data, reducer behavior, storage key, migrations, JSON backup, PDF session attachment, parser review boundary, and scoring semantics.
- Keep CVForge browser-only and local-first.
- Do not introduce backend, database, account, or server-side CV storage assumptions.
- Treat RoadForge and Anvilary-Website as read-only design references.
