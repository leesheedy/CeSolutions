// The links in the checklist emails that are not the upload page.
//   GET  ?t=<token>&a=info      JSON for the upload page: is this link known, and who to greet
//   GET  ?t=<token>&a=stop      (team) confirmation page for "Stop reminders"
//   GET  ?t=<token>&a=decline   (customer) confirmation page for "No thanks"
//   POST t, a                   does it
// Opening a link only shows a page with a button: mail scanners follow every link in an email, so nothing may
// change on a GET. The token is the only credential; it is random, unguessable and reveals a first name at most.
import {close,load,openStore,uploadUrl,validToken} from '../lib/checklist.mjs';
import {C,FONT,OFFICE,OFFICE_HREF,esc} from '../lib/email.mjs';

const ACTIONS={
  stop:{status:'stopped',title:'Stop reminders for this customer?',lead:r=>`${r.name||'This customer'} (${r.email}) will get no more checklist reminders. Their upload link keeps working.`,cta:'Stop reminders',done:'Reminders stopped.',after:()=>'No more reminder emails will go to this customer.'},
  decline:{status:'declined',title:'Stop these reminder emails?',lead:()=>'We won’t email you about the checklist again. You can still send us your bill and photos whenever you like.',cta:'Yes, stop the emails',done:'Done. No more reminders.',after:()=>`Changed your mind later? Call us on ${OFFICE} or reply to any of our emails.`}};

const page=(title,body,status=200)=>new Response(`<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)} | Clean Energy Solutions</title></head>
<body style="margin:0;background:${C.stone};font:400 17px/1.6 ${FONT};color:${C.ink}"><div style="max-width:520px;margin:0 auto;padding:48px 18px">
<div style="background:#fff;border:1px solid ${C.line};border-radius:20px;overflow:hidden"><div style="background:${C.night};padding:20px 28px"><img src="/assets/email/logo.png" width="176" height="50" alt="Clean Energy Solutions" style="display:block;height:auto"></div>
<div style="padding:28px"><h1 style="margin:0 0 12px;font:700 26px/1.2 ${FONT};letter-spacing:-.02em">${esc(title)}</h1>${body}</div></div>
<p style="margin:18px 0 0;font-size:14px;color:${C.muted}">Clean Energy Solutions · 79 Elgin Boulevard, Wodonga VIC 3690 · <a href="${OFFICE_HREF}" style="color:${C.brand}">${OFFICE}</a></p></div></body></html>`,{status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
const para=t=>`<p style="margin:0 0 16px;color:${C.muted}">${esc(t)}</p>`;
const btn=(label,solid=true)=>`display:inline-block;padding:14px 22px;border-radius:999px;font:600 16px/1 ${FONT};text-decoration:none;cursor:pointer;${solid?`background:${C.brand};color:#fff;border:1.5px solid ${C.brand}`:`background:#fff;color:${C.ink};border:1.5px solid #C7D0CB`}`;
const unknown=()=>page('This link has expired','<p style="margin:0;color:'+C.muted+'">We couldn’t find that request. If you need a hand, call us on <a href="'+OFFICE_HREF+'" style="color:'+C.brand+'">'+OFFICE+'</a>.</p>',404);

export default async(req)=>{
  const url=new URL(req.url);
  let t=url.searchParams.get('t')||'',a=url.searchParams.get('a')||'';
  if(req.method==='POST'){const f=await req.formData().catch(()=>null);t=String(f?.get('t')||'');a=String(f?.get('a')||'');}
  else if(req.method!=='GET')return new Response('Method not allowed',{status:405});
  if(a==='info'){
    if(!validToken(t))return Response.json({ok:false},{status:404,headers:{'Cache-Control':'no-store'}});
    const rec=await load(openStore(),t);
    return Response.json(rec?{ok:true,first:(String(rec.name||'').trim().split(/\s+/)[0]||'').slice(0,40),status:rec.status}:{ok:false},{status:rec?200:404,headers:{'Cache-Control':'no-store'}});
  }
  const act=ACTIONS[a];
  if(!act||!validToken(t))return unknown();
  const store=openStore();
  if(req.method==='GET'){
    const rec=await load(store,t);
    if(!rec)return unknown();
    if(rec.status!=='open')return page('Reminders are already off',para(rec.status==='uploaded'?'The files have been sent, so there is nothing left to remind anyone about.':'No more checklist reminders will be sent for this request.'));
    return page(act.title,`${para(act.lead(rec))}<form method="POST" action="/api/checklist-link" style="margin:0"><input type="hidden" name="t" value="${esc(t)}"><input type="hidden" name="a" value="${esc(a)}"><button type="submit" style="${btn()}">${esc(act.cta)}</button></form>`);
  }
  const rec=await close(store,t,act.status);
  if(!rec)return unknown();
  return page(act.done,para(act.after(rec))+(a==='decline'?`<a href="${esc(uploadUrl(t))}" style="${btn('',false)}">Send my bill and photos instead</a>`:''));
};

export const config={path:'/api/checklist-link',rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip']}};
