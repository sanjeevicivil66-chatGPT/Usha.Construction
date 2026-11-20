# USHA CONSTRUCTION & ARCHITECT — Website

Responsive static website for **USHA CONSTRUCTION & ARCHITECT**, Chithod, Erode, Tamil Nadu.

## Technology

- HTML5, CSS3 and vanilla JavaScript.
- No build step or package manager.
- Entry point: `index.html`.
- Build command: empty.
- Publish directory: repository root (`.`).

## Start here

1. Read [AGENTS.md](AGENTS.md) before making changes.
2. Read [Project workflow](docs/PROJECT_WORKFLOW.md) for branches, commits, reviews and quality gates.
3. Read [Deployment runbook](docs/DEPLOYMENT.md) before changing hosting or releasing.
4. Read [Project playbooks](docs/skills/README.md) for repeatable task procedures.
5. Check [index.yaml](index.yaml) for the project inventory and content schema.

## Main files

- `index.html` — premium responsive landing page, services, indicative packages, inspiration gallery, FAQs and guided WhatsApp enquiry.
- `assets/usha-logo.svg` — owner-provided USHA logo artwork in an SVG wrapper.
- `scripts/validate_site.py` — dependency-free static site validation.
- `.github/workflows/ci.yml` — GitHub Actions validation workflow.
- `.github/instructions/website.instructions.md` — scoped website implementation rules.
- `.github/pull_request_template.md` — standard PR review checklist.
- `docs/` — workflow, deployment, instruction history and task playbooks.

## Local validation

Requires Python 3.12 or compatible Python 3:

```bash
python scripts/validate_site.py
```

## Git and release policy

- Start by searching GitHub issues; create an issue before substantive changes when no matching issue exists.
- Work on an issue-number branch from latest `main`; link commits and PRs back to that issue.
- For UI changes, inspect Playwright screenshots at 360, 390, 430, 768 and 1280 px before requesting review.
- See [the issue-first workflow](docs/PROJECT_WORKFLOW.md) and [AGENTS.md](AGENTS.md) for mandatory gates.

- Use focused branches and conventional commits.
- Production changes go through a pull request to `main`.
- Merge only after checks pass and the owner approves.
- Render target: Static Site, branch `main`, empty build command, publish directory `.`, auto-deploy enabled.
- See [Deployment status and setup](docs/DEPLOYMENT.md). Hosting must not be described as live until the public URL has been verified.

## Public launch checks

- Confirm the official phone number and office address.
- Confirm package rates and written inclusions.
- Replace illustrative gallery images with owner-approved project photos.
- Confirm the official logo artwork.
- Test WhatsApp enquiry behavior on mobile and desktop.

The guided enquiry flow opens WhatsApp with a pre-filled message for the visitor to review and send. It does not store leads on a server.
