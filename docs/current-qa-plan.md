# CVForge Final QA Plan

Run this checklist before final UI polish sign-off and deployment. Record browser, viewport, source PDF type, and any console errors for each issue.

## Manual Validation Commands

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Pre-Deploy Browser Checklist

- **Homepage (`/`):** Verify the page loads cleanly, primary navigation works, and "Start Building" reaches `/builder`.
- **Builder (`/builder`):** Edit profile, work, education, projects, skills, languages, and custom sections. Confirm repeatable cards, visibility toggles, section ordering, inline section title edits, and settings reset behave correctly.
- **PDF preview:** Confirm the live PDF canvas updates after content and settings edits, zoom/fit controls work, and preview remains sharp without layout overflow.
- **PDF export/download:** Download a PDF from Builder and confirm it visually matches the preview and remains usable for CVForge session restore.
- **JSON export/import:** Export a JSON backup, change the CV, cancel an import once, then import the backup and confirm full session restoration.
- **Parser with no upload (`/parser`):** Confirm Builder CV analysis appears, including the empty-CV warning when Builder has no useful content.
- **Parser with CVForge-generated PDF:** Upload a downloaded CVForge PDF. Confirm source preview, embedded session detection, restore action, and score target behave correctly.
- **Parser with external PDF:** Upload a non-CVForge text PDF. Confirm extraction diagnostics, best-effort draft review/import, scoring target, and source preview behave correctly without silently replacing Builder state.
- **Mobile/responsive:** Check `/`, `/builder`, and `/parser` at mobile and tablet widths. Confirm panels, bottom navigation, forms, modals, and buttons remain reachable without horizontal overflow.
- **localStorage/session persistence:** Refresh after Builder edits and confirm state persists. Close and reopen the app in the same browser profile and confirm the session is restored.
- **Deprecated redirect:** Visit `/resume-import` and confirm it redirects to the current Parser flow.

## Expected Pass Signals

- No uncaught console errors during core flows.
- Local-only state persists without backend/API calls.
- PDF preview, export, parser restore, JSON import/export, and heuristic parser flows remain distinct and predictable.
- External PDF import always requires review before replacing Builder state.
