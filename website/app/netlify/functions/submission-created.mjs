// Runs automatically whenever Netlify verifies a form submission (the file name is the trigger) and emails the
// team a readable version of the enquiry: who it is, what they want, one-tap call / reply / map buttons, the
// attached bill and photos as buttons (with a thumbnail for images), and nothing for the fields left empty.
// It also emails the team the files sent through a checklist upload link, and closes that checklist request.
//
// Netlify's own notification email cannot be styled, which is why this exists. It sends through Resend
// (https://resend.com) and stays silent until these are set on the Netlify project:
//   RESEND_API_KEY   the Resend key
//   ENQUIRY_FROM     a sender on a domain verified in Resend, e.g. "CES website <enquiries@cesolutions.com.au>"
//   ENQUIRY_TO       who receives enquiries, comma-separated (defaults to it@cesolutions.com.au)
//   ENQUIRY_ACK      set to "on" to also send the customer a short "we've got it" email
// Until then nothing breaks: the submission is still stored and Netlify's plain notification still goes out.
import {C,FONT,OFFICE,OFFICE_HREF,REVIEWS,button,esc,review,shell,steps} from '../lib/email.mjs';
import {close,openStore} from '../lib/checklist.mjs';

const FILES=[['bill','Power bill'],['roof_photo','Roof photo'],['meter_photo','Meter box'],['battery_photo','Battery location']];
const clean=s=>String(s??'').trim();
const tel=s=>'tel:'+clean(s).replace(/[^0-9+]/g,'');
const list=v=>(Array.isArray(v)?v:clean(v).split(/,\s*/)).map(clean).filter(Boolean);
const fileOf=v=>v&&typeof v==='object'&&v.url?{url:v.url,name:v.filename||'file',size:v.size}:typeof v==='string'&&/^https?:\/\//.test(v)?{url:v,name:'file'}:null;
const isImage=f=>/\.(jpe?g|png|gif)$/i.test(f.name);
const kb=n=>!n?'':n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
const row=(label,value)=>`<tr><td style="padding:12px 0;border-top:1px solid ${C.line};width:128px;vertical-align:top;font:600 14px/1.45 ${FONT};color:${C.muted}">${esc(label)}</td><td style="padding:12px 0;border-top:1px solid ${C.line};vertical-align:top;font:400 16px/1.45 ${FONT};color:${C.ink}">${value}</td></tr>`;

const fileCard=([label,f])=>`<a href="${esc(f.url)}" style="display:block;margin:0 0 8px;padding:12px 14px;border-radius:14px;border:1.5px solid ${C.line};text-decoration:none"><table role="presentation" cellpadding="0" cellspacing="0"><tr>${isImage(f)?`<td style="padding-right:14px;vertical-align:middle"><img src="${esc(f.url)}" width="64" height="64" alt="" style="display:block;width:64px;height:64px;border-radius:10px;object-fit:cover;border:0"></td>`:''}<td style="vertical-align:middle"><span style="display:block;font:600 15px/1.3 ${FONT};color:${C.ink}">${esc(label)}</span><span style="display:block;font:400 13px/1.4 ${FONT};color:${C.muted}">${esc(f.name)}${f.size?' · '+kb(f.size):''} · Open</span></td></tr></table></a>`;

/** Builds the team email. Exported so it can be previewed without sending anything. */
export function renderEnquiry(d,meta={}){
  const name=clean(d.name)||'Someone',phone=clean(d.phone),email=clean(d.email),address=clean(d.address),message=clean(d.message);
  const services=list(d.services),files=FILES.map(([k,label])=>[label,fileOf(d[k])]).filter(([,f])=>f);
  const place=[clean(d.suburb),clean(d.state)].filter(Boolean).join(' ');
  const subject=`New enquiry: ${name}${services.length?' · '+services.join(', '):''}${place?' · '+place:''}`;
  const map=address?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address):'';
  const chips=services.map(s=>`<span style="display:inline-block;margin:0 6px 6px 0;padding:7px 13px;border-radius:999px;background:${C.tint};color:${C.brand};font:600 14px/1 ${FONT}">${esc(s)}</span>`).join('');
  const rows=[
    phone&&row('Phone',`<a href="${esc(tel(phone))}" style="color:${C.ink};font-weight:600;text-decoration:none">${esc(phone)}</a>`),
    email&&row('Email',`<a href="mailto:${esc(email)}" style="color:${C.brand};text-decoration:underline">${esc(email)}</a>`),
    address&&row('Address',`${esc(address)}${map?`<br><a href="${esc(map)}" style="color:${C.brand};font-size:14px;text-decoration:underline">Open in Google Maps</a>`:''}`),
    row('Attachments',files.length?files.map(([label])=>esc(label)).join(', '):`<span style="color:${C.muted}">None sent. Ask for a recent bill.</span>`)
  ].filter(Boolean).join('');
  const when=meta.created_at?new Date(meta.created_at).toLocaleString('en-AU',{timeZone:'Australia/Melbourne',weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'';
  const body=`<tr><td style="padding:28px 28px 8px">
  ${when?`<p style="margin:0 0 6px;font:500 13px/1.4 ${FONT};color:${C.muted}">${esc(when)}</p>`:''}
  <h1 style="margin:0 0 14px;font:700 28px/1.15 ${FONT};color:${C.ink};letter-spacing:-.02em">${esc(name)}</h1>
  ${chips?`<div style="margin:0 0 14px">${chips}</div>`:''}
  <div style="margin:6px 0 4px">${phone?button(tel(phone),'Call '+phone,true):''}${email?button('mailto:'+email+'?subject='+encodeURIComponent('Your solar quote from Clean Energy Solutions'),'Reply by email'):''}${map?button(map,'Open map'):''}</div>
</td></tr>
${message?`<tr><td style="padding:8px 28px 4px"><div style="padding:16px 18px;border-radius:14px;background:${C.stone};font:400 16px/1.55 ${FONT};color:${C.ink};white-space:pre-wrap">${esc(message)}</div></td></tr>`:''}
<tr><td style="padding:14px 28px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
${files.length?`<tr><td style="padding:6px 28px 10px"><p style="margin:10px 0 10px;font:700 15px/1.3 ${FONT};color:${C.ink}">Files they sent</p>${files.map(fileCard).join('')}</td></tr>`:''}
<tr><td style="padding:18px 28px 26px"><p style="margin:0;padding-top:18px;border-top:1px solid ${C.line};font:400 13px/1.55 ${FONT};color:${C.muted}">The site promises a reply within one business day. Replying to this email goes straight to ${esc(email||'the customer')}.</p></td></tr>`;
  const html=shell({title:subject,preheader:[services.join(', '),phone,place].filter(Boolean).join(' · '),tag:'New website enquiry',rows:body,note:'Sent from the enquiry form on the Clean Energy Solutions website.'});
  const text=[`New website enquiry: ${name}`,when,'',services.length?'Interested in: '+services.join(', '):'',phone?'Phone: '+phone:'',email?'Email: '+email:'',address?'Address: '+address:'',message?'\nMessage:\n'+message:'',files.length?'\nFiles:\n'+files.map(([l,f])=>`- ${l}: ${f.url}`).join('\n'):'\nNo files sent.'].filter(Boolean).join('\n');
  return {subject,html,text,email,name};
}

const NEXT=[
  ['We read your enquiry','Our solar consultant calls or emails within one business day.'],
  ['We design your system','From your power bill, with a visit if the roof or switchboard needs a look.'],
  ['You get a clear price','A design, expected savings and pricing in writing. Then it’s your call.']];
/** The optional acknowledgement to the customer: what happens next, and no promises beyond what the site makes. */
export function renderAck(d){
  const first=(clean(d.name).split(/\s+/)[0]||'there').slice(0,40);
  const body=`<tr><td style="padding:28px 28px 6px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <h1 style="margin:0 0 12px;font:700 26px/1.2 ${FONT};color:${C.ink};letter-spacing:-.02em">Thanks, ${esc(first)}. We’ve got it.</h1>
  <p style="margin:0">Your enquiry is with our team in Wodonga. Here’s what happens next.</p>
</td></tr>
<tr><td style="padding:14px 28px 6px">${steps(NEXT)}</td></tr>
<tr><td style="padding:10px 28px 24px;font:400 16px/1.6 ${FONT};color:${C.ink}">
  <p style="margin:0 0 16px;padding-top:18px;border-top:1px solid ${C.line}"><strong>Want to speed it up?</strong> Reply to this email with a photo of a recent power bill. It’s what we design your system from.</p>
  ${button(OFFICE_HREF,'Call '+OFFICE,true)}
</td></tr>
${review(REVIEWS.install)}`;
  const html=shell({title:'We’ve got your enquiry',preheader:'Our solar consultant will be in touch within one business day.',hero:'ces-install-crew-roof.jpg',heroAlt:'Two Clean Energy Solutions installers fitting solar panels on a roof',rows:body,note:'You’re getting this because you sent an enquiry through the Clean Energy Solutions website.',width:560});
  const text=`Thanks, ${first}. We've got it.\n\nYour enquiry is with our team in Wodonga. What happens next:\n\n${NEXT.map(([t,b],i)=>`${i+1}. ${t}\n   ${b}`).join('\n')}\n\nWant to speed it up? Reply to this email with a photo of a recent power bill.\n\nClean Energy Solutions\n${OFFICE}\n79 Elgin Boulevard, Wodonga VIC 3690`;
  return {subject:'We’ve got your enquiry | Clean Energy Solutions',html,text};
}

async function send(key,body){
  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!res.ok)console.error('resend',res.status,await res.text());
  return res.ok;
}

/** Team email for files sent through a checklist upload link (the `checklist-upload` form). `rec` is the stored
 * checklist request the link belongs to, or null when the link's reference was missing or unknown. */
export function renderUpload(d,rec,meta={}){
  const files=FILES.map(([k,label])=>[label,fileOf(d[k])]).filter(([,f])=>f);
  const name=clean(rec?.name)||'Someone',email=clean(rec?.email),services=rec?.services||[];
  const subject=`Checklist files: ${name}${files.length?' · '+files.map(([l])=>l).join(', '):''}`;
  const when=meta.created_at?new Date(meta.created_at).toLocaleString('en-AU',{timeZone:'Australia/Melbourne',weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'';
  const chips=services.map(s=>`<span style="display:inline-block;margin:0 6px 6px 0;padding:7px 13px;border-radius:999px;background:${C.tint};color:${C.brand};font:600 14px/1 ${FONT}">${esc(s)}</span>`).join('');
  const missing=FILES.map(([,label])=>label).filter(l=>!files.some(([x])=>x===l));
  const body=`<tr><td style="padding:28px 28px 8px">
  ${when?`<p style="margin:0 0 6px;font:500 13px/1.4 ${FONT};color:${C.muted}">${esc(when)}</p>`:''}
  <h1 style="margin:0 0 14px;font:700 28px/1.15 ${FONT};color:${C.ink};letter-spacing:-.02em">${esc(name)}</h1>
  ${chips?`<div style="margin:0 0 14px">${chips}</div>`:''}
  <p style="margin:0 0 10px;font:400 16px/1.55 ${FONT};color:${C.ink}">${rec?'Sent through their checklist upload link. Their reminders have stopped.':'These came through a checklist upload link the website could not match to a request, so check the files to see whose they are.'}</p>
  ${email?`<div style="margin:6px 0 4px">${button('mailto:'+email+'?subject='+encodeURIComponent('Your solar quote from Clean Energy Solutions'),'Reply by email',true)}</div>`:''}
</td></tr>
<tr><td style="padding:6px 28px 10px"><p style="margin:10px 0 10px;font:700 15px/1.3 ${FONT};color:${C.ink}">Files they sent</p>${files.map(fileCard).join('')}</td></tr>
<tr><td style="padding:8px 28px 26px"><p style="margin:0;padding-top:18px;border-top:1px solid ${C.line};font:400 13px/1.55 ${FONT};color:${C.muted}">${missing.length?'Not sent: '+esc(missing.join(', '))+'. ':''}${email?'Replying to this email goes straight to '+esc(email)+'.':''}</p></td></tr>`;
  const html=shell({title:subject,preheader:files.map(([l])=>l).join(', '),tag:'Checklist files',rows:body,note:'Sent from a checklist upload link on the Clean Energy Solutions website.'});
  const text=[`Checklist files from ${name}${email?' <'+email+'>':''}`,when,'',...files.map(([l,f])=>`- ${l}: ${f.url}`),missing.length?'\nNot sent: '+missing.join(', '):''].filter(Boolean).join('\n');
  return {subject,html,text,email,count:files.length};
}

// Modern handler (Request in, Response out): the checklist store is only reachable from this runtime.
const reply=(body,status=200)=>new Response(body,{status});
export default async(req)=>{
  let payload;try{payload=(await req.json()).payload;}catch{return reply('bad payload',400);}
  if(!payload||!['enquiry','checklist-upload'].includes(payload.form_name))return reply('ignored');
  const key=process.env.RESEND_API_KEY,sender=process.env.ENQUIRY_FROM||process.env.CHECKLIST_FROM;
  if(!key||!sender)return reply('unconfigured');
  // A bare address shows in inboxes as "info"; give it the business name.
  const from=sender.includes('<')?sender:`Clean Energy Solutions <${sender.trim()}>`;
  const to=(process.env.ENQUIRY_TO||'it@cesolutions.com.au').split(',').map(s=>s.trim()).filter(Boolean);
  const d=payload.data||{};
  if(payload.form_name==='checklist-upload'){
    // Uploading is what stops the reminders, so close the request before anything else can fail.
    let rec=null;
    try{rec=await close(openStore(),clean(d.ref),'uploaded');}catch(err){console.error('checklist store',err);}
    const u=renderUpload(d,rec,{created_at:payload.created_at});
    if(!u.count)return reply('no files');
    const sentOk=await send(key,{from,to,subject:u.subject,html:u.html,text:u.text,...(u.email?{reply_to:u.email}:{})});
    return sentOk?reply('sent'):reply('send failed',502);
  }
  const m=renderEnquiry(d,{created_at:payload.created_at});
  const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email);
  const ok=await send(key,{from,to,subject:m.subject,html:m.html,text:m.text,...(valid?{reply_to:m.email}:{})});
  if(ok&&valid&&process.env.ENQUIRY_ACK==='on'){const a=renderAck(d);await send(key,{from,to:[m.email],reply_to:'info@cesolutions.com.au',subject:a.subject,html:a.html,text:a.text});}
  return ok?reply('sent'):reply('send failed',502);
};
