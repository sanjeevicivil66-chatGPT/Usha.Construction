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

- GitHub repository exists and contains the website work on `feature/website-v2`.
- Pull request #1 is open and has not been confirmed merged.
- The Render workspace selected is **Er.'s workspace**.
- The Render workspace service listing returned no existing services.
- Render site creation was attempted, but Render reported that the repository was unfetchable. No service was created by that attempt.
- The likely prerequisite is granting Render's Git provider integration access to the private GitHub repository. Confirm the integration and repository permission in Render before retrying.
- Therefore, production hosting, auto-deploy, first deployment, and public URL are **not yet verified**.

This status section must be updated only after checking the actual Render service and GitHub PR/deploy state. Do not infer success from configuration intent.

## Setup procedure

1. Connect the GitHub account to Render.
2. Grant Render access to the private repository `sanjeevicivil66-chatGPT/Usha.Construction`.
3. Create a Static Site in **Er.'s workspace**.
4. Select repository `sanjeevicivil66-chatGPT/Usha.Construction` and branch `main`.
5. Set build command to empty and publish directory to `.`.
6. Enable automatic deployment for branch updates.
7. Create the service and wait for its first deploy.
8. Confirm the linked repository, production branch, auto-deploy setting, latest deploy status and public `onrender.com` URL.
9. Open the public URL and test homepage, logo, images, links, responsive layout and WhatsApp enquiry flow.
10. Record the actual service name, public URL, connection status, and verification date here. Never store credentials or deploy-hook secrets in this file.

## Release behavior

- Merge a reviewed, CI-passing PR into `main`.
- Render's native auto-deploy should detect the main-branch update and start a deployment.
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
