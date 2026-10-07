/* Three-step enquiry form: what you need → about you → send (bill/photos optional). Posts to Netlify Forms;
 * the hidden form-name field and data-netlify attribute are what Netlify's build scans for. Steps are a
 * progressive layer: every step is in the DOM, only the active one is shown once JS runs, and without JS
 * (`html:not(.js-form)`) all three show and the native POST still works.
 * Photos are converted to JPEG and shrunk in the browser before upload (phone photos are 5–12 MB and iPhones
 * shoot HEIC, which Windows can't open; Netlify accepts 8 MB per submission and times uploads out at 30 s),
 * and the third step can instead email the visitor a checklist of what to send (see netlify/functions).
 * If the upload fails, the enquiry is sent again without the files, so the contact details still arrive. */
import {useEffect,useRef,useState,type FormEvent,type ComponentType} from 'react';
import {ArrowLeft,ArrowRight,BatteryCharging,Car,Check,Droplets,HelpCircle,Building2,Mail,Snowflake,Sun,type LucideProps} from 'lucide-react';
import {AddressField,ADDRESS_DRAFT} from './address-field';

type Service={value:string;label:string;hint:string;Icon:ComponentType<LucideProps>};
const SERVICES:Service[]=[
{value:'Solar panels',label:'Solar panels',hint:'Cut daytime power costs',Icon:Sun},
{value:'Solar + battery',label:'Solar + battery',hint:'Day and night power',Icon:BatteryCharging},
{value:'Home battery',label:'Battery only',hint:'Add a battery to existing solar',Icon:BatteryCharging},
{value:'EV charger',label:'EV charger',hint:'Charge from your roof',Icon:Car},
{value:'Hot water heat pump',label:'Hot water heat pump',hint:'Replace an electric tank',Icon:Droplets},
{value:'Air conditioning',label:'Air conditioning',hint:'Efficient heating and cooling',Icon:Snowflake},
{value:'Commercial solar',label:'Business or farm',hint:'Sheds, shops, cool rooms',Icon:Building2},
{value:'Not sure yet',label:'Not sure yet',hint:'We’ll talk it through',Icon:HelpCircle}];
const STEPS=['What you need','About you','Send'] as const;
// .heic/.heif are listed as well: Windows file pickers leave them out of image/*.
const PHOTO='image/*,.heic,.heif';
const FILES:[string,string,string][]=[['bill','Recent power bill','.pdf,'+PHOTO],['roof_photo','Photo of your roof',PHOTO],['meter_photo','Your meter box',PHOTO],['battery_photo','Where a battery could go',PHOTO]];
// One limit for a single file and for all of them together: Netlify caps the whole request, not each file.
// 7.5 rather than 8: the limit is on the whole multipart request, which is a little bigger than the files in it.
const MAX_BYTES=7.5*1024*1024;
const isOffline=()=>navigator.onLine===false;
/** POST the enquiry to Netlify Forms, giving up after `ms` so a stalled mobile upload doesn't hang on "Sending…". */
async function post(fd:FormData,ms:number){
  const ctl=new AbortController(),t=window.setTimeout(()=>ctl.abort(),ms);
  try{return (await fetch('/',{method:'POST',body:fd,signal:ctl.signal})).ok;}catch{return false;}finally{window.clearTimeout(t);}
}
const DRAFT='ces-enquiry-draft',DRAFT_FIELDS=['name','phone','email','message'] as const;
const fmtSize=(n:number)=>n>=1024*1024?(n/1024/1024).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';

const isHeic=(f:File)=>/^image\/hei[cf]/i.test(f.type)||/\.hei[cf]$/i.test(f.name);
const isImage=(f:File)=>f.type.startsWith('image/')||/\.(jpe?g|png|webp|gif|bmp|avif|hei[cf])$/i.test(f.name);
// Largest side and JPEG quality, tried in order until the photo is under PHOTO_TARGET. Four photos at the
// target leave room for a PDF bill inside the 8 MB request.
const PHOTO_STEPS:[number,number][]=[[2000,.8],[1600,.72],[1280,.62]],PHOTO_TARGET=1_200_000;
/** Decode a photo. iPhone HEIC/HEIF only decodes natively in Safari, so elsewhere the converter is fetched on demand. */
async function decode(file:File):Promise<ImageBitmap>{
  try{return await createImageBitmap(file,{imageOrientation:'from-image'});}
  catch(err){
    if(!isHeic(file))throw err;
    const {heicTo}=await import('heic-to/csp');
    return heicTo({blob:file,type:'bitmap'});
  }
}
/** Turn any photo into a JPEG of a sensible size: HEIC is converted so the office can open it, and big photos are
 * scaled down. Returns the original when it is already a small JPEG/PNG/WebP, is not an image, or cannot be decoded. */
async function shrink(file:File):Promise<File>{
  if(!isImage(file))return file;
  const plain=/^image\/(jpeg|png|webp)$/.test(file.type);
  if(plain&&file.size<=600_000)return file;
  try{
    const bmp=await decode(file);
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;
    let best:Blob|null=null;
    for(const [side,quality] of PHOTO_STEPS){
      const scale=Math.min(1,side/Math.max(bmp.width,bmp.height));
      canvas.width=Math.round(bmp.width*scale);canvas.height=Math.round(bmp.height*scale);
      // JPEG has no transparency: paint white first so a transparent PNG doesn't come out black.
      ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bmp,0,0,canvas.width,canvas.height);
      const blob=await new Promise<Blob|null>(r=>canvas.toBlob(r,'image/jpeg',quality));
      if(blob&&(!best||blob.size<best.size))best=blob;
      if(best&&best.size<=PHOTO_TARGET)break;
    }
    bmp.close();canvas.width=canvas.height=1;
    if(!best||(plain&&best.size>=file.size))return file;
    return new File([best],file.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});
  }catch{return file;}
}

export function QuoteForm(){
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState<string[]>([]);
  const [state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle');
  // Photos are shrunk as soon as they are picked, so the size shown (and the 10 MB check) is what will be sent.
  const [files,setFiles]=useState<Record<string,{name:string;size:number;file:File;busy?:boolean}>>({});
  // Why the last send failed ('offline'), and whether it went through only after the files were dropped.
  const [offline,setOffline]=useState(false);
  const [dropped,setDropped]=useState(false);
  const [checklist,setChecklist]=useState<'idle'|'sending'|'emailed'|'noted'|'failed'>('idle');
  const formRef=useRef<HTMLFormElement>(null);
  const stepRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{document.documentElement.classList.add('js-form');if(location.search.includes('enquiry=sent'))setState('sent');},[]);
  // A draft is kept for the visit (sessionStorage, this tab only): a refresh or a stray back-swipe no longer
  // wipes the form. Files and the address lookup are not stored. Cleared once the enquiry is sent.
  useEffect(()=>{
    try{
      const d=JSON.parse(sessionStorage.getItem(DRAFT)||'null') as {chosen?:string[];fields?:Record<string,string>}|null;
      if(!d)return;
      if(Array.isArray(d.chosen))setChosen(d.chosen.filter(v=>SERVICES.some(s=>s.value===v)));
      const form=formRef.current;if(!form)return;
      for(const n of DRAFT_FIELDS){const el=form.elements.namedItem(n) as HTMLInputElement|HTMLTextAreaElement|null;if(el&&d.fields?.[n])el.value=d.fields[n];}
    }catch{/* storage blocked or malformed: start empty */}
  },[]);
  const saveDraft=(nextChosen=chosen)=>{
    const form=formRef.current;if(!form)return;
    const fields:Record<string,string>={};
    for(const n of DRAFT_FIELDS){const el=form.elements.namedItem(n) as HTMLInputElement|HTMLTextAreaElement|null;if(el?.value)fields[n]=el.value;}
    try{sessionStorage.setItem(DRAFT,JSON.stringify({chosen:nextChosen,fields}));}catch{/* ignore */}
  };
  const doneRef=useRef<HTMLDivElement>(null);
  // When it sends, bring the confirmation into view and put focus on it so it is read out.
  useEffect(()=>{if(state!=='sent')return;try{sessionStorage.removeItem(DRAFT);sessionStorage.removeItem(ADDRESS_DRAFT);}catch{/* ignore */}const el=doneRef.current;if(!el)return;el.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});el.focus({preventScroll:true});},[state]);
  const firstStep=useRef(true);
  useEffect(()=>{if(firstStep.current){firstStep.current=false;return;}const fs=stepRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);fs?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});const target=step===2?fs?.querySelector<HTMLElement>('.qf__q'):fs?.querySelector<HTMLElement>('input:not([type=hidden]),select,textarea');window.setTimeout(()=>target?.focus({preventScroll:true}),350);},[step]);
  const toggle=(v:string)=>setChosen(c=>{const n=c.includes(v)?c.filter(x=>x!==v):[...c,v];saveDraft(n);return n;});
  const tooBig=Object.entries(files).filter(([,f])=>!f.busy&&f.size>MAX_BYTES);
  const preparing=Object.values(files).some(f=>f.busy);
  const overTotal=!tooBig.length&&!preparing&&Object.values(files).reduce((n,f)=>n+f.size,0)>MAX_BYTES;
  function next(){
    const form=formRef.current;if(!form)return;
    if(step===0&&chosen.length===0){setState('error');return;}
    if(step===1){const fields=[...form.querySelectorAll<HTMLInputElement>('[data-step="1"] input:not([type=hidden])')];for(const f of fields){if(!f.reportValidity())return;}}
    setState('idle');setStep(s=>Math.min(s+1,2));
  }
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();const form=e.currentTarget;
    if(step<2){next();return;}
    if(chosen.length===0){setStep(0);setState('error');return;}
    if(tooBig.length||overTotal){setState('error');return;}
    if(isOffline()){setOffline(true);setState('error');return;}
    setOffline(false);setState('sending');
    const fd=new FormData(form),bare=new FormData(form);
    let attached=false;
    for(const [name] of FILES){const f=files[name];bare.delete(name);if(f){fd.set(name,f.file,f.file.name);attached=true;}else fd.delete(name);}
    if(await post(fd,attached?32_000:20_000)){setState('sent');return;}
    // The details matter more than the photos: if the upload was what failed, send the enquiry without them.
    if(attached&&await post(bare,20_000)){setDropped(true);setState('sent');return;}
    setOffline(isOffline());setState('error');
  }
  async function emailChecklist(){
    const form=formRef.current;if(!form)return;
    const email=(form.elements.namedItem('email') as HTMLInputElement|null)?.value.trim()??'',name=(form.elements.namedItem('name') as HTMLInputElement|null)?.value.trim()??'';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setStep(1);setState('error');return;}
    setChecklist('sending');
    // The team is told as well (a second Netlify form), so nobody waits on an email that never went out.
    const note=new URLSearchParams({'form-name':'checklist-request',name,email,services:chosen.join(', ')});
    const noted=fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:note}).then(r=>r.ok).catch(()=>false);
    const emailed=fetch('/api/send-checklist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,services:chosen})}).then(async r=>r.ok&&(await r.json() as {ok:boolean}).ok).catch(()=>false);
    const [n,e]=await Promise.all([noted,emailed]);
    setChecklist(e?'emailed':n?'noted':'failed');
  }
  if(state==='sent')return <div ref={doneRef} tabIndex={-1} className="qf qf--done" role="status"><span className="qf__tick"><Check size={28} aria-hidden="true"/></span><h3>Thanks — it’s with the team.</h3><p>Our solar consultant will call or email within one business day with the next step. If it’s urgent, ring <a href="tel:+61260212000">(02) 6021 2000</a>.</p>{dropped&&<p>Your details came through, but the photos didn’t upload. Email them to <a href="mailto:info@cesolutions.com.au">info@cesolutions.com.au</a> whenever suits.</p>}</div>;
  return <form ref={formRef} className="qf" name="enquiry" method="POST" action="/?enquiry=sent" encType="multipart/form-data" data-netlify="true" data-netlify-honeypot="company" onSubmit={submit} onInput={()=>saveDraft()} aria-busy={state==='sending'} onKeyDown={e=>{if(e.key==='Enter'&&step<2&&(e.target as HTMLElement).tagName==='INPUT'){e.preventDefault();next();}}} noValidate={false}>
    <input type="hidden" name="form-name" value="enquiry"/>
    <p className="qf__hp" aria-hidden="true" inert><label>Company<input name="company" tabIndex={-1} autoComplete="off"/></label></p>
    <ol className="qf__progress" aria-label="Progress">{STEPS.map((s,i)=><li key={s} aria-current={i===step?'step':undefined} className={i<step?'is-done':i===step?'is-active':''}><span>{i<step?<Check size={12} aria-hidden="true"/>:i+1}</span>{s}</li>)}</ol>
    <p className="sr-only" role="status" aria-live="polite">Step {step+1} of 3: {STEPS[step]}</p>
    <div ref={stepRef} className="qf__steps">
      <fieldset className="qf__step" data-step="0" data-active={step===0}><legend className="qf__q">What are you looking at?<small>Pick one or more</small></legend><div className="qf__services">{SERVICES.map(s=>{const on=chosen.includes(s.value);return <label key={s.value} className={on?'svc is-on':'svc'}><input type="checkbox" name="services" value={s.value} checked={on} onChange={()=>toggle(s.value)}/><span className="svc__icon"><s.Icon size={22} strokeWidth={1.75} aria-hidden="true"/></span><span className="svc__text"><strong>{s.label}</strong><em>{s.hint}</em></span><span className="svc__check" aria-hidden="true"><Check size={14}/></span></label>;})}</div>{state==='error'&&step===0&&<p className="qf__err" role="alert">Pick at least one so we send the right person.</p>}</fieldset>
      <fieldset className="qf__step" data-step="1" data-active={step===1}><legend className="qf__q">Where do we send the quote?<small>So our solar consultant can reach you</small></legend><div className="qf__grid"><label className="qf__field"><span>Your name</span><input name="name" autoComplete="name" required maxLength={100} enterKeyHint="next" placeholder="Full name"/></label><label className="qf__field"><span>Mobile</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} minLength={8} pattern="[0-9+() \-]{8,}" title="A phone number we can call you on, digits only" enterKeyHint="next" placeholder="04…"/></label><label className="qf__field qf__field--wide"><span>Email</span><input name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} enterKeyHint="next" spellCheck={false} autoCapitalize="none" placeholder="name@example.com"/></label><AddressField/></div>{state==='error'&&step===1&&<p className="qf__err" role="alert">We need a valid email to send the checklist to.</p>}</fieldset>
      <fieldset className="qf__step" data-step="2" data-active={step===2}><legend className="qf__q" tabIndex={-1}>Anything that helps us quote?<small>All optional — add it now, or we can email you a list to send later</small></legend>
        <div className="qf__files">{FILES.map(([name,label,accept])=>{const f=files[name];const big=!!f&&f.size>MAX_BYTES;return <label key={name} className={big?'qf__file is-bad':f?'qf__file is-on':'qf__file'}><input type="file" name={name} accept={accept} onChange={e=>{const file=e.target.files?.[0];if(!file){setFiles(prev=>{const n={...prev};delete n[name];return n;});return;}setFiles(prev=>({...prev,[name]:{name:file.name,size:file.size,file,busy:true}}));void shrink(file).then(small=>setFiles(prev=>prev[name]?.file===file?{...prev,[name]:{name:small.name,size:small.size,file:small}}:prev));}}/><span className="qf__file-icon">{f&&!big&&!f.busy?<Check size={18} aria-hidden="true"/>:'+'}</span><span className="qf__file-text"><strong>{label}</strong><em>{f?(f.busy?'Preparing photo…':big?`Too big (${fmtSize(f.size)}) — max 7.5 MB`:`${f.name} · ${fmtSize(f.size)}`):'Tap to add a photo or file'}</em></span></label>;})}</div>
        <label className="qf__field qf__field--wide"><span>Anything else? <em>(optional)</em></span><textarea name="message" rows={3} maxLength={1500} placeholder="Roof type, how much your last bill was, when you’d like it done…"/></label>
        <div className="qf__alt">{checklist==='failed'?<><p role="alert">That didn’t send — call us on <a href="tel:+61260212000">(02) 6021 2000</a> and we’ll talk you through it.</p><button type="button" className="qf__ghost" onClick={()=>void emailChecklist()}><Mail size={16} aria-hidden="true"/>Try again</button></>:checklist==='emailed'?<p role="status"><Check size={16} aria-hidden="true"/>Checklist sent — check your inbox, then reply with the photos whenever suits.</p>:checklist==='noted'?<p role="status"><Check size={16} aria-hidden="true"/>Noted — our solar consultant will email you the list of what to send.</p>:<><p>Don’t have these handy?</p><button type="button" className="qf__ghost" onClick={()=>void emailChecklist()} disabled={checklist==='sending'}><Mail size={16} aria-hidden="true"/>{checklist==='sending'?'Sending…':'Email me a list of what to send'}</button></>}</div>
      </fieldset>
    </div>
    <div className="qf__nav">{step>0&&<button type="button" className="qf__back" onClick={()=>{setState('idle');setStep(s=>s-1);}}><ArrowLeft size={18} aria-hidden="true"/>Back</button>}{/* Distinct keys: React must not reuse the Continue button's DOM node for the submit button, or the click that advances to step 3 would also submit the form. */}{step<2?<button key="next" type="button" className="qf__next" onClick={next}>Continue<ArrowRight size={18} aria-hidden="true"/></button>:<button key="send" type="submit" className="qf__next" disabled={state==='sending'||tooBig.length>0||overTotal||preparing}>{state==='sending'?'Sending…':preparing?'Preparing photos…':'Request my free quote'}<ArrowRight size={18} aria-hidden="true"/></button>}</div>
    {step===2&&overTotal&&<p className="qf__err" role="alert">Together these files are over 7.5 MB. Remove one and email it to us later.</p>}
    {state==='error'&&step===2&&!overTotal&&<p className="qf__err" role="alert">{tooBig.length?'One of the files is over 7.5 MB — please pick a smaller one or leave it out.':offline?'You look to be offline. Your details are saved here, so reconnect and press send again.':<>That didn’t send. Your details are still here, so try again, or call <a href="tel:+61260212000">(02) 6021 2000</a> or email <a href="mailto:info@cesolutions.com.au">info@cesolutions.com.au</a>.</>}</p>}
    <p className="qf__note">Free, no obligation. Your details go only to CES in Wodonga.</p>
  </form>;
}

/** Static registration for the checklist-request submissions (Netlify scans the built HTML for named forms). */
export function ChecklistFormRegistration(){
  return <form name="checklist-request" data-netlify="true" hidden aria-hidden="true"><input type="hidden" name="form-name" value="checklist-request"/><input name="name"/><input name="email"/><input name="services"/></form>;
}
