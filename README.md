# Clean Energy Solutions — website

Source, audits and copy research for the new [Clean Energy Solutions](https://cesolutions.com.au) website: a family-owned solar and battery installer at 79 Elgin Boulevard, Wodonga, serving Albury-Wodonga.

The site is a server-rendered React app (TanStack Start on a Cloudflare Worker) built from the Higgsfield "scroll-scrub" website template. It replaces the current WordPress/Elementor site's content with a benefit-led homepage, five supporting pages, authentic CES photography and scroll-linked motion.

| Item | Where |
|---|---|
| Live preview (Higgsfield host) | https://clean-energy-solutions.higgsfield.app — see [launch status](#launch-status) |
| Site source | [`website/app`](website/app) |
| UI, content and technical audit | [`UI-AUDIT.md`](UI-AUDIT.md) (also at `website/app/audit/`) |
| Homepage copy research and compliance notes | [`homepage-copy-rewrite.md`](homepage-copy-rewrite.md), [`CES-Homepage-Copy-Report.pdf`](CES-Homepage-Copy-Report.pdf) |
| Deployment and local-run notes | [`WEBSITE-LINK.md`](WEBSITE-LINK.md), [`WEBSITE-LOCAL.md`](WEBSITE-LOCAL.md) |
| Photo provenance | [`website/app/asset-sources.json`](website/app/asset-sources.json) |

## Pages

- `/` — homepage: scroll-scrubbed hero over CES's own rooftop photo, trust stats, stacked service cards, a scroll-lit statement, six-photo gallery, reasons, team, equipment marquee, review, shopfront band, process, rebates, FAQ, contact band
- `/solar`, `/batteries`, `/commercial-solar`, `/about` — service and team pages driven by `src/site/content.ts`
- `/contact` — enquiry form that prepares an email on the visitor's device (there is no receiving backend yet), plus phone, email and map links
- `robots.txt`, `sitemap.xml`, LocalBusiness / FAQ structured data, canonical URLs pointing at cesolutions.com.au

## Running it locally

Requires [Bun](https://bun.sh) (Node 22+ also present for scripts).

```powershell
cd website/app
bun install --frozen-lockfile
bun run dev          # http://localhost:5173
```

Checks used before every deploy:

```powershell
bun run typecheck    # tsr generate + tsc
bun run check:ui     # template gate: no raw colours or dark: variants in route files
bun run build        # client + Cloudflare Worker SSR bundle in dist/
```

`bun test` runs the site's three tests plus the vendored Higgsfield package suites; the vendored suites and one template contract test fail without Higgsfield's private environment (see the audit's "Known, pre-existing" note).

## How the code is organised

```
website/app/src
├─ routes/            index.tsx (home), $page.tsx (service/team pages), contact.tsx, __root.tsx
├─ site/
│  ├─ content.ts      page copy, FAQ, metadata, structured data
│  ├─ nav.tsx         header: Radix navigation menu (desktop) + full-screen mobile menu
│  ├─ sun.tsx         the light engine: real solar position for Wodonga → CSS custom properties
│  ├─ shell.tsx       glow footer, contact band, FAQ
│  ├─ sections.tsx    hero (video), enquiry band, service stack, why-us, process, visit band
│  ├─ quote-form.tsx  three-step Netlify Forms enquiry (services → contact → bill/photos), photo shrinking, checklist button
│  ├─ address-field.tsx  address combobox (Google Places when keyed, else OpenStreetMap) → suburb/state/postcode
│  netlify/functions/send-checklist.mjs  emails the visitor a what-to-send list via Resend
│  ├─ estimator.tsx   bill-slider savings estimator (CES-published 50–100% range only)
│  ├─ flow.tsx        GSAP "sun to switchboard" six-step diagram with a following detail panel
│  ├─ projects.tsx    "Our work" scroll intro + filterable photo grid with a feature tile
│  ├─ locations.ts    Wagga Wagga / Shepparton / Yarrawonga page content
│  └─ motion.tsx      scroll and entrance motion (Motion for React)
├─ scroll-scrub-scenes.ts   hero scene: clip, poster, headline, actions
├─ components/scroll-scrub/ the template's video scrub engine (do not rewrite)
└─ styles.css         the site's own design tokens and layout
```

`public/assets` holds the photography (three public Instagram posts and images from cesolutions.com.au, listed in `asset-sources.json`), the encoded hero clips and their exact first-frame posters. `packages/` contains Higgsfield's vendored template packages; the site does not use them at runtime, but the build depends on the Quanta Tailwind entry, so they stay in place. Note that `@higgsfield/fnf` and `fnf-react` are marked `UNLICENSED` by Higgsfield.

### Brand

Colours come from the live cesolutions.com.au site and the layout/typography from CES's Framer project (read-only reference, see the audit): Inter (600 headings at −0.04em, sentence case; 400 body), cyan `#00ADF0` primary with mint `#05B085` as the second accent, the logo's green→cyan gradient, light-blue `#DBEDF3` and cream `#FBF3EA` surfaces, black header, enquiry and process bands, pill buttons, and a corner-bracket eyebrow on section labels. The one deliberate deviation is black text on cyan buttons — the live site's white-on-cyan is 2.6:1 and fails WCAG AA. The homepage hero backdrop is a Higgsfield-generated illustration, labelled as such on the page and in `asset-sources.json`; all other photography is CES's own.

### Reusable UI primitives

`src/components/ui/` (the shadcn folder; `components.json` aliases it as `@/components/ui`) holds the site's adapted third-party pieces alongside the stock shadcn kit: `svg-follow-scroll.tsx` (scroll-drawn stroke), `text-scroll-animation.tsx` (characters/photos converging on scroll) and `marquee.tsx` (CSS marquee). They take brand tokens via props/CSS and are composed in `src/site/`.

### Motion

Two libraries, each used where it fits. `src/site/flow.tsx` uses **GSAP + ScrollTrigger** (loaded on the client after mount) for the six-step "how your system works" diagram, whose connectors draw as you scroll, and for the progress line that fills beside the process steps. `src/site/motion.tsx` adapts several [21st.dev](https://21st.dev) components onto Motion for React: parallax image (#20023), masked text reveal (#19257), scroll word reveal (#24525), logo marquee (#21470), stacking cards (#25275) and two-speed grid columns (#1224). Every animated element carries `data-motion`; a `<noscript>` sheet and a `prefers-reduced-motion` rule force them visible, so content reads without JavaScript and for reduced-motion users. The hero uses the template's scroll-scrub engine, which seeks a short clip as you scroll and falls back to a still image.

### Copy rules

Only figures CES already publishes on its own FAQ are used on the site: 50–100% bill savings, 3–6 year payback, one-day residential installs, 25–30 year panel life, in-house CEC-accredited electricians led by Daniel (15+ years), and the dated 4.8/5 from 26 SolarQuotes ratings. Proposed claims that CES has not substantiated (a headline "up to 80%", dollar savings, NETCC status, a founding year, rebate dollar amounts) were deliberately left out; the reasoning is in `homepage-copy-rewrite.md` §3 and the audit.

## Deploying

**Netlify (public):** every push to `main` builds the site on Netlify (project `cesolutions`) and publishes it at https://cesolutions.netlify.app. `netlify.toml` sets the base to `website/app`, runs `bun install`, `bun run build` and `node scripts/prerender.mjs`, and publishes `dist/client`. The prerender step renders each route through the SSR bundle to a static file (`index.html`, `solar.html`, …, `robots.txt`, `sitemap.xml`, `404.html`); `public/_redirects` and `public/_headers` replace the Worker's redirect and security-header logic. To rebuild locally: `bun run build && node scripts/prerender.mjs`, then serve `dist/client`.

Netlify's edge injects a hosting comment, two `<meta>` tags and a HUD `<script>` into every HTML page. Because React hydrates the whole document, those nodes (and the newlines around them) break hydration, so `__root.tsx` ships a first-in-head script that removes them as the parser inserts them. If Netlify ever offers a switch for that injection, the script becomes redundant but harmless.

**Higgsfield (gated preview):** the site also deploys to Higgsfield. From a clone of the Higgsfield site repo (`website_repo_access` in the connector gives the URL and a scoped token), copy the changed files from `website/app` into the clone's `app/`, commit, push `main`, then call `deploy_website`. On Windows clone with `-c core.longpaths=true`; the vendored package paths exceed the default limit. Latest deployed revision: `f8a100b` (14 September 2026).

The `website/.github/workflows/ci.yml` file is the template's CI for Higgsfield's own runners; it is not at this repository's root, so GitHub Actions does not run it here.

## Launch status

**Public on Netlify, not yet on the CES domain.** https://cesolutions.netlify.app serves the new site to anyone. cesolutions.com.au still points at the WordPress site; its DNS is managed in Cloudflare. To switch: add `cesolutions.com.au` and `www.cesolutions.com.au` as custom domains on the Netlify project, then set the apex `A` record to `75.2.60.5` and `www` to a `CNAME` for `cesolutions.netlify.app`, both DNS-only, and let Netlify issue the certificate. The Higgsfield host remains a sign-in-gated preview.

Remaining launch work, from the audit:

1. Attach the domain and switch DNS (above).
2. The enquiry form posts to Netlify Forms (forms `enquiry`, with file uploads, and `checklist-request`). Set the notification email under Netlify → Forms → Notifications so submissions reach Ella.
3. Optional environment variables on the Netlify project (Site configuration → Environment variables):
   - `VITE_GOOGLE_PLACES_KEY` — a Google Maps Platform key with **Places API (New)** enabled, restricted to the site's domains. With it the address field uses Google suggestions; without it, it uses Photon (OpenStreetMap, free, no key), which resolves Albury-Wodonga street addresses well but has thinner coverage in small towns.
   - The checklist function only accepts requests whose `Origin` is cesolutions.com.au, a `*.netlify.app` deploy or cesolutions.automatrix.au, and is rate-limited to five per IP per minute (`config.rateLimit` in the function file) — add any new custom domain to `ALLOWED_ORIGIN` there.
   - `RESEND_API_KEY` and `CHECKLIST_FROM` (e.g. `Clean Energy Solutions <hello@cesolutions.com.au>`, a sender on a domain verified in [Resend](https://resend.com)) — enable the "Email me a list of what to send" button to actually email the visitor. `CHECKLIST_REPLY_TO` defaults to `info@cesolutions.com.au`. Until these are set the button records a `checklist-request` submission for the team and tells the visitor Ella will email the list.
3. Coordinate DNS, canonical/robots checks and legacy redirects when switching the domain.
4. Add consent-appropriate analytics and Search Console after public hosting, then measure Core Web Vitals and enquiry completion.
5. Replace the thumbnail-sized Instagram images with CES originals when available.
