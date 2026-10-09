// Emails the enquirer a short "what to send us" checklist with a personal upload link, and tells the team it
// went out. Called from the enquiry form's third step. The request is remembered (netlify/lib/checklist.mjs) so
// checklist-reminders.mjs can follow up and checklist-link.mjs can stop that.
// Sends through Resend (https://resend.com) when RESEND_API_KEY and CHECKLIST_FROM are set on the Netlify
// project; otherwise answers {ok:false, reason:'unconfigured'} and the form falls back to telling the team.
// Guard rails so this cannot be used as an open relay: same-site Origin only, rate-limited per IP, the
// service list is matched against the form's own values, and nothing from the request is used unescaped.
import {create,forget,openStore,renderChecklist,renderTeamNotice,sendEmail,sender,teamRecipients} from '../lib/checklist.mjs';

const REPLY_TO=process.env.CHECKLIST_REPLY_TO||'info@cesolutions.com.au';
const ALLOWED_ORIGIN=/^https:\/\/(www\.)?cesolutions\.com\.au$|^https:\/\/[a-z0-9-]+\.netlify\.app$|^https:\/\/cesolutions\.automatrix\.au$/;
const SERVICES=new Set(['Solar panels','Solar + battery','Home battery','EV charger','Hot water heat pump','Air conditioning','Commercial solar','Not sure yet']);

export default async(req)=>{
  if(req.method!=='POST')return Response.json({ok:false,reason:'method'},{status:405});
  const origin=req.headers.get('origin')||'';
  if(!ALLOWED_ORIGIN.test(origin))return Response.json({ok:false,reason:'origin'},{status:403});
  let body;try{body=await req.json();}catch{return Response.json({ok:false,reason:'body'},{status:400});}
  const email=String(body.email||'').trim(),name=String(body.name||'').trim().slice(0,100).replace(/[\r\n<>]/g,'');
  const services=Array.isArray(body.services)?body.services.map(String).filter(s=>SERVICES.has(s)).slice(0,8):[];
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)return Response.json({ok:false,reason:'email'},{status:400});
  const key=process.env.RESEND_API_KEY,from=sender();
  if(!key||!from)return Response.json({ok:false,reason:'unconfigured'},{status:200});

  // If the store is unavailable the checklist still goes out, just without an upload link or reminders.
  let store=null,token=null;
  try{store=openStore();token=await create(store,{email,name,services});}catch(err){console.error('checklist store',err);token=null;}
  const m=renderChecklist(name,services,token);
  if(!await sendEmail(key,{from,to:[email],reply_to:REPLY_TO,subject:m.subject,text:m.text,html:m.html})){
    if(token)await forget(store,token).catch(()=>{});
    return Response.json({ok:false,reason:'send'},{status:502});
  }
  // The customer has their email; a failed team notice must not turn that into an error on their screen.
  if(token){const n=renderTeamNotice({email,name,services},token);await sendEmail(key,{from,to:teamRecipients(),reply_to:email,subject:n.subject,text:n.text,html:n.html}).catch(err=>console.error('team notice',err));}
  return Response.json({ok:true});
};

// Netlify rate limiting: five requests per IP per minute is plenty for a human clicking a button.
export const config={path:'/api/send-checklist',rateLimit:{windowLimit:5,windowSize:60,aggregateBy:['ip']}};
