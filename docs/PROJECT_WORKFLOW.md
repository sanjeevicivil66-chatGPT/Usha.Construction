# Project workflow and repository operations

Read AGENTS.md before work. Follow the issue-first process and do not use Playwright; use a connected interactive browser for UI verification.

1. Inspect issue, latest main, source, open PRs, CI and Render state.
2. Create or reuse the issue before edits.
3. Create an issue-number branch from latest main.
4. Implement one dependency-ordered phase with Conventional Commits.
5. Run API tests, type checks, builds and public website validation.
6. For UI work, use a connected interactive browser at 360, 390, 430, 768 and 1280 CSS-pixel widths. If unavailable, document the blocker and keep the PR draft/unverified.
7. Review the full diff and synchronize README, inventory, architecture, deployment and changelog.
8. Open a draft PR for incomplete phases; request review only when checks and required verification are complete.
9. Merge only after checks, browser verification and explicit owner approval.
10. Verify the relevant Render service and public URL after approved deployment.

## Validation

Run npm install, npm test, npm run typecheck, npm run build:api and python scripts/validate_site.py.

## PR checklist

- [ ] Issue existed before implementation and is linked.
- [ ] Scope is phase-specific and documented.
- [ ] API tests, typecheck, build and website validator pass.
- [ ] No secrets or customer data are committed.
- [ ] UI has been manually verified in an interactive browser, or PR is explicitly draft/unverified.
- [ ] Documentation and inventory are synchronized.
- [ ] No unapproved hosting resources or charges.
- [ ] Owner approval is required before merge.
