# CVForge Agent Instructions (CLAUDE.md)

## 1. Project Identity
CVForge is a local-first, browser-only CV builder, PDF exporter, and parser diagnostics tool. It provides structured CV editing without requiring accounts, backend storage, or databases. All user data is kept in `localStorage` or embedded directly into exported PDFs.

## 2. Before Editing (CRITICAL)
For any coding task:
1. Read `docs/current-focus.md`.
2. Read ONLY the listed relevant files from the Source Map in `docs/agent-handoff.md`.
3. Use `rg` to find exact symbols if needed.
4. Do NOT broadly scan the repo unless `current-focus.md` is stale.
5. Do NOT restate the entire project or produce long plans.

## 3. Core Product Rules
- **No backend data:** All CV data stays in browser storage.
- **Embedded sessions:** PDF export embeds CVForge session data only upon download. Builder preview must NOT embed session data.
- **Parser diagnostics:** Heuristic, local checks only. No ATS guarantees.
- **Import:** External PDF import is best-effort. It must display a review UI before replacing Builder state.
- **UI Constraints:** No fake social proof. No `href="#"`. No placeholder text. No "Save to server" or "Share". No "RoadForge", "roadmap", "phase", "sprint", or "backlog" copy.
- **Typography:** No em dashes (`—`) or en dashes (`–`). Use ASCII punctuation only (standard hyphens `-`).

## 4. Architecture Summary
- **Stack:** Next.js, React, TypeScript, Tailwind CSS, Zod.
- **State:** `CVContext` manages a single reducer-based CV state synced to `localStorage`.
- **Preview:** Client-side `@react-pdf/renderer` outputting to a PDF.js canvas preview pipeline (flicker-free, supports zoom/fit).
- **Export:** `@react-pdf/renderer` + `pdf-lib` for embedding session JSON.
- **Parser:** `pdfjs-dist` for local text extraction and regex-based heuristics.

## 5. Coding & Style Rules
- Keep changes surgical and strictly scoped to the task.
- Do not touch unrelated files.
- Avoid monolithic files; prefer concise functions (roughly under 25 lines) with few parameters.
- Avoid clever inline code. Prioritize readability and explicitness.
- Use existing shared primitives before creating new ones.

## 6. Commands
**Suggest, but do NOT run:**
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `make check`
- `make audit-prod`

**Must NOT run without permission:**
- `git commit`
- `pnpm install`
- `make start` / `make dev`
- `docker build` / `docker up`
