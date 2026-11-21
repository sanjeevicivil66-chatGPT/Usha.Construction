# USHA admin platform architecture

## Delivery phases

1. Backend runtime and initial SQLite foundation (merged PR #13).
2. Modular TypeScript API, shared Zod contracts and generated OpenAPI (PR #33; automated checks passed, owner review pending).
3. Ordered, checksum-verified SQLite migrations and normalized transactional records (PR #35; automated checks passed, owner review pending).
4. Owner-only authentication, secure sessions and first-admin provisioning (PR #36; automated checks pending).
5. Consented public enquiry capture and WhatsApp handoff (this PR; API implemented, website integration waits for approved backend hosting).
6. Lead/customer/project CRM, stages, follow-ups and activity history (issues #20–22).
7. Construction BOQ, editable quotation snapshots and PDF output (issue #23).
8. Invoices, payment records, reconciliation and ageing analytics (issue #24).
9. Email templates, mock transport, delivery outbox and write-only SMTP settings (issue #25).
10. Markdown blog/news authoring with safe rendering and draft/publish lifecycle.
11. Component-based responsive admin frontend and end-to-end workflows (issue #26).
12. Analytics, audit explorer, durable hosting, backup/restore and owner handover (issue #27 and #15).

## Runtime layout

- Root index.html remains the public website entry point.
- apps/api contains the TypeScript Fastify API and persistence.
- packages/contracts contains shared Zod schemas, inferred TS types and JSON Schema generation.
- apps/admin will contain the component-based TypeScript admin UI in a later phase.
- content/blog and content/news will contain Markdown articles with frontmatter.
- data is runtime-only and excluded from Git.

## Persistence and integrity

SQLite migrations are ordered and SHA-256 checksummed. Existing v1 databases upgrade in place; migration v3 adds session idle-expiry metadata. Audit events, quote versions and invoice item snapshots are append-only/immutable. CRM contact matching uses non-unique normalized email/phone fields. Money is stored as integer minor units.

Public enquiry submission writes a customer, lead, activity event and idempotency receipt atomically. A retry with the same key and payload replays the same receipt; reusing a key with different content returns conflict. Honeypot submissions are acknowledged without persistence. The endpoint is source-only until an approved API deployment and public-site integration.

The current Render service is a Static Site and cannot run this API. A separate backend service and durable disk require explicit owner approval before provisioning; no backend resources have been created.

## Security boundaries

The API includes owner-only login/logout/me/password-change endpoints and a one-time owner provisioning CLI. Passwords use Argon2id. Session identifiers and CSRF tokens are random and stored only as SHA-256 hashes; session cookies are HttpOnly, Secure in production, and SameSite=Strict. Mutating auth endpoints require exact Origin and CSRF cookie/header/hash agreement. Sessions expire after 8 hours absolute and 30 minutes idle. Login is rate-limited and auth changes are audited.

No public registration or customer accounts exist. The admin UI is not implemented, and auth endpoints are not deployed. SMTP secrets, backup encryption, key management and restore automation remain future work. Never share a login URL until the full requested admin product is complete and deployed on approved infrastructure.

## API conventions

Business routes use /api/v1. Shared contracts are defined in packages/contracts with Zod and converted to JSON Schema for Fastify/OpenAPI. The OpenAPI document is served at GET /api/v1/openapi.json. Errors use { error: { code, message, requestId } }. Pagination is bounded (default 25, maximum 100); use UTC timestamps, idempotency keys and optimistic concurrency as domain modules are implemented.

## Local development

Requires Node.js 22+. Run npm install, then npm run dev:api, npm test, npm run typecheck and npm run build:api. One-time owner provisioning uses private bootstrap email and passphrase environment values with npm run provision:owner; never commit credentials. Production startup requires DATABASE_PATH on approved durable storage.
