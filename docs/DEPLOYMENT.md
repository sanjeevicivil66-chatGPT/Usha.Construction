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

- GitHub repository exists and contains the website work on `main` and `feature/website-v2`.
- Pull request #1 (initial website) is merged. Pull request #2 (repository contract and documentation) is open and not merged.
- The Render workspace selected is **Er.'s workspace**.
- The owner confirms Render is already wired to the GitHub Render connector. Do not ask the owner to connect GitHub again unless a fresh check shows that the integration is disconnected.
- The Render workspace service listing returned no existing services.
- Static Site creation was attempted through the Render connector, but Render returned: repository URL was invalid or unfetchable. Retrying with and without the `.git` suffix produced the same result.
- This is an unresolved repository-fetch/create-service error, not proof that the GitHub connector is disconnected. The exact cause has not been established.
- No Static Site was created by those attempts. Production branch linking, auto-deploy, first deployment, and public URL are therefore **not yet verified**.

This status section must be updated only after checking the actual Render service and GitHub PR/deploy state. Do not infer success from configuration intent.

## Next diagnostic steps

1. Keep the existing Render-GitHub connector wiring; do not repeat account connection as the default remedy.
2. Re-check the exact repository identifier and that the connected Git provider exposes this private repository to Render's service-creation flow.
3. If the repository is visible in Render's dashboard but API creation still rejects it, create the Static Site from the Render dashboard or inspect the connector/API error with Render support. Do not claim the site exists until the service appears in the workspace.
4. Once the repository is selectable, create a Static Site in **Er.'s workspace**.
5. Select repository `sanjeevicivil66-chatGPT/Usha.Construction` and branch `main`.
6. Set build command to empty and publish directory to `.`.
7. Enable automatic deployment for branch updates.
8. Confirm the linked repository, production branch, auto-deploy setting, latest deploy status and public `onrender.com` URL.
9. Open the public URL and test homepage, logo, images, links, responsive layout and WhatsApp enquiry flow.
10. Record the actual service name, public URL, connection status, and verification date here. Never store credentials or deploy-hook secrets in this file.

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
