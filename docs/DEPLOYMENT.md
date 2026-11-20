# Hosting and deployment

## Target configuration

| Setting | Intended value |
|---|---|
| Provider | Render |
| Service type | Static Site |
| Repository | `sanjeevicivil66-chatGPT/Usha.Construction` |
| Production branch | `main` |
| Build command | Empty |
| Publish directory | `.` |
| Auto deploy | Enabled for updates to `main` |
| Runtime | Static HTML/CSS/JavaScript |

## Current verified state (2026-11-20)

- Render workspace: **Er.'s workspace**.
- GitHub repository: `sanjeevicivil66-chatGPT/Usha.Construction`.
- Render Static Site: `usha-construction-architect` (service ID `srv-dc07sdd6e07s73bu49og`).
- Production branch: `main`.
- Build command: empty; publish directory: `.`.
- Native auto-deploy: enabled for commits to `main`.
- Public URL: https://usha-construction-architect.onrender.com
- Initial deployment of commit `a5fa7354f67e6be8da638fdf0759f42a908ef09f` was reported `live` by Render.
- The repository is public per owner confirmation. The Render-GitHub connector remains connected.

This site status must be rechecked against Render before future release reports. A successful deployment record is not a substitute for testing the public page and enquiry path in a browser.

## Website experience notes

- The website remains a static HTML/CSS/vanilla JavaScript site with no build step.
- The guided enquiry flow opens a prefilled WhatsApp message; it does not persist leads. Any CRM, automated follow-up or server-side lead capture requires an owner-approved backend and privacy review.
- The owner-provided logo is stored as `assets/usha-logo.svg` with embedded raster artwork.

## Release behavior

- Merge a reviewed, CI-passing PR into `main`.
- Render's native auto-deploy should detect the main-branch update and start a deployment after the service is connected and configured.
- Inspect the deployment in Render. A Git push is not proof that deployment succeeded.
- Verify the public website after deploy completion.
- If deployment fails, inspect Render build/deploy logs and events, fix the issue on a new branch, and release through a PR.

## CI and deployment gate

GitHub Actions validates pull requests and pushes to main. Render native auto-deploy may start independently of the GitHub Actions result. If the owner later requires a strict “deploy only after CI passes” gate, implement a protected deployment workflow using a Render deploy hook stored as a GitHub Actions secret, and verify the workflow before switching off native auto-deploy. Never commit the deploy hook URL.

## Rollback

If a production release causes a serious regression:
1. Identify the last known-good Render deployment.
2. Use Render's supported rollback/redeploy controls, or revert the offending commit through a reviewed PR.
3. Verify the restored public site.
4. Record the incident, cause, recovery and preventive action in the relevant documentation.
