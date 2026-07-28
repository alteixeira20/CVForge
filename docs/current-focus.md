# Current Focus: Release Validation

## 1. Current State

CVForge is in release-readiness validation after its architecture and Anvilary frontend migrations.

Implemented release work:

- Constrained responsive homepage header with explicit Builder, Analyzer, Source, GitHub star handoff, and primary Builder action.
- Route-aware Builder and Analyzer navigation with visible active state and `aria-current`.
- Compact value-first hero whose trust row precedes a richer Builder/Analyzer preview.
- Responsive entry/import dialogs with one active modal at a time.
- Shared focus trapping with forward/backward recovery, active-dialog Escape handling, focus restoration, and reference-counted body scroll locking.
- Dark-only Anvilary palette with the ember atmosphere retained at full landing intensity and subdued workbench intensity.
- Unified whole-surface button interactions, translucent forge surfaces, semantic landmarks, associated labels, and Analyzer loading/error announcements.
- Canonical `/analyzer` route with permanent `/parser` redirect.
- Explainable scoring method v2 with dimensions, priorities, evidence summaries, and suggestions.
- Unique page metadata, canonical URL configuration, robots, sitemap, JSON-LD, and generated social image.
- Playwright production-server smoke coverage for responsive routes, dialog behavior, reduced motion, persistence, JSON backup/restore, embedded PDF session detection, and review-first external PDF import.
- Security-only dependency patches for Next.js, PostCSS, and Sharp, with explicit standalone tracing for Sharp's glibc and musl libvips runtimes.
- A non-root standalone Docker build whose routes, manifest, brand assets, and image optimizer have been exercised locally.

Protected CV state, migrations, reducers, JSON, PDF generation/session embedding, and review-first import contracts remain unchanged. Scoring changed intentionally to version 2 within the isolated scoring feature.

## 2. Immediate Work

- Complete any desired Firefox, Safari, and assistive-technology spot checks; the automated release suite currently targets Chromium.
- Perform a final human comparison of exported PDFs against the in-app preview using representative real CV content.
- Configure the confirmed production `NEXT_PUBLIC_SITE_URL`, review the release branch, and deploy the exact reviewed commit.

## 3. Deferred Product Work

- PDF font embedding with real font assets.
- Photo support and a photo-layout PDF template.
- Drag-and-drop section reordering; arrow controls remain the supported implementation.
- Richer parser extraction evidence.
- DOCX and plain-text analysis; PDF remains the only supported Analyzer input.
- Local OCR; image-only PDFs currently receive guidance instead.
- PDF Phase 2 typography refinements listed in `docs/implementation-plan.md`.

## 4. Constraints

- Preserve the CV schema, serialized data, reducer behavior, storage key, migrations, JSON backup, PDF session attachment, and parser review boundary.
- Keep CVForge browser-only and local-first.
- Do not introduce backend, database, account, or server-side CV storage assumptions.
- Treat RoadForge and Anvilary-Website as read-only design references.
