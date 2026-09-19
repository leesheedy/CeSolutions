/* Illustrates the annual value of a 50–100% bill reduction using CES's published FAQ range.
 * This is percentage arithmetic, not a system model or a property-specific forecast.
 * Equipment costs, finance and payback require a tailored quote. */
import {useState,type CSSProperties} from 'react';
import {RoofScene} from './roof';
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
    <div className="estimator__copy"><Kicker light>Bill savings illustration</Kicker><h2 id="est-heading">What could a lower bill mean?</h2><p>Start with your quarterly bill to explore the value of a reduction in grid costs. Then ask us for a property-specific assessment based on your roof, tariff and energy use.</p><ul className="estimator__facts"><li><strong>Your bills</strong> shape the recommendation</li><li><strong>Your roof</strong> determines the design</li><li><strong>Your plans</strong> guide future options</li></ul><RoofScene/></div>
    <div className="estimator__card"><label className="estimator__label" htmlFor="est-bill">My last quarterly bill was about<output htmlFor="est-bill">{fmt(bill)}</output></label><input id="est-bill" type="range" min={200} max={2000} step={50} value={bill} onChange={e=>setBill(Number(e.target.value))} style={{'--p':((bill-200)/1800*100)+'%'} as CSSProperties} aria-valuetext={fmt(bill)+' per quarter'}/><div className="estimator__ticks" aria-hidden="true"><span>$200</span><span>$2,000</span></div>
      <div className="estimator__result" aria-live="polite"><span>If your bill fell by 50–100%</span><strong>{fmt(lo)} – {fmt(hi)}</strong><em>would be the annual reduction</em><small>Based on {fmt(yearly)} a year at your selected quarterly bill. This is a percentage illustration, not a prediction for your property.</small></div>
      <a href="#quote" className="estimator__cta">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a>
      <p className="estimator__note">The percentage range comes from the CES FAQ. Actual savings can fall outside it and depend on generation, usage, tariffs and system design. This illustration does not calculate system costs, finance or payback.</p></div>
  </div></section>;
}
