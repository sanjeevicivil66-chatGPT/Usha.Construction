# USHA admin platform architecture

## Delivery phases

1. Backend runtime and initial SQLite foundation (merged PR #13).
2. Modular TypeScript API, shared Zod contracts and generated OpenAPI (PR #33; CI passed, pending owner merge).
3. Ordered, checksum-verified SQLite migrations and normalized transactional records (this issue/PR).
4. Owner-only authentication, secure sessions and first-admin provisioning (issue #18).
5. Consented public enquiry capture and WhatsApp handoff (issue #19).
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

SQLite is the transactional store. Migration versions 1 and 2 are ordered, forward-only and SHA-256 checksummed. Existing version-1 databases are upgraded in place, preserving their rows; the legacy baseline is recognized and validated before version 2 applies. Future migrations must be appended, never edited after release. Checksum drift and databases newer than the application fail closed. Audit events, quote versions and invoice item snapshots are append-only/immutable.

CRM, quotations, invoices, payments, follow-ups, sessions and audit events are relationally linked. Flexible domain payloads remain JSON-shaped with SQLite JSON validity checks. Normalized customer email/phone fields support search but are not unique because multiple customers may legitimately share contact details. Money remains integer minor units. Production DB must live on approved durable persistent storage.

## Security boundaries

Public visitors do not need accounts. Admin routes are not exposed until authentication and authorization are implemented. Production requires HTTPS, secure HttpOnly SameSite cookies, CSRF tokens, password hashing, rate limits, strict origin allowlists and owner-only provisioning. SMTP secrets must never be committed, returned to clients or logged. Secret encryption, key management, backup and restore are later required phases, not implemented in this foundation.

## API conventions

Business routes use /api/v1. Shared contracts are defined in packages/contracts with Zod and converted to JSON Schema for Fastify/OpenAPI. The OpenAPI document is served at GET /api/v1/openapi.json. Errors use { error: { code, message, requestId } }. Pagination is bounded (default 25, maximum 100); use UTC timestamps, idempotency keys and optimistic concurrency as domain modules are implemented.

## Local development

Requires Node.js 22+. Run npm install, then npm run dev:api, npm test, npm run typecheck and npm run build:api. The development database defaults to data/usha-dev.sqlite. Production startup requires an explicit DATABASE_PATH on durable storage.
