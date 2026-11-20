# AGENTS.md — USHA CONSTRUCTION & ARCHITECT

## Purpose
Maintain the public-facing static website for USHA CONSTRUCTION & ARCHITECT, Chithod, Erode, Tamil Nadu.

## Stack and structure
- Static HTML5, CSS3 and vanilla JavaScript; no build step or package manager.
- `index.html` is the responsive landing page and WhatsApp enquiry funnel.
- `assets/usha-logo.svg` is the scalable brand mark.
- `index.yaml` is the machine-readable project and content inventory.

## Engineering rules
- Keep the site responsive, accessible, semantic and fast.
- Preserve the exact brand name: USHA CONSTRUCTION & ARCHITECT.
- Do not invent testimonials, awards, certifications, completed projects or guarantees.
- Gallery images are illustrative references, not verified company projects.
- The enquiry form opens a pre-filled WhatsApp message; it does not store leads on a server.
- Rates and contact information are historical details and require owner verification before public launch.
- Never commit credentials, tokens or personal data.

## Git workflow
- Never commit feature work directly to `main`.
- Use focused branches: `feature/<short-description>` or `fix/<short-description>`.
- Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`.
- Open pull requests to `main`; describe scope and checks.
- Review responsive layout, internal links, form validation and WhatsApp URL construction.
- Merge only after checks pass and the owner approves.

## Render deployment
- Render service type: Static Site.
- Build command: leave empty.
- Publish directory: `.` (repository root).
- Deploy production from `main` after successful PR merge and Render configuration.
- Never claim a site is live until its public URL has been opened and verified.
