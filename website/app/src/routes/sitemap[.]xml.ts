import {createFileRoute} from '@tanstack/react-router';
// lastmod is the date of the last content change; bump it when the copy on a page changes.
const LASTMOD='2026-10-05';
const pages:[string,string][]=[['/','1.0'],['/solar','0.9'],['/batteries','0.9'],['/commercial-solar','0.9'],['/contact','0.8'],['/about','0.7'],['/locations/wagga-wagga','0.7'],['/locations/shepparton','0.7'],['/locations/yarrawonga','0.7'],['/privacy','0.2']];
export const Route=createFileRoute('/sitemap.xml')({server:{handlers:{GET:async()=>new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(([p,priority])=>'<url><loc>https://cesolutions.com.au'+p+'</loc><lastmod>'+LASTMOD+'</lastmod><priority>'+priority+'</priority></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}})}}});
