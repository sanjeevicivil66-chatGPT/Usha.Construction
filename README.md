# USHA CONSTRUCTION & ARCHITECT

Responsive public website and owner-only admin platform for USHA CONSTRUCTION & ARCHITECT, Chithod, Erode, Tamil Nadu.

## Public website

The existing public site remains at the repository root in index.html and is deployed as a Render Static Site. Its enquiry flow prepares a WhatsApp message; it does not store leads server-side.

## Admin platform

- apps/api: TypeScript/Fastify API and SQLite persistence foundation (Phase 1).
- apps/admin: planned component-based admin frontend; not yet implemented.
- packages/contracts: planned shared versioned JSON Schemas.
- content/blog and content/news: planned Markdown publishing content.
- docs/ADMIN_ARCHITECTURE.md: phased implementation and security plan.

The API is not deployed and does not yet expose admin login or CRM workflows. The existing Render Static Site cannot run the API. A separate backend service and durable database require explicit approval before provisioning or incurring charges.

## Local API development

Requires Node.js 22+.

1. npm install
2. Copy apps/api/.env.example to an untracked environment file.
3. npm run dev:api
4. npm test
5. npm run typecheck
6. npm run build:api

Read AGENTS.md, docs/PROJECT_WORKFLOW.md, docs/DEPLOYMENT.md and docs/ADMIN_ARCHITECTURE.md before changes. Never commit credentials, SMTP secrets, tokens, customer data or runtime databases. Do not share an admin URL until all requested features are complete and verified.
