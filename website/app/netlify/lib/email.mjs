// Shared look for every email the site sends (team enquiry, customer acknowledgement, checklist): the CES
// logo on a dark band, an optional job photo, the message, a real SolarQuotes review and a contact footer.
// Table layout and inline styles throughout, because mail clients ignore stylesheets and flexbox. Images are
// PNG/JPG (Outlook does not render WebP) and load from the live site, so they need absolute URLs.

export const OFFICE='(02) 6021 2000',OFFICE_HREF='tel:+61260212000';
export const C={night:'#0A1D2B',ink:'#0F1E29',muted:'#52616C',line:'#E1E6E3',stone:'#F3F5F2',tint:'#E7F4EC',brand:'#0B7A4E',mint:'#7FE3B2',sun:'#F5B400'};
export const FONT="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
export const SITE=(process.env.URL||'https://cesolutions.automatrix.au').replace(/\/$/,'');
const SOLARQUOTES='https://www.solarquotes.com.au/installer-review/clean-energy-solutions/';
export const asset=name=>`${SITE}/assets/email/${name}`;
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const button=(href,label,solid)=>`<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 20px;border-radius:999px;font:600 15px/1 ${FONT};text-decoration:none;${solid?`background:${C.brand};color:#ffffff;border:1.5px solid ${C.brand}`:`background:#ffffff;color:${C.ink};border:1.5px solid #C7D0CB`}">${esc(label)}</a>`;

/** Numbered rows: [title, detail]. */
export const steps=items=>`<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items.map(([t,d],i)=>`<tr><td style="padding:14px 0;border-top:1px solid ${C.line};width:44px;vertical-align:top"><span style="display:inline-block;width:30px;height:30px;border-radius:15px;background:${C.tint};color:${C.brand};font:700 14px/30px ${FONT};text-align:center">${i+1}</span></td><td style="padding:14px 0;border-top:1px solid ${C.line};vertical-align:top"><strong style="display:block;font:600 16px/1.35 ${FONT};color:${C.ink}">${esc(t)}</strong>${d?`<span style="display:block;margin-top:3px;font:400 15px/1.5 ${FONT};color:${C.muted}">${esc(d)}</span>`:''}</td></tr>`).join('')}</table>`;

// Published SolarQuotes reviews, the same ones shown on the website.
export const REVIEWS={
quote:{text:'They came and looked at the job at 11am and had a quote emailed to me by 4.30 pm same day.',who:'Phillip, Holbrook area'},
install:{text:'Customer service was excellent, installation was on time and they did a fantastic job. Would definitely recommend.',who:'Adam, Albury area'},
service:{text:'From the moment we reached out the service was second to none. Highly recommend.',who:'Adele, Albury'}};
export const review=r=>`<tr><td style="padding:6px 28px 26px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.stone};border-radius:16px"><tr><td style="padding:20px 22px">
  <p style="margin:0 0 8px;font:700 17px/1 ${FONT};color:${C.sun};letter-spacing:2px">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
  <p style="margin:0 0 10px;font:400 16px/1.55 ${FONT};color:${C.ink}">&ldquo;${esc(r.text)}&rdquo;</p>
  <p style="margin:0;font:400 14px/1.5 ${FONT};color:${C.muted}"><strong style="color:${C.ink}">${esc(r.who)}</strong> &middot; <a href="${SOLARQUOTES}" style="color:${C.brand};text-decoration:underline">4.8/5 from 26 SolarQuotes reviews</a></p>
</td></tr></table></td></tr>`;

/** The whole email. `rows` is a string of <tr> rows for the white card; `tag` is the small label opposite the logo. */
export function shell({title,preheader='',tag='',hero,heroAlt='',rows,note,width=600}){
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.stone}">
<div style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.stone}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:${width}px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${C.line}">
<tr><td style="background:${C.night};padding:20px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td><a href="${SITE}" style="text-decoration:none"><img src="${asset('logo.png')}" width="176" height="50" alt="Clean Energy Solutions" style="display:block;border:0;width:176px;height:auto;font:700 15px/1.2 ${FONT};color:#ffffff"></a></td>${tag?`<td align="right" style="font:600 13px/1.2 ${FONT};color:${C.mint}">${esc(tag)}</td>`:''}</tr></table></td></tr>
${hero?`<tr><td style="font-size:0;line-height:0"><img src="${asset(hero)}" width="${width}" alt="${esc(heroAlt)}" style="display:block;border:0;width:100%;max-width:${width}px;height:auto"></td></tr>`:''}
${rows}
<tr><td style="background:${C.night};padding:24px 28px;font:400 14px/1.6 ${FONT};color:#C9D5DC">
  <strong style="display:block;font:700 15px/1.4 ${FONT};color:#ffffff">Clean Energy Solutions</strong>
  Family-owned in Wodonga. Our own licensed electricians, no subcontractors.<br>
  79 Elgin Boulevard, Wodonga VIC 3690<br>
  <a href="${OFFICE_HREF}" style="color:${C.mint};text-decoration:none;font-weight:600">${OFFICE}</a> &nbsp;&middot;&nbsp; <a href="mailto:info@cesolutions.com.au" style="color:${C.mint};text-decoration:none;font-weight:600">info@cesolutions.com.au</a>
</td></tr>
</table>
${note?`<p style="margin:16px 0 0;font:400 12px/1.5 ${FONT};color:${C.muted}">${esc(note)}</p>`:''}
</td></tr></table></body></html>`;
}
