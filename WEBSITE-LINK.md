# Clean Energy Solutions website

[Open the deployed website](https://clean-energy-solutions.higgsfield.app)

Higgsfield confirmed the updated deployment on 14 September 2026. Website ID: `229de0b0-bdd3-4434-b5f3-57faea419641`.

The hosted address currently redirects logged-out visitors to Higgsfield sign-in. Anonymous public access has not been verified and the connector exposes no setting to remove this platform restriction. The website is not listed in the community gallery. The existing cesolutions.com.au domain and hosting have not been changed.

The completed version includes six pages, desktop/mobile scroll animation, existing CES photography, responsive styling, metadata, structured data, sitemap and legacy redirects. Build, route and browser interaction checks passed. The enquiry form prepares an email for the visitor to send in their own email app; it does not send automatically.

The Higgsfield address carries noindex and canonical URLs for cesolutions.com.au to avoid duplicate search listings during review.

Source code and assets are saved in Higgsfield cloud and now also in the local `website` folder. Latest deployed revision: `f8a100b` (14 September 2026, late — the layered parallax revamp; deploy status `deployed`). The earlier backup archive `CES-website-source-d901efc.zip` predates this revision. See [local file instructions](WEBSITE-LOCAL.md).

After the `f8a100b` deploy an anonymous request to the hosted address still returns HTTP 401, so public access remains blocked at the platform level.

The September 14 update adds a ThrillX-inspired editorial layout, authentic CES Instagram photography, a photographic scroll animation, a filtered work gallery, clearer copy, mobile quick-contact navigation and accessibility fixes. Video files are approximately 87% smaller. All six pages passed checks at four screen widths; automated accessibility scans reported no violations at the tested desktop/mobile sizes.

See [the full UI audit](UI-AUDIT.md) for findings, validation evidence and remaining launch work. A browser check after the latest deployment still reached Higgsfield sign-in; public access remains unresolved.
