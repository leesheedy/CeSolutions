# CES homepage simplification and savings experience

The homepage now follows a shorter enquiry journey: a clear offer and real installation photo, solar and battery options, an interactive savings illustration, selected projects, local team, one customer review, four FAQs and a one-page enquiry.

Removed from the homepage: clock-based styling, the separate animated power-flow diagram, pinned service cards, large filtered photo gallery, repeated statistics, moving brand/review strips, checklist emails and upload steps. Supporting service and location pages remain available.

The savings illustration uses the quarterly bill entered by the visitor and an explicitly selected 25%, 50% or 75% reduction. It calculates annual arithmetic only and explains that system design, installation cost and payback are excluded. A day/evening architectural home illustration shows the solar array and battery. Rotation buttons work with keyboard input; the renderer redraws only for a changed view, changed mode or resize.

Checks performed:
- Higgsfield cloud build and local TypeScript/production build.
- All ten public routes prerender successfully, with robots, sitemap and 404 output.
- Browser review at desktop and 390px mobile widths, no horizontal overflow or broken loaded images.
- Day/evening switches and rotation respond; savings verified at $100/quarter and 25% ($100/year), $800/quarter and 75% ($2,400/year), and $3,000/quarter and 75% ($9,000/year).
- Mobile menu opens/closes; enquiry requires name, phone and suburb, with email/message optional.
- No browser errors in the checked homepage session. Reduced-motion CSS removes transitions; no continuous canvas animation exists.
- Updated contact copy and privacy collection description to match the simplified form. Removed old FAQ schema from the homepage.

The user explicitly excluded email delivery from scope. No live test enquiry was submitted. Conversion gains have not been measured and require real enquiry data after launch.

Implementation was authored in the Higgsfield cloud sandbox against the current GitHub source and saved locally. The dedicated Higgsfield project checkout failed, so the older cloud-hosted revision was not redeployed. Netlify remains the public destination; no community gallery listing or domain/DNS changes are involved.
