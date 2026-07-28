# CVForge Release QA Plan

Run this checklist before deployment. Record browser, viewport, source PDF type, and console errors for every defect.

## Automated Validation

```bash
pnpm install --frozen-lockfile
make check
pnpm audit-prod
pnpm test:unit
pnpm test:e2e:chromium
pnpm test:e2e:cross-browser
git diff --check
```

Install managed browsers with:

```bash
pnpm --filter web exec playwright install chromium firefox webkit
```

The full suite runs on Chromium; the critical subset runs on Firefox and WebKit. On
Linux hosts that lack WebKit runtime libraries, use the version-matched fallback:

```bash
bash scripts/cross-browser-check.sh
```

Run the complete production gate:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.alexandreteixeira.dev \
DOCKER_PORT=3030 \
make release-check
```

It includes self-cleaning Docker validation. After every run, confirm no
`cvforge-check-*` container and no temporary standalone server remain.

## Route and Asset Smoke Checks

Verify successful responses for:

- `/`
- `/builder`
- `/analyzer`
- `/health`
- `/parser` (permanent redirect to `/analyzer`)
- `/resume-import` (redirects to `/builder`)
- `/robots.txt`
- `/sitemap.xml`
- `/site.webmanifest`
- `/opengraph-image`
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

Builder and Analyzer:

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

- **Homepage:** Builder and Analyze CV actions are immediately clear. The trust row is above the preview at 1440×900 and 1280×800. Builder, Analyzer, Source, GitHub star handoff, and the primary action remain usable at the acceptance widths.
- **Entry flow:** Continue preserves existing data. Starting fresh requires confirmation when content exists. Restore/import clearly distinguishes reliable JSON from reviewed PDF import.
- **Dialogs:** Tab and Shift+Tab remain inside the active dialog. Escape closes only the active dialog. Child import closes back to its parent control. Closing the full flow returns focus to the page trigger.
- **Builder:** Edit all section types. Confirm card expansion, visibility, ordering, title editing, settings reset, and mobile edit/preview switching.
- **PDF preview:** Confirm updates after content and setting changes. Check zoom, Fit, sharpness, empty, loading, and error states.
- **JSON:** Export a backup, change the CV, cancel one import without replacement, then restore the backup.
- **PDF export:** Download a CVForge PDF, compare it with the preview, and confirm the embedded session is detected on re-import.
- **Analyzer with Builder state:** Confirm empty and populated Builder analysis remains distinct from uploaded-file results.
- **Analyzer with CVForge PDF:** Confirm source preview, embedded-session detection, restore action, extraction confidence, and scoring target.
- **Analyzer with external PDF:** Confirm extraction analysis, Parseability dimension, and a mandatory best-effort review before Builder replacement.
- **Unsupported formats:** Confirm DOCX and plain text receive an honest PDF-only message.
- **File safety:** Confirm zero-byte, renamed non-PDF, malformed, truncated, encrypted,
  over-15-MB, and over-20-page files receive actionable errors. Rapidly replace an
  upload and confirm stale analysis cannot replace the new result.
- **Image-only PDF:** Confirm the no-selectable-text guidance mentions a text-based re-export and no OCR.
- **Scoring:** Confirm method v3 whole-number weighted dimensions, priorities, detected
  evidence summaries, explanations, suggestions, and deterministic reload results.
  Check strong English and PT-PT samples, neutral-language fallback, misleading digits,
  actual impact metrics, and malformed extraction.
- **Persistence:** Refresh and reopen the same browser profile after edits.
- **Reduced motion:** Confirm moving canvas embers are suppressed while the static heat glow remains.
- **Deprecated route:** Confirm `/resume-import` reaches `/builder`.
- **Canonical route:** Confirm `/parser` returns a permanent redirect to `/analyzer`.
- **SEO:** Inspect initial HTML for one H1, unique title/description/canonical, Open Graph and Twitter tags. Parse JSON-LD, robots, and sitemap; confirm redirect-only routes are absent from the sitemap.
- **Social image:** Confirm the 1200×630 PNG endpoint renders legibly and metadata references it.
- **Security headers:** Confirm document responses contain CSP, nosniff, referrer,
  permissions, COOP, and CORP headers without breaking PDF analysis/export or fonts.
- **Recovery:** Exercise app/route recovery, not-found navigation, Analyzer retry/reset,
  and Builder persistence after a simulated UI failure.
- **Announcements:** Confirm analysis start/completion/failure and import/export completion
  are announced once without repeated noise.

## Accessibility Matrix

Automated axe coverage includes homepage, Builder initial/populated/mobile states,
Analyzer empty/result states, and the Import review dialog. Manually verify one H1,
landmarks, heading order, dialog names/descriptions, focus trap/restoration, keyboard-only
operation, score semantics, icon labels, disabled controls, touch targets, contrast,
reduced motion, and 200% zoom. Record any assistive technology and version used.

## Local Production and Rollback Checks

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.alexandreteixeira.dev make preview-build
make preview-start
make preview-status
make preview-stop
make preview-status
```

Confirm 3030 is released after stopping. Test occupied-port refusal with a known
disposable listener; never stop an unrelated process. Review `docs/deployment.md` and
verify that the previous immutable image tag is available before deployment.

## Expected Pass Signals

- No uncaught console or page errors during core flows.
- No backend/API request is required for CV data.
- JSON, CVForge PDF restore, and external PDF draft paths remain visibly distinct.
- External PDF import never replaces Builder state without review and explicit confirmation.
- Builder and Analyzer remain separate, route-aware modes of the same workbench.
- Only PDF is advertised as an Analyzer input.
- ATS-style analysis remains clearly framed as local best-practice signals, not a hiring or ATS guarantee.
- No CV contents, filenames, extracted text, secrets, or tokens are sent to a server.
- Production output contains no localhost or production placeholder origin.
