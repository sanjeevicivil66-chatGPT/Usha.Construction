# Instruction and workflow changelog

## 2026-11-21 — Issue #19 consented public enquiry capture

- Added a public enquiry endpoint with shared Zod contract, mobile validation, explicit consent, honeypot and per-IP throttling.
- Persisted customer, lead, activity event and idempotency receipt in one SQLite transaction.
- Added safe retry replay and conflict detection when a request key is reused with different content.
- Added synthetic tests for persistence, retry, consent, invalid mobile and honeypot behavior.
- The existing website remains WhatsApp-only until the API is hosted and the frontend can be verified.

## 2026-11-21 — Issue #18 owner authentication

- Added Argon2id owner provisioning CLI; no default credentials or public signup.
- Added hashed opaque sessions, HttpOnly/SameSite cookies, readable CSRF cookie plus synchronizer-token hash, exact-origin checks, login rate limiting, absolute and idle expiry, logout and password change.
- Added auth audit events and tests for anonymous access, origin validation, login, session use, CSRF logout and revocation.
- Owner provisioning requires private bootstrap email/passphrase environment values and must run only once against an approved durable database.
- No admin frontend, public login URL or production API deployment is included.

## 2026-11-21 — Issue #17 versioned SQLite migrations

- Replaced the single startup SQL string with ordered, SHA-256-checksummed forward migrations.
- Added safe recognition and upgrade of the previously deployed schema version 1 without dropping existing records.
- Added normalized customer search fields, optimistic version columns, activity events, idempotency keys, immutable quote/invoice snapshots, outbox attempts and append-only audit constraints.
- Added a session idle-expiry field as migration version 3.
- Added migration replay, checksum drift, legacy-upgrade and append-only tests.
- No destructive rollback is automated; backup and restore remain explicit operational procedures.

## 2026-11-21 — Issue #16 modular API and shared contracts

- Added a shared contracts workspace with Zod runtime schemas and inferred TypeScript types.
- Derived Fastify JSON Schema/OpenAPI from the same shared contracts.
- Extracted versioned health routes, retained legacy health behavior, added request correlation IDs and a stable error envelope.
- Added generated OpenAPI endpoint and tests for health, request IDs, error shape and route documentation.
- Updated architecture, API conventions, repository instructions and inventory.
