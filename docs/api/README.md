# API conventions

- All business endpoints are versioned under /api/v1.
- Route modules live under apps/api/src/modules/<domain>/routes.ts; domain services and repositories are added with their feature issues.
- Shared request/response validation contracts live in packages/contracts and are consumed by API and future admin UI.
- OpenAPI is generated from the same Fastify route schemas and served at GET /api/v1/openapi.json.
- Errors use { error: { code, message, requestId } }; do not return stack traces or internal details.
- Pagination uses bounded limit/offset contracts (default 25, maximum 100).
- Use UTC ISO-8601 timestamps and integer INR paise for monetary amounts.
- Use idempotency keys for retryable create operations and optimistic version checks for updates as each domain endpoint is implemented.
- Authentication and owner authorization must be enforced before exposing any admin route.
