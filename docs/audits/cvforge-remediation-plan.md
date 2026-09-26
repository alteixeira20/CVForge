# CVForge Remediation Plan

Source of findings: `cvforge-release-readiness-2026-09-26.md` (F-xx IDs).

**Status after remediation session 2 (2026-09-26, uncommitted working tree):** done:
R-0, R-1, R-2, R-3, R-4, R-5, R-6, R-7 (Chromium, Firefox, and WebKit via the Docker
fallback), R-8 (owner decisions applied: three core fonts, Locale and rating controls
removed), R-9 (long tokens fixed; non-WinAnsi text disclosed only), R-10, R-11, R-12,
R-14 (fonts self-hosted), and R-17. Not done: R-13, R-15, R-16 (the gate fails at the
dependency audit), and new R-18 (dependency upgrades). See section 7 of the readiness
report.
Base revision: `d858f37c1e817c8fae319f7709124ec652eb955f`.
Branching: one remediation branch off `main` (for example
`fix/release-readiness-2026-09-26`), one small commit per task, and no commits without
owner approval. History cleanup is not needed (see `cvforge-history-cleanup.md`) and is
therefore separate from all tasks below.

Invariants for every task: CV schema and `CURRENT_CV_SCHEMA_VERSION`, migrations, the
`cvforge:state` storage key, the JSON backup format, PDF session attachment and restore,
review-first external import, no backend, no new runtime dependencies without approval,
no em dashes, and no co-author trailers.

**Privacy invariant (owner requirement, 2026-09-26):** CVs and all user data are stored
only in the user's browser (`localStorage`) or in files the user explicitly downloads.
The server serves static assets and metadata routes only. It must never receive, log,
or retain CV content, uploaded PDFs, extracted text, or analysis results. Every fix in
this plan respects this. In particular, the R-1 recovery copy lives in the browser's own
`localStorage`, and "Download saved data" creates a local file with no upload.

### R-17 Privacy regression guard (release-blocking)

- Add a Playwright spec that records every request during a full journey: fill the
  Builder with a unique marker string, wait for preview updates, download the PDF, export
  the JSON backup, analyze the Builder CV, upload a PDF to the Analyzer, and import a PDF
  draft. Assert that no request uses POST, PUT, or PATCH; that no request URL, header,
  or body contains the marker; and that every request targets the site origin (or an
  explicitly allowlisted static host, if any).
- Verify that the CSP `connect-src` is limited to `'self'` (plus any required worker or
  blob sources), so a future regression is blocked by the browser.
- Acceptance: the spec passes in Chromium and in the Firefox and WebKit smoke projects.

## Order and dependencies

```
R-0 reproduction suite
 |-- R-1 storage load safety (P0)
 |-- R-2 preview sizing -- R-3 preview status -- R-4 panel lifecycle -- R-5 dock
 |                                                         \-- R-6 renderer cleanup
 |-- R-7 download lifecycle + cross-browser bytes
 |-- R-8 font/locale/rating truthfulness (needs owner decisions)
 |-- R-9 WinAnsi and long-URL handling
R-10 em dash cleanup + validator     (independent)
R-11 co-author prevention            (independent)
R-12 multi-tab notice                (after R-1)
R-13 Analyzer edge-case tests        (independent)
R-14 build font hermeticity          (owner decision)
R-15 CI Node pin                     (independent)
R-17 privacy regression guard        (independent, release-blocking)
R-16 final release verification      (after all release tasks)
```

## Release-blocking tasks

### R-0 Reproduction and regression suite (F-07; enables F-01 to F-06, F-08, F-09)

- Add `apps/web/e2e/builder-preview.spec.ts`, `apps/web/e2e/data-integrity.spec.ts`,
  helpers, and fixtures (a one-page CV, and a CV of at least three A4 pages with
  Portuguese characters and a long URL). Scope preview canvases to the preview
  container, never page-wide `canvas`, because `EmberBackground` also draws on a canvas.
- Cases: first preview and Fit at 1440, 1024, 768, 390, and 320 px widths for A4 and
  Letter; typing continuity (realistic and rapid) with a per-frame sampler; resize
  continuity; mobile Edit/Preview/Edit switching; dock reachability at 320x568,
  390x844, and 640x400 at device scale 2; zoom and Fit; forced render failure by
  aborting the pdf.js worker request, then Retry; multi-page count; preview/export parity
  (page count and extracted text of the downloaded file); future-schema and corrupt
  stored payloads survive an edit; metrics attachment (time to first preview, update
  latency, long tasks).
- Acceptance: the suite runs on the unchanged baseline, and its failures are recorded in
  `cvforge-test-evidence.md` as reproductions before any fix lands.

### R-1 Storage load safety (F-01 P0, F-20)

- Files: `lib/storage.ts`, `context/CVContext.tsx`, one small banner component,
  unit tests.
- Change: `getCVState` returns `{ status: 'empty' } | { status: 'loaded', state } |
  { status: 'unreadable', raw, reason }`. On `unreadable`, copy `raw` to
  `cvforge:state:recovery` once, before anything else, and set a context flag that blocks
  writes and shows a banner with "Download saved data" (raw JSON file) and "Start fresh"
  (explicit confirm, then clear the flag). Replace the `updatedAt` persistence guard with
  an explicit `hydrated` flag. Render a neutral Builder loading state until hydrated.
- Acceptance: unit tests for each load status; the R-0 data-integrity cases pass; all
  existing persistence, JSON, and PDF restore tests pass unchanged.

### R-2 Preview sizing (F-02, F-03, F-08)

- Files: `features/builder/workbench/PdfCanvasPreview.tsx`, `useZoomControl.ts`.
- Change: display pages at the current `zoom` and keep the bitmap as a CSS-scaled
  placeholder until the re-rasterized pages arrive. Remove the overflow-based blocking
  state. Separate fit bounds (lower bound about 0.2) from manual bounds (0.5 to 2.5), and
  stop clamping the rendered zoom to the manual minimum. Copy bitmaps in a callback ref
  so remounted canvases are never blank.
- Acceptance: R-0 first-preview, resize, and zoom cases pass at every width, with zero
  loader frames after the first preview.

### R-3 Preview status and recovery (F-04)

- Files: `usePdfCanvasPreview.tsx` (expose `retry` and a `pending` flag that covers the
  debounce window), `BuilderPreviewPanel.tsx`, and a small status component.
- Change: a polite `role="status"` chip reading "Updating preview" while pending or
  rendering, and "Preview could not be updated" with a Retry button on failure. Prior
  pages stay visible. Replace the unlabeled spin icon with this chip.
- Acceptance: the R-0 forced-failure case passes; axe shows no new serious or critical
  violations.

### R-4 Panel lifecycle and redundant renders (F-05, F-09)

- Files: `components/shared/workbench/WorkbenchShell.tsx`, `hooks/useWorkbench.ts`,
  `usePdfCanvasPreview.tsx`.
- Change: always mount both panels and hide the inactive one below `lg` with CSS. Skip
  scheduling when the render signature equals the last rendered one. Rendering pauses
  while hidden because the container measures 0 px.
- Acceptance: the R-0 mobile switching case passes; the Analyzer mobile flow (upload,
  switch panels, results persist) is verified; desktop first paint shows both panels.

### R-5 Compact preview dock (F-06)

- Measure first with R-0. If controls leave the viewport, allow wrapping or use a
  two-row layout below `sm`.
- Acceptance: R-0 dock reachability passes at all listed sizes.

### R-7 Download lifecycle and cross-browser integrity (F-11, F-18)

- Files: `features/resume-pdf/DownloadPdfButton.tsx`,
  `features/import-export/exportCVState.ts`, `e2e/cross-browser-smoke.spec.ts`.
- Change: revoke object URLs after a grace delay. In Firefox and WebKit, parse the
  downloaded PDF with pdf-lib, check the page count and the embedded session attachment,
  and restore it.
- Acceptance: cross-browser projects pass with byte-level assertions.

### R-8 Truthful font, locale, and rating controls (F-13, F-14, F-25, F-27)

- Owner decisions: (a) label font options with their PDF output, or reduce to three;
  (b) wire `localePreset` into date formatting, or remove the control; (c) remove the
  skill rating input, or relabel it.
- Always: fix Courier New resolving to Helvetica, with a unit test for every option.
- Acceptance: unit tests for `resolvePdfFont` and date formatting; parity test output
  matches the selected settings.

### R-9 Text coverage in the PDF (F-23, F-24)

- First runtime-verify what react-pdf does with Greek, Cyrillic, and Polish input. If it
  throws, raise F-23 to P1.
- Change: a Builder notice when unsupported characters are present; a hyphenation
  callback that inserts break opportunities in overlong tokens without altering stored
  text.
- Acceptance: a long-URL fixture stays inside page bounds in the downloaded PDF, the
  extracted text contains the full URL, and non-WinAnsi fixtures show the notice with no
  preview error.

### R-10 Em dash cleanup and prevention (F-15)

- Replace U+2014 in the 10 tracked files. Keep regex semantics in
  `lib/parser/extractionDiagnostics.ts:37` with `\u2013\u2014` escapes. Replace the
  en dash in `features/scoring/scoreCV.ts:143` user copy. Rewrite the `CLAUDE.md`
  typography rule. Update any e2e assertion that matches the old title strings.
- Add `tools/check-no-em-dash.mjs` (ported from RoadForge, which builds the character
  from its code point), a root `check:em-dash` script, a `make check` dependency, a
  `release-check.sh` step, and a CI `static` job step.
- Acceptance: the validator passes on the cleaned tree and fails on a scratch file
  containing U+2014 (demonstrated, then removed); lint, typecheck, unit, build, and e2e
  pass.

### R-11 Co-author trailer prevention (F-16)

- Add tracked `.claude/settings.json` with `{"attribution": {"commit": "", "pr": ""}}`;
  `.githooks/commit-msg` rejecting `^co-authored-by:` (case-insensitive) and U+2014; a
  `make hooks` target running `git config core.hooksPath .githooks`; and a CI step that
  checks every commit message in the push or pull request range.
- Acceptance: the hook rejects a test message with a trailer and accepts a clean one; CI
  passes on the current history.

## Important but not blocking

- R-6 Renderer cleanup (F-10): `try`/`finally` destroy of the loading task and document.
  Measure a shared `PDFWorker` against the R-0 metrics before adopting it.
- R-12 Multi-tab notice (F-12): `storage` event listener with a Reload prompt; no
  auto-merge.
- R-13 Analyzer edge-case e2e (F-17): pdf-lib generated encrypted, truncated, >15 MB,
  and >20-page fixtures, plus rapid replacement.
- R-15 Pin Node in CI and `engines` (F-22).

## Owner decisions required

1. R-8 (a), (b), (c) as listed above.
2. R-14 (F-19): self-host Lexend and JetBrains Mono with `next/font/local` (adds OFL
   WOFF2 binaries to the repository), or accept the build-time network dependency.
3. Whether F-23 disclosure copy should also appear in the Analyzer.

## Deferred

Font embedding, locale-aware section titles, undo for reset (F-21), `entrySpacing`
cleanup (F-26), and the items already deferred in `docs/current-focus.md`.

## R-16 Final release verification

On the exact release commit: `make check`, `pnpm test:unit`,
`NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools DOCKER_PORT=3030 make
release-check` (installs Firefox and WebKit), and the manual QA matrix in
`docs/current-qa-plan.md`, including live preview and PDF comparison on the production
build. Record everything in `cvforge-test-evidence.md`. No deployment without owner
approval.

## Execution note for the next session

Partway through this audit, the Maestrum firewall exhausted the lead session's
raw-output allowance, so source and test output were withheld. Tasks R-0 and R-2 to R-5
need the lead to see Playwright output while iterating. Start them in a session with a
fresh allowance. The mechanical tasks R-10 and R-11 can be delegated as Maestrum WRITE
tasks and verified by exit codes.
