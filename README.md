# CVForge

CVForge is a local-first CV builder built with Next.js, React, TypeScript, Tailwind CSS, and Zod.

The current app focuses on structured CV editing, local browser persistence, JSON backup/restore, PDF export, and local parser diagnostics in a shared workbench UI.

## Product Principles

- **Local-Only Privacy**: CVForge does not use a database, account system, or server-side persistence. Your data remains in your browser's `localStorage`.
- **Heuristic Diagnostics**: Parser scoring and diagnostics are rule-based local checks. They are intended as useful signals for manual CV polish, not as a hiring outcome guarantee or an exact simulation of server-side ATS parsing.
- **Reliable Portability**: Validated JSON export/import is the guaranteed way to move or back up your full session data.

## Current Status

Implemented:
- Next.js app foundation under `apps/web`.
- Zod CV data contract in `apps/web/src/types/cv.ts`.
- Reducer-based CV state in `apps/web/src/context/CVContext.tsx`.
- Browser `localStorage` persistence through `apps/web/src/lib/storage.ts`.
- Responsive shared workbench shell.
- Builder editors for profile, settings, work experience, education, projects, skills, custom sections, and languages.
- CSS-based live preview placeholder.
- JSON backup export and validated JSON restore.
- PDF download generated from current CV data.
- Local PDF upload, source preview, text extraction, and parser diagnostics.
- ATS-style local scoring with transparent issue rows.

Planned:
- Major section reordering.
- Builder-to-parser handoff.
- Richer parser extraction and scoring checks.
- Importing parsed PDF content into the builder.

## Local Development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The root scripts delegate to the `web` workspace package.

## Production Build

Build the app:

```bash
pnpm build
```

Start the production server from the web app:

```bash
pnpm --filter web start
```

By default, Next.js serves on port `3000`. Set `PORT` if your host expects another port:

```bash
PORT=8080 pnpm --filter web start
```

## Self-Hosting Basics

CVForge is currently a standard Next.js application. A basic self-hosted setup needs:
- A supported Node.js runtime for Next.js 15.
- `pnpm install --frozen-lockfile` during deployment.
- `pnpm build` before starting the server.
- `pnpm --filter web start` as the runtime command.

The current app stores CV data in the user's browser under the `cvforge:state` localStorage key. JSON backup/restore, PDF generation, PDF upload, extraction, and scoring run locally in the browser. There is no database, account system, or server upload in the implemented state.

## Forge App Principles

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

Run validation after each implementation slice.

## Clean-Room Rebuild

CVForge is a clean-room rebuild. Comparable features may be rebuilt from scratch, but code must not be copied from OpenResume-derived sources or old fork sources. The local `tmp/` directory is treated as quarantined reference material and must not be imported from or committed.

## More Documentation

- `docs/product-scope.md`: product scope, implemented status, and planned work.
- `docs/clean-room.md`: clean-room rules, folder structure, and state/storage notes.
- `docs/implementation-plan.md`: implementation phases and validation expectations.
