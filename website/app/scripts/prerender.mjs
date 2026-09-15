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
  "/locations/wagga-wagga": "locations/wagga-wagga.html",
  "/locations/shepparton": "locations/shepparton.html",
  "/locations/yarrawonga": "locations/yarrawonga.html",
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

const notFound = await render("/this-page-does-not-exist", 404);
await writeFile(join(out, "404.html"), notFound);
console.log("prerendered 404.html");
