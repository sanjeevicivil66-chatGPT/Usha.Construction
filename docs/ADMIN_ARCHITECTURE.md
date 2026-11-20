# USHA admin platform architecture

## Delivery phases

1. Backend runtime, validated configuration, SQLite migrations and health checks (this PR).
2. Owner-only authentication, secure sessions, CSRF protection, first-admin provisioning and audit events.
3. Lead/customer/project CRM, stages, follow-ups and activity history.
4. Quotations, editable line items, INR-safe totals, PDF output and status transitions.
5. Invoices, payment records, reconciliation and ageing analytics.
6. Email templates, mock transport, delivery outbox, write-only SMTP settings and server-side secret encryption.
7. Markdown blog/news authoring with safe rendering and draft/publish lifecycle.
8. Component-based responsive admin frontend and end-to-end workflows.
9. Durable hosting, backup/restore, production verification and owner handover.

## Runtime layout

- Root index.html remains the public website entry point.
- apps/api contains the TypeScript Fastify API and SQLite persistence.
- apps/admin will contain the component-based TypeScript admin UI in a later phase.
- packages/contracts will hold versioned JSON Schemas and shared domain contracts.
- content/blog and content/news will contain Markdown articles with frontmatter.
- data is runtime-only and excluded from Git.

## Persistence and integrity

SQLite is the transactional store. CRM, quotations, invoices, payments, follow-ups, sessions and audit events are relationally linked. Domain payloads are JSON-shaped and SQLite checks JSON validity. Money is stored as integer minor units. The database must live on durable persistent storage in production.

The current Render service is a Static Site and cannot run this API. A separate backend service and durable disk require explicit owner approval before provisioning; this PR creates no Render resources and incurs no hosting charges.

## Security boundaries

Public visitors do not need accounts. Admin routes are not exposed until authentication and authorization are implemented. Production requires HTTPS, secure HttpOnly SameSite cookies, CSRF tokens, password hashing, rate limits, strict origin allowlists and owner-only provisioning. SMTP secrets must never be committed, returned to clients or logged. Secret encryption, key management, backup and restore are later required phases, not implemented in this foundation.

## Local development

Requires Node.js 22+. Run npm install, then npm run dev:api, npm test, npm run typecheck and npm run build:api. The development database defaults to data/usha-dev.sqlite. Production startup requires an explicit DATABASE_PATH on durable storage.
