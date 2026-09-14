/* GSAP-driven pieces. GSAP and ScrollTrigger are loaded on the client only, after mount; the markup is
 * complete and readable without them, and `prefers-reduced-motion` skips every hidden start state. */
import {useEffect,useRef,type ComponentType} from 'react';
import {BatteryCharging,Cable,Grid2x2,House,Sun,Zap,type LucideProps} from 'lucide-react';

type Node={id:string;label:string;detail:string;Icon:ComponentType<LucideProps>};
const nodes:Node[]=[
{id:'sun',label:'Sunlight',detail:'Daylight lands on your roof, even on cloudy days.',Icon:Sun},
{id:'panels',label:'Panels',detail:'Panels turn that light into DC electricity.',Icon:Grid2x2},
{id:'inverter',label:'Inverter',detail:'The inverter converts it into power your home can use.',Icon:Zap},
{id:'home',label:'Your home',detail:'Your appliances run on your own power first.',Icon:House},
{id:'battery',label:'Battery',detail:'Spare daytime power charges the battery for tonight.',Icon:BatteryCharging},
{id:'grid',label:'The grid',detail:'Anything left over is exported and credited to your bill.',Icon:Cable}];

function Diagram({vertical}:{vertical:boolean}){
  // Vertical (phone) layout shows labels only; the numbered list under the diagram carries the details.
  const n=nodes.length,gap=vertical?120:200,r=34;
  const pos=(i:number)=>vertical?{x:50,y:50+i*gap}:{x:70+i*gap,y:70};
  const w=vertical?300:70+(n-1)*gap+70,h=vertical?50+(n-1)*gap+50:150;
  return <svg className={vertical?'flow-svg flow-svg--v':'flow-svg flow-svg--h'} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="How a solar system moves power from the sun to your home, battery and the grid">
    {nodes.slice(0,-1).map((_,i)=>{const a=pos(i),b=pos(i+1);const d=vertical?`M${a.x} ${a.y+r} L${b.x} ${b.y-r}`:`M${a.x+r} ${a.y} L${b.x-r} ${b.y}`;return <path key={i} className="flow-link" d={d}/>;})}
    {nodes.map((node,i)=>{const p=pos(i);return <g key={node.id} className="flow-node"><circle cx={p.x} cy={p.y} r={r}/><node.Icon x={p.x-14} y={p.y-14} width={28} height={28} strokeWidth={1.75} aria-hidden="true"/>
      {vertical?<text className="flow-label" x={p.x+r+18} y={p.y+8}>{node.label}</text>:<text className="flow-label" x={p.x} y={p.y+r+26} textAnchor="middle">{node.label}</text>}
    </g>;})}
  </svg>;
}

/** "How your system works": the connectors draw and the nodes light up as the section scrolls into view. */
export function SystemFlow(){
  const ref=useRef<HTMLElement>(null);
  useEffect(()=>{
    const root=ref.current;
    if(!root||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let cleanup=()=>{};
    void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      if(!root.isConnected)return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx=gsap.context(()=>{
        for(const svg of root.querySelectorAll<SVGSVGElement>('.flow-svg')){
          if(svg.getClientRects().length===0)continue; // the orientation hidden by CSS
          const links=[...svg.querySelectorAll<SVGPathElement>('.flow-link')];
          const nodesEls=[...svg.querySelectorAll<SVGGElement>('.flow-node')];
          for(const l of links){const len=l.getTotalLength();l.style.strokeDasharray=String(len);l.style.strokeDashoffset=String(len);}
          gsap.set(nodesEls.slice(1),{opacity:.25});
          const tl=gsap.timeline({scrollTrigger:{trigger:svg,start:'top 78%',end:'bottom 45%',scrub:.6}});
          links.forEach((l,i)=>{tl.to(l,{strokeDashoffset:0,ease:'none',duration:1},i).to(nodesEls[i+1],{opacity:1,duration:.4,ease:'none'},i+.6);});
        }
        for(const li of root.querySelectorAll<HTMLElement>('.flow-steps li')){
          gsap.from(li,{opacity:0,y:18,duration:.6,ease:'power2.out',scrollTrigger:{trigger:li,start:'top 88%',once:true}});
        }
      },root);
      root.classList.add('gsap-ready');
      cleanup=()=>{ctx.revert();root.classList.remove('gsap-ready');};
    });
    return()=>cleanup();
  },[]);
  return <section ref={ref} className="flow-section" aria-labelledby="flow-heading"><div className="wrap"><span className="eyebrow">How it works</span><h2 id="flow-heading">Solar in six steps.<br/>No jargon.</h2><p className="flow-intro">This is the whole system. We design each part around your roof and your bills, then explain it again on install day.</p><Diagram vertical={false}/><Diagram vertical/><ol className="flow-steps">{nodes.map((node,i)=><li key={node.id}><span className="flow-step-n">{String(i+1).padStart(2,'0')}</span><div><strong>{node.label}</strong><p>{node.detail}</p></div></li>)}</ol></div></section>;
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
