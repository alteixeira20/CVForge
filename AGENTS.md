# CVForge Codex Guidance

## Project Shape

- CVForge is a Next.js app under `apps/web`.
- The product is local-first and browser-only.
- There is currently no backend, API service, database, or auth system.
- Use `pnpm` for package commands.

## Working Rules

- Keep changes small, focused, and commit-sized.
- Preserve PDF export/import, embedded session restore, localStorage migrations, parser behavior, and scoring behavior.
- Do not touch PDF rendering, PDF preview, parser heuristics, or scoring casually.
- Do not introduce backend, API, database, or auth assumptions unless explicitly requested.
- Do not run validation, dev-server, build, install, migration, Docker, or network commands unless explicitly asked.

## Manual Validation Commands

The user runs validation manually:

```bash
pnpm typecheck
pnpm lint
pnpm build
```
