// Emails the enquirer a short "what to send us" checklist. Called from the enquiry form's third step.
// Sends through Resend (https://resend.com) when RESEND_API_KEY and CHECKLIST_FROM are set on the Netlify
// project; otherwise answers {ok:false, reason:'unconfigured'} and the form falls back to telling the team.
// Guard rails so this cannot be used as an open relay: same-site Origin only, rate-limited per IP, the
// service list is matched against the form's own values, and nothing from the request is used unescaped.

const OFFICE='(02) 6021 2000',SUBJECT='What to send us for your solar quote';
const C={night:'#0A1D2B',ink:'#0F1E29',muted:'#52616C',line:'#E1E6E3',stone:'#F3F5F2',tint:'#E7F4EC',brand:'#0B7A4E'};
const FONT="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const REPLY_TO=process.env.CHECKLIST_REPLY_TO||'info@cesolutions.com.au';
const ALLOWED_ORIGIN=/^https:\/\/(www\.)?cesolutions\.com\.au$|^https:\/\/[a-z0-9-]+\.netlify\.app$|^https:\/\/cesolutions\.automatrix\.au$/;
const SERVICES=new Set(['Solar panels','Solar + battery','Home battery','EV charger','Hot water heat pump','Air conditioning','Commercial solar','Not sure yet']);
const ITEMS=[
  ['A recent power bill','A photo or PDF of your latest bill (all pages if you can). It tells us how much power you use and when, which sets the system size.'],
  ['Your roof','A photo from the street or the backyard showing the roof. A screenshot of your house on Google Maps satellite view works well too.'],
  ['Your meter box','Open the lid and take one photo of the inside so we can see the switchboard.'],
  ['Where a battery could go','If you are thinking about a battery: a photo of the wall near the meter box or garage where it might sit, and anything in the way.']];

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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

  const first=name.split(/\s+/)[0]||'there';
  const interest=services.length?`You asked about: ${services.join(', ')}.`:'';
  const text=[`Hi ${first},`,'',`Thanks for getting in touch with Clean Energy Solutions. ${interest}`.trim(),'','To put a real number on your quote, reply to this email with any of the following (whatever you have handy is fine):','',...ITEMS.map(([t,d],i)=>`${i+1}. ${t}\n   ${d}`),'',`Reply to this email with the photos attached, or call us on ${OFFICE} and we will talk it through.`,'','The CES team','Clean Energy Solutions · 79 Elgin Boulevard, Wodonga VIC 3690'].join('\n');
  // Same look as the team's enquiry email (submission-created.mjs): table layout and inline styles, because
  // mail clients ignore stylesheets and flexbox.
  const steps=ITEMS.map(([t,d],i)=>`<tr><td style="padding:14px 0;border-top:1px solid ${C.line};width:44px;vertical-align:top"><span style="display:inline-block;width:30px;height:30px;border-radius:15px;background:${C.tint};color:${C.brand};font:700 14px/30px ${FONT};text-align:center">${i+1}</span></td><td style="padding:14px 0;border-top:1px solid ${C.line};vertical-align:top"><strong style="display:block;font:600 16px/1.35 ${FONT};color:${C.ink}">${esc(t)}</strong><span style="display:block;margin-top:3px;font:400 15px/1.5 ${FONT};color:${C.muted}">${esc(d)}</span></td></tr>`).join('');
  const html=`<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(SUBJECT)}</title></head>
<body style="margin:0;padding:0;background:${C.stone}">
<div style="display:none;max-height:0;overflow:hidden">Four things that help us quote, and how to send them.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.stone}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${C.line}">
<tr><td style="background:${C.night};padding:22px 28px;font:700 15px/1.2 ${FONT};color:#ffffff;letter-spacing:.02em">Clean Energy Solutions</td></tr>
<tr><td style="padding:28px 28px 6px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <h1 style="margin:0 0 12px;font:700 24px/1.2 ${FONT};color:${C.ink};letter-spacing:-.02em">Hi ${esc(first)}, here’s what to send us.</h1>
  <p style="margin:0 0 6px">Thanks for getting in touch. ${esc(interest)}</p>
  <p style="margin:0">Reply to this email with any of these. Whatever you have handy is fine.</p>
</td></tr>
<tr><td style="padding:14px 28px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table></td></tr>
<tr><td style="padding:10px 28px 28px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <p style="margin:0 0 16px;padding-top:18px;border-top:1px solid ${C.line}">Just hit reply and attach the photos. Prefer to talk it through?</p>
  <a href="tel:+61260212000" style="display:inline-block;padding:13px 20px;border-radius:999px;background:${C.brand};color:#ffffff;border:1.5px solid ${C.brand};font:600 15px/1 ${FONT};text-decoration:none">Call ${OFFICE}</a>
  <p style="margin:18px 0 0;font:400 14px/1.5 ${FONT};color:${C.muted}">The CES team<br>79 Elgin Boulevard, Wodonga VIC 3690</p>
</td></tr>
</table>
<p style="margin:16px 0 0;font:400 12px/1.5 ${FONT};color:${C.muted}">You asked for this list on the Clean Energy Solutions website.</p>
</td></tr></table></body></html>`;

  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[email],reply_to:REPLY_TO,subject:SUBJECT,text,html})});
  if(!res.ok){console.error('resend',res.status,await res.text());return Response.json({ok:false,reason:'send'},{status:502});}
  return Response.json({ok:true});
};

// Netlify rate limiting: five requests per IP per minute is plenty for a human clicking a button.
export const config={path:'/api/send-checklist',rateLimit:{windowLimit:5,windowSize:60,aggregateBy:['ip']}};
