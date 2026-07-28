# CVForge Release QA Plan

Run this checklist before deployment. Record browser, viewport, source PDF type, and console errors for every defect.

## Automated Validation

```bash
pnpm install --frozen-lockfile
make check
pnpm audit-prod
pnpm test:e2e
git diff --check
```

Playwright needs Chromium. Install its managed browser with `pnpm exec playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_PATH` to an existing Chromium executable.
Set `PLAYWRIGHT_REUSE_SERVER=1` only when intentionally testing an already-running CVForge production server.

When Docker is available:

```bash
make docker-check
```

## Route and Asset Smoke Checks

Verify successful responses for:

- `/`
- `/builder`
- `/parser`
- `/resume-import` (redirects to `/builder`)
- `/site.webmanifest`
- every Anvilary logo path referenced by metadata, manifests, headers, and dialogs

## Responsive Matrix

Homepage:

- 1440×900
- 1280×800
- 1024×768
- 768×1024
- 430×932
- 390×844
- 320×568

Builder and Parser:

- Repeat the applicable widths above.
- Check both mobile workbench panels.
- Use a long profile name and populated repeatable sections.
- Open entry/import dialogs on compact and short screens.
- Test browser zoom at 200%.

At every size confirm:

- no horizontal overflow;
- no clipped header controls;
- essential actions remain visible;
- touch targets remain usable;
- fixed navigation does not cover content;
- dialog controls remain reachable;
- text wraps without hiding meaning;
- bright atmosphere regions do not reduce text readability.

## Functional Browser Checklist

- **Homepage:** Primary Builder action opens the entry flow. Parser remains a clear secondary path. Source remains available in the header or footer.
- **Entry flow:** Continue preserves existing data. Starting fresh requires confirmation when content exists. Restore/import clearly distinguishes reliable JSON from reviewed PDF import.
- **Dialogs:** Tab and Shift+Tab remain inside the active dialog. Escape closes only the active dialog. Child import closes back to its parent control. Closing the full flow returns focus to the page trigger.
- **Builder:** Edit all section types. Confirm card expansion, visibility, ordering, title editing, settings reset, and mobile edit/preview switching.
- **PDF preview:** Confirm updates after content and setting changes. Check zoom, Fit, sharpness, empty, loading, and error states.
- **JSON:** Export a backup, change the CV, cancel one import without replacement, then restore the backup.
- **PDF export:** Download a CVForge PDF, compare it with the preview, and confirm the embedded session is detected on re-import.
- **Parser with Builder state:** Confirm empty and populated Builder diagnostics remain distinct from uploaded-file diagnostics.
- **Parser with CVForge PDF:** Confirm source preview, embedded-session detection, restore action, and scoring target.
- **Parser with external PDF:** Confirm extraction diagnostics and a mandatory best-effort review before Builder replacement.
- **Persistence:** Refresh and reopen the same browser profile after edits.
- **Reduced motion:** Confirm moving canvas embers are suppressed while the static heat glow remains.
- **Deprecated route:** Confirm `/resume-import` reaches `/builder`.

## Expected Pass Signals

- No uncaught console or page errors during core flows.
- No backend/API request is required for CV data.
- JSON, CVForge PDF restore, and external PDF draft paths remain visibly distinct.
- External PDF import never replaces Builder state without review and explicit confirmation.
- Builder and Parser remain separate, route-aware modes of the same workbench.
