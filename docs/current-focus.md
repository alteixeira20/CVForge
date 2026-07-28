# Current Focus: Final Deployment Hardening

## 1. Current State

CVForge is a safe-to-deploy public-beta candidate pending final gate execution and owner
review. The Anvilary visual direction, local-first boundary, Builder/Analyzer model, and
protected serialized CV architecture remain intact.

Implemented release work:

- Constrained responsive homepage header with explicit Builder, Analyzer, Source, GitHub star handoff, and primary Builder action.
- Route-aware Builder and Analyzer navigation with visible active state and `aria-current`.
- Compact value-first hero whose trust row precedes a richer Builder/Analyzer preview.
- Responsive entry/import dialogs with one active modal at a time.
- Shared focus trapping with forward/backward recovery, active-dialog Escape handling, focus restoration, and reference-counted body scroll locking.
- Dark-only Anvilary palette with the ember atmosphere retained at full landing intensity and subdued workbench intensity.
- Unified whole-surface button interactions, translucent forge surfaces, semantic landmarks, associated labels, and Analyzer loading/error announcements.
- Canonical `/analyzer` route with permanent `/parser` redirect.
- Explainable scoring method v3 with documented weights, visible-content analysis,
  contextual impact evidence, English/PT-PT diagnostics, and neutral-language fallback.
- PDF input safety: 15 MB and 20 page limits, extension/MIME/signature checks, sequential
  extraction, cancellation, cleanup, and stale-upload protection.
- Parseability warnings for low/absent selectable text, line fragmentation, repeated
  page edges, possible reading-order issues, replacement characters, and symbol noise.
- Unique page metadata, canonical URL configuration, robots, sitemap, JSON-LD, and generated social image.
- Standalone Playwright production-server coverage for responsive routes, dialog
  behavior, reduced motion, persistence, JSON backup/restore, embedded PDF session
  detection, review-first external PDF import, and serious/critical axe violations.
- Full Chromium plus critical Firefox/WebKit projects.
- CSP and response headers, app/global error boundaries, a not-found experience, and a
  minimal `/health` endpoint.
- Safe release, Docker, local production-preview, artifact-assertion, and CI workflows.
- Security-only dependency patches for Next.js, PostCSS, and Sharp, with explicit standalone tracing for Sharp's glibc and musl libvips runtimes.
- A non-root standalone Docker build whose routes, manifest, brand assets, and image optimizer have been exercised locally.

The storage key and serialized schema version are unchanged. Current-version object
parsing preserves unknown extension fields, migrations still reject unsupported future
versions, and JSON/PDF restore contracts remain backward compatible.

## 2. Immediate Work

- Run the complete production-origin `make release-check`.
- Complete the manual viewport, keyboard, zoom, assistive-technology, and PDF
  preview/export comparison matrix in `docs/current-qa-plan.md`.
- Review the exact release commit and follow `docs/deployment.md`. Deployment remains an
  owner action; no workflow in this repository publishes automatically.

## 3. Deferred Product Work

- PDF font embedding with real font assets.
- Photo support and a photo-layout PDF template.
- Drag-and-drop section reordering; arrow controls remain the supported implementation.
- Richer field-level parser evidence beyond the deterministic signals now implemented.
- DOCX and plain-text analysis; PDF remains the only supported Analyzer input.
- Local OCR; image-only PDFs currently receive guidance instead.
- PDF Phase 2 typography refinements listed in `docs/implementation-plan.md`.

## 4. Constraints

- Preserve the serialized data contract, reducer behavior, storage key, migrations, JSON
  backup, PDF session attachment, and parser review boundary.
- Keep CVForge browser-only and local-first.
- Do not introduce backend, database, account, or server-side CV storage assumptions.
- Treat RoadForge and Anvilary-Website as read-only design references.
