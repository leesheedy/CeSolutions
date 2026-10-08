/* "How solar works" on /solar: one diagram of a home system, and four times of day that change where the power
 * is flowing. It steps through the day by itself until the visitor picks a time; reduced motion and the site's
 * "Pause animations" switch stop the stepping, and arrowheads still show direction when the dashes hold still. */
import {useEffect,useRef,useState,type ComponentType} from 'react';
import {ArrowRight,BatteryCharging,Cable,Grid2x2,House,Moon,Sun,Sunrise,Sunset,Zap,type LucideProps} from 'lucide-react';
import {Reveal,Rise} from './motion';
import {useCalm} from './a11y';

type Icon=ComponentType<LucideProps>;
type NodeId='sun'|'panels'|'inverter'|'home'|'battery'|'grid';
const nodes:{id:NodeId;label:string;Icon:Icon}[]=[
{id:'sun',label:'Sun',Icon:Sun},{id:'panels',label:'Panels',Icon:Grid2x2},{id:'inverter',label:'Inverter',Icon:Zap},
{id:'home',label:'Your home',Icon:House},{id:'battery',label:'Battery',Icon:BatteryCharging},{id:'grid',label:'The grid',Icon:Cable}];
// Each link is drawn from its first node to its second; a mode sets it to run forwards, backwards or not at all.
const links:[NodeId,NodeId][]=[['sun','panels'],['panels','inverter'],['inverter','home'],['home','battery'],['home','grid']];
type Flow='fwd'|'rev'|'off';
type Mode={id:string;tab:string;Icon:Icon;time:string;title:string;body:string;flows:Flow[];bought?:number;rows:[string,string,boolean][]};
const modes:Mode[]=[
{id:'morning',tab:'Morning',Icon:Sunrise,time:'About 6am to 10am',title:'The roof wakes up.',body:'As the sun climbs, your panels start producing and your home uses that power first. If the kettle, the toaster and the heater want more than the roof is making yet, the grid tops up the difference.',flows:['fwd','fwd','fwd','off','rev'],bought:4,rows:[['Your home','Solar first, grid tops up',true],['Battery','Waiting for spare solar',false],['The grid','Supplying the shortfall',true]]},
{id:'midday',tab:'Midday',Icon:Sun,time:'About 10am to 3pm',title:'More power than you can use.',body:'This is peak output. Your home runs on solar, the spare power charges the battery, and anything left after that is exported to the grid for a credit on your bill.',flows:['fwd','fwd','fwd','fwd','fwd'],rows:[['Your home','Running on solar',true],['Battery','Charging from spare solar',true],['The grid','Taking your surplus for a credit',true]]},
{id:'evening',tab:'Evening',Icon:Sunset,time:'About 6pm to 11pm',title:'Running on stored sunshine.',body:'The sun is down and grid power is at its dearest. Instead of buying it, your home draws on what the battery stored during the day.',flows:['off','off','off','rev','off'],rows:[['Your home','Running on the battery',true],['Battery','Powering the house',true],['The grid','Not needed',false]]},
{id:'overnight',tab:'Overnight',Icon:Moon,time:'About 11pm to 6am',title:'The grid as backup.',body:'Once the battery has done its job, the grid covers what is left, usually the fridge and a few standby loads. Then the sun comes up and it all starts again.',flows:['off','off','off','off','rev'],bought:4,rows:[['Your home','Light overnight loads',true],['Battery','Resting until morning',false],['The grid','Covering the remainder',true]]}];

type Pt={x:number;y:number};
const R=42,GAP=8;
const wide:Record<NodeId,Pt>={sun:{x:90,y:108},panels:{x:270,y:108},inverter:{x:450,y:108},battery:{x:270,y:278},home:{x:450,y:278},grid:{x:630,y:278}};
const tall:Record<NodeId,Pt>={sun:{x:190,y:62},panels:{x:190,y:196},inverter:{x:190,y:330},home:{x:190,y:464},battery:{x:58,y:464},grid:{x:322,y:464}};
function Diagram({portrait,mode}:{portrait:boolean;mode:Mode}){
  const pos=portrait?tall:wide,[w,h]=portrait?[380,560]:[720,372];
  const lit=new Set<NodeId>();
  links.forEach(([a,b],i)=>{if(mode.flows[i]!=='off'){lit.add(a);lit.add(b);}});
  const suffix=portrait?'t':'w';
  return <svg className={portrait?'eday-svg eday-svg--tall':'eday-svg eday-svg--wide'} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${mode.tab}: ${mode.rows.map(([n,s])=>n+', '+s.toLowerCase()).join('; ')}`}>
    <defs>
      <marker id={'eday-arrow-'+suffix} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></marker>
      <marker id={'eday-arrow-buy-'+suffix} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></marker>
    </defs>
    {links.map(([a,b],i)=>{
      const p=pos[a],q=pos[b],len=Math.hypot(q.x-p.x,q.y-p.y),ux=(q.x-p.x)/len,uy=(q.y-p.y)/len,o=R+GAP;
      const d=`M${p.x+ux*o} ${p.y+uy*o} L${q.x-ux*o} ${q.y-uy*o}`,f=mode.flows[i],buy=mode.bought===i,m=`url(#eday-arrow-${buy?'buy-':''}${suffix})`;
      return <g key={a+b}><path className="eday-rail" d={d}/>{f!=='off'&&<path className={'eday-flow eday-flow--'+f+(buy?' is-bought':'')} d={d} markerEnd={f==='fwd'?m:undefined} markerStart={f==='rev'?m:undefined}/>}</g>;
    })}
    {nodes.map(({id,label,Icon})=>{const p=pos[id],top=!portrait&&p.y<200,side=portrait&&p.x===190&&id!=='home';
      return <g key={id} className={lit.has(id)?'eday-node is-on':'eday-node'}><rect x={p.x-R} y={p.y-R} width={R*2} height={R*2} rx="22"/><Icon x={p.x-15} y={p.y-15} width={30} height={30} strokeWidth={1.75} aria-hidden="true"/>
        {side?<text x={p.x+R+16} y={p.y+6}>{label}</text>:<text x={p.x} y={top?p.y-R-14:p.y+R+26} textAnchor="middle">{label}</text>}
      </g>;})}
  </svg>;
}

const STEP_MS=6500;
export function SystemFlow(){
  const ref=useRef<HTMLElement>(null);
  const [active,setActive]=useState(1);
  const [auto,setAuto]=useState(true);
  const [seen,setSeen]=useState(false);
  const calm=useCalm();
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const io=new IntersectionObserver(([e])=>setSeen(e.isIntersecting),{threshold:.25});
    io.observe(el);return()=>io.disconnect();
  },[]);
  const running=auto&&seen&&!calm;
  useEffect(()=>{
    if(!running)return;
    const t=window.setInterval(()=>setActive(a=>(a+1)%modes.length),STEP_MS);
    return()=>window.clearInterval(t);
  },[running]);
  const pick=(i:number)=>{setActive(i);setAuto(false);};
  const mode=modes[active];
  return <section ref={ref} id="how-it-works" className="bg-stone py-20 md:py-28" aria-labelledby="flow-heading"><div className="wrap">
    <div className="grid items-end gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-16"><div><p className="eyebrow">How solar works</p><Reveal id="flow-heading" lines={['One day on solar,','start to finish.']} className="h-sec"/></div><p className="lede">Your system makes different choices at different hours. Pick a time of day to see where the power comes from and where it goes.</p></div>
    <Rise delay={.1}>
      <div className="eday-tabs" role="group" aria-label="Time of day">{modes.map((m,i)=><button key={m.id} type="button" aria-pressed={i===active} className={i===active?'is-on':''} onClick={()=>pick(i)}><m.Icon size={20} strokeWidth={1.9} aria-hidden="true"/><span>{m.tab}</span>{i===active&&running&&<i key={active} style={{animationDuration:STEP_MS+'ms'}} aria-hidden="true"/>}</button>)}</div>
      <div className="eday-stage">
        <div className="eday-diagram"><Diagram portrait={false} mode={mode}/><Diagram portrait mode={mode}/>
          <p className="eday-key"><span><i className="eday-key__own"/>Your own power</span><span><i className="eday-key__bought"/>Bought from the grid</span></p>
        </div>
        <div className="eday-panel" aria-live="polite"><div key={active} className="eday-panel__body">
          <p className="eday-panel__time">{mode.tab} · {mode.time}</p>
          <h3>{mode.title}</h3>
          <p>{mode.body}</p>
          <ul>{mode.rows.map(([n,s,on])=><li key={n} className={on?'is-on':''}><span>{n}</span><strong>{s}</strong></li>)}</ul>
        </div>
        <a className="link-arrow mt-6" href="/#quote">Size a system for my home <ArrowRight size={17} aria-hidden="true"/></a></div>
      </div>
      <p className="mt-6 max-w-[80ch] text-[14.5px] text-muted">No battery? Your home still uses its solar first and exports the rest. A battery can be added to most systems later. Times are a guide and shift with the season.</p>
    </Rise>
  </div></section>;
}
