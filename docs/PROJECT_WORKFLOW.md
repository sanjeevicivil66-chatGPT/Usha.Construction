# Project workflow and repository operations

This document expands [AGENTS.md](../AGENTS.md). Issue-first delivery is mandatory for every substantive task.

## Required Git-driven lifecycle

| Order | Action | Required evidence |
|---|---|---|
| 1 | Inspect repository, issues, PRs, branches, main, CI and Render | Current state recorded |
| 2 | Find existing issue; otherwise create issue before code edits | Issue URL, problem, expected result, acceptance criteria and test plan |
| 3 | Create focused issue-number branch from latest main | Branch name and base SHA |
| 4 | Implement narrowly and commit conventionally | Reviewable diff and commit SHA |
| 5 | Run static checks and CI | Actual passing result for latest SHA |
| 6 | Run Playwright browser tests for UI changes | Viewport matrix, screenshots, browser console/network results |
| 7 | Inspect screenshots and diff | Visual approval; issues filed for any defects |
| 8 | Open PR referencing issue | PR body with Closes/Refs, test evidence and risks |
| 9 | Request review after checks and visuals pass | Reviewer request |
| 10 | Owner approves and PR merges | Merge commit on main |
| 11 | Verify Render deployment and production browser smoke test | Deploy ID/status and public URL test |

## Issue writing standard

Create the GitHub issue before implementation. Include:
- Reproduction steps and supplied evidence.
- Actual versus expected behavior.
- Acceptance criteria with measurable conditions.
- Files/components likely affected (as hypotheses, not facts).
- Risks, non-goals and a verification matrix.
- Dependencies or owner questions.

Search existing open/closed issues first. Link duplicates rather than silently creating duplicate work items.

## Branch and commit conventions

- Production: `main`.
- Issue-linked bug fix: `fix/issue-<number>-<slug>`.
- Issue-linked feature: `feature/issue-<number>-<slug>`.
- Issue-linked docs/maintenance: `docs/issue-<number>-<slug>` or `chore/issue-<number>-<slug>`.
- Use conventional commits, e.g. `fix: crop complete USHA mark (#123)`.
- Do not commit feature work directly to main, rewrite shared history, or force-push without explicit owner approval.

## Required local validation

```bash
python scripts/validate_site.py
node scripts/browser-smoke.mjs
```

The browser script runs headless Chromium through Playwright, serves the static site locally and checks responsive layout, key interactions, console/network errors and screenshot artifacts. CI installs Playwright and Chromium from its pinned workflow environment.

## Browser test matrix

For all UI changes, test CSS viewport widths 360, 390, 430, 768 and 1280. Capture and inspect:
- Header logo (entire mark and brand line, no tagline, no clipping/background block).
- Hero and navigation (menu open/close, links, no horizontal overflow).
- Contact card and enquiry wizard (radio choice, Continue, Back, required fields, WhatsApp URL generated but not sent).
- Footer branding and fixed mobile action bar.
- FAQ interaction and reduced-motion behavior.
- Console errors, failed requests, image loads and document scroll width.

A screenshot being generated is not a pass. Inspect image contents and verify the acceptance criteria at all breakpoints. If no browser is available or a defect is found, keep the issue open, add evidence/comment and report the blocker in chat. Do not request final review or merge.

## PR checklist

- [ ] Issue created before implementation and linked with `Closes #N` / `Refs #N`.
- [ ] Scope is limited to the issue acceptance criteria.
- [ ] Static validator output is recorded.
- [ ] Latest CI run is green for exact head SHA.
- [ ] Playwright browser suite passed for UI work.
- [ ] Screenshots are attached/referenced and visually inspected.
- [ ] Mobile/tablet/desktop, keyboard, reduced-motion and enquiry paths reviewed.
- [ ] Console and failed network requests reviewed.
- [ ] No secrets, private customer data or unsupported claims.
- [ ] Documentation and inventory synchronized.
- [ ] Known defects have issues and are disclosed.
- [ ] Owner approval required for production merge is explicit.

## Review, merge and deployment

- Open PR only after the issue scope is implemented and required checks/visual review pass. Draft PRs may be used for unverified WIP but must state blockers and must not be sent for final review.
- Include the issue reference, exact commit, actual check results, browser/viewport matrix, screenshot artifacts, known limitations and rollback plan.
- Request collaborators/reviewers only after blockers are resolved.
- Merge only after required CI and review gates pass and the owner explicitly approves.
- After merge, confirm main SHA and Render deploy status, then run a live browser smoke test of the public URL.
- If branch protection is absent, state that CI is not enforced as a merge gate.

## Repository structure policy

- `assets/`: approved brand and media.
- `.github/workflows/`: CI and automation.
- `.github/instructions/`: scoped contributor/agent rules.
- `docs/`: architecture, workflow, deployment, changelog and playbooks.
- `scripts/`: dependency-light validation and browser smoke harness.
- Document important files and folders in `index.yaml`.
