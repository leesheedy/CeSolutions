/* GSAP-driven pieces. GSAP and ScrollTrigger are loaded on the client only, after mount; the markup is
 * complete and readable without them, and `prefers-reduced-motion` skips every hidden start state. */
import {useEffect,useRef,useState,type ComponentType} from 'react';
import {BatteryCharging,Cable,Grid2x2,House,Sun,Zap,type LucideProps} from 'lucide-react';
import {Kicker} from './sections';

type Node={id:string;label:string;short:string;detail:string;time:string;Icon:ComponentType<LucideProps>};
const nodes:Node[]=[
{id:'sun',label:'Sunlight',short:'Sun hits your roof',time:'All day',detail:'Daylight lands on your roof, even on cloudy days. Panels still generate at reduced output when it’s overcast.',Icon:Sun},
{id:'panels',label:'Panels',short:'Panels make power',time:'Daytime',detail:'Your panels turn that light into DC electricity. More sun, more power — the middle of the day is your peak.',Icon:Grid2x2},
{id:'inverter',label:'Inverter',short:'Inverter converts it',time:'Instantly',detail:'The inverter turns DC into the AC power your home runs on. It is the brain of the system and what your monitoring app reads.',Icon:Zap},
{id:'home',label:'Your home',short:'Your home uses it first',time:'Daytime',detail:'Fridge, cooling, pool pump, the washing — anything running in daylight is powered by your roof before a cent comes from the grid.',Icon:House},
{id:'battery',label:'Battery',short:'Spare power charges the battery',time:'Afternoon',detail:'Whatever your home doesn’t use goes into the battery, so you run the evening on your own power instead of buying it at peak rates.',Icon:BatteryCharging},
{id:'grid',label:'The grid',short:'The rest is sold back',time:'Whenever there’s extra',detail:'Anything still left over is exported to the grid and credited on your bill. At night, or when the battery is empty, the grid picks up the slack.',Icon:Cable}];

function Diagram({vertical,active,onPick}:{vertical:boolean;active:number;onPick:(i:number)=>void}){
  const n=nodes.length,gap=vertical?110:200,r=34;
  const pos=(i:number)=>vertical?{x:50,y:50+i*gap}:{x:70+i*gap,y:70};
  const w=vertical?300:70+(n-1)*gap+70,h=vertical?50+(n-1)*gap+50:150;
  return <svg className={vertical?'flow-svg flow-svg--v':'flow-svg flow-svg--h'} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="How a solar system moves power from the sun to your home, battery and the grid">
    {nodes.slice(0,-1).map((_,i)=>{const a=pos(i),b=pos(i+1);const d=vertical?`M${a.x} ${a.y+r} L${b.x} ${b.y-r}`:`M${a.x+r} ${a.y} L${b.x-r} ${b.y}`;return <g key={i}><path className="flow-link" d={d}/><path className="flow-pulse" d={d}/></g>;})}
    {nodes.map((node,i)=>{const p=pos(i);return <g key={node.id} className={i===active?'flow-node is-active':'flow-node'} onClick={()=>onPick(i)} style={{cursor:'pointer'}}><circle cx={p.x} cy={p.y} r={r}/><node.Icon x={p.x-14} y={p.y-14} width={28} height={28} strokeWidth={1.75} aria-hidden="true"/>
      {vertical?<text className="flow-label" x={p.x+r+18} y={p.y+8}>{node.label}</text>:<text className="flow-label" x={p.x} y={p.y+r+26} textAnchor="middle">{node.label}</text>}
    </g>;})}
  </svg>;
}

/** "How your system works": connectors draw and nodes light up on scroll; the detail panel follows the
 * highlighted node, and any node can be tapped to read its step. */
export function SystemFlow(){
  const ref=useRef<HTMLElement>(null);
  const [active,setActive]=useState(0);
  const pinned=useRef(false);
  useEffect(()=>{
    const root=ref.current;
    if(!root||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let cleanup=()=>{};
    void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      if(!root.isConnected)return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx=gsap.context(()=>{
        for(const svg of root.querySelectorAll<SVGSVGElement>('.flow-svg')){
          if(svg.getClientRects().length===0)continue;
          const links=[...svg.querySelectorAll<SVGPathElement>('.flow-link')];
          const pulses=[...svg.querySelectorAll<SVGPathElement>('.flow-pulse')];
          const nodesEls=[...svg.querySelectorAll<SVGGElement>('.flow-node')];
          for(const l of links){const len=l.getTotalLength();l.style.strokeDasharray=String(len);l.style.strokeDashoffset=String(len);}
          gsap.set(nodesEls.slice(1),{opacity:.3});
          // The detail panel reads the *scrubbed* timeline progress so it never runs ahead of the line being drawn.
          const tl=gsap.timeline({scrollTrigger:{trigger:svg,start:'top 78%',end:'bottom 40%',scrub:.6},onUpdate:()=>{if(!pinned.current)setActive(Math.min(nodes.length-1,Math.round(tl.progress()*(nodes.length-1))));}});
          links.forEach((l,i)=>{tl.to(l,{strokeDashoffset:0,ease:'none',duration:1},i).to(nodesEls[i+1],{opacity:1,duration:.4,ease:'none'},i+.6).call(()=>pulses[i]?.classList.toggle('is-live',tl.progress()>(i+.95)/links.length),[],i+.95);});
        }
      },root);
      root.classList.add('gsap-ready');
      cleanup=()=>{ctx.revert();root.classList.remove('gsap-ready');};
    });
    return()=>cleanup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  const pick=(i:number)=>{setActive(i);pinned.current=true;};
  const node=nodes[active];
  return <section ref={ref} className="flow-section" aria-labelledby="flow-heading"><div className="wrap">
    <div className="flow-head"><div><Kicker>How it works</Kicker><h2 id="flow-heading">Sun to switchboard,<br/>in six steps.</h2></div><p className="flow-intro">Every system we install does this. We size each part to your roof and your bills, and walk you through it again on install day.</p></div>
    <Diagram vertical={false} active={active} onPick={pick}/><Diagram vertical active={active} onPick={pick}/>
    <div className="flow-detail-panel"><span className="flow-detail-n">{String(active+1).padStart(2,'0')} / 06 · {node.time}</span><h3>{node.short}</h3><p>{node.detail}</p><div className="flow-dots" aria-label="Steps">{nodes.map((n,i)=><button key={n.id} type="button" aria-pressed={i===active} aria-label={n.label} className={i===active?'is-on':''} onClick={()=>pick(i)}/>)}</div></div>
    <ol className="flow-steps sr-only">{nodes.map((n,i)=><li key={n.id}>{i+1}. {n.short} — {n.detail}</li>)}</ol>
  </div></section>;
}

/** Fills the line beside the process steps and lights each step as it reaches the middle of the viewport. */
export function ProcessMotion(){
  useEffect(()=>{
    const list=document.querySelector<HTMLElement>('.process-list');
    if(!list||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let cleanup=()=>{};
    void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      if(!list.isConnected)return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx=gsap.context(()=>{
        const fill=list.querySelector<HTMLElement>('.process-line i');
        if(fill)gsap.fromTo(fill,{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:list,start:'top 65%',end:'bottom 60%',scrub:.4}});
        for(const step of list.querySelectorAll<HTMLElement>('article')){
          ScrollTrigger.create({trigger:step,start:'top 62%',end:'bottom 40%',toggleClass:{targets:step,className:'is-active'}});
        }
      },list);
      list.classList.add('gsap-ready');
      cleanup=()=>{ctx.revert();list.classList.remove('gsap-ready');};
    });
    return()=>cleanup();
  },[]);
  return null;
}
