# Instruction and workflow changelog

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
