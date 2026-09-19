import {useEffect,useRef,useState} from 'react';
import {DayStamp} from './sun';
import {createPortal} from 'react-dom';
import {AnimatePresence,motion,useReducedMotion,useScroll} from 'motion/react';
import {ChevronLeft,ChevronRight,X} from 'lucide-react';
import {ScrollChars,ScrollPhotos} from '@/components/ui/text-scroll-animation';
import {Arrow} from './shell';
import {MAPS,Kicker} from './sections';
import {Parallax,Rise} from './motion';
import {lockScroll} from './scroll-lock';
/** Responsive variants exist for the CES job photos (600/900/1200 px); Instagram/site photos ship one size. */
const variants=(img:string)=>img.startsWith('ces-')?[600,900,1200].map(w=>`/assets/${img.replace('.webp','')}-${w}.webp ${w}w`).join(', '):undefined;
const small=(img:string)=>img.startsWith('ces-')?img.replace('.webp','-600.webp'):img;
const medium=(img:string)=>img.startsWith('ces-')?img.replace('.webp','-1200.webp'):img;
/* CES job photos from the cesolutions.com.au media library (the crews’ own Facebook shots, re-hosted by CES),
 * public Instagram posts and a few site photos — all listed in asset-sources.json. Titles say what the photo
 * shows; the `kind` line is what a visitor scans. Equipment brands are named only where the logo is legible. */
type Work={id:string;category:'Solar'|'Batteries'|'Our team';shape:'portrait'|'landscape';image:string;width:number;height:number;kind:string;title:string;body:string;href:string;source:string;alt:string;feature?:boolean};
const work:Work[]=[
{id:'sunset',category:'Solar',shape:'landscape',feature:true,image:'ces-roof-sunset-hills.webp',width:1600,height:1200,kind:'Rural · shed roof',title:'Last light on a new array.',body:'Panels across a shed roof at dusk, snow still on the ranges behind. Farm sheds are some of the best solar hosts we work with: big, simple roofs and daytime loads.',href:'/assets/ces-roof-sunset-hills.webp',source:'CES job photo',alt:'Rows of solar panels on a corrugated shed roof at sunset with paddocks and snow-capped mountains behind'},
{id:'tile-pool',category:'Solar',shape:'landscape',image:'ces-drone-pool-tile.webp',width:1600,height:900,kind:'Residential · tile roof',title:'Panels across four roof faces.',body:'A big tile roof with the array split across every north- and west-facing section, laid out from the drone before the crew went up.',href:'/assets/ces-drone-pool-tile.webp',source:'CES job photo',alt:'Drone view of a brick home with a swimming pool and solar panels on several sections of its tile roof'},
{id:'garage',category:'Batteries',shape:'landscape',image:'ces-garage-byd-fronius.webp',width:1600,height:1200,kind:'Home battery · garage',title:'Two battery stacks, two inverters, one EV charger.',body:'A larger home setup in the garage: BYD battery towers, Fronius inverters and a wall-mounted EV charger, with bollards so the car can never reach them.',href:'/assets/ces-garage-byd-fronius.webp',source:'CES job photo',alt:'Garage with two white battery towers, two Fronius inverters and an EV charger mounted on brick walls, with yellow bollards'},
{id:'crew',category:'Our team',shape:'portrait',image:'ces-install-crew-roof.webp',width:721,height:721,kind:'Our team · on the tools',title:'Two of the crew, mid-install.',body:'Clamping panels to the rails on a tin roof. Our own electricians do the work — no subcontractors.',href:'/assets/ces-install-crew-roof.webp',source:'CES job photo',alt:'Two CES installers in branded shirts fixing solar panels to rails on a corrugated roof, a house with panels behind'},
{id:'faces',category:'Solar',shape:'landscape',image:'ces-drone-pool-faces.webp',width:1600,height:900,kind:'Residential · large system',title:'A big roof, used properly.',body:'Panels on five faces of a large Colorbond roof, with the crew’s ute and racks still in the driveway.',href:'/assets/ces-drone-pool-faces.webp',source:'CES job photo',alt:'Drone view of a large home with a pool and solar panels on several faces of its grey metal roof'},
{id:'powerwalls',category:'Batteries',shape:'landscape',image:'ces-powerwalls-enclosure.webp',width:1600,height:1200,kind:'Home battery · Tesla Powerwall',title:'Two Powerwalls, out of the weather.',body:'A pair of Tesla Powerwalls under a purpose-built cover beside the meter box. Placement and shading are part of every battery design.',href:'/assets/ces-powerwalls-enclosure.webp',source:'CES job photo',alt:'Two Tesla Powerwall batteries inside a dark metal enclosure against a light grey wall, next to a meter box'},
{id:'rural',category:'Solar',shape:'landscape',image:'ces-drone-rural-court.webp',width:1600,height:1095,kind:'Rural · homestead',title:'Country home, north-facing array.',body:'Panels on the best face of a big rural roof. Wide blocks give us room to size for a battery or an EV later, not just today’s bill.',href:'/assets/ces-drone-rural-court.webp',source:'CES job photo',alt:'Aerial view of a large brick country home with a tennis court and pool, solar panels on one roof section'},
{id:'wiring',category:'Batteries',shape:'portrait',image:'ces-install-battery-wiring.webp',width:1536,height:2048,kind:'Home battery · garage',title:'Wiring up the battery.',body:'One of our electricians commissioning a battery under its inverter in a garage. Neat conduit and a clear label set are part of the job.',href:'/assets/ces-install-battery-wiring.webp',source:'CES job photo',alt:'A CES electrician crouched beside a home battery, wiring it under a wall-mounted inverter on a red brick wall'},
{id:'bigsky',category:'Solar',shape:'portrait',image:'ces-roof-big-sky.webp',width:1536,height:2048,kind:'Residential · Colorbond roof',title:'Two clean rows, big sky.',body:'Standard corrugated roof, panels flush to the pitch. Photographed by the crew before they packed up.',href:'/assets/ces-roof-big-sky.webp',source:'CES job photo',alt:'Two rows of solar panels on a white corrugated roof under a bright blue sky with clouds'},
{id:'shed',category:'Solar',shape:'portrait',image:'instagram-shed.webp',width:1600,height:1600,kind:'Shed · farm & rural',title:'A whole shed roof of panels.',body:'Sheds, workshops and farm buildings: big, simple roofs and daytime demand.',href:'https://www.instagram.com/cesolutions1/p/DciM1ayIAv3/',source:'@cesolutions1 · Aug 2026',alt:'Black solar panels across a new shed roof, installed by CES'},
{id:'lift',category:'Batteries',shape:'portrait',image:'ces-install-battery-lift.webp',width:1536,height:2048,kind:'Our team · on the tools',title:'Onto the wall it goes.',body:'One of our electricians lifting the inverter into position, cable runs already sorted so the finish is tidy.',href:'/assets/ces-install-battery-lift.webp',source:'CES job photo',alt:'A CES electrician in a branded singlet lifting a white wall unit into place on a grey wall with cables ready'},
{id:'drone',category:'Solar',shape:'landscape',image:'instagram-roof-drone.webp',width:1600,height:1600,kind:'Residential · rooftop solar',title:'Black-on-red, from above.',body:'All-black panels on a red corrugated roof. The drone shot is how we check a layout on install day.',href:'https://www.instagram.com/cesolutions1/p/Dccg6arnFf3/',source:'@cesolutions1 · Aug 2026',alt:'Drone view of black solar panels on a red corrugated roof, installed by CES'},
{id:'gums',category:'Solar',shape:'portrait',image:'ces-roof-gums.webp',width:1536,height:1536,kind:'Residential · tin roof',title:'Panels, clouds and gum trees.',body:'A dark tin roof with the array set close to the ridge for the best sun.',href:'/assets/ces-roof-gums.webp',source:'CES job photo',alt:'Solar panels on a dark corrugated roof with gum trees and a cloudy blue sky behind'},
{id:'battery',category:'Batteries',shape:'landscape',image:'battery.webp',width:1500,height:1000,kind:'Home battery · wall-mounted',title:'Battery and inverter, tidy.',body:'Mounted on an external wall with the conduit run neatly. Backup, capacity and placement are all part of the design chat.',href:'/batteries',source:'cesolutions.com.au',alt:'Home battery and inverter mounted on a timber-clad exterior wall'},
{id:'daniel',category:'Our team',shape:'portrait',image:'ces-installer-selfie.webp',width:1179,height:1572,kind:'Our team · on the roof',title:'Daniel, mid-install.',body:'A licensed electrician with more than 15 years installing solar on the Border, and the person who leads our crews.',href:'/about',source:'cesolutions.com.au',alt:'Daniel Grubisa in a hi-vis shirt on a roof beside newly installed solar panels'},
{id:'people',category:'Our team',shape:'landscape',image:'instagram-crew.webp',width:1600,height:1060,kind:'Our team · the crew',title:'The people behind the panels.',body:'The installers, designers and office team, all on one payroll in Wodonga.',href:'https://www.instagram.com/cesolutions1/p/DdAkDIQIPCf/',source:'@cesolutions1 · Sep 2026',alt:'The CES team together at their workplace'},
{id:'people-close',category:'Our team',shape:'portrait',image:'instagram-team.webp',width:1200,height:1500,kind:'Our team · your first call',title:'The people you’ll actually talk to.',body:'Ask us about your bills, your roof or the system you already have. We answer in plain language.',href:'https://www.instagram.com/cesolutions1/p/DdISbZLDSY9/',source:'@cesolutions1 · Sep 2026',alt:'Two CES team members in company uniforms'},
{id:'shop',category:'Our team',shape:'landscape',image:'team.webp',width:1800,height:992,kind:'Our office · Wodonga',title:'79 Elgin Boulevard.',body:'Drop in with a bill and we’ll talk it through in person.',href:MAPS,source:'cesolutions.com.au',alt:'The Clean Energy Solutions shopfront on a red-brick corner building'}];
const filters=['All','Solar','Batteries','Our team'] as const;
/** Pinned intro: the words "Our work" converge and the photos fan in as the section scrolls. */
function WorkIntro(){
  const ref=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const photos=work.slice(0,6).map(p=>({src:'/assets/'+small(p.image),alt:p.alt,width:p.width,height:p.height,href:p.href}));
  return <div ref={ref} className="work-intro"><div className="work-intro__pin"><Kicker light>Real installs, real people</Kicker><h2 className="work-intro__title"><ScrollChars text="Our work" progress={scrollYProgress}/></h2><ScrollPhotos photos={photos} progress={scrollYProgress} className="work-fan" itemClassName="work-fan__item" spread={120} tilt={10} drop={28}/><p className="work-intro__caption">Photography from our crews and <a href="https://www.instagram.com/cesolutions1/">@cesolutions1</a>. Nothing staged, nothing stock.</p></div></div>;
}
/** Full-screen viewer: tap a photo to see it large, arrows/swipe between them, Esc or × to close. Rendered in a
 * portal on <body>; the rest of the page is made inert while it is open, Tab cycles inside, and focus returns
 * to whatever opened it. */
function Lightbox({items,index,onClose,onMove}:{items:Work[];index:number;onClose:()=>void;onMove:(d:1|-1)=>void}){
  const reduce=useReducedMotion();
  const closeRef=useRef<HTMLButtonElement>(null);
  const rootRef=useRef<HTMLDivElement>(null);
  const cb=useRef({onClose,onMove});cb.current={onClose,onMove};
  useEffect(()=>{
    const opener=document.activeElement as HTMLElement|null;
    const unlock=lockScroll();
    const others=[...document.querySelectorAll<HTMLElement>('header,main,footer,.mobile-dock')];
    for(const el of others)el.setAttribute('inert','');
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==='Escape')cb.current.onClose();
      else if(e.key==='ArrowRight')cb.current.onMove(1);
      else if(e.key==='ArrowLeft')cb.current.onMove(-1);
      else if(e.key==='Tab'&&rootRef.current){const f=[...rootRef.current.querySelectorAll<HTMLElement>('button,a[href]')];const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    };
    document.addEventListener('keydown',onKey);
    const id=window.setTimeout(()=>closeRef.current?.focus(),30);
    return()=>{unlock();for(const el of others)el.removeAttribute('inert');document.removeEventListener('keydown',onKey);window.clearTimeout(id);opener?.focus({preventScroll:true});};
  },[]);
  const p=items[index];
  return createPortal(<motion.div ref={rootRef} className="lightbox" role="dialog" aria-modal="true" aria-label={p.title} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?0:.2}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <span className="lightbox__count">{index+1} / {items.length}</span>
    <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close"><X size={22} aria-hidden="true"/></button>
    {items.length>1&&<><button type="button" className="lightbox__btn lightbox__prev" onClick={()=>onMove(-1)} aria-label="Previous photo"><ChevronLeft size={24} aria-hidden="true"/></button><button type="button" className="lightbox__btn lightbox__next" onClick={()=>onMove(1)} aria-label="Next photo"><ChevronRight size={24} aria-hidden="true"/></button></>}
    <motion.div key={p.id} className="lightbox__img" initial={{opacity:0,scale:reduce?1:.97}} animate={{opacity:1,scale:1}} transition={{duration:reduce?0:.25}} drag={reduce?false:'x'} dragConstraints={{left:0,right:0}} dragElastic={.2} onDragEnd={(_,i)=>{if(i.offset.x<-60)onMove(1);else if(i.offset.x>60)onMove(-1);}}><img src={'/assets/'+p.image} srcSet={variants(p.image)} sizes="100vw" alt={p.alt} width={p.width} height={p.height} draggable={false}/></motion.div>
    <div className="lightbox__cap"><span>{p.kind}</span><strong>{p.title}</strong><p>{p.body}</p><a href={p.href}>{p.source} <Arrow/></a></div>
  </motion.div>,document.body);
}
export function ProjectGallery(){
  const [filter,setFilter]=useState<(typeof filters)[number]>('All');
  const [lit,setLit]=useState<number|null>(null);
  const [all,setAll]=useState(false);
  const CAP=9;
  const matching=work.filter(p=>filter==='All'||p.category===filter);
  const visible=all||filter!=='All'?matching:matching.slice(0,CAP);
  const counts=Object.fromEntries(filters.map(f=>[f,f==='All'?work.length:work.filter(p=>p.category===f).length]));
  const move=(d:1|-1)=>setLit(i=>i===null?null:(i+d+visible.length)%visible.length);
  return <section id="our-work" className="work-section"><WorkIntro/><div className="wrap"><DayStamp at="15:30" label="Afternoon" light/>
    <div className="work-controls" role="group" aria-label="Filter CES photos">{filters.map(v=><button key={v} type="button" aria-pressed={filter===v} onClick={()=>{setFilter(v);setLit(null);setAll(false);}}>{v}<span className="work-controls__n">{counts[v]}</span></button>)}</div>
    <div className="work-masonry" key={filter}>{visible.map((p,i)=><Rise key={p.id} delay={Math.min(i,4)*.06}><article className={'work-card'+(p.feature&&filter==='All'?' work-card--feature':'')} data-shape={p.shape}><a className="work-image" href={p.href} aria-label={'View larger: '+p.title} onClick={e=>{e.preventDefault();setLit(i);}}><Parallax intensity={p.feature?36:22}><img src={'/assets/'+medium(p.image)} srcSet={variants(p.image)} sizes={p.feature&&filter==='All'?'(max-width:1100px) 100vw, 66vw':'(max-width:600px) 100vw, (max-width:1100px) 50vw, 33vw'} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async"/></Parallax><span className="work-card__kind">{p.kind}</span><span className="work-card__open" aria-hidden="true"><Arrow/></span></a><div className="work-card__body"><h3><a href={p.href}>{p.title}</a></h3><p>{p.body}</p><span className="work-card__source">{p.source}</span></div></article></Rise>)}</div>
    {!all&&filter==='All'&&matching.length>CAP&&<div className="work-showall"><button type="button" onClick={()=>setAll(true)}>Show all {matching.length} photos</button></div>}
    <div className="work-more"><p>Want to see a system like yours? Ask our solar consultant for install photos from your area.</p><a className="instagram-link" href="https://www.instagram.com/cesolutions1/">Follow @cesolutions1 <Arrow/></a></div>
  </div>
  <AnimatePresence>{lit!==null&&visible[lit]&&<Lightbox items={visible} index={lit} onClose={()=>setLit(null)} onMove={move}/>}</AnimatePresence>
  </section>;
}
export function SiteMotion(){useEffect(()=>{const motion=matchMedia('(prefers-reduced-motion: reduce)');const active=new Set<Animation>();let observer:IntersectionObserver|undefined;const stop=()=>{observer?.disconnect();for(const a of active)a.cancel();active.clear();};const start=()=>{stop();if(motion.matches)return;observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){const a=e.target.animate([{transform:'translateY(14px)'},{transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.65,.3,1)',fill:'none'});active.add(a);a.onfinish=()=>active.delete(a);observer?.unobserve(e.target);}}},{threshold:.12});document.querySelectorAll('.section-heading,.team-copy,.reason-list article,.process-list article').forEach(el=>observer?.observe(el));};start();motion.addEventListener('change',start);return()=>{stop();motion.removeEventListener('change',start);};},[]);return null;}
