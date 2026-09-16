/* Bill-based savings estimator, the lead device on Tesla's and Palmetto's homepages. Inputs a quarterly bill
 * and a system choice; outputs a savings range using only the figures CES publishes on its FAQ (50–100%
 * with a battery, 3–6 year payback). Every result carries the same qualifier as the hero. No system sizes,
 * prices or payback dates are shown, because CES quotes those from the actual bills. */
import {useState,type CSSProperties} from 'react';
import {ArrowRight} from 'lucide-react';
import {Kicker} from './sections';

// CES FAQ: "Savings usually range between 50% and 100% ... If you add a battery, you can increase your savings further."
const BANDS={solar:{lo:.5,hi:.8,label:'Solar only'},both:{lo:.7,hi:1,label:'Solar + battery'}};
const fmt=(n:number)=>'$'+Math.round(n).toLocaleString('en-AU');

export function Estimator(){
  const [bill,setBill]=useState(600);
  const [kind,setKind]=useState<'solar'|'both'>('both');
  const b=BANDS[kind];
  const yearly=bill*4;
  const lo=yearly*b.lo,hi=yearly*b.hi;
  return <section className="estimator" aria-labelledby="est-heading"><div className="wrap estimator__grid">
    <div className="estimator__copy"><Kicker light>Quick estimate</Kicker><h2 id="est-heading">What could you save?</h2><p>Slide to your last quarterly bill. This uses the savings range our customers typically see — our solar consultant turns it into a real number from your bills.</p><ul className="estimator__facts"><li><strong>50–100%</strong> typical bill reduction</li><li><strong>3–6 yrs</strong> typical payback on panels</li><li><strong>25–30 yrs</strong> panel life</li></ul></div>
    <div className="estimator__card"><label className="estimator__label" htmlFor="est-bill">My last quarterly bill was about<output htmlFor="est-bill">{fmt(bill)}</output></label><input id="est-bill" type="range" min={200} max={2000} step={50} value={bill} onChange={e=>setBill(Number(e.target.value))} style={{'--p':((bill-200)/1800*100)+'%'} as CSSProperties} aria-valuetext={fmt(bill)+' per quarter'}/><div className="estimator__ticks" aria-hidden="true"><span>$200</span><span>$2,000</span></div>
      <div className="estimator__kind" role="group" aria-label="System type">{(Object.keys(BANDS) as ('solar'|'both')[]).map(k=><button key={k} type="button" aria-pressed={kind===k} onClick={()=>setKind(k)}>{BANDS[k].label}</button>)}</div>
      <div className="estimator__result" aria-live="polite"><span>You could save around</span><strong>{fmt(lo)} – {fmt(hi)}</strong><em>a year on your power bill</em><small>Bill of {fmt(yearly)} a year · {Math.round(b.lo*100)}–{Math.round(b.hi*100)}% saving with {b.label.toLowerCase()}</small></div>
      <a href="#quote" className="estimator__cta">Get my real number <ArrowRight size={18} aria-hidden="true"/></a>
      <p className="estimator__note">Typical range, not a quote. Your figure depends on roof, system size and when you use power — we calculate it from your actual bills before you decide anything.</p></div>
  </div></section>;
}
