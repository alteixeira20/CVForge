# CVForge Release Readiness Audit

Date: 2026-09-26
Audited revision: `d858f37c1e817c8fae319f7709124ec652eb955f` (`main` = `origin/main`; no
local changes to application code)
Audit branch: `audit/release-readiness-2026-09-26` (documentation only)
Production origin: `https://cvforge.alexandreteixeira.dev` at audit time; `https://cvforge.anvilary.tools` from session 3 (section 8)
Prior input: `~/Downloads/CVForge_targeted_release_audit_2026-09-26.md` (static review of
the same SHA)

## 1. Status summary

**Not release-ready (updated in session 2, section 7).** The P0 and all P1 findings are
fixed and verified on the uncommitted working tree, with runtime reproductions on the
baseline. The release gate now fails at the production dependency audit (2 critical
Next.js advisories and a high pdf.js advisory, section 7.3), which needs owner-approved
upgrades. F-23 output correction also needs an owner decision.

Original session 1 summary: one P0 data-loss defect and five P1 preview defects were
confirmed from source, none fixed, runtime reproduction incomplete (section 6).

| Severity | Open | Fixed and verified |
| --- | --- | --- |
| P0 | 0 | 1 (F-01) |
| P1 | 0 | 7 (F-02 to F-07, new F-31) |
| P2 | 4 (F-11 and F-18 WebKit pending, F-17, F-23 disclosed only) | 11 |
| P3 | 7 (F-21 accepted risk, F-22, F-26 to F-30) | 1 (F-20) |

Counts as of remediation session 2 (section 7), on the uncommitted working tree based on
`d858f37`. The original counts were P0 1, P1 6, P2 15 (the table said 14), P3 8.

The Analyzer core (upload validation, stale-upload protection, analysis-target isolation,
review-first restore, deterministic scoring, honest copy) was reviewed and found sound.
Its gaps are test coverage, not behavior.

## 2. Evidence levels

Each finding records one of:

- **Source-confirmed**: verified by reading the cited code on the audited SHA, either
  directly by the lead engineer or through a Maestrum READ delegation that returned
  locator-backed evidence.
- **Runtime-reproduced**: reproduced in a browser against the production build.
- **Arithmetic**: deduced from explicit constants and CSS in source; runtime pending.

No finding is marked fixed. Fixed requires a code change plus a passing regression test
on the exact revision.

## 3. Baseline (unchanged `d858f37`)

| Check | Result |
| --- | --- |
| `pnpm lint` | pass |
| `pnpm typecheck` | pass |
| `pnpm test:unit` | pass, 5 files, 43 tests |
| `pnpm build` (origin set) | attempt 1 **failed** (`next/font/google` loader TypeError, see F-19); attempt 2 pass |
| `scripts/prepare-standalone.sh` | pass (attempt 2) |
| `pnpm test:e2e:chromium` | pass, 32 of 32 (attempt 2; attempt 1 had no build) |
| `pnpm test:e2e:cross-browser` | **not run**: Firefox and WebKit Playwright browsers are not installed locally |
| `make release-check` | **not run** (see section 6) |

Full details: `cvforge-test-evidence.md`.

## 4. Findings register

Fields: ID, severity, subsystem, status, evidence level, reproduction, expected, actual,
source evidence, root cause, recommended correction, regression test.

### F-01 P0: Unreadable saved CV is silently replaced by an empty CV on first edit

- Subsystem: persistence (`lib/storage.ts`, `context/CVContext.tsx`)
- Status: **fixed and verified** on the remediation working tree (see section 7).
  Evidence: runtime-reproduced on baseline `d858f37` (one keystroke replaced both a corrupt
  payload and a `schemaVersion: "2.0.0"` payload with the edited default CV).
- Reproduce: store a CV whose `schemaVersion` is newer than the build's (a deploy
  rollback, or an older cached tab after a newer build saved) or whose JSON is corrupt.
  Open `/builder`, then type one character.
- Expected: the stored CV is never overwritten without consent; the user is told it
  could not be loaded and can export or keep it.
- Actual: `getCVState()` returns `null` on JSON parse failure or schema rejection with no
  message. The Builder shows `defaultCVState`. The first edit changes `updatedAt`, which
  passes the `state.updatedAt !== defaultCVState.updatedAt` persistence guard, and
  `setCVState` overwrites the stored payload.
- Source: `apps/web/src/lib/storage.ts:4-72`, `apps/web/src/context/CVContext.tsx:14-50`,
  `apps/web/src/lib/cvMigrations.ts:26-54` (newer versions pass through unmigrated),
  `apps/web/src/types/cv/schemas.ts:179-185` (`z.literal` version),
  `apps/web/src/context/cvReducer.ts:18-28` (every action except `REPLACE_STATE` stamps
  `updatedAt`).
- Root cause: load failure and "nothing stored" are both represented as `null`, and
  persistence is gated on a timestamp comparison instead of an explicit hydration result.
- Correction: distinguish `empty`, `loaded`, and `unreadable` load results. On
  `unreadable`, copy the raw value to a recovery key (for example
  `cvforge:state:recovery`) before any write, show a persistent banner with "Download
  saved data" and "Start fresh" actions, and suppress writes until the user chooses. Add
  an explicit hydrated flag instead of the `updatedAt` comparison. Keep the storage key,
  schema, and migrations unchanged.
- Regression tests: unit tests for the storage load result; Playwright: future-version
  and corrupt-JSON payloads remain recoverable after an edit and a warning is visible.

### F-02 P1: Resizing replaces a valid preview with the loading screen

- Subsystem: live preview. Prior audit P1-01. Status: **fixed and verified** (section 7).
  Evidence: runtime-reproduced on baseline (56 of 126 sampled frames showed the loader
  during a stepwise desktop resize).
- Reproduce: with a rendered preview in Fit mode, narrow the window so the preview panel
  shrinks by more than 2%.
- Expected: current pages stay visible, scaled to the new width, while a sharper render
  is produced.
- Actual: `PreviewLoadingState` replaces the pages until the debounced (400 ms) regenerate
  and rasterize completes.
- Source: `PdfCanvasPreview.tsx:73-74` (`renderedZoom` derived from the bitmap),
  `:91` (`displayZoom` prefers `renderedZoom`), `:93-98` (`overflowIsUnintended` makes
  `isBlocking` true).
- Root cause: the displayed size follows the zoom at which the bitmap was rendered, not
  the current zoom, so a narrower container makes valid pages "overflow" and the
  component treats them as invalid.
- Correction: display pages at the current `zoom` (CSS scaling of the existing bitmap)
  and reserve the blocking state for "no pages yet". Keep the debounced re-rasterization
  for sharpness.
- Regression test: frame sampler during stepwise viewport resize asserts zero frames with
  the loading status and at least one visible canvas.

### F-03 P1: At 320 px the preview can stay on "Preparing document" indefinitely

- Subsystem: live preview. Prior audit P1-02. Status: **fixed and verified** (section 7).
  Evidence: runtime-reproduced on baseline (A4 at 320 px never left the loader in 20 s;
  US Letter never rendered at any width, see F-31).
- Source: `useZoomControl.ts` (`MIN_ZOOM = 0.5`; fit zoom is
  `clamp(containerWidth / baseWidth, MIN_ZOOM, MAX_ZOOM)`), `PdfCanvasPreview.tsx:74`
  (rendered zoom also clamped to `MIN_ZOOM`), `styles/workspace/canvas.css` (`.canvas`
  padding 24 px each side, `scrollbar-gutter: stable`), `OVERFLOW_TOLERANCE = 0.02`.
- Arithmetic: a 320 px panel leaves at most 272 px of content width (less if a classic
  scrollbar gutter is reserved). A4 at the clamped 0.5 is 297.5 px; US Letter is 306 px.
  Both exceed 272 x 1.02 = 277.4 px, so `overflowIsUnintended` is permanently true and the
  preview never leaves the blocking state. At 390 px, A4 fits (342 / 595 = 0.575).
- Root cause: manual zoom bounds are reused as the fit bounds.
- Correction: allow fit zoom below the manual minimum (for example down to 0.2) and do not
  clamp `renderedZoom` to the manual bound; combined with F-02 the overflow block goes
  away.
- Regression test: first preview visible and within the container at 320x568 and
  390x844 for A4 and Letter.

### F-04 P1: A failed or pending update leaves stale pages with no indication

- Subsystem: live preview. Prior audit P1-03. Status: **fixed and verified** (section 7).
  Evidence: source-confirmed; baseline has no status or Retry.
- Source: `BuilderPreviewPanel.tsx:22` uses only `pages`, `progress`, `error`;
  `isRendering` and `isPreviewStale` from `usePdfCanvasPreview.tsx:134` are unused.
  `PdfCanvasPreview.tsx:103` shows `error` only while blocking.
- Consequence: after a render failure, the last good pages stay on screen with no
  message. Download uses current state, so the downloaded file can differ from what the
  preview shows.
- Correction: a small non-blocking status in the preview panel: "Updating preview" while
  pending or rendering; "Preview could not be updated" plus Retry after a failure, with
  prior pages kept.
- Regression test: after the first preview, block the pdf.js worker request, edit, and
  assert that pages remain and an error with Retry is visible; unblock, retry, and assert
  recovery.

### F-05 P1: Mobile Edit/Preview switching destroys and regenerates the preview

- Subsystem: workbench shell. Prior audit P1-04. Status: **fixed and verified** (section 7).
  Evidence: runtime-reproduced on baseline (editor scroll position lost after switching).
- Source: `components/shared/workbench/WorkbenchShell.tsx:32-44` renders each panel
  conditionally; `hooks/useWorkbench.ts` computes `showLeft`/`showRight` from
  `isDesktop` (initially `false`, set in an effect).
- Consequence: every return to Preview below 1024 px remounts `usePdfCanvasPreview`, so
  pages are discarded and the blocking loader shows. The editor panel is also unmounted
  on the way, which discards its scroll position and expanded cards. On desktop, the
  first client render shows only the editor until the effect runs.
- Correction: keep both panels mounted and hide the inactive one with CSS below `lg`.
  While hidden, the preview container measures 0 px, so rendering pauses. On return,
  skip regeneration when the render signature is unchanged (see F-09). The Analyzer uses
  the same shell, so its mobile behavior must be re-tested.
- Regression test: at 390x844, Preview, then Edit, then Preview shows canvases within
  150 ms and no loading status.

### F-06 P1: Preview dock may be unusable at 320 px (provisional)

- Subsystem: live preview. Prior audit P1-05. Status: **fixed and verified** (section 7).
  Evidence: runtime-reproduced on baseline: the dock overflows the preview panel at 1024 px
  (18 px horizontal scroll) and is clipped at the left edge at 1100 px (screenshot), and the
  320x568 case never shows the dock because the preview never renders.
- Source: `PreviewDock.tsx` wraps Download, Analyze, zoom out, percentage, zoom in, and
  Fit in one `flex items-center gap-1` row without wrapping. The Analyze label hides
  below `sm`, but Download does not.
- Correction if confirmed: allow wrapping or use a two-row compact layout below `sm`.
- Regression test: every dock control fully inside the viewport and trial-clickable at
  320x568, 390x844, and 640x400 at device scale 2.

### F-07 P1: No automated test covers the real Builder preview

- Subsystem: tests. Prior audit P1-06. Status: **fixed** (section 7): `e2e/builder-preview.spec.ts`,
  23 tests. Evidence: baseline run lists all 32
  Chromium tests; none asserts on Builder preview canvases, continuity, resize, mobile
  switching, error state, or preview/export parity.
- Correction: add `e2e/builder-preview.spec.ts` covering F-02 to F-06, F-08, and F-09,
  plus parity with the downloaded PDF.

### F-08 P2: Remounted canvases are left blank until the next render

- Subsystem: live preview. New. Status: **fixed and verified** (section 7).
  Evidence: runtime-reproduced on baseline (24 blank-page frames during resize).
- Source: `PdfCanvasPreview.tsx:79-89` copies bitmaps in a layout effect keyed only on
  `pages`; `:104` unmounts the canvases whenever `isBlocking` is true.
- Reproduce (derived): narrow the window to trigger F-02, then widen it before the new
  render lands. The canvases remount with no pixels, so white pages show until the next
  render.
- Correction: copy the bitmap when a canvas element attaches (callback ref), not only
  when `pages` changes. Largely neutralized by the F-02 correction, but it should be
  fixed directly.

### F-09 P2: Unnecessary regeneration when nothing visible changed

- Subsystem: live preview. New. Status: **fixed** (section 7). Evidence: source-confirmed.
- Source: `usePdfCanvasPreview.tsx:106-122` schedules a render on every signature change
  and never compares with `lastRenderedSignatureRef` before scheduling.
- Consequence: resizing away and back, or any temporary scale change, re-renders an
  identical document. On mobile this compounds F-05.
- Correction: skip scheduling (and cancel any pending timer) when the new signature
  equals the last rendered one.

### F-10 P2: pdf.js resources are not released on render errors

- Subsystem: live preview. Prior audit P2-03. Status: **fixed and verified** (section 7).
  Evidence: source-confirmed.
- Source: `pdfCanvasRenderer.ts:20-51` has no `try`/`finally`; an exception from
  `getPage` or `render` skips `pdfDoc.destroy()`, leaking the document and its worker.
  Each render also creates a new pdf.js worker (no shared `PDFWorker`), and in-flight
  `@react-pdf/renderer` generation cannot be aborted.
- Correction: destroy the loading task and document in `finally`. Measure whether a
  shared worker helps before changing worker strategy.

### F-11 P2: Object URLs are revoked synchronously after starting downloads

- Subsystem: export. Prior audit P2-04. Status: **fixed; verified in Chromium and Firefox, WebKit pending** (7.2). Evidence: source-confirmed
  (Maestrum): `features/import-export/exportCVState.ts:12`,
  `features/resume-pdf/DownloadPdfButton.tsx:30`.
- Runtime: the Chromium download and embedded-session tests pass. Firefox and WebKit are
  untested because their browsers are not installed.
- Correction: revoke after a short delay (for example on the next macrotask plus a
  grace period) and verify downloaded bytes in all three engines.

### F-12 P2: Two tabs silently overwrite each other

- Subsystem: persistence. New. Status: **fixed and verified** (7.2). Evidence: source-confirmed (Maestrum): no
  `storage` event listener in `lib/storage.ts` or `context/CVContext.tsx`.
- Consequence: with the Builder open in two tabs, the last tab to save wins with no
  warning.
- Correction: listen for `storage` events on `cvforge:state` and show a "changed in
  another tab" notice with Reload. Do not auto-merge.

### F-13 P2: Font choices collapse to three PDF core fonts, and Courier New maps to Helvetica

- Subsystem: settings and PDF. Prior audit P2-01, extended. Status: **fixed and verified** (7.2). Evidence:
  source-confirmed (Maestrum, locator-backed); runtime pending.
- Source: `features/builder/settings/settingsConstants.ts:10-33` offers Lexend, Inter,
  Helvetica, Times New Roman, Georgia, Courier New, and JetBrains Mono.
  `features/resume-pdf/resumePdfFontHelpers.ts:5-16` resolves Sans to Helvetica, Serif to
  Times-Roman, and names containing "mono" to Courier. "Courier New" does not contain
  "mono", so it falls through to **Helvetica**. The picker (`FontFamilyPicker.tsx`) does
  not disclose any mapping.
- Correction for this release: fix the Courier New mapping, and label each option with
  its actual PDF output (or reduce the list to the three real families). Font embedding
  stays deferred.
- Regression test: unit test of `resolvePdfFont` for every offered option.

### F-14 P2: Locale setting has no effect on the PDF

- Subsystem: settings and PDF. Prior audit P2-02. Status: **resolved by removing the control** (7.2). Evidence:
  source-confirmed (Maestrum): `settings.localePreset` is edited in
  `DocumentSettings.tsx:45-54` and read nowhere else; `lib/resume-formatting.ts:17-25`
  `formatDateRange` takes no locale and hardcodes English "Present" and "Until ".
- Correction: either pass the locale to date formatting and test EU and US output, or
  remove the control with an explanation. Do not remove the schema field (data contract).

### F-15 P2: Current files contain em dashes and there is no automated check

- Subsystem: repository. Status: **fixed and verified** (7.2). Evidence: `git grep` on the audited SHA.
- Inventory: 63 U+2014 occurrences in 10 tracked files. `CLAUDE.md` has 49, including
  the policy line that permits one in the headline. Six are product metadata:
  `lib/siteConfig.ts:6` (`HOME_TITLE`) and five Open Graph `alt` strings (`app/layout.tsx`,
  `app/page.tsx`, `app/builder/page.tsx`, `app/analyzer/page.tsx`,
  `app/opengraph-image.tsx`). One is visible hero copy (`components/home/HeroSection.tsx:15`,
  "(em dash) locally."). Four are comments (`PdfCanvasPreview.tsx`). One is behavior-bearing:
  `lib/parser/extractionDiagnostics.ts:37` lists the em dash and en dash as
  non-noise characters inside a regex. It must become `\u2013\u2014` escapes, not be
  deleted, or noise scoring changes. En dashes (U+2013) also appear in user copy at
  `features/scoring/scoreCV.ts:143` ("2–4").
- Correction: replace them with ASCII punctuation, keeping regex semantics. Port
  RoadForge `tools/check-no-em-dash.mjs`, add a `check:em-dash` script, and wire it into
  `make check`, `release-check.sh`, and CI. Update the `CLAUDE.md` typography rule so it
  no longer permits em dashes. Existing e2e metadata assertions may need matching
  updates.

### F-16 P2: Nothing prevents co-author trailers on new commits

- Subsystem: repository and agent tooling. Status: **fixed and verified** (7.2). Evidence: see
  `cvforge-history-cleanup.md` section 4. History is clean. The only live mechanism is
  Claude Code's default commit attribution, which no project or user setting overrides.
- Correction: a tracked `.claude/settings.json` with empty commit and PR attribution; a
  versioned `commit-msg` hook (Co-authored-by and U+2014); a CI job checking the pushed
  commit range.

### F-17 P2: Analyzer edge cases lack automated tests

- Subsystem: Analyzer tests. Status: open. Evidence: the baseline e2e list covers PDF-only
  acceptance and image-only honesty; there are no e2e cases for encrypted, truncated,
  oversized (>15 MB), >20 pages, or rapid replacement. Behavior for these was confirmed
  sound in source (section 5), so this is a coverage gap only.
- Correction: generated fixtures (pdf-lib at test time) and e2e cases for each.

### F-18 P2: Cross-browser export integrity is unverified

- Subsystem: tests. Status: **fixed for Chromium and Firefox; WebKit pending** (7.2). Evidence: `cross-browser-smoke.spec.ts` asserts a
  `.pdf` download event only (prior audit); Firefox and WebKit browsers were unavailable
  for the baseline.
- Correction: in the cross-browser projects, parse the downloaded bytes with pdf-lib,
  assert page count and the embedded session attachment, and restore it.

### F-19 P2: Production build depends on live Google Fonts

- Subsystem: build and release. New. Status: **fixed** (7.2). Evidence: runtime. Baseline build
  attempt 1 failed inside `next/font/google`'s loader (`TypeError: Cannot read properties
  of null (reading '1')` at `loader.js:122`, the font-file extension regex) for `Lexend`
  and `JetBrains_Mono` from `app/layout.tsx`. The same request succeeded minutes later,
  and attempt 2 built cleanly.
- Consequence: release, CI, and Docker builds can fail intermittently for reasons
  outside the repository.
- Correction: self-host the two families with `next/font/local` and committed WOFF2 files
  (both are OFL-licensed), or accept the risk and document a retry. Needs owner approval
  because it adds binary assets.

### F-20 P3: Hydration shows the default state briefly

- Subsystem: persistence. Prior audit P2-05. Status: **fixed** (7.2). Evidence: source-confirmed
  (Maestrum). The preview's empty placeholder can flash before stored state loads. The
  data-loss aspect is tracked as F-01. The F-01 hydrated flag also lets the Builder
  render a neutral loading state instead.

### F-21 P3: Reset and Start Fresh have confirmation but no undo

- Subsystem: Builder. Status: accepted risk candidate. Evidence: source-confirmed
  (Maestrum): `features/builder/settings/ResetSettingsControl.tsx:8-56` (inline confirm),
  `features/builder/workbench/BuilderEntryModal.tsx:52-59` (`window.confirm`).
- Recommendation: acceptable for release; consider an undo snackbar later.

### F-22 P3: CI Node version differs from local

- Subsystem: CI. Status: open. Evidence: `.github/workflows/validation.yml` uses Node 20;
  the local toolchain is Node 22.23.1. Pin one version in `package.json` `engines` and CI.

### F-23 P2 (P1 if it throws): Characters outside WinAnsi are unsupported in the PDF and undisclosed

- Subsystem: PDF generation. New. Status: **disclosed, output not corrected; owner decision** (7.2, 7.3). Runtime: does not throw. Evidence: source-confirmed (Maestrum):
  no `Font.register` or `Font.registerHyphenationCallback` anywhere
  (`features/resume-pdf/resumePdfStyles.ts:1-215`), so only the standard 14 PDF fonts
  are used, and they cover WinAnsi (Western European) only.
- Impact: Portuguese and other Western European letters are covered. Polish, Czech,
  Greek, Cyrillic, CJK, and emoji are not; react-pdf renders them as missing or wrong
  glyphs. Whether any input makes generation throw (which would also trigger F-04) is
  **unverified**.
- Correction for this release: runtime-verify the behavior with a Greek, Cyrillic, and
  Polish fixture; show a Builder notice when the CV contains unsupported characters;
  document the limitation. Font embedding with broad-coverage fonts stays deferred.
- Regression test: Playwright generates a CV with each script, asserts no preview error,
  and asserts that the notice is shown.

### F-24 P2: Long unbroken strings (URLs) can overflow the PDF page

- Subsystem: PDF generation. New. Status: **fixed and verified** (7.2). Runtime-reproduced on baseline. Evidence: source-confirmed (Maestrum):
  `features/resume-pdf/ResumePdfEntry.tsx:49` sets `wrap` on links but no hyphenation
  callback or break opportunities exist, so a single long token cannot break.
- Consequence: text runs past the right margin or is clipped, which hurts both reading
  and ATS extraction.
- Correction: register a hyphenation callback that splits overlong tokens at safe
  characters (`/`, `?`, `&`, `-`, `.`) or at fixed lengths, without changing the stored
  text.
- Regression test: fixture with a 150-character URL; extracted text from the downloaded
  PDF contains the full URL, and pdf.js text item x-extents stay within the page width.

### F-25 P2: Featured skill "rating" input has no visible effect

- Subsystem: Builder skills. New. Status: **resolved by removing the input** (7.2). Evidence:
  source-confirmed (Maestrum): `features/builder/skills/FeaturedSkillItem.tsx:26-31`
  updates `rating`; `features/resume-pdf/ResumePdfSkills.tsx:44` ignores it. Showing
  ratings would violate the ATS rule against skill meters.
- Correction: remove the input from the UI (keep the schema field for compatibility), or
  relabel it with its real purpose if it drives ordering.

### F-26 P3: `entrySpacing` setting is dead

- Subsystem: settings. New. Evidence: source-confirmed (Maestrum): defined at
  `types/cv/schemas.ts:139` with no control and no PDF consumer. Harmless; keep for data
  compatibility and document it.

### F-27 P3: Dates always use English words

- Subsystem: PDF generation. New. Evidence: `lib/resume-formatting.ts:17-25` hardcodes
  "Present" and "Until ". A PT-PT CV therefore mixes languages. Resolve together with
  F-14.

### F-28 P3: Featured skills are keyed by array index

- Subsystem: Builder skills. New. Evidence: source-confirmed (Maestrum):
  `context/cvStateUpdates.ts:5-39` updates and deletes featured skills by index, while
  repeatable sections use ids. Deleting an item while another is being edited can move
  focus or input state to the wrong row. Data stays consistent because inputs are
  controlled. Correction: give featured skills stable ids at creation (migration-free,
  optional field) or key rows by a derived stable value.

### F-29 P3: Section move at a boundary still writes state

- Subsystem: Builder. New. Evidence: source-confirmed (Maestrum):
  `features/builder/workbench/useBuilderSectionActions.ts:37-49` dispatches a
  `sectionOrder` update even when the section is already first or last. That stamps
  `updatedAt`, writes storage, and schedules a preview render for no change.
  Correction: return early at boundaries (and disable the control there, if it is not
  already disabled).

### F-30 P3: Expanded-card ids are not cleaned up on delete

- Subsystem: Builder. New. Evidence: source-confirmed (Maestrum): `useBuilderSectionState`
  keeps ids of deleted items in `expandedIds`. Negligible memory impact; clean up when
  that file is next touched.

## 5. Reviewed and found sound

| Area | Evidence (Maestrum, locator-backed) |
| --- | --- |
| Upload validation order: extension, MIME, zero size, 15 MB, `%PDF-` signature, then the 20-page limit before text extraction | `lib/parser/analysisFileValidation.ts:16-41`, `lib/parser/pdfTextExtraction.ts:50-109` |
| Specific messages for encrypted and malformed PDFs; honest no-selectable-text guidance with no OCR claim | `pdfTextExtraction.ts:173-192`, `features/parser/diagnostics/ExtractionDiagnostics.tsx:49-54` |
| Stale uploads: generation counter plus AbortController; pdf.js loading task and document destroyed in `finally`; source object URL revoked | `features/parser/upload/useParserDocument.ts:13-88` |
| Analysis target isolation: four branches; uploaded PDFs never scored with Builder data | `features/parser/workbench/resolveParserAnalysisTarget.ts:8-69` |
| Restore and import require explicit confirmation; cancel has no side effects | `ParserRestoreAction.tsx:12-17`, `ParserHeuristicAction.tsx:16-22`, `import-export/useImportModalFlow.ts:26-86` |
| JSON backup import validates with `migrateCVState` then `parseCVState`; failures leave Builder state untouched | `import-export/importCVState.ts:4-12` |
| Deterministic scoring: no `Date`, `Math.random`, `Intl`, or `localeCompare`; English/PT-PT keyword detection with neutral fallback | `features/scoring/scoreCV.ts:30-61`, `features/scoring/languageDiagnostics.ts:33-109` |
| Copy disclaims ATS guarantees, recruiter prediction, and commercial ATS equivalence | `features/parser/score/ScorePanel.tsx:42-70` |
| Preview blob never carries the session attachment (attachment only in the download path) | `DownloadPdfButton.tsx`, `usePdfCanvasPreview.tsx:11-17` |
| Storage write failure (quota) shows an alert | `context/CVContext.tsx` (Maestrum) |
| **Privacy: no CV or user data reaches or stays on the server.** Server entry points are GET-only static routes (`app/health/route.ts:5-18`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`, two redirect pages); there are no POST/PUT/PATCH handlers, server actions, middleware, rewrites, analytics, or third-party scripts | `next.config.mjs:5-18,33-45` |
| No client network egress (`fetch`, XHR, `sendBeacon`, WebSocket, EventSource, form posts). PDF generation, pdf.js parsing (same-origin worker), and scoring run in the browser. The only URL parameter is the static `?source=builder` | `DownloadPdfButton.tsx:18-30`, `pdfTextExtraction.ts:41-53`, `pdfCanvasRenderer.ts:10-20`, `scoreCV.ts:30-48`, `BuilderPreviewPanel.tsx:47` |
| CSP `connect-src 'self' data: blob:`; no Docker volumes or request logging; storage is `localStorage` only (`cv:displayName`, `cv:lastSession`, `cv:saved`, `cvforge:state`) with no cookies | `next.config.mjs`, `Dockerfile:1-56`, `docker-compose.yml:1-17`, `lib/storage.ts:4-37` |

The privacy result is static evidence. A runtime network-egress regression test is
planned as R-17 in the remediation plan.

## 6. Audit limitations

- **Environment:** Firefox and WebKit Playwright browsers are not installed;
  `git-filter-repo` is not installed (not needed, see history document).
- **Maestrum output firewall:** partway through the audit, the session's raw-output
  allowance was exhausted. After that point, repository source and runtime test output
  were withheld from the lead session, so these runtime reproductions were not
  completed: F-01, F-03, F-06, F-08. The owner chose delegation-only mode.
  Maestrum bypassed the Playwright reproduction-authoring task as low-gain for
  delegation, and local authoring without seeing test output is not reliable. No
  application code was changed.
- **Settings trace (all 25 `SettingsSchema` fields)** is complete: `documentSize`,
  `themeColor`, `fontFamily`, typography sizes, spacings, section order, visibility,
  titles, bullet visibility, description modes, and the nine advanced layout settings all
  reach `resumePdfStyles.ts` or `ResumePdfDocument.tsx`. The exceptions are
  `localePreset` (F-14), `entrySpacing` (F-26), and the Courier New mapping (F-13). No
  `href="#"`, TODO, "coming soon", "Save to server", "Share", roadmap, or sprint copy was
  found.
- **Section CRUD and description modes** are complete: repeatable sections are keyed by
  id with boundary checks (`context/cvStateUpdates.ts:5-39`); empty custom-section titles
  are omitted from the PDF (`ResumePdfCustomSections.tsx:24-26`); bullet/paragraph
  toggling is per-section and lossless, and blank bullets are kept in state and dropped
  in the PDF (`useDescriptionModeToggle.ts:6-21`, `ResumePdfSection.tsx:27-57`).
- **Test inventory:** 5 unit files and 3 e2e specs. Missing: reducer CRUD and move,
  storage load failure, migrations, description-mode conversion, PDF generation units,
  and the live preview.
- **Not yet covered by this audit:** visual consistency against Anvilary and RoadForge,
  keyboard and mobile interaction beyond the existing axe and focus tests, performance
  baselines, the manual QA matrix, and `make release-check`. All of these need runtime
  observation.

## 7. Remediation session 2 (2026-09-26)

### 7.1 Reconciliation with the checkout

Checked against the working tree at `d858f37` before any change:

- Git state: branch `audit/release-readiness-2026-09-26` at `d858f37`, only `docs/audits/`
  untracked, `stash@{0}` ("wip: previous pdf preview smoothing attempt") present and left
  untouched.
- Source locators for F-01 (`lib/storage.ts:55-64`, `context/CVContext.tsx:19-30`,
  `lib/cvMigrations.ts`), F-02 to F-06, F-11 (`exportCVState.ts:12`,
  `DownloadPdfButton.tsx:30`), and F-13 were re-read and match the register.
- Severity table correction: the register lists 15 P2 findings (F-08 to F-19, F-23, F-24,
  F-25), not 14.
- **R-17 status correction:** the privacy network-egress browser test was planned, not
  implemented. At `d858f37`, `apps/web/e2e/` contains only `accessibility.spec.ts`,
  `cross-browser-smoke.spec.ts`, and `release-smoke.spec.ts`; none records network
  requests. The privacy row in section 5 is static evidence only.

### 7.2 Fix log

Each entry is marked fixed only when a regression test passes on the working tree.

| Finding | Change | Regression evidence |
| --- | --- | --- |
| F-01 (P0) | `storage.loadCVState()` returns `empty`, `loaded`, or `unreadable` (`corrupt`, `unsupported-version`, `invalid`). An unreadable payload is copied to `cvforge:state:recovery` (a different existing copy is never overwritten; the new one gets a timestamped key). `useCVPersistence` suppresses every write while loading and while blocked. `SavedDataNotice` (Builder and Analyzer) offers Download saved data, Reload (newer version only), and Start fresh with an explicit confirmation. Explicit hydration status replaces the `updatedAt` guard. Storage key, schema, migrations, JSON backup, and PDF restore are unchanged. | `src/lib/storageLoad.test.ts` (10 unit tests); `e2e/data-integrity.spec.ts` (6 Chromium tests: corrupt data, byte-exact download, newer-schema rollback with edit and reload, Analyzer, confirmed recovery with reload, valid load unchanged). On baseline `d858f37` the same spec fails 5 of 6, and a probe shows the stored payload replaced after one keystroke. |
| F-02, F-03, F-08, F-31 | `PdfCanvasPreview` always displays pages at the current zoom and CSS-scales the existing bitmap until sharper pages arrive; the loader is shown only before the first pages. Fit bounds (0.2 to 2.5) are separate from manual bounds (0.5 to 2.5), and Fit uses the selected page size before the first render. The container has `min-width: 0`, so Fit no longer measures its own page. A sub-pixel tolerance prevents the wide layout at Fit. Canvases paint from a callback ref, so a remounted canvas is never blank. | First preview fits at 1440, 1024, 768, 390, and 320 px for A4 and Letter (10 tests; baseline 2 of 10). Resize samplers: desktop 0 of 122 frames and mobile 0 of 159 frames without pages, with the loader, or blank (baseline 56, 56, 24 and 45, 45, 39). |
| F-04 | `usePdfCanvasPreview` exposes `isPending` (debounce window), `isRendering`, and `retry`. A `role="status"` chip reads "Updating preview" or "Preview could not be updated" with a Retry preview button; pages stay visible. The unlabeled spin icon is removed. A first-render failure shows the error with Retry. | "pending updates are announced" and "a failed update ... recovers on Retry" tests. The failure test closes the live pdf.js worker; pages stay visible for all sampled frames and Retry recovers. |
| F-04 (new root cause) | Retry could never recover after a worker load failure: pdf.js fell back to a main-thread `import()` of the worker, and the browser caches failed module imports for the page lifetime. The preview now owns one shared module `Worker` (`pdfPreviewWorker.ts`), waits for its `ready` message, and recreates it after any failure. A 10 s document-load timeout turns a dead worker into a visible error instead of a permanent "Updating preview". | Same test. |
| F-05, F-09 | `WorkbenchShell` keeps both panels mounted and hides the inactive one below `lg` with CSS. A hidden preview measures 0 px, which pauses rendering. The hook skips scheduling, and cancels pending work, when the signature equals the last rendered one. Desktop first paint shows both panels (no `isDesktop` effect). | Mobile switching: preview visible 52 ms after returning, 0 loader frames, 0 blank frames, editor scroll position kept (baseline lost it). `e2e/workbench-panels.spec.ts`: Analyzer results survive mobile Analysis and Source switching; desktop shows both panels. |
| F-06 | `PreviewDock` is a labelled `role="toolbar"` ("PDF preview controls") that wraps within the panel; buttons have `type="button"`; the zoom level is a polite status; Analyze keeps an accessible name at every width. | Every toolbar control is inside the viewport and hit-testable at 320x568, 390x844, and 640x400 at device scale 2; axe shows no serious or critical violations with the preview rendered. |
| F-07 | New `e2e/builder-preview.spec.ts` (23 tests) and helpers in `e2e/support/`. | On baseline `d858f37`: 5 passed, 18 failed (`.logs/remediation/baseline-preview.log`). On the working tree: 23 passed. |
| F-10 | `pdfCanvasRenderer.ts` destroys the loading task in `finally` and cleans up each page in `finally`. The shared worker replaces one worker per render. | Covered by the preview suite; no leak-specific test. |
| F-11 (partial) | `lib/downloadBlob.ts` appends the anchor, clicks, removes it, and revokes the object URL after 60 s. Used by the PDF download, JSON backup, and saved-data download. | Chromium download tests pass. Firefox and WebKit verification is pending (F-18). |
| F-20 | The Builder preview shows the neutral loader until the saved CV has been read, instead of the empty-CV placeholder. | Covered by the data-integrity and preview suites. |
| F-12 | `useCVPersistence` listens for `storage` events on `cvforge:state`. When another tab saves different content, autosave pauses and the notice reads "This CV was changed in another tab" with Reload and "Keep this tab's version". No auto-merge. | Two Chromium tests with two pages in one context: the second tab never overwrites the first tab's save, Reload shows the first tab's CV, and "Keep this tab's version" saves it and warns the other tab. |
| F-11, F-18 | Delayed object URL revocation (see F-11 row above). `cross-browser-smoke.spec.ts` now exports the JSON backup and parses it, loads the downloaded PDF with pdf-lib, checks the page count and the `cvforge-state.json` entry in the EmbeddedFiles name tree, and restores the embedded session through Import. | Chromium 3 of 3 and Firefox 3 of 3 pass. **WebKit not verified:** the WebKit browser was installed but cannot launch on this host (missing `libevent-2.1-7t64`, `libgstreamer-plugins-bad1.0-0`, `libavif16`; installing them requires sudo). |
| F-13 (owner decision) | The picker offers exactly Helvetica (Sans), Times (Serif), and Courier (Mono), with the note "Standard PDF fonts that every PDF reader displays the same way." `resolvePdfFont` maps Courier New and Courier to Courier (previously Helvetica) and checks `sans` before `serif`, so `sans-serif` is Helvetica. Saved legacy values (Lexend, Inter, Georgia, JetBrains Mono) still load and are shown as the family they produce. Schema and default unchanged. | `resumePdfFontHelpers.test.ts` (12 tests: every offered option and every legacy value). |
| F-14 (owner decision) | The Locale control is removed from Document settings. `settings.localePreset` stays in the schema and in saved data. | Typecheck; no remaining UI reference. F-27 (English date words) stays open as P3. |
| F-25 (owner decision) | The featured skill rating input is removed; the skill input gains an accessible name. Stored ratings are preserved on edit. | `cvSkillsUpdates.test.ts`. |
| F-19 (owner decision) | `next/font/google` is removed. Lexend (variable 300 to 700) and JetBrains Mono (variable 400 to 500) latin and latin-ext WOFF2 files are served from `public/fonts/` through `@font-face` in `styles/fonts.css`, with the Google Fonts unicode ranges. `OFL-Lexend.txt`, `OFL-JetBrainsMono.txt`, and a provenance README ship beside them. The Lexend latin file is preloaded. | Builds after the change make no font requests (build logs contain no font fetch). `privacy.spec.ts` "website fonts load from this origin" passes in Chromium and Firefox (`document.fonts.check('16px Lexend')` true; every font request is under `/fonts/`). An offline build could not be demonstrated because network namespaces are not permitted on this host. |
| F-24 | `pdfHyphenation.ts` registers a hyphenation callback: link-like tokens break after `/ ? & = # . _ -`, and no run exceeds 18 characters. Ordinary words keep the built-in hyphenation. Stored text is unchanged. react-pdf always draws a hyphen at a break inside a token; the link target itself is exact. | Baseline: a 150-character token ended at x = 599.3 pt on a 595.3 pt page and was clipped; the long URL broke as `?ver-` / `sion`. Now: `pdf-text.spec.ts` shows both tokens inside the page and extracting in full after rejoining wrapped lines; `pdfHyphenation.test.ts` (5 tests). |
| F-23 (disclosed, not corrected) | Runtime result: nothing throws, but every character outside WinAnsi is silently garbled in the PDF (for example, "Łukasz Żółć" extracts as "Aukasz {óB"; Greek, Cyrillic, CJK, and emoji become mojibake). The Builder preview now shows "Some characters cannot be shown in the PDF" and lists them. Correcting the output needs an embedded fallback font, which conflicts with this release's core-font decision. See section 7.3. | `pdfCharacterSupport.test.ts` (8 tests); `pdf-text.spec.ts`: Western European text and typographic punctuation extract exactly; Polish, Greek, Cyrillic, CJK, and emoji render without errors and show the notice. |
| F-15 | All U+2014 removed from tracked and new files: `CLAUDE.md` (49, typography rule rewritten to forbid em dashes), five Open Graph `alt` strings and `HOME_TITLE` (now "CVForge: ..."), hero copy ("Build, analyze, and improve your CV, locally."), four comments (file rewritten), the audit docs, and `extractionDiagnostics.ts` (same regex code points, written as U+2013 and U+2014 escapes). The en dash in `scoreCV.ts` copy is now "2-4". `tools/check-no-em-dash.mjs` (ported from RoadForge; also scans untracked, non-ignored files) runs as `pnpm check:em-dash`, first in `make check`, in `release-check.sh`, and in the CI `static` job. | Validator passes on 300 files; it failed (exit 1) on a scratch file containing U+2014, which was then removed. |
| F-16 | Tracked `.claude/settings.json` sets empty commit and PR attribution. `.githooks/commit-msg` (enabled by `make hooks`) and `tools/check-commit-messages.mjs` reject `Co-authored-by:` in any letter case and U+2014, ignoring `#` comment lines. `pnpm check:commits` runs in `release-check.sh` and in CI (checkout `fetch-depth: 0`, every commit reachable from HEAD). | Hook rejects a trailer (exit 1) and an em dash (exit 1) and accepts a clean message (exit 0); the history check passes for 155 commits. |
| R-17 | Implemented: `e2e/privacy.spec.ts` records every request in a journey (type a unique marker, wait for the preview, download the PDF, export JSON, analyze the Builder CV, upload the PDF to the Analyzer, import an external PDF for review). It asserts same-origin GET or HEAD only, with no marker in any URL, header, or body. It also asserts the CSP `connect-src 'self' data: blob:` and same-origin fonts. The spec runs in Chromium, Firefox, and WebKit projects. | Chromium 3 of 3, Firefox 3 of 3 (WebKit blocked by host libraries; the CSP test passes). Negative control: an injected same-origin POST carrying the marker fails the test. |
| Language | Test fixtures and sample content added in this session, plus the existing samples in `accessibility.spec.ts` and `cvDataIntegrity.test.ts`, are now English (owner request). Accented Western European names and non-Latin script samples remain only where a test is about character coverage. | Unit and e2e suites pass. |

Preview metrics on the working tree (Chromium, 1440x900 unless noted): time to first
preview 0.7 to 1.3 s; last keystroke to updated preview 493 ms for a one-page CV; rapid
edits on a four-page CV settle with pages visible throughout. Screenshots of baseline and
fixed builds (desktop, mid-resize at 120 ms, settled, 320 px preview, 100 ms after a
mobile switch) are in `.logs/remediation/screens/` (git-ignored). The baseline mid-resize
screenshot shows "Preparing document" in place of the pages and the dock clipped at the
panel's left edge.

### F-31 P1 (new): US Letter previews never finish on baseline

- Subsystem: live preview. Status: **fixed and verified** (section 7.2, F-02 row).
- Evidence: runtime-reproduced on baseline `d858f37`: with `documentSize: 'Letter'`, no
  preview canvas appeared within 20 s at 1024, 768, 390, and 320 px, and at 1440 px
  the canvas stayed unpainted.
- Root cause: the first render used A4 width (595 pt) to estimate Fit. Letter pages
  (612 pt) then overflowed by more than the 2% tolerance, so `overflowIsUnintended` kept
  the blocking state, and the flex container's `min-width: auto` kept the measured width
  at the page width.

### 7.3 Open release blockers and owner decisions

1. **R-18 (new, release-blocking): production dependency advisories.** `pnpm audit-prod`
   fails the gate: `next` 15.5.21 (2 critical RCE advisories, patched in 15.5.24),
   `pdfjs-dist` 5.7.284 (high, script execution on a crafted PDF, patched in 6.2.108, a
   major upgrade), plus `sharp`, `nanoid`, `postcss`, and `fflate`. Details in
   `cvforge-test-evidence.md` section 7.5. Upgrading needs `pnpm install` and a lockfile
   change, which require owner approval. After upgrading, rerun the full gate; pdf.js 6
   needs the preview, Analyzer, and import suites.
2. **F-23 output correction (owner decision).** Non-WinAnsi text is now disclosed but still
   garbled in the PDF. Options: (a) accept disclosure for this release; (b) embed a
   broad-coverage fallback font (for example Noto Sans for Latin Extended, Greek, and
   Cyrillic, OFL) as a react-pdf fallback family, which adds font binaries and embedded
   font data to every PDF; CJK and emoji would still need separate fonts. Recommendation:
   (a) for this release, (b) as the first follow-up.
3. **F-22 (P3):** Docker and CI run Node 20, local development runs Node 22. Pick one
   (changing the Docker base image digest is an owner decision).
4. **F-17 (P2, coverage only):** Analyzer edge-case e2e tests (encrypted, truncated,
   over 15 MB, over 20 pages, rapid replacement) are still missing.
5. **Manual QA:** `docs/current-qa-plan.md` has not been run by a person on the release
   build.
6. **Commit and deploy:** nothing is committed. `make hooks` (opt-in) enables the
   commit-msg hook in a clone; it was tested directly, not installed.

## 8. Session 3 status (2026-09-26)

Evidence: `cvforge-test-evidence.md` section 8. Final tested tree
`e412fa382e6e495a9ca294878b379fed747fa2cc` (uncommitted, on `d858f37`).

- **Release gate passes** with `NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools`.
- **R-18 fixed:** production and full dependency audits report no known vulnerabilities
  (Next.js 15.5.26, pdfjs-dist 6.3.289, sharp 0.35.4, patched transitive packages).
- **F-22 fixed:** Docker, CI, and `engines` use Node 22 (required by pdfjs-dist 6).
- **New finding F-32 (P1, fixed before release):** with pdf.js 6, embedded-session restore
  would have returned nothing because `getAttachments()` now returns a `Map` without
  content; hand-written casts hid this from TypeScript. Fixed with the real types and an
  on-demand content fallback; unit and three-engine e2e coverage.
- **New finding F-33 (P1, operational, open until Phase 2):** production at
  `cvforge.alexandreteixeira.dev` runs `2082f8b` (April 2026), which predates every fix
  here, including the F-01 data-loss defect, and has real users. Phase 2 of
  `deploy/self-hosted/README.md` serves that hostname from the new release with the
  moved notice, without a redirect.
- Origin moved to `https://cvforge.anvilary.tools`; the previous hostname stays available
  with a CV export path (section 8.5 of the evidence).

### 8.1 Session 4 additions (2026-09-26)

- **F-34 (P1, fixed): the Analyzer's heuristic parser mis-read standard single-column
  CVs, including CVForge's own PDF layout.** An owner test with a real CVForge PDF scored
  "0 of 7" complete experience entries, no location, and no summary although all were
  present. Causes: bullet markers were discarded, so wrapped bullet lines looked like job
  titles; any line with a date (including a date inside a bullet) started a new entry;
  dated header lines were excluded as titles; the parser never extracted a location;
  location and name patterns rejected accented letters; and a summary was read only
  under a "Summary" heading. Fix (`lib/parser/heuristic/*`): section content keeps raw
  lines; `entryLines` keeps bullets and joins wrapped lines; entries start only at
  headings after bullets or after a complete title, organization, and date header; dates
  come only from header lines; role versus organization is chosen by keywords, then by
  the dated line; header location is read from the contact block; an unheaded paragraph
  before the first section becomes the summary. Tests:
  `lib/parser/heuristicResumeParser.test.ts` (10 tests, anonymised English fixture of the
  CVForge layout plus "Role at Company", date-first, one-line pipe, and headed-summary
  layouts). The owner's actual PDF now parses to 2 of 2 complete entries, a location, a
  summary, education, and three projects, and every content check passes.
- The same April 2026 PDF showed spaces inside words in its extracted text ("progra
  mming"); the current export does not (verified by extracting a fresh download), which
  adds urgency to F-33.
- The "Source" link was removed from the site header at the owner's request (the GitHub
  star button still links to the repository; the footer link is unchanged).
- Release gate rerun: **RELEASE CHECK PASSED** (unit 92 of 92, Chromium 81 of 81, Firefox
  and WebKit 14 of 14 via the Docker fallback, production audit clean, Docker validation
  passed). Tested tree `6feabbe1609d7096ecf2fe9c50b6eab3d40b7657`, uncommitted on `d858f37`.

### 8.2 Session 5 additions (2026-09-26)

- **F-35 (P1, fixed): phantom spaces inside words in older CVForge PDFs.** Builder import
  and the Analyzer showed "progra mming", "skil ls", "Feb 20 23". Root cause (verified in
  the raw operator list): older CVForge (react-pdf) exports wrote a real space glyph at
  each hyphenation point followed by a TJ pull-back of about 248 of the space's 278 units,
  so the text genuinely contains a space. `lib/parser/phantomSpaces.ts` finds a space glyph
  followed by a pull-back of at least 60% of its width and joins the fragments around it
  in the extracted text. It runs only for documents whose Creator or Producer is react-pdf
  or CVForge. Tests: `phantomSpaces.test.ts` (6) and `e2e/builder-import.spec.ts` (a
  synthetic pdf-lib PDF with real TJ phantom spaces). The owner's April PDFs now import
  with no split words.
- **Imported sections open automatically:** after Builder Import, or restore or draft from
  the Analyzer, every section that received content opens (`importExpansion.ts`); the
  section list remounts so the first entry of each opens. Test in `builder-import.spec.ts`.
- **Section move arrows sit side by side** (`SectionReorderControls`, 28 by 32 px targets).
  Test in `builder-import.spec.ts`.
- **Skill extraction:** commas inside parentheses no longer split a skill, category labels
  such as "Technical:" are dropped, and wrapped lines are joined (2 tests).
- One owner file, `Resume (72).pdf`, contains the second job inside the first job's bullet
  text; it imports as a separate entry with the full header as the role and no company,
  which reflects the source content.
- Release gate rerun: **RELEASE CHECK PASSED** (unit 100 of 100, Chromium 84 of 84, Firefox
  and WebKit 14 of 14 via the Docker fallback, production audit clean, Docker validation
  passed). Tested tree `23f07eefeacc21053e077e85c1a1f0f4b898cfe8`, uncommitted on `d858f37`.

Still open: F-23 output correction (disclosed only), F-17, F-26 to F-30 (P3), manual QA,
owner approval to commit, and the phased deployment (Access, DNS, ingress, and Nginx
changes were prepared and validated locally, not applied).
