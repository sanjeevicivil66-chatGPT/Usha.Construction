# USHA CONSTRUCTION & ARCHITECT

Responsive public website and owner-only admin platform for USHA CONSTRUCTION & ARCHITECT, Chithod, Erode, Tamil Nadu.

## Public website

The existing public site remains at the repository root in index.html and is deployed as a Render Static Site. Its enquiry flow prepares a WhatsApp message; it does not store leads server-side.

## Admin platform

- apps/api: TypeScript/Fastify API, SQLite persistence, versioned migrations and owner-auth endpoints.
- packages/contracts: shared Zod schemas, inferred TypeScript types and generated JSON Schema/OpenAPI.
- apps/admin: planned component-based admin frontend; not yet implemented.
- content/blog and content/news: planned Markdown publishing content.
- docs/ADMIN_ARCHITECTURE.md: phased admin delivery plan.
- docs/api/README.md: API conventions and error/contract rules.

Owner authentication API is implemented in source but is not deployed. No admin login page or admin URL is available yet. The existing Render Static Site cannot run the API. A separate backend service and durable database require explicit approval before provisioning or incurring charges.

## One-time owner provisioning (only on an approved backend database)

Set USHA_BOOTSTRAP_EMAIL and USHA_BOOTSTRAP_PASSPHRASE privately in the process environment, then run npm run provision:owner. The passphrase must be 14–200 characters. The command refuses to create a second owner. Remove the bootstrap passphrase from the environment immediately after successful provisioning. Never put credentials in Git, shell history, chat, or browser storage.

## Local API development

Requires Node.js 22+.

1. npm install
2. Copy apps/api/.env.example to an untracked environment file.
3. npm run dev:api
4. npm test
5. npm run typecheck
6. npm run build:api

Read AGENTS.md, docs/PROJECT_WORKFLOW.md, docs/DEPLOYMENT.md, docs/ADMIN_ARCHITECTURE.md and docs/api/README.md before changes. Never commit credentials, SMTP secrets, tokens, customer data or runtime databases.
