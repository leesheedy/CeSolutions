import {useState,type CSSProperties} from 'react';
import {ArrowUpRight,Sun,Moon,Info} from 'lucide-react';
import {RoofScene} from './roof';
const money=(n:number)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(n);
export function Estimator(){
 const [bill,setBill]=useState(600),[reduction,setReduction]=useState(50),[mode,setMode]=useState<'day'|'evening'>('day');
 const annual=bill*4,saved=annual*reduction/100;
 return <section id="estimate" className="energy-section" aria-labelledby="energy-title"><div className="home-wrap">
 <div className="home-section-head"><div><p className="home-eyebrow">Explore the difference</p><h2 id="energy-title">More of your own power.<br/>Less of the power bill.</h2></div><p>See how solar and storage work together, then explore what a lower bill could mean for you.</p></div>
 <div className="energy-studio">
 <div className={'energy-scene energy-scene--'+mode}><div className="energy-scene__top"><span>Your home, reimagined</span><div className="energy-tabs" role="group" aria-label="Home illustration time of day"><button type="button" aria-pressed={mode==='day'} onClick={()=>setMode('day')}><Sun size={16}/>Day</button><button type="button" aria-pressed={mode==='evening'} onClick={()=>setMode('evening')}><Moon size={16}/>Evening</button></div></div>
 <RoofScene mode={mode}/>
 <div className="energy-scene__story" aria-live="polite"><span className="energy-status"/><div><h3>{mode==='day'?'Make it. Use it. Store the rest.':'Your sunshine, after sunset.'}</h3><p>{mode==='day'?'Solar supplies your home. Surplus can charge a battery, then export to the grid.':'A charged battery can supply evening demand. The grid covers any shortfall.'}</p></div></div><p className="energy-scene__note">Illustrative home with solar and a battery. No live generation data.</p>
 </div>
 <div className="energy-calculator"><div className="energy-calculator__heading"><span>What could you save?</span><span>Bill illustration</span></div><label className="energy-bill-label" htmlFor="energy-bill">Your quarterly electricity bill</label><div className="energy-bill-input"><span aria-hidden="true">$</span><input id="energy-bill" type="number" inputMode="numeric" min={100} max={3000} step={50} value={bill} onChange={e=>setBill(Math.min(3000,Math.max(0,Number(e.target.value))))} onBlur={()=>setBill(v=>Math.max(100,v))} aria-describedby="energy-bill-hint"/><span>/ quarter</span></div><input className="energy-range" type="range" aria-label="Adjust quarterly electricity bill" min={100} max={3000} step={50} value={bill} onChange={e=>setBill(Number(e.target.value))} style={{'--range':((bill-100)/2900*100)+'%'} as CSSProperties}/><div id="energy-bill-hint" className="energy-range-labels"><span>$100</span><span>$3,000</span></div>
 <fieldset className="energy-scenarios"><legend>Explore a bill reduction of</legend><div>{[25,50,75].map(p=><button type="button" key={p} aria-pressed={p===reduction} onClick={()=>setReduction(p)}>{p}%</button>)}</div></fieldset>
 <div className="energy-result" aria-live="polite" aria-atomic="true"><span>At a {reduction}% reduction, you would save</span><p><strong>{money(saved)}</strong><span>/ year</span></p><div className="energy-comparison"><div><span>Current annual bill</span><b>{money(annual)}</b></div><div className="energy-bar"><span/></div><div><span>With this reduction</span><b>{money(annual-saved)}</b></div><div className="energy-bar energy-bar--after"><span style={{width:(100-reduction)+'%'}}/></div></div></div>
 <p className="energy-disclaimer"><Info size={15}/><span>You choose the percentage. This is simple bill arithmetic, not a savings forecast. Your actual result depends on your roof, usage, tariffs and system. Installation costs and payback are not included.</span></p><a className="energy-quote" href="#quote">Find out what suits my home <ArrowUpRight size={20}/></a>
 </div></div></div></section>
}
