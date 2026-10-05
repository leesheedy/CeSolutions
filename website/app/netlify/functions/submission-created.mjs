// Runs automatically whenever Netlify verifies a form submission (the file name is the trigger) and emails the
// team a readable version of the enquiry: who it is, what they want, one-tap call / reply / map buttons, the
// attached bill and photos as buttons, and nothing for the fields that were left empty.
//
// Netlify's own notification email cannot be styled, which is why this exists. It sends through Resend
// (https://resend.com) and stays silent until these are set on the Netlify project:
//   RESEND_API_KEY   the Resend key
//   ENQUIRY_FROM     a sender on a domain verified in Resend, e.g. "CES website <enquiries@cesolutions.com.au>"
//   ENQUIRY_TO       who receives enquiries, comma-separated (defaults to it@cesolutions.com.au)
//   ENQUIRY_ACK      set to "on" to also send the customer a short "we've got it" email
// Until then nothing breaks: the submission is still stored and Netlify's plain notification still goes out.

const OFFICE='(02) 6021 2000',OFFICE_HREF='tel:+61260212000';
const C={night:'#0A1D2B',ink:'#0F1E29',muted:'#52616C',line:'#E1E6E3',stone:'#F3F5F2',tint:'#E7F4EC',brand:'#0B7A4E',mint:'#7FE3B2'};
const FONT="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const FILES=[['bill','Power bill'],['roof_photo','Roof photo'],['meter_photo','Meter box'],['battery_photo','Battery location']];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s??'').trim();
const tel=s=>'tel:'+clean(s).replace(/[^0-9+]/g,'');
const list=v=>(Array.isArray(v)?v:clean(v).split(/,\s*/)).map(clean).filter(Boolean);
const fileOf=v=>v&&typeof v==='object'&&v.url?{url:v.url,name:v.filename||'file',size:v.size}:typeof v==='string'&&/^https?:\/\//.test(v)?{url:v,name:'file'}:null;
const kb=n=>!n?'':n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
const button=(href,label,solid)=>`<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 20px;border-radius:999px;font:600 15px/1 ${FONT};text-decoration:none;${solid?`background:${C.brand};color:#ffffff;border:1.5px solid ${C.brand}`:`background:#ffffff;color:${C.ink};border:1.5px solid #C7D0CB`}">${esc(label)}</a>`;
const row=(label,value)=>`<tr><td style="padding:12px 0;border-top:1px solid ${C.line};width:128px;vertical-align:top;font:600 14px/1.45 ${FONT};color:${C.muted}">${esc(label)}</td><td style="padding:12px 0;border-top:1px solid ${C.line};vertical-align:top;font:400 16px/1.45 ${FONT};color:${C.ink}">${value}</td></tr>`;

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
  const html=`<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.stone}">
<div style="display:none;max-height:0;overflow:hidden">${esc([services.join(', '),phone,place].filter(Boolean).join(' · '))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.stone}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${C.line}">
<tr><td style="background:${C.night};padding:22px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font:700 15px/1.2 ${FONT};color:#ffffff;letter-spacing:.02em">Clean Energy Solutions</td><td align="right" style="font:600 13px/1.2 ${FONT};color:${C.mint}">New website enquiry</td></tr></table></td></tr>
<tr><td style="padding:28px 28px 8px">
  ${when?`<p style="margin:0 0 6px;font:500 13px/1.4 ${FONT};color:${C.muted}">${esc(when)}</p>`:''}
  <h1 style="margin:0 0 14px;font:700 28px/1.15 ${FONT};color:${C.ink};letter-spacing:-.02em">${esc(name)}</h1>
  ${chips?`<div style="margin:0 0 14px">${chips}</div>`:''}
  <div style="margin:6px 0 4px">${phone?button(tel(phone),'Call '+phone,true):''}${email?button('mailto:'+email+'?subject='+encodeURIComponent('Your solar quote from Clean Energy Solutions'),'Reply by email'):''}${map?button(map,'Open map'):''}</div>
</td></tr>
${message?`<tr><td style="padding:8px 28px 4px"><div style="padding:16px 18px;border-radius:14px;background:${C.stone};font:400 16px/1.55 ${FONT};color:${C.ink};white-space:pre-wrap">${esc(message)}</div></td></tr>`:''}
<tr><td style="padding:14px 28px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
${files.length?`<tr><td style="padding:6px 28px 10px"><p style="margin:10px 0 10px;font:700 15px/1.3 ${FONT};color:${C.ink}">Files they sent</p>${files.map(([label,f])=>`<a href="${esc(f.url)}" style="display:block;margin:0 0 8px;padding:14px 16px;border-radius:14px;border:1.5px solid ${C.line};text-decoration:none"><span style="display:block;font:600 15px/1.3 ${FONT};color:${C.ink}">${esc(label)}</span><span style="display:block;font:400 13px/1.4 ${FONT};color:${C.muted}">${esc(f.name)}${f.size?' · '+kb(f.size):''} · Open</span></a>`).join('')}</td></tr>`:''}
<tr><td style="padding:18px 28px 26px"><p style="margin:0;padding-top:18px;border-top:1px solid ${C.line};font:400 13px/1.55 ${FONT};color:${C.muted}">The site promises a reply within one business day. Replying to this email goes straight to ${esc(email||'the customer')}.</p></td></tr>
</table>
<p style="margin:16px 0 0;font:400 12px/1.5 ${FONT};color:${C.muted}">Sent from the enquiry form on the Clean Energy Solutions website.</p>
</td></tr></table></body></html>`;
  const text=[`New website enquiry: ${name}`,when,'',services.length?'Interested in: '+services.join(', '):'',phone?'Phone: '+phone:'',email?'Email: '+email:'',address?'Address: '+address:'',message?'\nMessage:\n'+message:'',files.length?'\nFiles:\n'+files.map(([l,f])=>`- ${l}: ${f.url}`).join('\n'):'\nNo files sent.'].filter(Boolean).join('\n');
  return {subject,html,text,email,name};
}

/** The optional acknowledgement to the customer: short, plain, and no promises beyond what the site makes. */
export function renderAck(d){
  const first=(clean(d.name).split(/\s+/)[0]||'there').slice(0,40);
  const html=`<!doctype html><html lang="en-AU"><body style="margin:0;padding:0;background:${C.stone}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 14px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${C.line}"><tr><td style="background:${C.night};padding:22px 28px;font:700 15px/1.2 ${FONT};color:#ffffff">Clean Energy Solutions</td></tr><tr><td style="padding:28px;font:400 16px/1.6 ${FONT};color:${C.ink}"><h1 style="margin:0 0 12px;font:700 24px/1.2 ${FONT};letter-spacing:-.02em">Thanks, ${esc(first)}. We’ve got it.</h1><p style="margin:0 0 14px">Your enquiry is with the team in Wodonga. Our solar consultant will call or email within one business day.</p><p style="margin:0 0 18px">If you have a recent power bill handy, reply to this email with a photo of it. It’s what we design your system from.</p>${button(OFFICE_HREF,'Call '+OFFICE,true)}<p style="margin:18px 0 0;font-size:14px;color:${C.muted}">79 Elgin Boulevard, Wodonga VIC 3690</p></td></tr></table></td></tr></table></body></html>`;
  const text=`Thanks, ${first}. We've got it.\n\nYour enquiry is with the team in Wodonga. Our solar consultant will call or email within one business day.\n\nIf you have a recent power bill handy, reply to this email with a photo of it.\n\nClean Energy Solutions\n${OFFICE}\n79 Elgin Boulevard, Wodonga VIC 3690`;
  return {subject:'We’ve got your enquiry | Clean Energy Solutions',html,text};
}

async function send(key,body){
  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!res.ok)console.error('resend',res.status,await res.text());
  return res.ok;
}

export const handler=async(event)=>{
  let payload;try{payload=JSON.parse(event.body||'{}').payload;}catch{return {statusCode:400,body:'bad payload'};}
  if(!payload||payload.form_name!=='enquiry')return {statusCode:200,body:'ignored'};
  const key=process.env.RESEND_API_KEY,from=process.env.ENQUIRY_FROM||process.env.CHECKLIST_FROM;
  if(!key||!from)return {statusCode:200,body:'unconfigured'};
  const to=(process.env.ENQUIRY_TO||'it@cesolutions.com.au').split(',').map(s=>s.trim()).filter(Boolean);
  const d=payload.data||{};
  const m=renderEnquiry(d,{created_at:payload.created_at});
  const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email);
  const ok=await send(key,{from,to,subject:m.subject,html:m.html,text:m.text,...(valid?{reply_to:m.email}:{})});
  if(ok&&valid&&process.env.ENQUIRY_ACK==='on'){const a=renderAck(d);await send(key,{from,to:[m.email],reply_to:'info@cesolutions.com.au',subject:a.subject,html:a.html,text:a.text});}
  return {statusCode:ok?200:502,body:ok?'sent':'send failed'};
};
