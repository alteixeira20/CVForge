# CVForge Test Evidence

## 1. Tested revision

- SHA: `d858f37c1e817c8fae319f7709124ec652eb955f` (`main` = `origin/main`)
- Branch at test time: `audit/release-readiness-2026-09-26` (identical application code;
  only `docs/audits/` added, untracked)
- Date: 2026-09-26
- Host: Linux 7.0.0-34-generic
- Node.js 22.23.1, pnpm 10.5.2 (`packageManager: pnpm@10.5.2`)
- Key dependencies (`apps/web/package.json`): next 15.5.21, react ^19 (installed
  19.2.6), @react-pdf/renderer ^4.5.1, pdfjs-dist ^5.7.284, pdf-lib ^1.17.1, zod ^4.4.3,
  @playwright/test 1.62.0, @axe-core/playwright 4.12.1, vitest 4.1.10
- Playwright browsers present: chromium-1234, chromium_headless_shell-1234, ffmpeg.
  **Firefox and WebKit are absent.**
- Docker 29.8.0 available. `git-filter-repo` not installed.
- CI (`.github/workflows/validation.yml`) uses Node 20, which differs from local.
- Dependencies were already installed; no `pnpm install` was run.

Logs are kept locally under `.logs/audit-baseline/` (git-ignored).

## 2. Baseline results

| # | Command | Result | Log |
| --- | --- | --- | --- |
| 1 | `pnpm lint` | exit 0 | `lint.log` |
| 2 | `pnpm typecheck` | exit 0 | `typecheck.log` |
| 3 | `pnpm test:unit` | exit 0: 5 files, 43 tests passed | `unit.log` |
| 4 | `NEXT_PUBLIC_SITE_URL=https://cvforge.alexandreteixeira.dev pnpm build` | **exit 1** (attempt 1): `next/font/google` loader TypeError at `loader.js:122` for `Lexend` and `JetBrains_Mono` | `build-attempt1-failed.log` |
| 5 | `bash scripts/prepare-standalone.sh` | exit 1 (attempt 1; no build output) | `standalone-attempt1.log` |
| 6 | `pnpm test:e2e:chromium` | exit 1 (attempt 1; no build output) | `e2e-chromium-attempt1-noserver.log` |
| 7 | Same build, retried | exit 0 (attempt 2) | `build.log` |
| 8 | `bash scripts/prepare-standalone.sh` | exit 0 (attempt 2) | `standalone.log` |
| 9 | `pnpm test:e2e:chromium` | exit 0: **32 of 32 passed** in 28.9 s (attempt 2) | `e2e-chromium.log` |
| - | `pnpm test:e2e:cross-browser` | **not run**: browsers not installed | - |
| - | `make release-check` | **not run** | - |

Diagnosis of attempt 1: from the same machine, a direct Google Fonts CSS request and
Next's own `fetchCSSFromGoogleFonts` plus `findFontFilesInCss` both returned normal
`.woff2` URLs minutes later. The failure was transient and external. It is recorded as
finding F-19.

### Chromium tests that passed (baseline)

`accessibility.spec.ts` (4), `cross-browser-smoke.spec.ts` in Chromium (3), and
`release-smoke.spec.ts` (25). They cover homepage, header, and dialog behavior;
responsive overflow of routes; persistence across reload; JSON export, cancel, and
restore; embedded PDF session restore; review-first external import; focus trapping;
Analyzer scoring and PDF-only acceptance; metadata, JSON-LD, robots, sitemap, and
manifest; reduced motion; and legacy redirects. None asserts on the Builder live PDF
preview (finding F-07).

## 3. Runtime reproduction of findings

Not performed. A Maestrum output firewall withheld repository and runtime test output
from the lead session partway through the audit (see the readiness report, section 6).
The owner chose delegation-only mode. The planned reproduction suite is specified in
`cvforge-remediation-plan.md` (task R-0).

## 4. Browser matrix

| Engine | Baseline | Export integrity |
| --- | --- | --- |
| Chromium | 32 of 32 passed | Download event, embedded session restore (existing test) |
| Firefox | not run | not verified |
| WebKit | not run | not verified |

## 5. Performance measurements

None recorded yet. Planned metrics (task R-0): time to first preview, update latency
from last keystroke to a settled preview for one-page and multi-page CVs, long-task
total and maximum during typing, and preview regeneration counts during resize and
panel switching.

## 6. Manual QA matrix

`docs/current-qa-plan.md` has not been executed in this audit.

## 7. Remediation session 2 (2026-09-26)

### 7.1 Tested revision

- Base commit: `d858f37c1e817c8fae319f7709124ec652eb955f` (HEAD, unchanged; nothing committed).
- The tested code is the uncommitted working tree. Its content fingerprint is the Git tree
  hash of all tracked and non-ignored files, computed with a temporary index (no refs,
  stash, or real index touched):
  `GIT_INDEX_FILE=<copy of .git/index> git add -A && git write-tree`. After the final test
  runs, only files under `docs/audits/` changed; the fingerprint including them is in the
  final handoff.
- `stash@{0}` is untouched. The baseline reproductions ran in a temporary detached worktree
  of `d858f37`, since removed.
- Logs: `.logs/remediation/` (git-ignored). Screenshots: `.logs/remediation/screens/`.

### 7.2 Final results on the working tree

| Check | Result |
| --- | --- |
| `pnpm check:em-dash` | pass, 300 text files |
| `pnpm check:commits` | pass, 155 commits reachable from HEAD |
| `pnpm lint`, `pnpm typecheck` | pass |
| `pnpm test:unit` | pass, 10 files, 78 tests (baseline 5 files, 43 tests) |
| `NEXT_PUBLIC_SITE_URL=https://cvforge.alexandreteixeira.dev pnpm build`, `prepare-standalone.sh`, `assert-release-artifacts.sh` | pass |
| `pnpm test:e2e:chromium` | pass, 76 of 76 (baseline 32): accessibility 4, builder-preview 23, cross-browser-smoke 3, data-integrity 8, pdf-text 8, privacy 3, release-smoke 25, workbench-panels 2 |
| Stability | builder-preview, data-integrity, workbench-panels, and pdf-text repeated 3 times: 123 of 123 pass. Compact toolbar tests repeated 5 times: 15 of 15 |
| `scripts/cross-browser-check.sh` (Firefox and WebKit) | native WebKit cannot launch (host lacks `libevent-2.1-7t64`, `libgstreamer-plugins-bad1.0-0`, `libavif16`); the script's Playwright Docker fallback (`mcr.microsoft.com/playwright:v1.62.0-noble`) passed 12 of 12 twice in a row. The first run had 1 flaky Firefox privacy test (navigation right after downloads), fixed by using a fresh page for the import step |
| `scripts/docker-check.sh` (port 3030) | pass: `/`, `/builder`, `/analyzer`, `/health`, `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/opengraph-image` return 200; `/parser` 308 and `/resume-import` 307 |
| `make release-check` | **fails at "production dependency audit"**: `pnpm audit-prod` reports 2 critical, 4 high, and 2 moderate advisories (see 7.4). Every other gate step was run separately with the results above |

### 7.3 Baseline reproductions (`d858f37`)

| Spec | Baseline result |
| --- | --- |
| `data-integrity.spec.ts` (first 6 tests) | 5 failed, 1 passed; probe: one keystroke replaced a corrupt payload and a `schemaVersion: "2.0.0"` payload |
| `builder-preview.spec.ts` | 5 passed, 18 failed (`.logs/remediation/baseline-preview.log`) |

Frame-sampler comparisons (frames without pages / with the loader / with a blank page):

| Scenario | Baseline | Working tree |
| --- | --- | --- |
| Desktop stepwise resize 1440 to 1024 and back | 56 / 56 / 24 of 126 | 0 / 0 / 0 of 122 |
| Mobile stepwise resize 430 to 320 and back | 45 / 45 / 39 of 150 | 0 / 0 / 0 of 159 |
| Typing into the summary (one-page CV) | 0 / 0 / 0 of 140 | 0 / 0 / 0 of 121 to 130 |
| Zoom in, zoom out, Fit | not measurable (no toolbar role) | 0 / 0 / 0 |
| Crashed pdf.js worker, then Retry | no status or Retry | 0 / 0 / 0 of 475 to 516; error chip and Retry shown; recovery after Retry |
| First preview, US Letter | never rendered at 1024, 768, 390, 320 px; unpainted at 1440 px | renders and fits at all five widths |
| First preview, A4 at 320 px | stayed on "Preparing document" | renders and fits |
| Mobile Edit then Preview | editor scroll position lost; preview regenerated | preview visible after 52 to 57 ms, 0 loader frames, scroll kept |

### 7.4 Performance (Chromium, production build, 1440x900 unless noted)

- Time to first preview: 624 to 1165 ms across 30 runs (A4 and Letter, 320 to 1440 px).
- Last keystroke to updated preview (one-page CV): 421 to 619 ms (400 ms debounce included).
- Rapid edits on a four-page CV: pages visible throughout; one long task of 77 to 95 ms.
- Mobile return to Preview: 52 to 57 ms to painted pages.

### 7.5 Dependency audit (`pnpm audit-prod`, 2026-09-26)

| Severity | Package | Installed | Patched | Advisory |
| --- | --- | --- | --- | --- |
| critical | next | 15.5.21 | >= 15.5.24 | GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4 (unauthenticated remote code execution) |
| high | pdfjs-dist | 5.7.284 | >= 6.2.108 | GHSA-hq66-cqwq-w95j (script execution when opening a crafted PDF; the Analyzer and import open user PDFs) |
| high | nanoid (via next > postcss) | < 3.3.16 | >= 3.3.18 | GHSA-28wg-ghj8-5hjv, GHSA-2v37-7h3g-55p8 |
| high | sharp (via next) | 0.35.0 | >= 0.35.4 | GHSA-rgj7-g3m4-5g8c (libheif) |
| moderate | postcss (via next) | 8.5.18 | >= 8.5.23 | GHSA-fxqj-rqcc-2cmp |
| moderate | fflate (via @react-pdf/renderer) | < 0.8.3 | >= 0.8.3 | GHSA-px8p-9vwx-vf98 |

Not remediated: upgrades change `pnpm-lock.yaml` and need `pnpm install`, which requires
owner approval. `pdfjs-dist` 6 is a major version and needs its own regression pass (preview
renderer, Analyzer extraction, worker setup in `pdfPreviewWorker.ts`).

### 7.6 Manual QA

`docs/current-qa-plan.md` was not executed by a person. The browser evidence above is
automated (Playwright on the production build in Chromium, Firefox, and WebKit). Viewing
the fixed-build screenshots was blocked by the Maestrum firewall partway through the
session; the baseline mid-resize screenshot was reviewed and shows the loader replacing
the pages and the dock clipped at the panel's left edge.

## 8. Session 3: new origin, dependency upgrades, release gate (2026-09-26)

### 8.1 Tested source

- Base commit `d858f37c1e817c8fae319f7709124ec652eb955f`; nothing committed. `stash@{0}`
  untouched.
- The session started from tree `531d7a7c2b2ea0404a21f55f9173478dcf82c8ab`, identical to
  the session 2 fingerprint.
- **Final tested tree: `e412fa382e6e495a9ca294878b379fed747fa2cc`** (Git tree of all
  tracked and non-ignored files, computed with a temporary index). The passing release
  gate ran on exactly this tree; only this document and the readiness report changed
  afterwards.
- Production origin: `https://cvforge.anvilary.tools` (was `cvforge.alexandreteixeira.dev`).

### 8.2 Release gate

`NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools DOCKER_PORT=3030 make release-check`:
**RELEASE CHECK PASSED** (`.logs/remediation/s3-release-check-2.log`).

| Step | Result |
| --- | --- |
| Frozen install | pass |
| Em dash policy | pass, 310 text files |
| Commit message policy | pass, 155 commits |
| Lint, TypeScript | pass |
| Production build, standalone, artifact assertions | pass (the retired origin is now a blocked artifact string) |
| `pnpm audit-prod` | **No known vulnerabilities found** |
| Unit tests | 11 files, 82 of 82 |
| Chromium and axe | 81 of 81: accessibility 4, builder-preview 23, cross-browser-smoke 3, data-integrity 8, origin-migration 2, pdf-text 8, privacy 4, production-origin 2, release-smoke 25, workbench-panels 2 |
| Firefox and WebKit | native: Firefox 8 of 8 pass, WebKit 6 cannot launch (missing host libraries); Docker fallback `mcr.microsoft.com/playwright:v1.62.0-noble`: **14 of 14** |
| Docker validation (port 3030) | pass: 200 for `/`, `/builder`, `/analyzer`, `/health`, `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/opengraph-image`; `/parser` 308, `/resume-import` 307 |

An earlier gate run on this session's code also passed but had 1 flaky Firefox case (the
new worker test read worker events once); it now polls, and 20 of 20 repetitions in
Firefox and WebKit passed without retries before the final gate.

Full audit including development dependencies (`pnpm audit`): no known vulnerabilities.

### 8.3 Dependency changes

| Package | Before | After | How |
| --- | --- | --- | --- |
| next, eslint-config-next | 15.5.21 | 15.5.26 | direct |
| pdfjs-dist | 5.7.284 | 6.3.289 | direct (major; migrated, 8.4) |
| sharp | 0.35.0 | 0.35.4 | direct and existing override |
| postcss | 8.5.18 | 8.5.28 | existing override raised to ^8.5.28 |
| nanoid | 3.3.12 | 3.3.19 | override `nanoid@<3.3.18` |
| fflate | 0.8.2 | 0.8.3 | override `fflate@<0.8.3` (via @react-pdf, which stays 4.5.1) |
| vitest | 4.1.10 | 4.1.11 | direct (dev) |
| brace-expansion, js-yaml, browserslist, baseline-browser-mapping, postcss-selector-parser, @vitest/mocker | vulnerable | patched | `pnpm update --depth Infinity` within existing ranges (dev) |
| @types/node | ^20 | ^22 | direct (dev) |
| Node.js runtime | 20 (Docker, CI) | 22 (`node:22-alpine@sha256:0a7108bf...`, CI `node-version: 22`, root `engines` `>=22.13.0 <23`) | pdfjs-dist 6 requires Node 22.13 or newer |

The pre-upgrade lockfile is saved at `.logs/remediation/pnpm-lock.before.yaml`.

### 8.4 PDF.js 6 migration

| Call site | Change |
| --- | --- |
| `lib/parser/extractCVForgeAttachment.ts` | **Would have silently broken embedded-session restore:** the code cast pdf.js results to a hand-written type and read `attachments['cvforge-state.json']`, which is always `undefined` on the 6.x `Map`. It now uses the real `PDFDocumentProxy` types, iterates the `Map` (by name-tree key or filename), and falls back to `getAttachmentContent(id)` because 6.x usually omits `content`. `PDFDocumentProxy.destroy()` calls removed; the loading task is destroyed in `finally`, and the abort listener is removed. |
| `lib/parser/pdfTextExtraction.ts` | Hand-written `PdfDocument` cast replaced with `PDFDocumentProxy`, so future API removals fail typecheck. `pdf.destroy()` removed; `cleanup()` then `loadingTask.destroy()`. |
| `features/builder/workbench/pdfCanvasRenderer.ts`, `pdfPreviewWorker.ts` | Unchanged and compatible: `getDocument({ data, worker })`, `PDFWorker.create({ port })`, `render({ canvas, canvasContext, viewport })`, `loadingTask.destroy()` in `finally`. |
| `e2e/support/pdfText.ts` | `doc.destroy()` replaced with `loadingTask.destroy()`. |

Regression coverage added: `extractCVForgeAttachment.test.ts` (4 tests: inline Map content,
on-demand content, filename match, absent attachment); `privacy.spec.ts` "PDF.js workers
for the preview and the Analyzer start from this origin" (2 or more `pdf.worker` workers,
all same-origin, no CSP console errors; Chromium, Firefox, WebKit). Existing embedded
restore tests (`release-smoke`, `cross-browser-smoke` in three engines), Analyzer tests,
and all preview continuity tests pass on pdf.js 6. pdf.js 6 uses its modern build, which
targets current browsers (its legacy build supports Chrome 125+, Safari 18+, Firefox ESR).

### 8.5 Origin change and previous hostname

- `siteConfig` fallback, `.env.example`, `Makefile`, `scripts/preview.sh`, `README.md`,
  `docs/deployment.md`, and `docs/current-qa-plan.md` use `https://cvforge.anvilary.tools`.
  CI keeps `https://cvforge.example.invalid`.
- `e2e/production-origin.spec.ts` (runs when `NEXT_PUBLIC_SITE_URL` is set): canonical,
  `og:url`, `og:image`, `twitter:image`, JSON-LD, robots `Host` and `Sitemap`, and sitemap
  `<loc>` values use the production origin, and the retired hostname appears nowhere.
- The previous hostname has real traffic (read-only check of the host's Nginx log: 182
  requests to `/builder` or `/analyzer` since late July, 163 with non-bot user agents).
  Saved CVs are in that origin's browser storage, so there is no redirect. On a hostname in
  `LEGACY_HOSTNAMES`, Builder and Analyzer show "CVForge has moved to
  cvforge.anvilary.tools" with Download JSON backup and a link to the new Builder.
  `e2e/origin-migration.spec.ts` maps the old hostname to the test server in Chromium,
  saves a CV there, exports it from the notice, and imports it at the new origin (2 tests).

### 8.6 Tested image and local preview

- Gate-tested image: `cvforge:check`, ID
  `sha256:96aec43b92b5d8624435c2cfd0ca4c014eb07d86f5c9da9626b03ccd6228aa38` (built
  2026-09-26 15:28 +01:00 with `NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools`). The
  host image must be rebuilt from the approved commit with `RELEASE_ID` (see
  `deploy/self-hosted/README.md`); nothing was deployed to the host.
- Local production preview (`make preview-start`, `http://127.0.0.1:3030`, built with the
  production origin): `/health` 200 JSON; `/`, `/builder`, `/analyzer`, `/robots.txt`,
  `/sitemap.xml`, `/site.webmanifest`, `/opengraph-image` 200; `/parser` 308 to
  `/analyzer`; `/resume-import` 307 to `/builder`; `/fonts/*.woff2` 200 `font/woff2`;
  `pdf.worker.min.*.mjs` 200 `application/javascript`. Headers: CSP with `connect-src
  'self' data: blob:`, `worker-src 'self' blob:`, `frame-ancestors 'none'`;
  `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`;
  `Permissions-Policy`; `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`
  `same-origin`. No `Strict-Transport-Security` from the app (set it at the Cloudflare
  edge). Canonical, `og:url`, `og:image`, `twitter:image`, robots, and sitemap all use
  `https://cvforge.anvilary.tools`.

### 8.7 Remaining manual QA checklist (owner)

On the local preview, then on the Access-protected hostname:

1. Builder: type in every section; the preview stays visible and updates; zoom, Fit, and
   resize the window; mobile Edit and Preview switching on a phone.
2. Download the PDF; open it in two PDF readers; check fonts (Helvetica, Times, Courier
   choices), long URLs, and page count against the preview.
3. Export JSON, clear site data, import JSON; import the downloaded PDF (embedded session
   restore); import an external PDF (review-first draft).
4. Analyzer: analyze the Builder CV; upload the downloaded PDF and a third-party PDF;
   check encrypted, scanned, and oversized files show the right messages.
5. Two tabs: edit in one; the other shows "changed in another tab".
6. Corrupt `cvforge:state` in DevTools; the Builder shows the recovery notice and does
   not overwrite it.
7. Enter Polish or Greek text; the character notice appears.
8. Safari (macOS and iOS) and Firefox on real devices, including an older Safari if you
   need to support it (pdf.js 6 targets current browsers).
9. On the previous hostname after Phase 2: the moved notice, Download JSON backup, and
   import at the new hostname.
10. Keyboard only and a screen reader through Builder, preview toolbar, and notices.
