# Clean-Room Rebuild Strategy

CVForge is a clean-room rebuild. Comparable features can be rebuilt, but source code must be written for this repository and fit the current architecture.

## 1. Principles
- Do not copy code from OpenResume-derived sources or old fork sources.
- Do not import from `tmp/`.
- Do not modify `tmp/`.
- Do not commit `tmp/`.
- Rebuild comparable features in the current style instead of moving old code into this app.
- Keep features in focused folders with small, inspectable components.
- Run validation after each implementation slice.

## 2. Current Architecture

- Root:
  - `package.json`: workspace-level scripts.
  - `pnpm-workspace.yaml`: includes `apps/*`.
  - `.gitignore`: excludes dependencies, build output, `tmp/`, `.handoff/`, and TypeScript build caches.
- `apps/web`: the Next.js app.
- `apps/web/src/app`: route pages and app layout.
- `apps/web/src/context`: CV state provider, reducer actions, and state update helpers.
- `apps/web/src/types`: Zod schemas and inferred TypeScript types.
- `apps/web/src/components`: shared layout, form, section, workbench, home, and UI components.
- `apps/web/src/features`: feature-specific builder, parser, scoring, PDF, and import/export modules.
- `apps/web/src/lib`: browser storage and parser helpers.
- `apps/web/src/styles`: Anvilary-family CSS tokens, atmosphere, landing, modal, and workbench styles.

Current builder feature folders:
- `src/features/builder/profile`
- `src/features/builder/settings`
- `src/features/builder/work-experience`
- `src/features/builder/education`
- `src/features/builder/projects`
- `src/features/builder/skills`
- `src/features/builder/languages`
- `src/features/builder/workbench`
- `src/features/import-export`
- `src/features/parser`
- `src/features/resume-pdf`
- `src/features/scoring`

## 3. Data Flow

1. The CV contract is defined in `apps/web/src/types/cv.ts` with Zod.
2. `CVProvider` in `apps/web/src/context/CVContext.tsx` owns reducer state.
3. Builder editors call context actions to update profile, settings, and repeatable sections.
4. State changes are saved to browser `localStorage`.
5. Stored state is parsed as JSON, migrated to the current schema version, and validated with the CV schema before it is loaded.

The visible CV storage key is `cvforge:state`.

## 4. Current UI Boundaries

Implemented builder sections:
- Profile.
- Settings.
- Work experience.
- Education.
- Projects.
- Skills.
- Languages.

Implemented utility behavior:
- JSON backup export and restore run in the browser and validate with `parseCVState`.
- PDF export is generated from current CV state with `@react-pdf/renderer`.
- Analyzer upload and extraction run locally in the browser with `pdfjs-dist`; the implementation remains under internal parser modules.
- ATS-style scoring is deterministic and transparent, but it is a diagnostic signal only.

Current limitations:
- Builder preview renders the generated PDF through the PDF.js canvas pipeline; download/export uses the same @react-pdf/renderer document with an embedded session attachment. The two paths are designed to stay visually aligned, not guaranteed identical.
- Analyzer extraction depends on selectable PDF text. External PDFs can produce a best-effort draft only after an explicit review step.
- No CV data is uploaded to a server by the implemented app.

## 5. Hygiene Rules

- `tmp/` and `.handoff/` are local-only and ignored by git.
- TypeScript build cache files such as `tsconfig.tsbuildinfo` should not be committed.
- Keep public docs factual. Do not claim PDF-to-builder import, ATS guarantees, or server sync until implemented.

## 6. Anvilary UI Rules

CVForge should be recognizable as Anvilary Labs → Anvilary Tools → CVForge while remaining useful, self-hostable, and understandable to ordinary users.

- Keep UI minimal, organized, and task-focused.
- Do not add shallow filler content.
- Do not add oversized empty containers without a clear job.
- Every visible block should collect input, show output, explain state, or support navigation.
- Prefer responsive layout rules over duplicated mobile/desktop implementations.
- Keep pages dense enough to be useful without becoming cluttered.

Builder and Analyzer must stay on the shared workbench template:
- Builder left: editing workbench.
- Builder right: generated CV/PDF preview.
- Analyzer left: local analysis and parser controls.
- Analyzer right: uploaded/source PDF preview.

Route files should compose workbench modes. Feature internals belong under `src/features`, shared UI belongs under `src/components/shared`, and responsive workbench behavior belongs in the workbench shell/hook.
