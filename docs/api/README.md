# API conventions

- All business endpoints are versioned under /api/v1.
- Route modules live under apps/api/src/modules/<domain>/routes.ts; domain services and repositories are added with their feature issues.
- Shared request/response validation contracts live in packages/contracts and are consumed by API and future admin UI.
- OpenAPI is generated from the same Fastify route schemas and served at GET /api/v1/openapi.json.
- Errors use { error: { code, message, requestId } }; do not return stack traces or internal details.
- Pagination uses bounded limit/offset contracts (default 25, maximum 100).
- Use UTC ISO-8601 timestamps and integer INR paise for monetary amounts.
- Use idempotency keys for retryable create operations and optimistic version checks for updates as each domain endpoint is implemented.
- Public enquiry capture uses POST /api/v1/public/enquiries, explicit consent, honeypot and IP rate limits, a required Idempotency-Key header, and a generic receipt rather than exposing internal CRM identifiers.
- The public enquiry API is not deployed or connected to the website yet; the existing site continues its WhatsApp handoff until approved backend hosting and browser verification are complete.
- Authentication and owner authorization must be enforced before exposing any admin route.
