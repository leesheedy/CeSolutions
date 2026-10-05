/* Bill-based savings estimator, the lead device on Tesla's and Palmetto's homepages. Inputs a quarterly bill;
 * outputs a savings range using only the single figure CES publishes on its FAQ (savings usually 50–100%,
 * a battery pushes toward the top). No system sizes, prices, payback dates or sub-bands are shown, because
 * CES quotes those from the actual bills. Every result carries the "not a quote" qualifier. */
import {useState,type CSSProperties} from 'react';
import {ArrowRight} from 'lucide-react';
import {Reveal,Rise} from './motion';

// CES FAQ: "Savings usually range between 50% and 100% ... If you add a battery, you can increase your savings further."
const LO=.5,HI=1;
const fmt=(n:number)=>'$'+Math.round(n).toLocaleString('en-AU');

const facts=[['50–100%','typical bill reduction'],['3–6 yrs','typical payback on panels'],['25–30 yrs','panel warranties']];
export function Estimator(){
  const [bill,setBill]=useState(600);
  const yearly=bill*4;
  const lo=yearly*LO,hi=yearly*HI;
  return <section id="estimate" className="py-20 md:py-28" aria-labelledby="est-heading"><div className="wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20">
    <div><p className="eyebrow">Savings estimate</p><Reveal id="est-heading" lines={['What could','you save?']} className="h-sec"/><Rise delay={.12}><p className="lede mt-5 max-w-[48ch]">Slide to your last quarterly bill. This is the range CES customers typically see. Our solar consultant turns it into an exact figure from your bills, free.</p>
      <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-line pt-7">{facts.map(([n,l])=><div key={l} className="flex flex-col"><dt className="order-last mt-1.5 text-[14.5px] leading-snug text-muted">{l}</dt><dd className="text-[clamp(1.35rem,2.2vw,1.9rem)] leading-none font-bold tracking-tight text-brand">{n}</dd></div>)}</dl></Rise></div>
    <Rise delay={.1}><div className="rounded-[28px] border border-line bg-white p-7 shadow-[var(--shadow-card)] md:p-9">
      <label className="flex items-end justify-between gap-4 text-[16px] font-semibold" htmlFor="est-bill">My last quarterly bill was about<output htmlFor="est-bill" className="text-[2rem] leading-none font-bold tracking-tight tabular-nums">{fmt(bill)}</output></label>
      <input id="est-bill" className="est-range mt-4" type="range" min={200} max={2000} step={50} value={bill} onChange={e=>setBill(Number(e.target.value))} style={{'--p':((bill-200)/1800*100)+'%'} as CSSProperties} aria-valuetext={fmt(bill)+' per quarter'}/>
      <div className="flex justify-between text-[14px] text-muted" aria-hidden="true"><span>$200</span><span>$2,000</span></div>
      <div className="mt-6 rounded-3xl bg-tint p-6" aria-live="polite"><span className="text-[15px] font-semibold text-brand-dark">You could save around</span><strong className="mt-1 block text-[clamp(2rem,4.4vw,3.1rem)] leading-none font-bold tracking-tight text-brand tabular-nums">{fmt(lo)} – {fmt(hi)}</strong><span className="mt-2 block text-[16px] font-semibold text-ink">a year on your power bill</span><span className="mt-2 block text-[14.5px] text-muted">Bill of {fmt(yearly)} a year · 50–100% typical saving. Adding a battery pushes you toward the top of that range.</span></div>
      <a href="#quote" className="btn btn--primary mt-6 w-full">Get my exact number <ArrowRight size={18} aria-hidden="true"/></a>
      <p className="mt-4 text-[14px] leading-relaxed text-muted">Typical range, not a quote. Your figure depends on roof, system size and when you use power. We calculate it from your actual bills before you decide anything.</p>
    </div></Rise>
  </div></section>;
}
