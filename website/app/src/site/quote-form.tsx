/* Three-step enquiry form: what you need → about you → send (bill/photos optional). Posts to Netlify Forms;
 * the hidden form-name field and data-netlify attribute are what Netlify's build scans for. Steps are a
 * progressive layer: every step is in the DOM, only the active one is shown once JS runs, and without JS
 * (`html:not(.js-form)`) all three show and the native POST still works.
 * Photos are shrunk in the browser before upload (phone photos are 5–12 MB; Netlify accepts 10 MB per file),
 * and the third step can instead email the visitor a checklist of what to send (see netlify/functions). */
import {useEffect,useRef,useState,type FormEvent,type ComponentType} from 'react';
import {ArrowLeft,ArrowRight,BatteryCharging,Car,Check,Droplets,HelpCircle,Building2,Mail,Snowflake,Sun,type LucideProps} from 'lucide-react';
import {AddressField} from './address-field';

type Service={value:string;label:string;hint:string;Icon:ComponentType<LucideProps>};
const SERVICES:Service[]=[
{value:'Solar panels',label:'Solar panels',hint:'Cut daytime power costs',Icon:Sun},
{value:'Solar + battery',label:'Solar + battery',hint:'Most popular',Icon:BatteryCharging},
{value:'Home battery',label:'Battery only',hint:'Add storage to existing solar',Icon:BatteryCharging},
{value:'EV charger',label:'EV charger',hint:'Charge from your roof',Icon:Car},
{value:'Hot water heat pump',label:'Hot water heat pump',hint:'Replace an electric tank',Icon:Droplets},
{value:'Air conditioning',label:'Air conditioning',hint:'Efficient heating and cooling',Icon:Snowflake},
{value:'Commercial solar',label:'Business or farm',hint:'Sheds, shops, cool rooms',Icon:Building2},
{value:'Not sure yet',label:'Not sure yet',hint:'We’ll talk it through',Icon:HelpCircle}];
const STEPS=['What you need','About you','Send'] as const;
const FILES:[string,string,string][]=[['bill','Recent power bill','.pdf,image/*'],['roof_photo','Photo of your roof','image/*'],['meter_photo','Your meter box','image/*'],['battery_photo','Where a battery could go','image/*']];
const MAX_BYTES=10*1024*1024;
const fmtSize=(n:number)=>n>=1024*1024?(n/1024/1024).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';

/** Downscale a photo to ≤1800px JPEG. Returns the original when it is already small or cannot be decoded (e.g. HEIC on desktop). */
async function shrink(file:File):Promise<File>{
  if(!file.type.startsWith('image/')||file.size<1_200_000)return file;
  try{
    const bmp=await createImageBitmap(file);
    const scale=Math.min(1,1800/Math.max(bmp.width,bmp.height));
    const canvas=document.createElement('canvas');canvas.width=Math.round(bmp.width*scale);canvas.height=Math.round(bmp.height*scale);
    canvas.getContext('2d')!.drawImage(bmp,0,0,canvas.width,canvas.height);bmp.close();
    const blob=await new Promise<Blob|null>(r=>canvas.toBlob(r,'image/jpeg',.82));
    if(!blob||blob.size>=file.size)return file;
    return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});
  }catch{return file;}
}

export function QuoteForm(){
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState<string[]>([]);
  const [state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle');
  // Photos are shrunk as soon as they are picked, so the size shown (and the 10 MB check) is what will be sent.
  const [files,setFiles]=useState<Record<string,{name:string;size:number;file:File;busy?:boolean}>>({});
  const [checklist,setChecklist]=useState<'idle'|'sending'|'emailed'|'noted'>('idle');
  const formRef=useRef<HTMLFormElement>(null);
  const stepRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{document.documentElement.classList.add('js-form');},[]);
  useEffect(()=>{if(step>0)stepRef.current?.querySelector<HTMLElement>('input:not([type=hidden]),select,textarea')?.focus({preventScroll:true});},[step]);
  const toggle=(v:string)=>setChosen(c=>c.includes(v)?c.filter(x=>x!==v):[...c,v]);
  const tooBig=Object.entries(files).filter(([,f])=>!f.busy&&f.size>MAX_BYTES);
  const preparing=Object.values(files).some(f=>f.busy);
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
    if(tooBig.length){setState('error');return;}
    setState('sending');
    try{
      const fd=new FormData(form);
      for(const [name] of FILES){const f=files[name];if(f)fd.set(name,f.file,f.file.name);else fd.delete(name);}
      const res=await fetch('/',{method:'POST',body:fd});if(!res.ok)throw new Error(String(res.status));setState('sent');
    }catch{setState('error');}
  }
  async function emailChecklist(){
    const form=formRef.current;if(!form)return;
    const email=(form.elements.namedItem('email') as HTMLInputElement|null)?.value.trim()??'',name=(form.elements.namedItem('name') as HTMLInputElement|null)?.value.trim()??'';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setStep(1);setState('error');return;}
    setChecklist('sending');
    // The team is told either way (a second Netlify form), so nobody waits on an email that never went out.
    const note=new URLSearchParams({'form-name':'checklist-request',name,email,services:chosen.join(', ')});
    void fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:note}).catch(()=>{});
    try{const res=await fetch('/api/send-checklist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,services:chosen})});const data=res.ok?await res.json() as {ok:boolean}:{ok:false};setChecklist(data.ok?'emailed':'noted');}
    catch{setChecklist('noted');}
  }
  if(state==='sent')return <div className="qf qf--done" role="status"><span className="qf__tick"><Check size={28} aria-hidden="true"/></span><h3>Thanks — it’s with the team.</h3><p>Our solar consultant will call or email within one business day with the next step. If it’s urgent, ring <a href="tel:+61260212000">(02) 6021 2000</a>.</p></div>;
  return <form ref={formRef} className="qf" name="enquiry" method="POST" action="/?enquiry=sent" encType="multipart/form-data" data-netlify="true" data-netlify-honeypot="company" onSubmit={submit} onKeyDown={e=>{if(e.key==='Enter'&&step<2&&(e.target as HTMLElement).tagName==='INPUT'){e.preventDefault();next();}}} noValidate={false}>
    <input type="hidden" name="form-name" value="enquiry"/>
    <p className="qf__hp" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off"/></label></p>
    <ol className="qf__progress" aria-label="Progress">{STEPS.map((s,i)=><li key={s} aria-current={i===step?'step':undefined} className={i<step?'is-done':i===step?'is-active':''}><span>{i<step?<Check size={12} aria-hidden="true"/>:i+1}</span>{s}</li>)}</ol>
    <div ref={stepRef} className="qf__steps">
      <fieldset className="qf__step" data-step="0" data-active={step===0}><legend className="qf__q">What are you looking at?<small>Pick one or more</small></legend><div className="qf__services">{SERVICES.map(s=>{const on=chosen.includes(s.value);return <label key={s.value} className={on?'svc is-on':'svc'}><input type="checkbox" name="services" value={s.value} checked={on} onChange={()=>toggle(s.value)}/><span className="svc__icon"><s.Icon size={22} strokeWidth={1.75} aria-hidden="true"/></span><span className="svc__text"><strong>{s.label}</strong><em>{s.hint}</em></span><span className="svc__check" aria-hidden="true"><Check size={14}/></span></label>;})}</div>{state==='error'&&step===0&&<p className="qf__err" role="alert">Pick at least one so we send the right person.</p>}</fieldset>
      <fieldset className="qf__step" data-step="1" data-active={step===1}><legend className="qf__q">Where do we send the quote?<small>So our solar consultant can reach you</small></legend><div className="qf__grid"><label className="qf__field"><span>Your name</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Full name"/></label><label className="qf__field"><span>Mobile</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} placeholder="04…"/></label><label className="qf__field qf__field--wide"><span>Email</span><input name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} placeholder="name@example.com"/></label><AddressField/></div>{state==='error'&&step===1&&<p className="qf__err" role="alert">We need a valid email to send the checklist to.</p>}</fieldset>
      <fieldset className="qf__step" data-step="2" data-active={step===2}><legend className="qf__q">Anything that helps us quote?<small>All optional — add it now, or we can email you a list to send later</small></legend>
        <div className="qf__files">{FILES.map(([name,label,accept])=>{const f=files[name];const big=!!f&&f.size>MAX_BYTES;return <label key={name} className={big?'qf__file is-bad':f?'qf__file is-on':'qf__file'}><input type="file" name={name} accept={accept} onChange={e=>{const file=e.target.files?.[0];if(!file){setFiles(prev=>{const n={...prev};delete n[name];return n;});return;}setFiles(prev=>({...prev,[name]:{name:file.name,size:file.size,file,busy:true}}));void shrink(file).then(small=>setFiles(prev=>prev[name]?.file===file?{...prev,[name]:{name:small.name,size:small.size,file:small}}:prev));}}/><span className="qf__file-icon">{f&&!big&&!f.busy?<Check size={18} aria-hidden="true"/>:'+'}</span><span className="qf__file-text"><strong>{label}</strong><em>{f?(f.busy?'Preparing photo…':big?`Too big (${fmtSize(f.size)}) — max 10 MB`:`${f.name} · ${fmtSize(f.size)}`):'Tap to add a photo or file'}</em></span></label>;})}</div>
        <label className="qf__field qf__field--wide"><span>Anything else? <em>(optional)</em></span><textarea name="message" rows={3} maxLength={1500} placeholder="Roof type, how much your last bill was, when you’d like it done…"/></label>
        <div className="qf__alt">{checklist==='emailed'?<p role="status"><Check size={16} aria-hidden="true"/>Checklist sent — check your inbox, then reply with the photos whenever suits.</p>:checklist==='noted'?<p role="status"><Check size={16} aria-hidden="true"/>Noted — our solar consultant will email you the list of what to send.</p>:<><p>Don’t have these handy?</p><button type="button" className="qf__ghost" onClick={()=>void emailChecklist()} disabled={checklist==='sending'}><Mail size={16} aria-hidden="true"/>{checklist==='sending'?'Sending…':'Email me a list of what to send'}</button></>}</div>
      </fieldset>
    </div>
    <div className="qf__nav">{step>0&&<button type="button" className="qf__back" onClick={()=>{setState('idle');setStep(s=>s-1);}}><ArrowLeft size={18} aria-hidden="true"/>Back</button>}{/* Distinct keys: React must not reuse the Continue button's DOM node for the submit button, or the click that advances to step 3 would also submit the form. */}{step<2?<button key="next" type="button" className="qf__next" onClick={next}>Continue<ArrowRight size={18} aria-hidden="true"/></button>:<button key="send" type="submit" className="qf__next" disabled={state==='sending'||tooBig.length>0||preparing}>{state==='sending'?'Sending…':preparing?'Preparing photos…':'Send my enquiry'}<ArrowRight size={18} aria-hidden="true"/></button>}</div>
    {state==='error'&&step===2&&<p className="qf__err" role="alert">{tooBig.length?'One of the files is over 10 MB — please pick a smaller photo or leave it out.':<>That didn’t send. Please call <a href="tel:+61260212000">(02) 6021 2000</a> or email <a href="mailto:info@cesolutions.com.au">info@cesolutions.com.au</a>.</>}</p>}
    <p className="qf__note">Free, no obligation. Your details go only to CES in Wodonga.</p>
  </form>;
}

/** Static registration for the checklist-request submissions (Netlify scans the built HTML for named forms). */
export function ChecklistFormRegistration(){
  return <form name="checklist-request" data-netlify="true" hidden aria-hidden="true"><input type="hidden" name="form-name" value="checklist-request"/><input name="name"/><input name="email"/><input name="services"/></form>;
}
