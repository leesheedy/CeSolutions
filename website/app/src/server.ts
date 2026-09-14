import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { applySecurityHeaders } from "./lib/security-headers.server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const redirects: Record<string,string> = {'/solar-systems/solar-systems-info/':'/solar','/heat-pumps/benefits-of-batteries/':'/batteries','/battery-systems/benefits-of-batteries/':'/batteries','/contact-us/contact-ces/':'/contact','/contact-us/':'/contact','/clean-energy-solutions-book-online/':'/about','/faq/':'/#faq','/ces-home-page/':'/'};
      if (redirects[url.pathname]) return Response.redirect(new URL(redirects[url.pathname],url.origin),301);
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const secured = applySecurityHeaders(await normalizeCatastrophicSsrResponse(response));
      if (!['cesolutions.com.au','www.cesolutions.com.au'].includes(url.hostname)) secured.headers.set('X-Robots-Tag','noindex, nofollow');
      return secured;
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
