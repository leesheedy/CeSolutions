// Emails the enquirer a short "what to send us" checklist. Called from the enquiry form's third step.
// Sends through Resend (https://resend.com) when RESEND_API_KEY and CHECKLIST_FROM are set on the Netlify
// project; otherwise answers {ok:false, reason:'unconfigured'} and the form falls back to telling the team.
// Guard rails so this cannot be used as an open relay: same-site Origin only, rate-limited per IP, the
// service list is matched against the form's own values, and nothing from the request is used unescaped.
import {C,FONT,OFFICE,OFFICE_HREF,REVIEWS,button,esc,review,shell,steps} from '../lib/email.mjs';

const SUBJECT='What to send us for your solar quote';
const REPLY_TO=process.env.CHECKLIST_REPLY_TO||'info@cesolutions.com.au';
const ALLOWED_ORIGIN=/^https:\/\/(www\.)?cesolutions\.com\.au$|^https:\/\/[a-z0-9-]+\.netlify\.app$|^https:\/\/cesolutions\.automatrix\.au$/;
const SERVICES=new Set(['Solar panels','Solar + battery','Home battery','EV charger','Hot water heat pump','Air conditioning','Commercial solar','Not sure yet']);
const ITEMS=[
  ['A recent power bill','A photo or PDF of your latest bill (all pages if you can). It tells us how much power you use and when, which sets the system size.'],
  ['Your roof','A photo from the street or the backyard showing the roof. A screenshot of your house on Google Maps satellite view works well too.'],
  ['Your meter box','Open the lid and take one photo of the inside so we can see the switchboard.'],
  ['Where a battery could go','If you are thinking about a battery: a photo of the wall near the meter box or garage where it might sit, and anything in the way.']];

/** Builds the checklist email. Exported so it can be previewed without sending anything. */
export function renderChecklist(name,services){
  const first=name.split(/\s+/)[0]||'there';
  const interest=services.length?`You asked about: ${services.join(', ')}.`:'';
  const text=[`Hi ${first},`,'',`Thanks for getting in touch with Clean Energy Solutions. ${interest}`.trim(),'','To put a real number on your quote, reply to this email with any of the following (whatever you have handy is fine):','',...ITEMS.map(([t,d],i)=>`${i+1}. ${t}\n   ${d}`),'',`Reply to this email with the photos attached, or call us on ${OFFICE} and we will talk it through.`,'','The CES team','Clean Energy Solutions · 79 Elgin Boulevard, Wodonga VIC 3690'].join('\n');
  const rows=`<tr><td style="padding:28px 28px 6px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <h1 style="margin:0 0 12px;font:700 26px/1.2 ${FONT};color:${C.ink};letter-spacing:-.02em">Hi ${esc(first)}, here’s what to send us.</h1>
  <p style="margin:0 0 6px">Thanks for getting in touch. ${esc(interest)}</p>
  <p style="margin:0">Four things let us design your system and give you a real price. Reply to this email with whatever you have handy.</p>
</td></tr>
<tr><td style="padding:14px 28px 6px">${steps(ITEMS)}</td></tr>
<tr><td style="padding:10px 28px 24px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <p style="margin:0 0 16px;padding-top:18px;border-top:1px solid ${C.line}"><strong>Just hit reply and attach the photos.</strong> We come back with a design, expected savings and clear pricing within one business day.</p>
  ${button(OFFICE_HREF,'Call '+OFFICE,true)}
</td></tr>
${review(REVIEWS.quote)}`;
  const html=shell({title:SUBJECT,preheader:'Four things that help us quote, and how to send them.',hero:'ces-roof-sunset-hills.jpg',heroAlt:'Solar panels installed by Clean Energy Solutions on a shed roof at sunset',rows,note:'You asked for this list on the Clean Energy Solutions website.',width:560});
  return {subject:SUBJECT,html,text};
}

export default async(req)=>{
  if(req.method!=='POST')return Response.json({ok:false,reason:'method'},{status:405});
  const origin=req.headers.get('origin')||'';
  if(!ALLOWED_ORIGIN.test(origin))return Response.json({ok:false,reason:'origin'},{status:403});
  let body;try{body=await req.json();}catch{return Response.json({ok:false,reason:'body'},{status:400});}
  const email=String(body.email||'').trim(),name=String(body.name||'').trim().slice(0,100).replace(/[\r\n<>]/g,'');
  const services=Array.isArray(body.services)?body.services.map(String).filter(s=>SERVICES.has(s)).slice(0,8):[];
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)return Response.json({ok:false,reason:'email'},{status:400});
  const key=process.env.RESEND_API_KEY,from=process.env.CHECKLIST_FROM;
  if(!key||!from)return Response.json({ok:false,reason:'unconfigured'},{status:200});

  const m=renderChecklist(name,services);
  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[email],reply_to:REPLY_TO,subject:m.subject,text:m.text,html:m.html})});
  if(!res.ok){console.error('resend',res.status,await res.text());return Response.json({ok:false,reason:'send'},{status:502});}
  return Response.json({ok:true});
};

// Netlify rate limiting: five requests per IP per minute is plenty for a human clicking a button.
export const config={path:'/api/send-checklist',rateLimit:{windowLimit:5,windowSize:60,aggregateBy:['ip']}};
