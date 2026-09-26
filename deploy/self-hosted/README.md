# CVForge controlled deployment on the shared Docker host

Target: `https://cvforge.anvilary.tools`. The host already runs Anvilary services on the
external Docker network `edge`, behind the shared `nginx` container and the shared
`cloudflared` tunnel (`/opt/data/proxy/nginx/conf.d`, `/opt/data/proxy/cloudflared/config.yml`).
Services publish **no host ports**; this stack follows the same pattern, so no loopback
port is needed on the host.

Observed on 2026-09-26 (read-only): the host listens only on SSH (22) and a loopback model
server (11434). The existing container `cvforge` (built 2026-07-27 from
`/opt/src/CVForge` at `2082f8b`) serves `cvforge.alexandreteixeira.dev` through
`conf.d/cvforge.conf`. Nginx logs show about 160 non-bot requests to `/builder` or
`/analyzer` on that hostname since late July, so it has real users.

Every step below changes shared infrastructure. Run it only after the owner approves that
phase. Take a dated backup of any file before editing it, as the existing `*.bak.*` files do.

## Phase 0: local production preview (developer machine)

```bash
NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools make preview-build
make preview-start          # http://127.0.0.1:3030 (use PREVIEW_PORT=... if 3030 is busy)
make preview-stop
```

## Phase 1: new hostname behind Cloudflare Access (owner QA)

1. **Protect first.** In Cloudflare Zero Trust, create a self-hosted Access application for
   `cvforge.anvilary.tools` with an Allow policy for the owner's identity only. Do this
   before any DNS or ingress change so the hostname is never reachable unprotected.
2. **Build the image from the approved commit** in a separate checkout (do not touch
   `/opt/src/CVForge`, which the current container's compose file builds from):

   ```bash
   git clone git@github.com:alteixeira20/CVForge.git /opt/stacks/cvforge-rc/src   # first time
   cd /opt/stacks/cvforge-rc/src && git fetch && git checkout --detach <approved-sha>
   RELEASE="$(git rev-parse --short=12 HEAD)"
   docker build \
     --build-arg NEXT_PUBLIC_SITE_URL=https://cvforge.anvilary.tools \
     --build-arg RELEASE_ID="${RELEASE}" \
     --tag "cvforge:${RELEASE}" .
   ```

3. **Start the container** on `edge` (no host port):

   ```bash
   cd /opt/stacks/cvforge-rc/src/deploy/self-hosted
   CVFORGE_RELEASE="${RELEASE}" docker compose up -d
   docker inspect --format '{{.State.Health.Status}}' cvforge-rc    # expect: healthy
   ```

4. **Nginx vhost:** copy `nginx/cvforge-anvilary.conf` to
   `/opt/data/proxy/nginx/conf.d/`, then `docker exec nginx nginx -t` and
   `docker exec nginx nginx -s reload`. The existing `cvforge.conf` stays unchanged.
5. **Tunnel ingress:** back up `/opt/data/proxy/cloudflared/config.yml`, add the entry from
   `cloudflared-ingress-snippet.yml` before the final `http_status:404` rule, and restart
   the `cloudflared` container from `/opt/stacks/cloudflared`.
6. **DNS:** route the hostname to the existing tunnel (same account as
   `roadforge.anvilary.tools`): `cloudflared tunnel route dns <tunnel-name-or-id>
   cvforge.anvilary.tools`, or create the proxied CNAME to `<tunnel-id>.cfargotunnel.com`
   in the dashboard.
7. **Verify from the host** (bypasses Access through the shared Nginx):

   ```bash
   docker exec nginx sh -c 'for p in /health /builder /analyzer /robots.txt /sitemap.xml \
     /site.webmanifest /opengraph-image /fonts/lexend-latin.woff2; do \
     wget -q -S -O /dev/null --header "Host: cvforge.anvilary.tools" "http://127.0.0.1$p" 2>&1 \
     | grep -m1 "HTTP/" | sed "s|^|$p |"; done'
   docker exec nginx wget -q -S -O /dev/null --header 'Host: cvforge.anvilary.tools' \
     http://127.0.0.1/builder 2>&1 | grep -iE 'content-security-policy|x-frame-options|referrer-policy|permissions-policy|x-content-type-options'
   docker exec nginx wget -q -S -O /dev/null --max-redirect=0 --header 'Host: cvforge.anvilary.tools' \
     http://127.0.0.1/parser 2>&1 | grep -iE 'HTTP/|location'
   ```

   Then sign in through Access in a browser and complete the manual QA checklist
   (`docs/current-qa-plan.md` and the remediation evidence).

## Phase 2: public launch (owner approval required)

1. Remove the Access application (or change its policy to bypass for everyone).
2. Switch the previous hostname to the new release **without redirecting**: back up
   `conf.d/cvforge.conf`, replace it with `nginx/cvforge-legacy.conf`, test, and reload.
   Visitors at `cvforge.alexandreteixeira.dev` then see "CVForge has moved to
   cvforge.anvilary.tools" with Download JSON backup; their saved CV stays in that origin's
   browser storage. Canonical metadata already points to the new origin.
3. Keep the old `cvforge` container stopped but not removed until the rollback window
   ends: `docker stop cvforge`.

## Phase 3: retire the previous hostname (later decision)

Only after a migration period the owner chooses (for example 90 days, with the notice
visible throughout): replace `cvforge-legacy.conf` with a 301 redirect to the new origin,
or remove the hostname. A redirect makes any CV still stored only at the old origin
unreachable to its owner, so announce the date in the notice first.

## Rollback

- Phase 1: `docker compose down` in the release directory, remove
  `conf.d/cvforge-anvilary.conf`, reload Nginx, remove the ingress entry and restart
  `cloudflared`. The previous hostname is unaffected throughout.
- Phase 2: restore the backed-up `conf.d/cvforge.conf`, `docker start cvforge`, test and
  reload Nginx. The previous image stays on the host (`docker image ls cvforge-cvforge`).
- To roll back a release candidate, start the previous tag:
  `CVFORGE_RELEASE=<previous-tag> docker compose up -d`.
