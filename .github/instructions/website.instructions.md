# Website implementation instructions

Applies to: `index.html`, `assets/**`, and website-facing static content.

- Follow the root `AGENTS.md` contract.
- Keep the implementation static and dependency-light: HTML5, CSS3 and vanilla JavaScript.
- Preserve the exact business name and never invent business claims, reviews, awards, completed projects or guarantees.
- Treat rates, contact details, package inclusions and company imagery as owner-controlled content.
- Use semantic elements, accessible labels, keyboard-operable controls, visible focus and responsive layouts.
- Do not use untrusted strings with unsafe HTML insertion. Prefer safe text APIs.
- The enquiry form currently opens a pre-filled WhatsApp message; do not describe it as a server-backed submission or lead store.
- Verify mobile and desktop behavior, anchors, external links, asset paths and browser console errors.
- Run `python scripts/validate_site.py` and inspect the actual GitHub Actions result.
- If an implementation change alters content, file structure, runtime, or release behavior, update `index.yaml` and the relevant docs in the same PR.
- If a durable instruction is improved, update `AGENTS.md` and `docs/INSTRUCTION_CHANGELOG.md` in the same PR.
