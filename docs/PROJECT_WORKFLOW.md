# Project workflow and repository operations

Issue-first delivery is mandatory. Read AGENTS.md before work.

1. Inspect the issue, latest main, source files, open PRs, CI and Render state.
2. Create or reuse the issue before edits.
3. Create an issue-number branch from latest main.
4. Implement a narrow phase with Conventional Commits.
5. Run API tests, type checks, builds and public website validation.
6. For UI work, use an available connected interactive browser at 360, 390, 430, 768 and 1280 CSS-pixel widths. Do not use Playwright for this project.
7. If browser access is unavailable, document the blocker and keep the PR draft/unverified; do not claim browser-tested or production-ready.
8. Review the full diff and synchronize README, inventory, architecture, deployment and changelog.
9. Open a draft PR for incomplete phases; request review only when checks and required verification are complete.
10. Merge only after checks, browser verification and explicit owner approval.
11. Verify the relevant Render service and public URL after approved deployment.

## Validation

Run npm install, npm test, npm run typecheck, npm run build:api and python scripts/validate_site.py.

## PR checklist

- [ ] Issue existed before implementation and is linked.
- [ ] Scope is phase-specific and documented.
- [ ] API tests, typecheck, build and website validator pass.
- [ ] No secrets or customer data are committed.
- [ ] UI has been manually verified in an interactive browser, or PR is explicitly draft/unverified.
- [ ] Documentation and inventory are synchronized.
- [ ] Owner approval is required before production merge.
