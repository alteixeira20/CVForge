# CVForge

CVForge is a local-first CV builder built with Next.js, React, TypeScript, Tailwind CSS, and Zod.

The current app focuses on structured CV editing, local browser persistence, and a responsive builder workbench. Parser diagnostics, ATS feedback, PDF upload, and real PDF export are planned but are not implemented yet.

## Current Status

Implemented:
- Next.js app foundation under `apps/web`.
- Zod CV data contract in `apps/web/src/types/cv.ts`.
- Reducer-based CV state in `apps/web/src/context/CVContext.tsx`.
- Browser `localStorage` persistence through `apps/web/src/lib/storage.ts`.
- Responsive shared workbench shell.
- Builder editors for profile, settings, work experience, education, projects, and languages.
- CSS-based live preview placeholder.
- Parser and import pages with placeholder interfaces.

Planned:
- Skills editor.
- Custom sections editor.
- Major section reordering.
- Real PDF export.
- PDF upload and parser extraction.
- ATS scoring and diagnostics.
- Builder-to-parser handoff.
- Import/restore workflows.

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

The current app stores CV data in the user's browser under the `cvforge:state` localStorage key. There is no database or account system in the implemented state.

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
