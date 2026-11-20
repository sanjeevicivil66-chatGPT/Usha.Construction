# Project skills and reusable playbooks

These are repository-specific procedures for repeatable work. They are documentation playbooks, not installed third-party tools or a claim that a separate runtime skill package exists. Follow [AGENTS.md](../../AGENTS.md) and [PROJECT_WORKFLOW.md](../PROJECT_WORKFLOW.md) first.

## 1. Repository audit

Use when starting work or reviewing repository health.

1. Read AGENTS.md, scoped instructions, README and index.yaml.
2. Inspect branch, recent commits, open PRs, CI runs and deployment state.
3. Compare actual folders/files with index.yaml.
4. Identify stale documentation, duplicate assets, broken links, untracked secrets, and unused dependencies.
5. Report findings by severity; fix only within the approved scope.
6. Add repeatable checks for recurring problems.

## 2. Static website implementation

Use for HTML, CSS, JavaScript, content and asset changes.

1. Preserve the static stack unless the owner approves a change.
2. Use semantic HTML, responsive CSS, accessible labels and keyboard-friendly controls.
3. Keep JavaScript small and progressively enhanced.
4. Optimize images and provide meaningful alt text.
5. Verify the enquiry flow without sending a real WhatsApp message.
6. Test mobile and desktop layouts and check browser console/network errors.
7. Update the content schema and inventory when business content or files change.

## 3. Accessibility and responsive review

1. Check document language, title, headings, landmarks and form labels.
2. Navigate with keyboard only; verify visible focus and logical order.
3. Check contrast, text resizing, tap targets and reduced-motion behavior where animation exists.
4. Review narrow mobile, tablet and desktop widths for clipping and horizontal overflow.
5. Verify image alternatives and that meaning is not conveyed by color alone.
6. Record findings and add automated checks where practical.

## 4. CI and quality maintenance

1. Keep GitHub Actions permissions least-privilege.
2. Run `python scripts/validate_site.py` locally.
3. Add deterministic checks for newly discovered recurring defects.
4. Run checks on PRs to main and pushes to main.
5. Inspect the actual run result; never infer a green check from a workflow file existing.
6. Update the workflow documentation when job names, commands, runtime or triggers change.

## 5. Release and hosting operations

1. Confirm the PR is approved and all required checks pass.
2. Merge to main only with owner authorization.
3. Confirm Render is linked to the correct repository and main branch.
4. Confirm auto-deploy is enabled and inspect the deployment result.
5. Open the live URL and test critical user paths.
6. Record deployment status and verification date in docs/DEPLOYMENT.md.
7. If hosting access or deployment is unavailable, report the blocker rather than claiming a release.

## 6. Documentation and instruction maintenance

1. Update AGENTS.md when a durable rule changes.
2. Add a dated entry to docs/INSTRUCTION_CHANGELOG.md.
3. Synchronize README.md, index.yaml and the affected playbook/runbook.
4. Ensure each important folder and file has a current inventory entry.
5. Check for contradictions and stale statements.
6. Commit documentation with the implementation that motivated it.

## Completion standard

A playbook is complete only when its checks have actually been performed, findings are recorded, and the relevant source-of-truth documents are synchronized.
