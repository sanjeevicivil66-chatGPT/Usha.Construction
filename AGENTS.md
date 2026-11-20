# AGENTS.md — USHA CONSTRUCTION & ARCHITECT

**Status:** Authoritative repository contract  
**Last reviewed:** 2026-11-20

## Mission and source of truth

Maintain the public USHA Construction & Architect website and build a secure, owner-only admin platform without interrupting the public site. Keep AGENTS.md, index.yaml, README.md, docs/PROJECT_WORKFLOW.md, docs/DEPLOYMENT.md, docs/ADMIN_ARCHITECTURE.md, docs/INSTRUCTION_CHANGELOG.md and docs/skills/README.md synchronized in substantive PRs.

## Current architecture

- Public website: root index.html, CSS and vanilla JavaScript, deployed as a Render Static Site.
- API: apps/api, Node.js 22+, TypeScript, Fastify and SQLite.
- Planned admin UI: apps/admin, component-based TypeScript.
- Planned shared contracts: packages/contracts, versioned JSON Schemas.
- Planned editorial content: Markdown under content/blog and content/news.
- Runtime data: data/, never committed or served publicly.

Do not replace the public site or claim the API is deployed. The existing Render Static Site cannot run the API. A separate backend service and durable disk require explicit owner approval before provisioning or incurring charges.

## Brand and factual controls

Preserve exact brand spelling: USHA CONSTRUCTION & ARCHITECT. Do not invent customer reviews, completed projects, awards, certifications or guarantees. Rates, inclusions, contact details and claims require owner confirmation before publication. Illustrative imagery must not be represented as completed USHA projects. The public enquiry form hands off to WhatsApp and does not persist leads.

## Issue-first delivery

1. Inspect issue, latest main, source, PRs, CI and Render state.
2. Reuse an existing issue or create one before substantive edits.
3. Branch from latest main using feature/issue-N-slug, fix/issue-N-slug or docs/issue-N-slug.
4. Use Conventional Commits with issue references; never commit feature work directly to main.
5. Run relevant tests, type checks, builds and public website validation.
6. For UI work, use an available connected interactive browser for real desktop/mobile interaction checks. Do not use Playwright for this project. If browser access is unavailable, keep PR draft/unverified and report the blocker.
7. Review the complete diff and synchronize docs/inventory.
8. Open a PR linked to the issue. Draft is required when acceptance or browser checks are incomplete.
9. Merge only after required checks, browser verification and explicit owner approval.
10. Verify deployment and public URL separately.

## Security requirements

- Never commit credentials, tokens, SMTP secrets, customer data or runtime database files.
- No public registration or customer login in this phase.
- Admin authentication must use strong password hashing, hashed session identifiers, secure HttpOnly/SameSite cookies, CSRF protection, rate limits, strict origin allowlists and owner-only provisioning.
- Validate API input against explicit schemas and use parameterized SQL.
- Use transactions for financial updates and integer minor units for money.
- SMTP secrets must be write-only/masked, encrypted server-side with managed key material, and never logged or returned to clients.
- Audit sensitive changes without recording secrets or unnecessary personal data.
- Backups must be encrypted, access-controlled and restore-tested.
- Health endpoints must not expose environment values, filesystem paths or personal data.

## Definition of done

A phase is complete only when implemented, tested, diff-reviewed, documented and committed to the correct branch. Production readiness additionally requires browser verification, explicit owner approval, approved hosting, successful deployment and live smoke tests. Never share an admin login URL until all requested admin features are complete and verified.
