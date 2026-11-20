# Website and platform implementation instructions

- Preserve the existing public website while the admin platform is developed separately.
- Preserve exact brand spelling: USHA CONSTRUCTION & ARCHITECT.
- Do not invent business facts, project photos, reviews, certifications or guarantees.
- The current public enquiry form opens a prefilled WhatsApp message; it does not persist leads.
- Keep API code under apps/api, planned admin UI under apps/admin, shared schemas under packages/contracts and Markdown content under content/.
- Never put secrets, customer records or database files in public assets or Git.
- For UI work, use an available connected interactive browser. The owner has instructed not to use Playwright. If a connected browser is unavailable, record the blocker and leave the PR draft/unverified.
- Update index.yaml and relevant documentation when the runtime, file structure, content schema or deployment changes.
