# Project workflow and repository operations

This document expands the mandatory contract in [AGENTS.md](../AGENTS.md). If instructions conflict, follow the stricter safety requirement and update the documents together.

## Standard change lifecycle

| Stage | Required action | Evidence |
|---|---|---|
| Intake | Read AGENTS.md, scoped instructions, relevant docs and current source | Task scope and affected files |
| Inspect | Check branch, recent commits, open PRs, CI and deployment state | Current repository state |
| Plan | Define outcome, risks, acceptance criteria and checks | Short implementation plan |
| Build | Make a focused change using the existing static stack | Source and asset diff |
| Validate | Run local validator and relevant manual checks | Actual command output and CI run |
| Document | Synchronize rules, README, index.yaml and playbooks | Documentation diff |
| Review | Inspect full diff, mobile/accessibility/security/content | Review checklist |
| Commit | Use conventional commit format on a focused branch | Commit SHA |
| PR | Open/update PR with scope, test results and risks | PR URL |
| Release | Owner approves; merge after required checks | Merge commit on main |
| Deploy | Render deploys main; inspect deployment and live site | Successful deploy and verified URL |

## Branch and commit conventions

- Production: `main`.
- Feature: `feature/<short-description>`.
- Bug fix: `fix/<short-description>`.
- Documentation: `docs/<short-description>`.
- Maintenance/automation: `chore/<short-description>`.
- Commit examples: `feat: add project gallery filtering`, `fix: correct mobile navigation overflow`, `docs: clarify Render release process`, `ci: validate project inventory`.
- Do not mix unrelated changes in one commit or PR.
- Do not commit directly to main for feature work.

## Pull request checklist

- [ ] Purpose and scope are clear.
- [ ] Acceptance criteria are met.
- [ ] No unrelated files or generated noise.
- [ ] Validator and applicable tests have actually run.
- [ ] GitHub Actions checks are green.
- [ ] Mobile, desktop, accessibility and enquiry flow reviewed as relevant.
- [ ] No secrets, private customer data, or unsupported business claims.
- [ ] README, index.yaml, architecture/deployment docs updated where affected.
- [ ] Instruction changes recorded in docs/INSTRUCTION_CHANGELOG.md.
- [ ] Owner approvals and unresolved launch decisions are explicit.

## Required validation

Run from the repository root:

```bash
python scripts/validate_site.py
```

For changes to HTML/CSS/JS, additionally inspect the rendered page at mobile and desktop widths, test navigation and anchors, check browser console/network failures, and exercise the enquiry flow without sending a real message.

If a new repeatable regression is found, add a deterministic automated check to `scripts/` and run it in `.github/workflows/ci.yml`.

## Review and merge policy

- PRs target `main`.
- The latest applicable CI run must pass.
- Resolve all blocking review findings.
- Obtain owner approval before merging production changes.
- Prefer squash merge for focused PRs.
- After merge, verify the merge commit on main and confirm the Render deployment status.
- If branch protection is not configured, state that limitation; do not claim CI is enforced as a merge gate.

## Repository structure policy

- `assets/`: approved brand and media assets. Organize by type when the folder grows.
- `.github/workflows/`: CI and repository automation.
- `.github/instructions/`: scoped contributor/agent instructions.
- `docs/`: architecture, workflow, deployment, change log and operational playbooks.
- `scripts/`: dependency-light validation and maintenance scripts.
- Root files: entrypoint, project contract, inventory and onboarding only.

Every new folder and important file must have a purpose documented in `index.yaml`. Remove or update inventory entries when files move or are deleted.

## Continuous improvement loop

At the end of each substantial task, capture durable lessons:
1. What failed, caused rework, or was difficult to verify?
2. Can a rule, checklist, script, CI job, or playbook prevent it?
3. Which source-of-truth documents need updating?
4. Is the new instruction actionable and consistent with existing rules?

Record accepted improvements in `docs/INSTRUCTION_CHANGELOG.md` in the same PR. Do not add speculative process or unnecessary tools.
