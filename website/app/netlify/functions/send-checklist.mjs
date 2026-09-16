// Emails the enquirer a short "what to send us" checklist. Called from the enquiry form's third step.
// Sends through Resend (https://resend.com) when RESEND_API_KEY and CHECKLIST_FROM are set on the Netlify
// project; otherwise answers {ok:false, reason:'unconfigured'} and the form falls back to telling the team.
// Guard rails so this cannot be used as an open relay: same-site Origin only, rate-limited per IP, the
// service list is matched against the form's own values, and nothing from the request is used unescaped.

const OFFICE='(02) 6021 2000';
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
  const html=`<div style="font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.6;color:#101010;max-width:560px"><p>Hi ${esc(first)},</p><p>Thanks for getting in touch with Clean Energy Solutions. ${esc(interest)}</p><p>To put a real number on your quote, reply to this email with any of the following — whatever you have handy is fine:</p><ol style="padding-left:20px">${ITEMS.map(([t,d])=>`<li style="margin-bottom:12px"><strong>${esc(t)}</strong><br><span style="color:#4a5560">${esc(d)}</span></li>`).join('')}</ol><p>Reply to this email with the photos attached, or call us on <a href="tel:+61260212000" style="color:#0089c0">${OFFICE}</a> and we will talk it through.</p><p>The CES team<br><span style="color:#4a5560">Clean Energy Solutions · 79 Elgin Boulevard, Wodonga VIC 3690</span></p></div>`;

  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[email],reply_to:REPLY_TO,subject:'What to send us for your solar quote',text,html})});
  if(!res.ok){console.error('resend',res.status,await res.text());return Response.json({ok:false,reason:'send'},{status:502});}
  return Response.json({ok:true});
};

// Netlify rate limiting: five requests per IP per minute is plenty for a human clicking a button.
export const config={path:'/api/send-checklist',rateLimit:{windowLimit:5,windowSize:60,aggregateBy:['ip']}};
