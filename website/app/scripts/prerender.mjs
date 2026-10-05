// Render every public route through the built SSR bundle and write static HTML
// into dist/client, so the site can be served by a static host (Netlify).
// The Worker bundle only needs the Fetch API, which Node provides.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const out = join(root, "dist/client");
const origin = "https://cesolutions.com.au";
const { default: handler } = await import(pathToFileURL(join(root, "dist/server/server.js")).href);

// Pages are written as <route>.html, not <route>/index.html: Netlify serves
// /solar from solar.html without the trailing-slash redirect a directory gets,
// which keeps served URLs identical to the canonical links.
const files = {
  "/": "index.html",
  "/solar": "solar.html",
  "/batteries": "batteries.html",
  "/commercial-solar": "commercial-solar.html",
  "/about": "about.html",
  "/contact": "contact.html",
  "/privacy": "privacy.html",
  "/locations": "locations.html",
  "/locations/wodonga": "locations/wodonga.html",
  "/locations/wodonga/solar-panels": "locations/wodonga/solar-panels.html",
  "/locations/wodonga/home-batteries": "locations/wodonga/home-batteries.html",
  "/locations/albury": "locations/albury.html",
  "/locations/albury/solar-panels": "locations/albury/solar-panels.html",
  "/locations/albury/home-batteries": "locations/albury/home-batteries.html",
  "/locations/yarrawonga": "locations/yarrawonga.html",
  "/locations/yarrawonga/solar-panels": "locations/yarrawonga/solar-panels.html",
  "/locations/yarrawonga/home-batteries": "locations/yarrawonga/home-batteries.html",
  "/locations/wagga-wagga": "locations/wagga-wagga.html",
  "/locations/wagga-wagga/solar-panels": "locations/wagga-wagga/solar-panels.html",
  "/locations/wagga-wagga/home-batteries": "locations/wagga-wagga/home-batteries.html",
  "/locations/shepparton": "locations/shepparton.html",
  "/locations/shepparton/solar-panels": "locations/shepparton/solar-panels.html",
  "/locations/shepparton/home-batteries": "locations/shepparton/home-batteries.html",
  "/robots.txt": "robots.txt",
  "/sitemap.xml": "sitemap.xml",
};

async function render(path, expected) {
  const res = await handler.fetch(new Request(origin + path), {}, {});
  if (res.status !== expected) throw new Error(`${path}: expected ${expected}, got ${res.status}`);
  return res.text();
}

for (const [path, file] of Object.entries(files)) {
  const body = await render(path, 200);
  const target = join(out, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body);
  console.log(`prerendered ${path} -> ${file} (${body.length} bytes)`);
}

const notFound = (await render("/this-page-does-not-exist", 404))
  // The 404 page is served for any unknown URL, so the router's embedded state would never match: ship it static.
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
  .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow"/>')
  .replace(/<title>[\s\S]*?<\/title>/, "<title>Page not found · Clean Energy Solutions</title>");
await writeFile(join(out, "404.html"), notFound);
console.log("prerendered 404.html");
