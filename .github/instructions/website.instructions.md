# Website implementation instructions

Applies to: `index.html`, `assets/**`, and website-facing static content.

- Follow the root `AGENTS.md` contract.
- Keep the implementation static and dependency-light: HTML5, CSS3 and vanilla JavaScript.
- Preserve the exact business name and never invent business claims, reviews, awards, completed projects or guarantees.
- Treat rates, contact details, package inclusions and company imagery as owner-controlled content.
- Use semantic elements, accessible labels, keyboard-operable controls, visible focus and responsive layouts.
- Do not use untrusted strings with unsafe HTML insertion. Prefer safe text APIs.
- The guided enquiry flow currently opens a pre-filled WhatsApp message; do not describe it as a server-backed submission or lead store.
- Respect `prefers-reduced-motion` for scroll reveals and animated elements. Keep mobile navigation keyboard-operable and the enquiry journey usable without animation.
- Use the owner-provided logo artwork in `assets/usha-logo.svg`; do not replace it with a generic wordmark.
- Verify mobile and desktop behavior, anchors, external links, asset paths and browser console errors.
- Run `python scripts/validate_site.py` and inspect the actual GitHub Actions result.
- If an implementation change alters content, file structure, runtime, or release behavior, update `index.yaml` and the relevant docs in the same PR.
- If a durable instruction is improved, update `AGENTS.md` and `docs/INSTRUCTION_CHANGELOG.md` in the same PR.

## Issue and browser verification gate

- Search GitHub issues first. Create a scoped issue before implementation when none exists; link work to the issue.
- Use an issue-number branch from latest main.
- Never claim browser testing from source inspection alone.
- For UI changes, run the Playwright browser suite and visually inspect its screenshots at 360, 390, 430, 768 and 1280 CSS-pixel widths.
- If Playwright is unavailable, any screenshot is clipped, or any check fails, create/update a GitHub issue and report the blocker; do not request review or merge.
- Verify the complete owner logo is visible in header and contact card at every viewport; do not use speculative SVG viewBox crops.
