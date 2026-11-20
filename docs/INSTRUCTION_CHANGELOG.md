# Instruction and workflow changelog

## 2026-11-20 — Refine mobile logo and footer branding

- Cropped the supplied logo artwork to retain the USHA mark and Construction & Architects line while removing the small tagline beneath it.
- Reduced the header logo width on mobile and applied a multiply blend treatment so its white image background blends into the light header.
- Replaced the footer logo image with a text-only company wordmark.
- Rationale: improve mobile header proportions, remove unwanted tagline content and simplify the footer brand treatment.

## 2026-11-20 — Upgrade the public website experience

- Replaced the temporary logo artwork with the logo image supplied by the owner, wrapped in SVG for consistent sizing.
- Reworked the homepage into a responsive, motion-enhanced architecture/construction experience with service discovery, project process, indicative package cards, material options, inspiration gallery and FAQs.
- Replaced the long single-screen enquiry form with a two-step project brief and WhatsApp handoff; clarified that submissions are not stored by a website backend.
- Added reduced-motion support, mobile navigation, responsive contact actions and accessible interaction states.
- Updated validation and project inventory to match the new website structure.
- Rationale: improve brand accuracy, visitor clarity and enquiry completion while preserving the dependency-free static deployment model.


Record durable changes to repository rules, agent instructions, automation, skills/playbooks, and release procedures. Newest entries go first. Keep entries factual and link the PR or commit when available.

## 2026-11-20 — Clarify existing Render-GitHub connector status

- Recorded the owner's confirmation that Render is already wired to the GitHub Render connector.
- Corrected the deployment runbook so it does not ask the owner to reconnect GitHub by default.
- Distinguished the existing connector wiring from the separate unresolved error returned when Render tried to create a Static Site from the private repository.
- Recorded that the service was not created and that repository visibility/fetchability in the service-creation flow still needs diagnosis.
- Rationale: preserve accurate operational state and avoid repeating a completed integration step.

## 2026-11-20 — Establish repository maintenance contract

- Expanded `AGENTS.md` into the authoritative contract for implementation, review, quality gates, security, documentation synchronization, Git operations, hosting and completion reporting.
- Added an end-to-end workflow, PR checklist, deployment runbook, task playbooks and scoped website instructions.
- Required every durable instruction improvement to update this changelog and all affected project documentation in the same PR.
- Documented the Render integration blocker accurately: service creation was attempted but repository access was rejected; no Render service or live deployment is confirmed.
- Rationale: make repository maintenance repeatable, auditable and safe as the website evolves.
