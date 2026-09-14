# Your local CES website

Saved on 14 September 2026 from deployed revision `d901efc`.

- Website project: [website/app](website/app)
- Source backup: [CES-website-source-d901efc.zip](CES-website-source-d901efc.zip)
- Homepage: [index.tsx](website/app/src/routes/index.tsx)
- Styling: [styles.css](website/app/src/styles.css)
- Photos and animation: [assets](website/app/public/assets)
- Audit and screenshots: [audit](website/app/audit)

The download checksum matches the cloud source. The archive contains the committed project files, assets, build configuration and dependency lockfile. Generated dependencies and Git history are not included.

## Running the project

This is a React/TanStack application; it needs a development server rather than opening an HTML file directly. Bun is installed globally via npm (`npm i -g bun`) and dependencies are installed. In PowerShell:

```powershell
cd C:\Users\efextech\CESOLUTIONS\website\app
bun run dev
```

The 14 September passes added `motion` (Motion for React). `src/site/motion.tsx` holds the parallax, masked-reveal, scroll-word, marquee, counter, stacking-card, two-speed-column and backdrop components adapted from 21st.dev; `src/site/sections.tsx` composes the stacked service cards and the shopfront band; `src/site/projects.tsx` is the six-photo gallery. Section copy lives in `src/routes/index.tsx`, `src/site/content.ts` and `src/scroll-scrub-scenes.ts`. See the update at the top of [UI-AUDIT.md](UI-AUDIT.md).

Open the local URL printed by the development server. Dependencies have not been installed as part of this file export.

To validate and build:

```powershell
bun run typecheck
bun run build
```

The existing Higgsfield deployment remains separate. Changes to these local files do not automatically update it. The cloud host currently requires sign-in, and the enquiry form prepares an email rather than sending one automatically. See [UI-AUDIT.md](UI-AUDIT.md) for full launch notes.

SHA-256: `baf9d860d90620bc19ff4dbaf0334ac0c8ec36af2b415a463c1f5b37c5944f36`
