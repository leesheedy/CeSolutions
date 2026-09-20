import {useState,type FormEvent} from 'react';
import {ArrowUpRight,Check,Clock,ShieldCheck} from 'lucide-react';
import './refresh.css';
/** Native validation and a genuine Netlify submission; no simulated success or outbound checklist email. */
export function QuoteForm(){
 const [state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setState('sending');
  try{const res=await fetch('/',{method:'POST',body:new FormData(e.currentTarget)});if(!res.ok)throw new Error('Submission failed');setState('sent');}catch{setState('error');}
 }
 if(state==='sent')return <div className="simple-enquiry" role="status"><Check size={32}/><h3>Thanks for getting in touch.</h3><p>Your enquiry has been submitted. To speak with the local team, call <a href="tel:+61260212000">(02) 6021 2000</a>.</p></div>;
 return <form className="simple-enquiry" name="enquiry" method="POST" action="/contact?enquiry=sent" data-netlify="true" data-netlify-honeypot="company" onSubmit={submit}>
 <input type="hidden" name="form-name" value="enquiry"/><p className="simple-enquiry__trap" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off"/></label></p>
 <h3>Get my free quote</h3><p>Just the essentials. No bill or photos needed to start.</p>
 <p className="simple-enquiry__meta"><span><Clock size={14}/>Takes about a minute</span><span><ShieldCheck size={14}/>We call you back within one business day</span></p>
 <fieldset><legend>What are you looking at?</legend><div className="enquiry-choices">{['Solar panels','Solar + battery','Home battery','EV charger','Business or farm','Not sure yet'].map((s,i)=><label key={s}><input type="radio" name="services" value={s} defaultChecked={i===5}/><span>{s}</span></label>)}</div></fieldset>
 <label>Where is your property?<input name="address" autoComplete="address-level2" required maxLength={100} placeholder="Suburb or postcode"/></label>
 <label>Anything you’d like us to know? <span>(optional)</span><textarea name="message" rows={2} maxLength={1500} placeholder="Existing solar, a new home or plans for an EV…"/></label>
 <div className="simple-enquiry__grid"><label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Full name"/></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="Mobile or landline"/></label><label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com"/></label></div>
 <button type="submit" disabled={state==='sending'}>{state==='sending'?'Submitting…':'Request my free quote'}<ArrowUpRight size={20}/></button>
 {state==='error'&&<p role="alert">We couldn’t submit that. Please call <a href="tel:+61260212000">(02) 6021 2000</a>.</p>}
 <small>Free, no obligation. We use your details to respond to your enquiry. <a href="/privacy">Privacy policy</a></small>
 </form>;
}
export function ChecklistFormRegistration(){return null;}
