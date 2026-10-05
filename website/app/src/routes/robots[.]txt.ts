import {createFileRoute} from '@tanstack/react-router';
// Search crawlers and AI answer engines are both welcome: the site wants to be the cited source when someone
// asks an assistant about solar in Albury-Wodonga. Named explicitly so the intent survives a future edit.
const AI=['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-SearchBot','Claude-User','PerplexityBot','Perplexity-User','Google-Extended','Applebot-Extended','CCBot'];
const PROD=['User-agent: *','Allow: /','Disallow: /app','',...AI.flatMap(a=>['User-agent: '+a,'Allow: /','Disallow: /app','']),'Sitemap: https://cesolutions.com.au/sitemap.xml','# Plain-text summary for AI assistants: https://cesolutions.com.au/llms.txt',''].join('\n');
const PREVIEW=['User-agent: *','Allow: /','# Preview responses carry X-Robots-Tag: noindex to avoid duplicate search listings.'].join('\n');
export const Route=createFileRoute('/robots.txt')({server:{handlers:{GET:async({request})=>{const u=new URL(request.url);const prod=['cesolutions.com.au','www.cesolutions.com.au'].includes(u.hostname);return new Response(prod?PROD:PREVIEW,{headers:{'Content-Type':'text/plain; charset=utf-8'}});}}}});
