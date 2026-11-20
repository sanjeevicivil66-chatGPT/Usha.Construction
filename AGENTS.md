# AGENTS.md — USHA CONSTRUCTION & ARCHITECT

**Status:** Authoritative repository contract  
**Applies to:** Every contributor, coding agent, reviewer, and automation working in this repository  
**Last reviewed:** 2026-11-20

## 1. Mission and source of truth

Maintain a reliable, accessible, fast, mobile-first public website for **USHA CONSTRUCTION & ARCHITECT**, Chithod, Erode, Tamil Nadu, India.

This file is the top-level operating contract. Read it before making any change. If a more specific instruction file exists under `.github/instructions/` or a subfolder, follow it in addition to this file. In a conflict, follow the stricter safety rule and document the conflict for the repository owner.

Keep these records aligned whenever the project changes:
- `AGENTS.md`: mandatory engineering, review, security, and release rules.
- `index.yaml`: machine-readable project inventory, structure, runtime, content schema, and hosting configuration.
- `README.md`: concise onboarding and project overview.
- `docs/PROJECT_WORKFLOW.md`: end-to-end contribution and maintenance process.
- `docs/DEPLOYMENT.md`: hosting setup, release behavior, verification, and recovery.
- `docs/INSTRUCTION_CHANGELOG.md`: dated record of instruction and workflow improvements.
- `docs/skills/README.md`: reusable task playbooks and quality procedures.

Never silently change the project contract. When a rule, tool, stack, folder purpose, test, or release process changes, update all affected documentation in the same pull request.

## 2. Project baseline

- Project: static company website.
- Runtime: HTML5, CSS3, vanilla JavaScript.
- Build command: none (empty).
- Publish directory: repository root (`.`).
- Entry point: `index.html`.
- Hosting target: Render Static Site, production branch `main`.
- CI: GitHub Actions, `.github/workflows/ci.yml`.
- Validation command: `python scripts/validate_site.py`.
- Do not add a framework, dependency, build system, server, database, or third-party service unless the owner approves the need and the documentation is updated.

## 3. Non-negotiable content and brand rules

- Preserve the exact brand spelling: **USHA CONSTRUCTION & ARCHITECT**.
- Do not invent customer reviews, project claims, awards, registrations, certifications, guarantees, client logos, or completed-project photographs.
- Label reference/stock imagery as illustrative. Replace it with owner-approved project images before presenting it as company work.
- Treat prices, package inclusions, phone numbers, addresses, social handles, and business claims as owner-controlled facts. Do not publish changed values without owner confirmation.
- The WhatsApp enquiry form currently opens a pre-filled message. It is not a server-side lead database. Never describe it as storing or submitting leads to a backend.
- Keep contact and personal information to the minimum needed for the website. Never commit private customer information.

## 4. Required work sequence

For every non-trivial task:

1. **Understand:** read this file, relevant scoped instructions, README, inventory, and affected source files.
2. **Inspect:** check the current branch, working context, existing implementation, open pull requests, and relevant CI results before editing.
3. **Plan:** state the intended outcome, affected files, risks, and how it will be verified. Split unrelated work into separate changes.
4. **Implement:** make the smallest coherent change. Preserve existing working behavior unless the task explicitly changes it.
5. **Validate:** run the documented checks and add/update tests for new behavior. Do not claim a check passed unless it was actually run and its result inspected.
6. **Document:** update README, index.yaml, relevant docs, scoped instructions, and instruction changelog whenever their facts or rules change.
7. **Review:** inspect the complete diff for correctness, accessibility, mobile layout, security, broken links, stale content, accidental secrets, and unrelated edits.
8. **Commit:** create focused commits with conventional prefixes and meaningful messages.
9. **Pull request:** open or update a PR to `main`, summarize changes, tests, risks, screenshots when useful, and owner decisions required.
10. **Release:** merge only after required checks pass and the owner approves. Confirm Render deployment and the public site before reporting success.

For a tiny typo or documentation-only change, use proportionate checks, but still review the diff and record any contract changes.

## 5. Git, commits, and pull requests

- `main` is the production branch. Do not do feature work directly on `main`.
- Use `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`, or `chore/<short-name>`.
- Keep each branch focused on one outcome. Avoid unrelated formatting or generated-file churn.
- Use Conventional Commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`, `perf:`, `ci:`.
- Commit messages must describe the actual change; never claim tests passed if they were not run.
- Do not rewrite shared branch history or force-push unless the owner explicitly authorizes it and the impact is understood.
- Every production change must go through a pull request. PRs must explain purpose, scope, testing, risks, screenshots where useful, and any owner approval needed.
- Merge only when CI is green, review findings are resolved, and owner approval is present.
- Prefer squash merging for a clean production history unless the owner chooses another strategy.
- Never merge a PR merely because it is open, created, or marked mergeable. Confirm its latest checks and review state first.
- After merge, confirm the resulting commit is on `main`; then check the deployment status.

## 6. Quality gates

Before a PR is ready:
- Run `python scripts/validate_site.py`.
- Confirm the CI workflow is valid and its latest applicable run is green.
- Check semantic HTML, document title, language, viewport, heading structure, labels, keyboard access, focus visibility, contrast, and meaningful image alternative text.
- Check mobile and desktop layouts, navigation, internal anchors, external links, and overflow.
- Test required enquiry fields and the WhatsApp message/URL without sending a message.
- Confirm assets load, paths are case-correct, and no console errors are introduced.
- Check performance: right-size images, avoid unnecessary scripts, and do not add heavy dependencies without justification.
- Check security: no credentials, tokens, secrets, unsafe inline data, or untrusted HTML injection.
- Check factual accuracy of business details and package claims.
- Update or add automated validation when a repeatable failure mode is discovered.

CI must be treated as a required PR gate. If repository rules cannot currently enforce it, document that limitation and ask the owner to enable branch protection/rulesets in GitHub. Never imply branch protection is active until verified.

## 7. Architecture and dependency policy

- Prefer native browser features and simple, maintainable HTML/CSS/JavaScript.
- Keep JavaScript progressively enhanced and avoid unnecessary global state.
- Keep reusable images, icons, fonts, and brand files under `assets/`, grouped into clear subfolders as the asset set grows.
- Keep automated checks under `scripts/`.
- Keep architecture, operations, deployment, and playbooks under `docs/`.
- Keep GitHub automation and contribution templates under `.github/`.
- Do not introduce a dependency solely for a task that can be handled safely with the existing stack.
- If a dependency is approved, document why it is needed, how it is maintained, and how it affects build/deploy/security.

## 8. Security, privacy, and reliability

- Never commit API keys, access tokens, passwords, private keys, deploy-hook URLs, or environment secrets.
- Store secrets only in the appropriate GitHub Actions or hosting secret store. Reference secret names in docs, never their values.
- Use least-privilege permissions for GitHub Actions.
- Pin or deliberately maintain third-party Actions; review major version changes before updating them.
- Do not add analytics, cookies, tracking pixels, or external form services without owner approval and a privacy review.
- Do not expose customer enquiries or personal data in logs, commits, screenshots, or test fixtures.
- Treat third-party content and external links as untrusted; validate destinations and avoid unsafe DOM insertion.

## 9. Documentation and instruction improvement contract

Documentation is part of the implementation, not optional cleanup.

Whenever a task reveals a better rule, recurring defect, missing check, new tool, new folder, architectural decision, deployment change, or operational lesson:

1. Update the relevant rule in `AGENTS.md` (or add a scoped instruction under `.github/instructions/`).
2. Add a dated entry to `docs/INSTRUCTION_CHANGELOG.md` explaining what changed and why.
3. Update `docs/PROJECT_WORKFLOW.md`, `docs/DEPLOYMENT.md`, `docs/skills/README.md`, `README.md`, or `index.yaml` wherever the change affects them.
4. Add or improve an automated check when the rule can be verified by a script or CI.
5. Include these documentation changes in the same PR as the implementation that motivated them.
6. Review the new wording for contradictions, duplication, outdated steps, and instructions that cannot actually be performed.

Do not create a new rule merely to describe a one-off preference. Record durable, repeatable project knowledge. Keep the changelog chronological with newest entries first. Never rewrite history to hide a previous rule.

## 10. Hosting and production release

- Intended host: Render Static Site.
- Production branch: `main`.
- Build command: empty.
- Publish directory: `.`.
- Automatic deployment should be enabled for pushes/merges to `main` once the Render service is connected and verified.
- A push to a feature branch must not be treated as a production release.
- Never expose secrets in repository files or deployment logs.
- Verify the Render service's linked repository, branch, auto-deploy setting, latest deploy status, and public URL.
- Open the public URL and check the homepage, assets, responsive layout, and enquiry path before saying the release is live.
- If a deployment fails, inspect build/deploy events and logs, identify the cause, fix it through a PR, and verify the next deployment.
- Current setup status must be read from `docs/DEPLOYMENT.md`; do not assume the host is connected merely because it is documented as the target.

## 11. Reporting standard

Every completion report must distinguish:
- changed and committed;
- PR opened or updated;
- checks actually run and their results;
- PR merged or not merged;
- hosting connected or not connected;
- deployment succeeded, failed, or is still pending;
- public URL verified or not verified;
- owner decisions or manual setup still required.

Use exact links and commit/PR references when available. Do not overstate progress.

## 12. Definition of done

A task is complete only when the requested behavior is implemented, appropriate checks are run, the diff is reviewed, relevant documentation and inventory are synchronized, the change is committed on the correct branch, and the PR/release state is accurately reported. Production work additionally requires owner-approved merge and verified hosting deployment.
