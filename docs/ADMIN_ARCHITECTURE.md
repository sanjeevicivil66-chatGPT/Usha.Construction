# USHA admin platform architecture

## Delivery phases

1. Backend runtime and initial SQLite foundation (merged PR #13).
2. Modular TypeScript API, shared Zod contracts and generated OpenAPI (issue #16).
3. Ordered, checksum-verified SQLite migrations and normalized transactional records (issue #17).
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

SQLite is the transactional store. CRM, quotations, invoices, payments, follow-ups, sessions and audit events are relationally linked. Domain payloads are JSON-shaped and SQLite checks JSON validity. Money is stored as integer minor units. Ordered migrations, checksums, optimistic concurrency and normalized searchable columns are tracked in issue #17 and are not yet implemented.

The current Render service is a Static Site and cannot run this API. A separate backend service and durable disk require explicit owner approval before provisioning; no backend resources have been created.

## Security boundaries

Public visitors do not need accounts. Admin routes are not exposed until authentication and authorization are implemented. Production requires HTTPS, secure HttpOnly SameSite cookies, CSRF tokens, password hashing, rate limits, strict origin allowlists and owner-only provisioning. SMTP secrets must never be committed, returned to clients or logged. Secret encryption, key management, backup and restore are later required phases, not implemented in this foundation.

## API conventions

Business routes use /api/v1. Shared contracts are defined in packages/contracts with Zod and are converted to JSON Schema for Fastify/OpenAPI. The OpenAPI document is served at GET /api/v1/openapi.json. Errors use { error: { code, message, requestId } }. Pagination is bounded (default 25, maximum 100); use UTC timestamps, idempotency keys and optimistic concurrency as domain modules are implemented.

## Local development

Requires Node.js 22+. Run npm install, then npm run dev:api, npm test, npm run typecheck and npm run build:api. The development database defaults to data/usha-dev.sqlite. Production startup requires an explicit DATABASE_PATH on durable storage.
