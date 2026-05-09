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
- `apps/web/src/context`: React providers for CV state and theme state.
- `apps/web/src/types`: Zod schemas and inferred TypeScript types.
- `apps/web/src/components`: shared layout, form, section, workbench, home, and UI components.
- `apps/web/src/features`: feature-specific builder editors.
- `apps/web/src/lib`: browser storage helpers.
- `apps/web/src/styles`: Forge-family CSS tokens and app styles.

Current builder feature folders:
- `src/features/builder/profile`
- `src/features/builder/settings`
- `src/features/builder/work`
- `src/features/builder/education`
- `src/features/builder/projects`
- `src/features/builder/skills`
- `src/features/builder/languages`
- `src/features/builder/preview`
- `src/features/builder/workbench`

## 3. Data Flow

1. The CV contract is defined in `apps/web/src/types/cv.ts` with Zod.
2. `CVProvider` in `apps/web/src/context/CVContext.tsx` owns reducer state.
3. Builder editors call context actions to update profile, settings, and repeatable sections.
4. State changes are saved to browser `localStorage`.
5. Stored state is parsed as JSON and validated with the CV schema before it is loaded.

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

Placeholder behavior:
- Parser page has upload/source diagnostics placeholders only.
- Resume import page has static action cards only.
- Live preview is a CSS-based preview, not real PDF export.

## 5. Hygiene Rules

- `tmp/` and `.handoff/` are local-only and ignored by git.
- TypeScript build cache files such as `tsconfig.tsbuildinfo` should not be committed.
- Keep public docs factual. Do not claim parser, ATS scoring, PDF upload, or PDF export are implemented until they are.

## 6. Forge UI Rules

Forge apps should be useful, self-hostable tools with interfaces that ordinary users can understand and developers can inspect.

- Keep UI minimal, organized, and task-focused.
- Do not add shallow filler content.
- Do not add oversized empty containers without a clear job.
- Every visible block should collect input, show output, explain state, or support navigation.
- Prefer responsive layout rules over duplicated mobile/desktop implementations.
- Keep pages dense enough to be useful without becoming cluttered.

Builder and Parser must stay on the shared workbench template:
- Builder left: editing workbench.
- Builder right: generated CV/PDF preview.
- Parser left: diagnostics/parser workbench.
- Parser right: uploaded/source PDF preview.

Route files should compose workbench modes. Feature internals belong under `src/features`, shared UI belongs under `src/components/shared`, and responsive workbench behavior belongs in the workbench shell/hook.
