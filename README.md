# CVForge

CVForge is a local-first CV Builder and ATS-style CV Analyzer built with Next.js, React, TypeScript, Tailwind CSS, and Zod.

The current app focuses on structured CV editing, browser persistence, JSON backup/import, PDF export with session embedding, CVForge PDF session restore, and transparent local analysis in a shared workbench UI.

## Product Principles

- **Local-Only Privacy**: CVForge does not use a database, account system, or server-side persistence. Your data remains in your browser's `localStorage`.
- **Transparent Analysis**: Analyzer scoring uses deterministic local checks across completeness, structure, clarity, impact, and ATS-style compatibility. Parseability is added only for an uploaded PDF. These are improvement signals, not a hiring outcome guarantee or an exact simulation of every ATS.
- **Reliable Portability**: Validated JSON export/import is the simplest reliable way to move or back up your full session data. CVForge-generated PDFs can also include an embedded session attachment for restoration when that attachment is present.

## Current Status

Implemented:
- Next.js app foundation under `apps/web`.
- Zod CV data contract exposed through `apps/web/src/types/cv.ts`, with schemas in `apps/web/src/types/cv/schemas.ts`.
- Reducer-based CV state in `apps/web/src/context/CVContext.tsx`.
- Browser `localStorage` persistence through `apps/web/src/lib/storage.ts`.
- Responsive shared workbench shell.
- Builder editors for profile, settings, work experience, education, projects, skills, custom sections, and languages.
- PDF.js canvas preview pipeline for the current builder state, providing sharp, flicker-free rendering with zoom/fit controls.
- Polished Workbench UI with repeatable item cards, hold-to-delete, inline editable section titles, and 10 professional color presets.
- Section reordering (up/down arrow controls), per-section visibility toggles, and inline title editing.
- Advanced PDF layout settings: theme color, font family/size, page size, section heading weight, top accent bar, per-section gaps, and compact mode.
- JSON backup export and validated JSON restore.
- PDF download generated from current CV data with embedded session metadata.
- Section visibility and bullet visibility controls.
- Local PDF upload, source preview, text extraction, and CV analysis.
- Direct Builder-to-Analyzer analysis for the current local Builder CV without exporting or uploading a file.
- CVForge-generated PDF detection and embedded session restore.
- Best-effort external PDF draft review and import that must be checked before use.
- Local scoring method v3 with documented weights, contextual impact detection, English and Portuguese (Portugal) diagnostics, PDF extraction signals, prioritized issues, detected evidence summaries, explanations, and concrete suggestions.
- Safe PDF analysis limits (15 MB and 20 pages), signature validation, sequential extraction, cancellation, and stale-upload protection.
- Automated accessibility checks, Chromium coverage, and critical Firefox/WebKit smoke coverage.
- Standalone production preview, self-cleaning Docker validation, and a single production release gate.

Planned (Pinned Future Slices):
- Drag-and-drop section reordering (arrow-based reordering is shipped).
- PDF font embedding (Geist Sans / Geist Mono as real PDF assets).
- Photo support and photo-layout PDF template.
- Richer parser extraction and Analyzer checks.

## Development Workflow

CVForge uses a `Makefile` to simplify common commands.

### Local Setup

```bash
make install
```

### Common Commands

- `make dev`: Start the development server with hot-reloading.
- `make build`: Build the production application.
- `make start`: Run the production build locally.
- `make check`: Run linting, type-checking, and a production build.
- `pnpm test:unit`: Run deterministic scoring, PDF validation, and data-integrity tests.
- `pnpm test:e2e:chromium`: Run the full Chromium and axe release suite against the standalone production server.
- `pnpm test:e2e:cross-browser`: Run critical Firefox and WebKit smoke checks.
- `make preview-build`: Build and assemble the standalone production preview.
- `make preview-start`: Start the already-built preview on port 3030.
- `make docker-check`: Build, run, poll, validate, and remove an isolated production container.
- `make clean`: Clear build artifacts.

## Production Release Gate

The owner-facing release gate uses the confirmed production origin and an isolated Bash
script with strict error handling:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools \
DOCKER_PORT=3030 \
make release-check
```

It performs a frozen install, lint, TypeScript, production build and artifact assertions,
production dependency audit, unit tests, Chromium plus axe validation, Firefox/WebKit
critical smoke, and self-cleaning Docker validation. It rejects localhost, placeholder
origins, and `.invalid` origins outside the explicitly configured CI path. Ordinary
`make check` remains suitable for local development and does not require a public domain.

## Local Production Preview

Build metadata for the real production origin, then run the standalone server locally
without Docker:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools make preview-build
make preview-start
make preview-status
make preview-logs
make preview-stop
```

The default test URL is `http://127.0.0.1:3030`. `preview-start` never rebuilds, refuses
an occupied port, records the process identity, and stops only the process it started.
Set `PREVIEW_PORT` to use another free port. The canonical origin remains the build-time
production URL; the local preview URL is only where the owner exercises that build.

## Deployment and Self-Hosting

`NEXT_PUBLIC_SITE_URL` is a build-time input and the source for canonical links, Open
Graph URLs, JSON-LD URLs, `robots.txt`, and `sitemap.xml`. Production builds default to
the confirmed CVForge origin, while development uses localhost. Supply the value
explicitly for auditable releases.

### Docker

CVForge includes a pinned multi-stage, non-root standalone image with a health check:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools make docker-build
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools DOCKER_PORT=3030 make docker-up
make docker-status
make docker-logs
DOCKER_PORT=3030 make docker-down
```

The service is available at `http://localhost:3030`. For an isolated validation that
does not affect Compose or unrelated containers:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools \
DOCKER_PORT=3030 \
make docker-check
```

See [`docs/deployment.md`](docs/deployment.md) for reverse-proxy, Cloudflare Tunnel
origin, production smoke, backup, branch-protection, deployment, and rollback guidance.

## Anvilary Product Family

CVForge follows the hierarchy Anvilary Labs → Anvilary Tools → CVForge. It shares the dark forge palette, interaction primitives, responsive hierarchy, and ember atmosphere used across the Anvilary product family.

Interface rules:
- Keep screens minimal, organized, and task-focused.
- Do not add filler sections, decorative empty blocks, or oversized containers without a job.
- Every visible block should help the user understand the current state or complete a task.
- Keep density useful without making the page feel cluttered.
- Make mobile, tablet, and desktop layouts feel like the same app, not separate products.

Builder and Analyzer use the same workbench pattern:
- Builder left panel: editing workbench.
- Builder right panel: generated CV/PDF preview.
- Analyzer left panel: local analysis and import controls (implemented internally by parser modules).
- Analyzer right panel: uploaded/source PDF preview.

Switching between Builder and Analyzer should feel like changing modes inside one tool.

## Analyzer, Routes, and Supported Formats

- `/analyzer` is the canonical user-facing Analyzer route.
- `/parser` is a permanent compatibility redirect to `/analyzer`.
- `/resume-import` retains its compatibility redirect to `/builder`.
- PDF is the only supported Analyzer input format in this release.
- DOCX and plain-text analysis are not implemented or advertised.
- Selectable PDF text is extracted locally with `pdfjs-dist`.
- Uploaded PDFs are limited to 15 MB and 20 pages and must pass extension, available
  MIME, and PDF signature checks.
- Image-only, scanned, malformed, truncated, encrypted, or protected PDFs receive
  specific local recovery guidance; CVForge does not use OCR.
- English and Portuguese from Portugal are the explicitly supported diagnostic
  languages. Other languages receive language-neutral fallback checks and are not
  penalized merely for lacking English headings or action verbs.
- JSON remains the most reliable structured restore path. A CVForge PDF may restore an embedded session, while an external PDF produces a best-effort draft that must be reviewed.

## SEO Architecture

- `apps/web/src/lib/siteConfig.ts` owns the site URL and page copy constants.
- App Router metadata provides unique titles, descriptions, canonicals, Open Graph, and Twitter tags for `/`, `/builder`, and `/analyzer`.
- `robots.ts` and `sitemap.ts` include only the three canonical, indexable pages.
- `/parser` and `/resume-import` are redirect-only and absent from the sitemap.
- `opengraph-image.tsx` generates the shared 1200×630 social image.
- Homepage JSON-LD describes the factual `WebSite`, `SoftwareApplication`, and Anvilary Labs relationship.

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:e2e:chromium
pnpm test:e2e:cross-browser
```

Install managed browsers with `pnpm --filter web exec playwright install chromium firefox webkit`.
On Linux hosts missing WebKit runtime libraries, `scripts/cross-browser-check.sh` retries
the critical suite in the version-matched official Playwright container. Analyzer
results are local rule-based signals, not commercial ATS equivalence, acceptance
guarantees, or recruiter-outcome predictions.

## Clean-Room Rebuild

CVForge is a clean-room rebuild. Comparable features may be rebuilt from scratch, but code must not be copied from OpenResume-derived sources or old fork sources. The local `tmp/` directory is treated as quarantined reference material and must not be imported from or committed.

## More Documentation

- `docs/product-scope.md`: product scope, implemented status, and planned work.
- `docs/clean-room.md`: clean-room rules, folder structure, and state/storage notes.
- `docs/implementation-plan.md`: implementation plan and validation expectations.
- `docs/current-qa-plan.md`: automated and manual release QA matrix.
- `docs/deployment.md`: production build, reverse proxy, Cloudflare Tunnel, smoke,
  backup, and rollback runbook.
