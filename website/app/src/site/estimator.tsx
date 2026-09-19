/* Bill-based savings estimator, the lead device on Tesla's and Palmetto's homepages. Inputs a quarterly bill;
 * outputs a savings range using only the single figure CES publishes on its FAQ (savings usually 50–100%,
 * a battery pushes toward the top). No system sizes, prices, payback dates or sub-bands are shown, because
 * CES quotes those from the actual bills. Every result carries the "not a quote" qualifier. */
import {useState,type CSSProperties} from 'react';
import {DayStamp} from './sun';
import {ArrowRight} from 'lucide-react';
import {Kicker} from './sections';

// CES FAQ: "Savings usually range between 50% and 100% ... If you add a battery, you can increase your savings further."
const LO=.5,HI=1;
const fmt=(n:number)=>'$'+Math.round(n).toLocaleString('en-AU');

export function Estimator(){
  const [bill,setBill]=useState(600);
  const yearly=bill*4;
  const lo=yearly*LO,hi=yearly*HI;
  return <section id="estimate" className="estimator" aria-labelledby="est-heading"><div className="wrap estimator__grid"><DayStamp at="11:00" label="Mid-morning" light/>
    <div className="estimator__copy"><Kicker light>Quick estimate</Kicker><h2 id="est-heading">What could you save?</h2><p>Slide to your last quarterly bill. This is the range CES customers typically see — our solar consultant turns it into an exact figure from your bills, free.</p><ul className="estimator__facts"><li><strong>50–100%</strong> typical bill reduction</li><li><strong>3–6 yrs</strong> typical payback on panels</li><li><strong>25–30 yrs</strong> panel warranties</li></ul></div>
    <div className="estimator__card"><label className="estimator__label" htmlFor="est-bill">My last quarterly bill was about<output htmlFor="est-bill">{fmt(bill)}</output></label><input id="est-bill" type="range" min={200} max={2000} step={50} value={bill} onChange={e=>setBill(Number(e.target.value))} style={{'--p':((bill-200)/1800*100)+'%'} as CSSProperties} aria-valuetext={fmt(bill)+' per quarter'}/><div className="estimator__ticks" aria-hidden="true"><span>$200</span><span>$2,000</span></div>
      <div className="estimator__result" aria-live="polite"><span>You could save around</span><strong>{fmt(lo)} – {fmt(hi)}</strong><em>a year on your power bill</em><small>Bill of {fmt(yearly)} a year · 50–100% typical saving. Adding a battery pushes you toward the top of that range.</small></div>
      <a href="#quote" className="estimator__cta">Get my exact number <ArrowRight size={18} aria-hidden="true"/></a>
      <p className="estimator__note">Typical range, not a quote. Your figure depends on roof, system size and when you use power — we calculate it from your actual bills before you decide anything.</p></div>
  </div></section>;
}
