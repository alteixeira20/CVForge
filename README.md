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
- Local scoring method v2 with whole-number dimensions, prioritized issues, detected evidence summaries, explanations, and concrete suggestions.

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
- `pnpm test:e2e`: Run the Playwright release smoke suite against a production server.
- `make clean`: Clear build artifacts.

## Deployment & Self-Hosting

### Standard Node.js

Follow the production build steps above. Ensure you have a Node.js 20+ environment.

Set `NEXT_PUBLIC_SITE_URL` to the confirmed public origin at build time:

```bash
NEXT_PUBLIC_SITE_URL=https://your-confirmed-domain.example pnpm build
```

This value is the single source for canonical links, Open Graph URLs, JSON-LD URLs, `robots.txt`, and `sitemap.xml`. Local development safely falls back to `http://localhost:3000`; do not deploy production metadata with that fallback.

### Docker

CVForge includes a multi-stage, non-root Docker configuration for self-hosting.

```bash
# Build the image
make docker-build SITE_URL=https://your-confirmed-domain.example

# Start the container
NEXT_PUBLIC_SITE_URL=https://your-confirmed-domain.example make docker-up

# View logs
make docker-logs

# Stop the container
make docker-down
```

The application will be available at `http://localhost:3000`.
If that port is occupied, use a matching host port and site URL, for example:

```bash
DOCKER_PORT=4321 NEXT_PUBLIC_SITE_URL=http://localhost:4321 make docker-check
```

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
- Image-only, scanned, or protected PDFs receive an honest no-selectable-text message; CVForge does not use cloud OCR.
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
pnpm test:e2e
```

Playwright needs a Chromium browser. Install its managed browser with `pnpm exec playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_PATH` to an existing Chromium executable. Analyzer results are local rule-based signals and must not be described as real ATS guarantees. External PDF draft import is heuristic and requires manual review.

## Clean-Room Rebuild

CVForge is a clean-room rebuild. Comparable features may be rebuilt from scratch, but code must not be copied from OpenResume-derived sources or old fork sources. The local `tmp/` directory is treated as quarantined reference material and must not be imported from or committed.

## More Documentation

- `docs/product-scope.md`: product scope, implemented status, and planned work.
- `docs/clean-room.md`: clean-room rules, folder structure, and state/storage notes.
- `docs/implementation-plan.md`: implementation plan and validation expectations.
