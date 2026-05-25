# CVForge

CVForge is a local-first CV builder and parser workbench built with Next.js, React, TypeScript, Tailwind CSS, and Zod.

The current app focuses on structured CV editing, browser localStorage persistence, JSON backup/import, PDF export with session embedding, CVForge PDF session restore, and local parser diagnostics in a shared workbench UI.

## Product Principles

- **Local-Only Privacy**: CVForge does not use a database, account system, or server-side persistence. Your data remains in your browser's `localStorage`.
- **Heuristic Diagnostics**: Parser scoring and diagnostics are rule-based local checks. They are intended as useful signals for manual CV polish, not as a hiring outcome guarantee or an exact simulation of server-side ATS parsing.
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
- Local PDF upload, source preview, text extraction, and parser diagnostics.
- Direct Builder-to-Parser analysis for the current local Builder CV without exporting or uploading a file.
- CVForge-generated PDF detection and embedded session restore.
- Best-effort external PDF draft review and import that must be checked before use.
- Local heuristic scoring with transparent issue rows.

Planned (Pinned Future Slices):
- Drag-and-drop section reordering (arrow-based reordering is shipped).
- PDF font embedding (Geist Sans / Geist Mono as real PDF assets).
- Photo support and photo-layout PDF template.
- Website/marketing polish.
- Richer parser extraction and scoring checks.

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
- `make verify`: Run linting, type-checking, and build validation.
- `make clean`: Clear build artifacts.

## Deployment & Self-Hosting

### Standard Node.js

Follow the production build steps above. Ensure you have a Node.js 20+ environment.

### Docker (Recommended for Self-Hosting)

CVForge includes a production-ready Docker configuration.

```bash
# Build the image
make docker-build

# Start the container
make docker-up

# View logs
make docker-logs

# Stop the container
make docker-down
```

The application will be available at `http://localhost:3000`.

## Product Principles

CVForge is part of a planned family of Forge tools. Forge apps should be practical, self-hostable, free to use, and useful to non-technical users as well as developers.

Interface rules:
- Keep screens minimal, organized, and task-focused.
- Do not add filler sections, decorative empty blocks, or oversized containers without a job.
- Every visible block should help the user understand the current state or complete a task.
- Keep density useful without making the page feel cluttered.
- Make mobile, tablet, and desktop layouts feel like the same app, not separate products.

Builder and Parser use the same workbench pattern:
- Builder left panel: editing workbench.
- Builder right panel: generated CV/PDF preview.
- Parser left panel: diagnostics/parser workbench.
- Parser right panel: uploaded/source PDF preview.

Switching between Builder and Parser should feel like changing modes inside one tool.

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run validation after each implementation slice. Parser diagnostics are local rule-based checks and should not be described as real ATS guarantees. External PDF draft import is heuristic and requires manual review.

## Clean-Room Rebuild

CVForge is a clean-room rebuild. Comparable features may be rebuilt from scratch, but code must not be copied from OpenResume-derived sources or old fork sources. The local `tmp/` directory is treated as quarantined reference material and must not be imported from or committed.

## More Documentation

- `docs/product-scope.md`: product scope, implemented status, and planned work.
- `docs/clean-room.md`: clean-room rules, folder structure, and state/storage notes.
- `docs/implementation-plan.md`: implementation plan and validation expectations.
