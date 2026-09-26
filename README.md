# CVForge

CVForge by [Anvilary](https://anvilary.tools) is a local-first CV builder and ATS-style
CV analyzer. Create and refine a structured CV, see its PDF preview as you edit,
export portable backups, and analyze PDF resumes without creating an account.

**Production origin:** [cvforge.anvilary.tools](https://cvforge.anvilary.tools)

> [!IMPORTANT]
> CVForge stores CV data in your browser, not in a hosted account or database.
> **Export a JSON backup** after meaningful changes and keep it somewhere you
> control. Clearing site data, changing browsers or devices, or losing access to
> a browser profile can remove your local CV.
>
> To move a CV between browsers or devices, export your JSON backup and
> import it into the new browser. CVForge does not synchronize local data.
>
> The hosted instance is a convenient way to use the tool, not a cloud-backup
> service or a guarantee of permanent data availability. You can also
> [self-host CVForge](deploy/self-hosted/README.md).

CVForge is open source under the [MIT License](LICENSE).

## Product contract

CVForge deliberately keeps its data model and operating requirements small:

- **Local first.** Build and analyze CVs in the browser, without accounts, a database,
  server-side CV storage, or an external analysis API.
- **Portable.** Validated JSON is the primary full-fidelity backup and restore format.
  CVForge-generated PDFs can also carry an embedded session for restoration.
- **Live preview.** The Builder renders the current CV through the same PDF document
  model used for downloads, with zoom and Fit controls.
- **Explainable analysis.** Scoring is deterministic and computed locally, with
  visible evidence, priorities, and actionable suggestions.
- **Review before replacement.** Importing an external PDF creates a best-effort
  draft that must be reviewed before it replaces Builder data.
- **Recoverable.** Unreadable saved data is protected from silent overwrite, and
  conflicting changes from another browser tab pause automatic saving.
- **Straightforward to self-host.** The standalone web application needs no
  application database or user-account infrastructure.

CVForge is not a commercial applicant-tracking system, an AI hiring assessor,
or a service that predicts recruiter decisions. Its ATS-style checks are
practical improvement signals, not acceptance or hiring guarantees.

## Builder and Analyzer

CVForge has two modes in one responsive workbench.

### Builder

- Edit your profile, work experience, projects, education, skills, languages,
  and custom sections.
- Reorder and hide sections, edit section titles, and choose layout settings,
  including A4 or US Letter, color, typography, spacing, and compact mode.
- See a PDF-backed canvas preview that updates as you work. Resize, zoom, and
  switch mobile workbench panels without discarding the current preview.
- Download a PDF, export a JSON backup, or restore a previously saved CV.
- Open a CVForge-generated PDF with an embedded session to recover its
  structured content when that attachment is present.

### Analyzer

- Analyze the current Builder CV directly, or select a PDF from your device.
- Inspect extraction and parseability warnings separately from CV quality
  findings.
- Review weighted scores for completeness, structure, clarity, impact,
  ATS-style compatibility, and PDF parseability when applicable.
- See detected evidence, prioritized issues, explanations, and suggested
  improvements.
- Review an external PDF's best-effort structured draft before importing it
  into the Builder.

PDF analysis supports files up to **15 MB and 20 pages**. English and
Portuguese (Portugal) have explicit language-aware diagnostics; other
languages receive language-neutral fallback checks.

## Data ownership and formats

The canonical CV state lives in browser `localStorage`. There is no account
sync, automatic cross-device transfer, or hosted copy of your CV.

| Format | Purpose | Important boundary |
| --- | --- | --- |
| JSON | Full-fidelity backup and validated import | Recommended for reliable recovery and device migration |
| CVForge PDF | Printable export with an optional embedded CV session | Session restore works only when the attachment is present |
| External PDF | Local extraction, analysis, and reviewed draft import | Parsing is heuristic and may miss or misidentify fields |

Keep exported files private. CVs can contain contact details, employment
history, and other personal information. The app's local-first design does
not protect an exported file once you share or upload it elsewhere.

If stored data is corrupt or was written by a newer CVForge schema, the
Builder must not silently replace it. Download the available recovery
data before starting fresh or rolling back an application version.

## Stack

| Layer | Technology |
| --- | --- |
| Application | Next.js App Router, React, TypeScript |
| Interface | Tailwind CSS and shared Anvilary workbench components |
| State and validation | React reducer, Zod schemas and migrations |
| Persistence | Browser `localStorage` |
| PDF generation | `@react-pdf/renderer` and `pdf-lib` |
| PDF preview and extraction | `pdfjs-dist`, running in the browser |
| Tests | Vitest, Playwright and axe |
| Workspace | pnpm and Make |
| Deployment | Standalone Node.js image, Docker Compose, Nginx and Cloudflare Tunnel |

No application backend, account service, or database is required.

## Local development

Reference toolchain:

- Node.js **22.13 or newer, below 23**
- pnpm **10.5.2** through Corepack
- Docker and Docker Compose for container and complete release validation

```bash
git clone https://github.com/alteixeira20/CVForge.git
cd CVForge
corepack enable
corepack prepare pnpm@10.5.2 --activate
pnpm install --frozen-lockfile
make dev
```

Open `http://127.0.0.1:3000`.

Useful lifecycle commands:

```bash
make help
make check
make status
make logs
make stop
```

To inspect the standalone production build locally:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools make preview-build
make preview-start
make preview-status
make preview-stop
```

The default preview address is `http://127.0.0.1:3030`. This address is
only for local testing; canonical metadata uses the production origin
supplied at build time.

## Architecture

CV data and PDF processing stay in the browser:

```text
Builder
  structured CV state -> browser localStorage -> validated JSON backup
                      -> PDF document -> canvas preview
                                      -> PDF download + optional session

Analyzer
  current Builder state ----------------------> local scoring
  selected PDF -> local extraction + validation -> local scoring
                                             -> reviewed import draft
```

The maintained data contract is defined by the Zod schemas in
`apps/web/src/types/cv/`. Import validation and schema migrations protect
the stored format, and external PDF parsing never silently replaces the
Builder's current CV.

The public web server serves the application, static assets, metadata,
and health information. Normal Builder and Analyzer workflows do not
upload CV contents to it.

## Privacy and PDF safety

- PDF parsing and scoring run locally. The PDF.js worker is served from
  the same origin as the application.
- Uploaded-file validation checks PDF signature, extension, available
  MIME information, size, and page count before analysis.
- Processing includes cancellation and stale-result protection so an
  older PDF cannot replace a newer analysis result.
- A production Content Security Policy and other response headers are
  part of the standalone application.
- Image-only or scanned PDFs need selectable text for analysis; CVForge
  does not send documents to cloud OCR.

A local-first application still depends on the safety of the browser,
device, and any copies you export. Do not put real CV data or private
PDFs in public bug reports.

## Self-hosting and operations

The production origin is configured with `NEXT_PUBLIC_SITE_URL` at
**build time**. It determines canonical links, Open Graph and JSON-LD
URLs, `robots.txt`, and `sitemap.xml`. Setting a different runtime
variable does not rewrite an existing build.

Run the complete release gate against your intended HTTPS origin:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools \
DOCKER_PORT=3030 \
make release-check
```

The gate includes a frozen dependency install, lint, type checking,
production build, dependency audit, unit tests, Chromium and axe checks,
critical Firefox/WebKit tests, and Docker validation.

A maintained deployment example under
[`deploy/self-hosted`](deploy/self-hosted/README.md) uses a shared Docker
network behind Nginx and Cloudflare Tunnel, without publishing the
application's container port. Deployments should terminate HTTPS at a
trusted edge, configure the appropriate security headers, retain a
previous validated image for rollback, and monitor application health
at `/health`.

See the [deployment runbook](docs/deployment.md) for standalone Docker,
reverse-proxy configuration, smoke tests, backup considerations, and
rollback.

## Known boundaries

These are explicit product limitations, not implied guarantees:

- Local browser data is not synchronized or backed up by the hosted site.
- The Analyzer accepts PDF only. DOCX, plain-text input, and OCR are not
  currently supported.
- External PDF extraction is best effort, especially for scans,
  protected files, complex layouts, and unusual reading order.
- The built-in PDF fonts do not cover every writing system. The Builder
  warns when text contains characters its PDF export cannot reliably
  render.
- The current Editor uses section move controls rather than drag-and-drop
  reordering. Photo-layout templates are not yet included.
- Scoring is a documented, rule-based assessment rather than a
  reproduction of a proprietary ATS.
- Browser profiles and website origins have separate local storage;
  use JSON export and import when moving a CV between them.

See [product scope](docs/product-scope.md) for implemented and planned
features.

## Contributing

Keep changes focused and include tests for behavior that users depend
on, especially persistence, PDF output, responsive preview, import, and
privacy. Run the relevant checks before opening a pull request:

```bash
pnpm check:em-dash
pnpm check:commits
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e:chromium
bash scripts/cross-browser-check.sh
```

Enable the repository's versioned commit-message hook with `make hooks`.
Please do not attach real CVs, contact details, or private PDFs to
public issues.

CVForge is a clean-room rebuild. Contributors must not copy source
from OpenResume-derived codebases or quarantined reference material.
Read the [clean-room rules](docs/clean-room.md) before contributing.

## Release evidence and documentation

A green historical build does not certify later changes. Release
candidates need the full gate on the exact source revision, followed by
deployment-specific and manual browser checks.

Start with:

- [Product scope](docs/product-scope.md)
- [Release QA checklist](docs/current-qa-plan.md)
- [Deployment and rollback](docs/deployment.md)
- [Shared-host deployment](deploy/self-hosted/README.md)
- [Release-readiness audit](docs/audits/cvforge-release-readiness-2026-09-26.md)
- [Test evidence](docs/audits/cvforge-test-evidence.md)
- [Implementation plan](docs/implementation-plan.md)
- [Clean-room rules](docs/clean-room.md)

## License

CVForge is maintained by Alexandre Teixeira and distributed under the
[MIT License](LICENSE).
