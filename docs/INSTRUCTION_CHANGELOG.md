# Instruction and workflow changelog

## 2026-11-20 — Admin platform Phase 1 foundation

- Added a Node.js 22 TypeScript workspace and Fastify API package while retaining the existing public static website.
- Added validated runtime configuration, SQLite WAL/foreign-key setup and an initial relational schema for admin identity/session, CRM, projects, follow-ups, quotations, invoices, payments, email outbox, SMTP configuration, content metadata and audit events.
- Added security middleware defaults, origin allowlisting, request size limits, rate limiting and minimal health endpoints.
- Documented the phased admin delivery plan and separately approved backend hosting and durable storage.
- This phase does not implement admin login, CRM screens, email sending or production deployment.

## 2026-11-20 — Issue-first Git workflow and browser-verification gate

- Required issue-first branches, linked PRs/commits, owner-approved releases and responsive browser evidence.
- The owner has instructed not to use Playwright; project browser verification now requires a connected interactive browser. If unavailable, keep work draft/unverified.
- Rationale: ensure changes are traceable and never claim visual acceptance without real interactive inspection.
