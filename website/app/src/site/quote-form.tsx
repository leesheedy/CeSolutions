/* Three-step enquiry form: what you need → about you → send (bill/photos optional). Posts to Netlify Forms;
 * the hidden form-name field and data-netlify attribute are what Netlify's build scans for. Steps are a
 * progressive layer: every step is in the DOM, only the active one is shown once JS runs, and without JS
 * (`html:not(.js-form)`) all three show and the native POST still works. */
import {useEffect,useRef,useState,type FormEvent,type ComponentType} from 'react';
import {ArrowLeft,ArrowRight,BatteryCharging,Car,Check,Droplets,HelpCircle,Building2,Snowflake,Sun,type LucideProps} from 'lucide-react';

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

export function QuoteForm(){
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState<string[]>([]);
  const [state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [files,setFiles]=useState<Record<string,string>>({});
  const formRef=useRef<HTMLFormElement>(null);
  const stepRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{document.documentElement.classList.add('js-form');},[]);
  useEffect(()=>{if(step>0)stepRef.current?.querySelector<HTMLElement>('input,select,textarea')?.focus({preventScroll:true});},[step]);
  const toggle=(v:string)=>setChosen(c=>c.includes(v)?c.filter(x=>x!==v):[...c,v]);
  function next(){
    const form=formRef.current;if(!form)return;
    if(step===0&&chosen.length===0){setState('error');return;}
    if(step===1){const fields=[...form.querySelectorAll<HTMLInputElement>('[data-step="1"] input')];for(const f of fields){if(!f.reportValidity())return;}}
    setState('idle');setStep(s=>Math.min(s+1,2));
  }
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();const form=e.currentTarget;
    if(chosen.length===0){setStep(0);setState('error');return;}
    setState('sending');
    try{const res=await fetch('/',{method:'POST',body:new FormData(form)});if(!res.ok)throw new Error(String(res.status));setState('sent');}
    catch{setState('error');}
  }
  if(state==='sent')return <div className="qf qf--done" role="status"><span className="qf__tick"><Check size={28} aria-hidden="true"/></span><h3>Thanks — it’s with the team.</h3><p>Ella will call or email within one business day with the next step. If it’s urgent, ring <a href="tel:+61260212000">(02) 6021 2000</a>.</p></div>;
  return <form ref={formRef} className="qf" name="enquiry" method="POST" action="/?enquiry=sent" encType="multipart/form-data" data-netlify="true" data-netlify-honeypot="company" onSubmit={submit} noValidate={false}>
    <input type="hidden" name="form-name" value="enquiry"/>
    <p className="qf__hp" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off"/></label></p>
    <ol className="qf__progress" aria-label="Progress">{STEPS.map((s,i)=><li key={s} aria-current={i===step?'step':undefined} className={i<step?'is-done':i===step?'is-active':''}><span>{i<step?<Check size={12} aria-hidden="true"/>:i+1}</span>{s}</li>)}</ol>
    <div ref={stepRef} className="qf__steps">
      <fieldset className="qf__step" data-step="0" data-active={step===0}><legend className="qf__q">What are you looking at?<small>Pick one or more</small></legend><div className="qf__services">{SERVICES.map(s=>{const on=chosen.includes(s.value);return <label key={s.value} className={on?'svc is-on':'svc'}><input type="checkbox" name="services" value={s.value} checked={on} onChange={()=>toggle(s.value)}/><span className="svc__icon"><s.Icon size={22} strokeWidth={1.75} aria-hidden="true"/></span><span className="svc__text"><strong>{s.label}</strong><em>{s.hint}</em></span><span className="svc__check" aria-hidden="true"><Check size={14}/></span></label>;})}</div>{state==='error'&&step===0&&<p className="qf__err" role="alert">Pick at least one so we send the right person.</p>}</fieldset>
      <fieldset className="qf__step" data-step="1" data-active={step===1}><legend className="qf__q">Where do we send the quote?<small>So Ella can reach you</small></legend><div className="qf__grid"><label className="qf__field"><span>Your name</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Full name"/></label><label className="qf__field"><span>Mobile</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} placeholder="04…"/></label><label className="qf__field qf__field--wide"><span>Email</span><input name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} placeholder="name@example.com"/></label><label className="qf__field qf__field--wide"><span>Property address</span><input name="address" autoComplete="street-address" required maxLength={200} placeholder="Street, suburb and postcode"/></label></div></fieldset>
      <fieldset className="qf__step" data-step="2" data-active={step===2}><legend className="qf__q">Anything that helps us quote?<small>All optional — send it now or later</small></legend><div className="qf__files">{[['bill','Recent power bill','.pdf,image/*'],['roof_photo','Photo of your roof','image/*'],['meter_photo','Your meter box','image/*'],['battery_photo','Where a battery could go','image/*']].map(([name,label,accept])=><label key={name} className={files[name]?'qf__file is-on':'qf__file'}><input type="file" name={name} accept={accept} capture={name==='bill'?undefined:'environment'} onChange={e=>setFiles(f=>({...f,[name]:e.target.files?.[0]?.name??''}))}/><span className="qf__file-icon">{files[name]?<Check size={18} aria-hidden="true"/>:'+'}</span><span className="qf__file-text"><strong>{label}</strong><em>{files[name]||'Tap to add'}</em></span></label>)}</div><label className="qf__field qf__field--wide"><span>Anything else? <em>(optional)</em></span><textarea name="message" rows={3} maxLength={1500} placeholder="Roof type, how much your last bill was, when you’d like it done…"/></label></fieldset>
    </div>
    <div className="qf__nav">{step>0&&<button type="button" className="qf__back" onClick={()=>{setState('idle');setStep(s=>s-1);}}><ArrowLeft size={18} aria-hidden="true"/>Back</button>}{step<2?<button type="button" className="qf__next" onClick={next}>Continue<ArrowRight size={18} aria-hidden="true"/></button>:<button type="submit" className="qf__next" disabled={state==='sending'}>{state==='sending'?'Sending…':'Send my enquiry'}<ArrowRight size={18} aria-hidden="true"/></button>}</div>
    {state==='error'&&step===2&&<p className="qf__err" role="alert">That didn’t send. Please call <a href="tel:+61260212000">(02) 6021 2000</a> or email <a href="mailto:info@cesolutions.com.au">info@cesolutions.com.au</a>.</p>}
    <p className="qf__note">Free, no obligation. Your details go only to CES in Wodonga.</p>
  </form>;
}
