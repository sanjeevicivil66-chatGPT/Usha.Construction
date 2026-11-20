# Hosting and deployment

## Existing public website

- Provider: Render Static Site.
- Repository: sanjeevicivil66-chatGPT/Usha.Construction.
- Production branch: main.
- Build command: empty; publish directory: repository root.
- Auto deploy: enabled for main.
- Public URL: https://usha-construction-architect.onrender.com

Recheck the service and latest deploy in Render before each release. A deployment record is not a substitute for testing the public URL.

## Admin API deployment status

The TypeScript API is source-only and is not deployed. The existing Render Static Site cannot run the Node.js API or host a durable SQLite database. A separate Render Web Service and persistent disk are required. Do not create them, change the public site, or incur hosting charges without the owner's separate approval.

Production environment includes NODE_ENV=production, HOST=0.0.0.0, host-supplied PORT, DATABASE_PATH on approved persistent storage and ADMIN_ORIGIN set to the exact admin frontend origin. Future authentication and SMTP secrets belong only in the host secret manager.

## Release and recovery

Apply migrations before traffic. Back up SQLite consistently; encrypt and access-control backups; test restoration away from production. Verify health, authentication, CRM, quotations, invoices, email mock/live separation and responsive admin behavior. Keep public site and API deployments independently observable and reversible.
