# Clean Energy Solutions launch

Six server-rendered pages: home, solar, batteries, commercial solar, team and contact. Existing CES photography and business details are retained; the hero is a labelled Higgsfield-generated solar-home visualisation. Scroll scrubbing has separate desktop/mobile MP4s, exact first-frame posters and the shipped reduced-motion fallback.

The enquiry form prepares an email; it does not submit details to a server. The visitor explicitly sends using their own email app, or follows the existing CES contact form link. Telephone, email and map links are available.

Unique titles, descriptions, production canonicals, social cards, local-business data, sitemap and legacy redirects are included. The Higgsfield subdomain is intentionally noindex to avoid duplicating the existing CES domain. The existing cesolutions.com.au hosting/DNS has not been changed. Community gallery listing was declined.

Source review: https://cesolutions.com.au/ and its service/team/contact pages. Design inspiration: Heliox. No unsupported savings, payback, installation counts or star ratings are claimed.

Restored 13 September 2026 after the earlier interrupted cloud session. Typecheck and production build passed. See final conversation for deployment status.

Final browser verification passed at 1440px desktop and 390px mobile: no horizontal overflow, one H1, no broken eager images or browser exceptions, video seeks forward and backward, mobile menu opens/closes with Escape, FAQ opens and validated enquiries produce the correct mailto link. Reduced motion requests zero MP4s. All six pages, robots and sitemap return 200; unknown pages return 404. Runtime verification details are in runtime-verification.json.

## Where the emails go (9 October 2026)

Staff emails (new enquiry, checklist sent, checklist files) go to `ENQUIRY_TO`, set on the Netlify project to info@cesolutions.com.au. Customer emails are sent from and reply to info@cesolutions.com.au. Environment variables are frozen per deploy, so a change needs a new deploy that touches `website/app` (Netlify skips builds for commits outside the base directory).

## Live on cesolutions.com.au (9 October 2026)

The domain now serves this site. In the Cloudflare zone the apex `A` record points at Netlify (`75.2.60.5`, was `45.77.235.129`) and `www` is a `CNAME` to `cesolutions.netlify.app` (was `uhnyqmsn.elementor.cloud`), both DNS only. cesolutions.com.au is the primary domain on the Netlify project, www redirects to it, and cesolutions.automatrix.au stays as an alias so links in earlier emails keep working. Mail records were not changed. To roll back, restore the two old values.
