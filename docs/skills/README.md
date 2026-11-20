# Project skills and reusable playbooks

Follow AGENTS.md and docs/PROJECT_WORKFLOW.md.

## Repository audit
Inspect issues, branches, PRs, current main, CI, Render and the source-of-truth inventory. Compare documented and actual files; report mismatches before expanding scope.

## API and data implementation
1. Keep API code in apps/api and shared schemas/contracts in packages/contracts.
2. Validate environment configuration at startup.
3. Use versioned SQLite migrations, foreign keys, WAL mode and transactions.
4. Store financial amounts as integer minor units.
5. Validate incoming JSON against explicit schemas.
6. Add tests for validation, authorization, persistence, migrations and failure cases.
7. Keep runtime databases, backups and secrets out of Git.

## Admin authentication and security
Use owner-only provisioning, strong password hashing, hashed session identifiers, secure cookies, CSRF checks, rate limits and audit events. Never expose SMTP credentials or session secrets. Test unauthorized access and session expiry.

## CRM and financial workflows
Persist leads, customers, projects, follow-ups, quotations, invoices and payments in relational tables. Use transactions for multi-record financial updates. Reconcile analytics to persisted source records.

## Email and Markdown publishing
Use a mock email transport for automated tests. SMTP settings must be write-only/masked and secrets encrypted server-side. Store editorial content as Markdown with validated frontmatter and safe rendering; never render raw untrusted HTML.

## Browser and accessibility verification
Do not use Playwright. Use an available connected interactive browser to test real rendered pages at mobile, tablet and desktop widths, including keyboard/focus, forms, navigation and errors. If no browser connection is available, record the blocker and leave the PR draft/unverified.

## Release and hosting
The public static website and admin API are separate deployment targets. Do not provision a backend service or persistent disk until the owner approves potential hosting costs. Verify migrations, backups, restore, deployment and live health before release.
