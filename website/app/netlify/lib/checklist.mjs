// The "what to send us" checklist: who was sent one, their personal upload link, and the emails around it.
//
// Each request is remembered in Netlify Blobs (store "checklist") so the site can follow up:
//   t/<token>        {email,name,services,sentAt,reminders,lastReminderAt,status}
//   email/<sha256>   the newest token for that address, so a second request replaces the first
// status: open (reminders may go out) | uploaded | stopped (the team) | declined (the customer) | done (both
// reminders sent) | replaced (they asked again). Only "open" records are ever reminded.
//
// The store is site-wide, so deploy previews share it with production. Do not test against it from a preview.
import {getStore} from '@netlify/blobs';
import {createHash,randomBytes} from 'node:crypto';
import {C,FONT,OFFICE,OFFICE_HREF,REVIEWS,SITE,button,esc,review,shell,steps} from './email.mjs';

export const REMINDER_DAYS=[2,6];
export const ITEMS=[
  ['A recent power bill','A photo or PDF of your latest bill (all pages if you can). It tells us how much power you use and when, which sets the system size.'],
  ['Your roof','A photo from the street or the backyard showing the roof. A screenshot of your house on Google Maps satellite view works well too.'],
  ['Your meter box','Open the lid and take one photo of the inside so we can see the switchboard.'],
  ['Where a battery could go','If you are thinking about a battery: a photo of the wall near the meter box or garage where it might sit, and anything in the way.']];

/* ── storage ─────────────────────────────────────────────────────────────────────────────────────────── */
export const openStore=()=>getStore({name:'checklist',consistency:'strong'});
export const validToken=t=>typeof t==='string'&&/^[a-f0-9]{32}$/.test(t);
const tokenKey=t=>'t/'+t;
const emailKey=e=>'email/'+createHash('sha256').update(e.trim().toLowerCase()).digest('hex');
export const uploadUrl=t=>`${SITE}/upload?t=${t}`;
export const actionUrl=(t,a)=>`${SITE}/api/checklist-link?t=${t}&a=${a}`;

export async function load(store,token){return validToken(token)?store.get(tokenKey(token),{type:'json'}):null;}
/** Remember a new request and retire any earlier one for the same address. Returns the token. */
export async function create(store,{email,name,services}){
  const token=randomBytes(16).toString('hex'),ek=emailKey(email);
  const previous=await store.get(ek);
  if(validToken(previous))await close(store,previous,'replaced');
  await store.setJSON(tokenKey(token),{email,name,services,sentAt:Date.now(),reminders:0,lastReminderAt:0,status:'open'});
  await store.set(ek,token);
  return token;
}
/** Stop reminders for a request that is still open. Returns the record, or null when the token is unknown. */
export async function close(store,token,status){
  const rec=await load(store,token);
  if(!rec)return null;
  if(rec.status==='open'){rec.status=status;rec.closedAt=Date.now();await store.setJSON(tokenKey(token),rec);}
  return rec;
}
export async function forget(store,token){
  const rec=await load(store,token);
  await store.delete(tokenKey(token));
  if(rec&&await store.get(emailKey(rec.email))===token)await store.delete(emailKey(rec.email));
}
/** Every stored request with its token and etag, for the reminder run. */
export async function all(store){
  const {blobs}=await store.list({prefix:'t/'});
  const out=[];
  for(const b of blobs){const r=await store.getWithMetadata(b.key,{type:'json'});if(r?.data)out.push({token:b.key.slice(2),rec:r.data,etag:r.etag});}
  return out;
}
const DAY=86_400_000,KEEP_DAYS=90;
/** What the reminder run should do with one record at time `now`: 'forget' it (older than KEEP_DAYS), 'skip' it,
 * 'finish' it (nothing left to send), or send reminder number {remind:n}. A reminder is due once the request is
 * old enough and never within two days of the previous one, which also covers a run that was missed. */
export function nextStep(rec,now){
  const age=now-rec.sentAt;
  if(age>KEEP_DAYS*DAY)return 'forget';
  if(rec.status!=='open')return 'skip';
  const n=rec.reminders+1;
  if(n>REMINDER_DAYS.length)return 'finish';
  if(age<REMINDER_DAYS[n-1]*DAY||now-rec.lastReminderAt<2*DAY)return 'skip';
  return {remind:n};
}
/** Write back only if nobody changed the record since it was read, so a stop that lands mid-run is not undone. */
export async function saveIfUnchanged(store,token,rec,etag){return (await store.setJSON(tokenKey(token),rec,{onlyIfMatch:etag})).modified;}

/* ── emails ──────────────────────────────────────────────────────────────────────────────────────────── */
const firstName=name=>(String(name||'').trim().split(/\s+/)[0]||'there').slice(0,40);
const p=(html,style='')=>`<p style="margin:0 0 14px;${style}">${html}</p>`;
const uploadBlock=token=>token?`${button(uploadUrl(token),'Upload your bill and photos',true)}
  <p style="margin:6px 0 0;font:400 14.5px/1.55 ${FONT};color:${C.muted}">Opens a page with four slots. Add whatever you have and press send. Prefer email? Just reply to this message with the files attached.</p>`:'';

/** The first email: the list of four things and the personal upload link. */
export function renderChecklist(name,services,token){
  const first=firstName(name),subject='What to send us for your solar quote';
  const interest=services.length?`You asked about: ${services.join(', ')}.`:'';
  const text=[`Hi ${first},`,'',`Thanks for getting in touch with Clean Energy Solutions. ${interest}`.trim(),'','To put a real number on your quote, send us any of the following (whatever you have handy is fine):','',...ITEMS.map(([t,d],i)=>`${i+1}. ${t}\n   ${d}`),'',token?`Upload them here: ${uploadUrl(token)}`:'',`Or reply to this email with the photos attached, or call us on ${OFFICE} and we will talk it through.`,'','The CES team','Clean Energy Solutions · 79 Elgin Boulevard, Wodonga VIC 3690'].filter((l,i,a)=>l!==''||a[i-1]!=='').join('\n');
  const rows=`<tr><td style="padding:28px 28px 6px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <h1 style="margin:0 0 12px;font:700 26px/1.2 ${FONT};color:${C.ink};letter-spacing:-.02em">Hi ${esc(first)}, here’s what to send us.</h1>
  <p style="margin:0 0 6px">Thanks for getting in touch. ${esc(interest)}</p>
  <p style="margin:0">Four things let us design your system and give you a real price. Send whatever you have handy.</p>
</td></tr>
<tr><td style="padding:14px 28px 6px">${steps(ITEMS)}</td></tr>
<tr><td style="padding:10px 28px 24px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <div style="padding-top:20px;border-top:1px solid ${C.line}">${token?uploadBlock(token):p('<strong>Just hit reply and attach the photos.</strong>')}</div>
  <p style="margin:18px 0 12px">We come back with a design, expected savings and clear pricing within one business day.</p>
  ${button(OFFICE_HREF,'Call '+OFFICE,!token)}
</td></tr>
${review(REVIEWS.quote)}`;
  const html=shell({title:subject,preheader:'Four things that help us quote, and a link to send them.',hero:'ces-roof-sunset-hills.jpg',heroAlt:'Solar panels installed by Clean Energy Solutions on a shed roof at sunset',rows,note:'You asked for this list on the Clean Energy Solutions website.',width:560});
  return {subject,html,text};
}

/** Reminder `n` of REMINDER_DAYS.length (1-based). Short, with the upload link and a way out. */
export function renderReminder(rec,token,n){
  const first=firstName(rec.name),last=n>=REMINDER_DAYS.length;
  const subject=last?'Last reminder: what to send us for your solar quote':'Still keen on a solar quote? Here’s your upload link';
  const lead=last?'This is the last reminder we’ll send. If you’d still like a quote, your upload link is below and it only takes a couple of minutes.':'A couple of days ago you asked what to send us for your solar quote. Whenever you’re ready, your upload link is below.';
  const text=[`Hi ${first},`,'',lead,'','What helps us quote:',...ITEMS.map(([t],i)=>`${i+1}. ${t}`),'',`Upload them here: ${uploadUrl(token)}`,`Or reply to this email with the files attached, or call us on ${OFFICE}.`,'',`Not going ahead? Stop these emails: ${actionUrl(token,'decline')}`,'','The CES team','Clean Energy Solutions · 79 Elgin Boulevard, Wodonga VIC 3690'].join('\n');
  const rows=`<tr><td style="padding:28px 28px 6px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <h1 style="margin:0 0 12px;font:700 26px/1.2 ${FONT};color:${C.ink};letter-spacing:-.02em">${last?`Hi ${esc(first)}, one last nudge.`:`Hi ${esc(first)}, still keen on a quote?`}</h1>
  <p style="margin:0">${esc(lead)}</p>
</td></tr>
<tr><td style="padding:14px 28px 6px">${steps(ITEMS.map(([t])=>[t,'']))}</td></tr>
<tr><td style="padding:10px 28px 24px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <div style="padding-top:20px;border-top:1px solid ${C.line}">${uploadBlock(token)}</div>
  <p style="margin:20px 0 0;font:400 14.5px/1.55 ${FONT};color:${C.muted}">Not going ahead, or already sorted? <a href="${esc(actionUrl(token,'decline'))}" style="color:${C.brand};font-weight:600;text-decoration:underline">No thanks, stop these emails</a>.${last?'':' Otherwise we’ll send one more reminder in a few days, then stop.'}</p>
</td></tr>
${review(last?REVIEWS.service:REVIEWS.install)}`;
  const html=shell({title:subject,preheader:last?'Your upload link, one last time.':'Your upload link, whenever you’re ready.',rows,note:'You’re getting this because you asked for the checklist on the Clean Energy Solutions website.',width:560});
  return {subject,html,text};
}

/** To the team when a checklist goes out: who asked, when the reminders are due, and the button that stops them. */
export function renderTeamNotice(rec,token){
  const name=rec.name||'Someone',subject=`Checklist sent: ${name} · ${rec.email}`;
  const text=[`The website emailed the "what to send us" checklist to ${name} <${rec.email}>.`,rec.services.length?'Interested in: '+rec.services.join(', '):'','',`They get reminders on day ${REMINDER_DAYS.join(' and day ')} unless they upload through their link.`,`If they have replied by email or phoned, stop the reminders: ${actionUrl(token,'stop')}`].filter((l,i)=>l!==''||i===2).join('\n');
  const chips=rec.services.map(s=>`<span style="display:inline-block;margin:0 6px 6px 0;padding:7px 13px;border-radius:999px;background:${C.tint};color:${C.brand};font:600 14px/1 ${FONT}">${esc(s)}</span>`).join('');
  const rows=`<tr><td style="padding:28px 28px 26px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <h1 style="margin:0 0 6px;font:700 26px/1.2 ${FONT};color:${C.ink};letter-spacing:-.02em">${esc(name)}</h1>
  <p style="margin:0 0 14px"><a href="mailto:${esc(rec.email)}" style="color:${C.brand};text-decoration:underline">${esc(rec.email)}</a></p>
  ${chips?`<div style="margin:0 0 10px">${chips}</div>`:''}
  ${p('They asked for the list of what to send us, and the website has emailed it with a personal upload link. Anything they upload arrives here as a separate email.')}
  ${p(`<strong>Reminders:</strong> day ${REMINDER_DAYS.join(' and day ')}, then it stops. Uploading through the link stops them automatically.`)}
  <div style="margin-top:18px;padding:18px 20px;border-radius:16px;background:${C.stone}">
    <p style="margin:0 0 12px;font:400 15px/1.55 ${FONT};color:${C.ink}"><strong>Already heard from them?</strong> The website cannot see replies to info@ or phone calls, so stop the reminders here.</p>
    ${button(actionUrl(token,'stop'),'Stop reminders',true)}
  </div>
</td></tr>`;
  const html=shell({title:subject,preheader:`Reminders on day ${REMINDER_DAYS.join(' and day ')} unless stopped.`,tag:'Checklist sent',rows,note:'Sent by the Clean Energy Solutions website when a visitor asks for the checklist.'});
  return {subject,html,text};
}

export async function sendEmail(key,body){
  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!res.ok)console.error('resend',res.status,await res.text());
  return res.ok;
}
export const teamRecipients=()=>(process.env.ENQUIRY_TO||'it@cesolutions.com.au').split(',').map(s=>s.trim()).filter(Boolean);
export const sender=()=>{const s=process.env.CHECKLIST_FROM||process.env.ENQUIRY_FROM||'';return !s||s.includes('<')?s:`Clean Energy Solutions <${s.trim()}>`;};
