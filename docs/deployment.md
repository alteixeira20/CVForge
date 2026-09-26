# CVForge Deployment Runbook

CVForge is a static/local-first product served by a Next.js standalone process. CV data
is processed in the browser and stored in that browser's `localStorage`; the service has
no database, account system, upload endpoint, or server-side CV store.

## Release Prerequisites

- Review and deploy only the intended release commit.
- Use Node.js 22 (22.13 or newer) and pnpm 10.5.2 through Corepack.
- Keep Docker available for the final container gate.
- Do not deploy until the following command passes:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools \
DOCKER_PORT=3030 \
make release-check
```

The origin is embedded at build time. Changing the runtime environment variable does not
rewrite already-generated canonical metadata.

## Local Production Preview

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools make preview-build
make preview-start
make preview-status
make preview-logs
make preview-stop
```

The test URL is `http://127.0.0.1:3030`. `preview-start` uses existing standalone output,
never rebuilds, refuses an occupied port, and records both PID and kernel process start
time before it can stop that process. Use `PREVIEW_PORT=4321` consistently on the preview
commands when 3030 is unavailable.

## Docker Deployment

Build and tag the exact reviewed commit:

```bash
git rev-parse --short=12 HEAD
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools \
  --build-arg RELEASE_ID="$(git rev-parse --short=12 HEAD)" \
  --tag cvforge:"$(git rev-parse --short=12 HEAD)" \
  .
```

Run directly on loopback for a reverse proxy:

```bash
docker run -d \
  --name cvforge \
  --restart unless-stopped \
  --publish 127.0.0.1:3030:3000 \
  cvforge:"$(git rev-parse --short=12 HEAD)"
```

Or use Compose:

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools \
NEXT_PUBLIC_RELEASE_ID="$(git rev-parse --short=12 HEAD)" \
CVFORGE_PORT=3030 \
docker compose up --build -d
```

The image runs as an unprivileged user, includes only standalone runtime output and
public/static assets, exposes a Docker health check at `/health`, and does not contain
the build-stage development dependencies.

## Reverse Proxy and Cloudflare Tunnel

Terminate public TLS at the existing trusted proxy or Cloudflare edge and send origin
traffic to `http://127.0.0.1:3030`. Preserve the original `Host` and forwarding headers,
use HTTP/1.1 or newer, and configure a graceful upstream timeout long enough for normal
page and generated-image responses.

The production host runs CVForge on the shared Docker network `edge`, behind the shared
Nginx container and Cloudflare Tunnel, with no published host port. The controlled rollout
for `cvforge.anvilary.tools` (local preview, Access-protected QA, public launch, and
keeping the previous hostname `cvforge.alexandreteixeira.dev` available for CV export) is
in [`deploy/self-hosted/README.md`](../deploy/self-hosted/README.md). For a standalone
host without that proxy, point the tunnel at `http://127.0.0.1:3030` and never expose the
port publicly. This repository does not change tunnels, DNS, TLS, WAF, or Cloudflare
settings by itself.

## Production Smoke

From the deployment host:

```bash
node -e "fetch('http://127.0.0.1:3030/health').then(async r=>{console.log(r.status,await r.text());if(!r.ok)process.exit(1)})"
```

From a trusted external machine after routing is enabled:

```bash
node -e "Promise.all(['/', '/builder', '/analyzer', '/robots.txt', '/sitemap.xml', '/site.webmanifest', '/opengraph-image'].map(async p=>{const r=await fetch('https://cvforge.anvilary.tools'+p);console.log(r.status,p);if(!r.ok)process.exitCode=1}))"
node -e "fetch('https://cvforge.anvilary.tools/parser',{redirect:'manual'}).then(r=>{console.log(r.status,r.headers.get('location'));if(r.status!==308)process.exit(1)})"
```

Also complete the manual flow matrix in `docs/current-qa-plan.md`. The health endpoint
reports only service status, application name, and an optional release identifier.

## User Data Backup

The container has no CV data volume to back up. User CV state lives in each browser
profile. Before browser resets, device migration, or risky upgrades, use Builder's JSON
export and store the resulting file in the owner's normal encrypted backup system.
Restoring a CVForge-generated PDF is a convenience when its embedded session is present;
validated JSON remains the primary full-fidelity backup.

## Rollback

Keep the previously validated immutable image tag. To roll back a direct Docker run:

```bash
docker stop cvforge
docker rename cvforge cvforge-failed
docker run -d \
  --name cvforge \
  --restart unless-stopped \
  --publish 127.0.0.1:3030:3000 \
  cvforge:PREVIOUS_VALIDATED_SHA
node -e "fetch('http://127.0.0.1:3030/health').then(r=>{console.log(r.status);if(!r.ok)process.exit(1)})"
```

After the prior image is healthy, remove the failed container only when its logs are no
longer needed:

```bash
docker logs cvforge-failed
docker rm cvforge-failed
```

For Compose, set the image to the previous immutable tag, run
`CVFORGE_PORT=3030 docker compose up -d`, and repeat the health and external smoke checks.
Application rollback does not rewrite browser CV state. Schema migration rejects future
versions rather than silently loading them, so retain a user JSON backup when testing a
new schema.

## CI and Branch Protection

`.github/workflows/validation.yml` validates pushes and pull requests without secrets or
deployment. Recommended branch protection for `main`: require the static, Chromium,
cross-browser, and Docker jobs; require the branch to be current; require at least one
review; prohibit force pushes and deletion; and restrict direct pushes. Repository
settings remain an owner/admin action and are not changed by this project.
