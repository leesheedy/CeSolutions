import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {ChevronLeft,ChevronRight,X} from 'lucide-react';
import {Arrow} from './shell';
import {MAPS} from './sections';
import {Parallax,Reveal,Rise} from './motion';
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
{id:'sunset',category:'Solar',shape:'landscape',feature:true,image:'ces-roof-sunset-hills.webp',width:1600,height:1200,kind:'Rural · shed roof',title:'A farm shed that earns its keep.',body:'Tilt-mounted panels on a big shed roof, making power while the farm is at work. Got a shed? Send us a bill and we’ll size a system for it.',href:'/assets/ces-roof-sunset-hills.webp',source:'CES job photo',alt:'Rows of solar panels on a corrugated shed roof at sunset with paddocks and snow-capped mountains behind'},
{id:'tile-pool',category:'Solar',shape:'landscape',image:'ces-drone-pool-tile.webp',width:1600,height:900,kind:'Residential · tile roof',title:'A tile roof with plenty of angles.',body:'A big tile roof with the panels spread over several sections. We planned the layout from drone photos before the crew went up.',href:'/assets/ces-drone-pool-tile.webp',source:'CES job photo',alt:'Drone view of a brick home with a swimming pool and solar panels on several sections of its tile roof'},
{id:'tin-single',category:'Solar',shape:'portrait',image:'drone-tin-single-array.webp',width:500,height:500,kind:'Residential · tin roof',title:'One roof face, one tidy array.',body:'All the panels together on the best side of a light tin roof. Simple layouts like this are quick to install and easy to service.',href:'/assets/drone-tin-single-array.webp',source:'CES job photo',alt:'Drone view of a home with a light tin roof and a single large block of black solar panels on one side'},
{id:'garage',category:'Batteries',shape:'landscape',image:'ces-garage-byd-fronius.webp',width:1600,height:1200,kind:'Home battery · garage',title:'Two battery stacks, two inverters, one EV charger.',body:'A larger home setup in the garage: two battery towers, Fronius inverters and a wall-mounted EV charger, with bollards so the car can’t reach them.',href:'/assets/ces-garage-byd-fronius.webp',source:'CES job photo',alt:'Garage with two white battery towers, two Fronius inverters and an EV charger mounted on brick walls, with yellow bollards'},
{id:'crew',category:'Our team',shape:'portrait',image:'ces-install-crew-roof.webp',width:721,height:721,kind:'Our team · on the tools',title:'Two of the crew, mid-install.',body:'Clamping panels to the rails on a tin roof. Our own electricians do the work, not subcontractors.',href:'/assets/ces-install-crew-roof.webp',source:'CES job photo',alt:'Two installers, one in a Clean Energy Solutions shirt, fixing solar panels to rails on a corrugated roof'},
{id:'faces',category:'Solar',shape:'landscape',image:'ces-drone-pool-faces.webp',width:1600,height:900,kind:'Residential · large system',title:'A big Colorbond roof.',body:'Panels on several sides of a large Colorbond roof. That’s our ute in the driveway, racks still on.',href:'/assets/ces-drone-pool-faces.webp',source:'CES job photo',alt:'Drone view of a large home with a pool and solar panels on several faces of its grey metal roof'},
{id:'tile-two-storey',category:'Solar',shape:'portrait',image:'drone-tile-two-storey.webp',width:500,height:500,kind:'Residential · two-storey tile',title:'A two-storey tile roof, fully used.',body:'Panels on five sections of a dark tile roof, worked around the hips and a skylight. We map a roof like this from above before anyone climbs a ladder.',href:'/assets/drone-tile-two-storey.webp',source:'CES job photo',alt:'Drone view of a two-storey home with a dark tile roof and solar panels on several roof sections'},
{id:'powerwalls',category:'Batteries',shape:'landscape',image:'ces-powerwalls-enclosure.webp',width:1600,height:1200,kind:'Home battery · Tesla Powerwall',title:'Two Powerwalls, out of the weather.',body:'A pair of Tesla Powerwalls under a purpose-built cover beside the meter box. Placement and shading are part of every battery design.',href:'/assets/ces-powerwalls-enclosure.webp',source:'CES job photo',alt:'Two Tesla Powerwall batteries inside a dark metal enclosure against a light grey wall, next to a meter box'},
{id:'weatherboard',category:'Solar',shape:'portrait',image:'drone-weatherboard-steep.webp',width:500,height:500,kind:'Residential · weatherboard',title:'An older home, a steep roof.',body:'Two rows of panels on the steep tin roof of a weatherboard house. Older homes take solar well when the layout is planned around the roof.',href:'/assets/drone-weatherboard-steep.webp',source:'CES job photo',alt:'Drone view of a weatherboard house with two rows of solar panels on its steep tin roof'},
{id:'rural',category:'Solar',shape:'landscape',image:'ces-drone-rural-court.webp',width:1600,height:1095,kind:'Rural · homestead',title:'Country home, one clean array.',body:'Panels on one face of a big rural roof. Wide blocks give us room to size for a battery or an EV later, not just today’s bill.',href:'/assets/ces-drone-rural-court.webp',source:'CES job photo',alt:'Aerial view of a large brick country home with a tennis court and pool, solar panels on one roof section'},
{id:'colorbond-country',category:'Solar',shape:'portrait',image:'drone-colorbond-country.webp',width:500,height:500,kind:'Residential · Colorbond',title:'A long Colorbond roof on a big block.',body:'Panels in three groups along a low-pitched Colorbond roof, placed to catch the sun through the day.',href:'/assets/drone-colorbond-country.webp',source:'CES job photo',alt:'Drone view of a long Colorbond-roofed home on a lawn block with solar panels in three groups'},
{id:'wiring',category:'Batteries',shape:'portrait',image:'ces-install-battery-wiring.webp',width:1536,height:2048,kind:'Home battery · garage',title:'Wiring up the battery.',body:'One of our electricians wiring a battery under its inverter in a garage.',href:'/assets/ces-install-battery-wiring.webp',source:'CES job photo',alt:'A CES electrician crouched beside a home battery, wiring it under a wall-mounted inverter on a red brick wall'},
{id:'bigsky',category:'Solar',shape:'portrait',image:'ces-roof-big-sky.webp',width:1536,height:2048,kind:'Colorbond roof',title:'Two clean rows, big sky.',body:'Standard corrugated roof, panels flush to the pitch. Photographed by the crew before they packed up.',href:'/assets/ces-roof-big-sky.webp',source:'CES job photo',alt:'Two rows of solar panels on a white corrugated roof under a bright blue sky with clouds'},
{id:'shed',category:'Solar',shape:'portrait',image:'instagram-shed.webp',width:1600,height:1600,kind:'Shed · backyard',title:'A shed roof of panels.',body:'All-black panels covering a backyard shed roof.',href:'https://www.instagram.com/cesolutions1/p/DciM1ayIAv3/',source:'@cesolutions1 · Aug 2026',alt:'Black solar panels across a new shed roof, installed by CES'},
{id:'tin-three',category:'Solar',shape:'portrait',image:'drone-tin-three-faces.webp',width:500,height:500,kind:'Residential · tin roof',title:'Three faces, one system.',body:'Panels split across three sides of a tin roof so the system keeps producing from morning to late afternoon.',href:'/assets/drone-tin-three-faces.webp',source:'CES job photo',alt:'Drone view of a home with a pale tin roof and black solar panels on three roof faces'},
{id:'lift',category:'Batteries',shape:'portrait',image:'ces-install-battery-lift.webp',width:1536,height:2048,kind:'Our team · on the tools',title:'Onto the wall it goes.',body:'One of our electricians lifting the inverter onto its bracket, cables pulled through and ready to terminate.',href:'/assets/ces-install-battery-lift.webp',source:'CES job photo',alt:'A CES electrician in a branded singlet lifting a white wall unit into place on a grey wall with cables ready'},
{id:'gums',category:'Solar',shape:'portrait',image:'ces-roof-gums.webp',width:1536,height:1536,kind:'Residential · tin roof',title:'Panels, clouds and gum trees.',body:'A dark tin roof with the array split across two faces.',href:'/assets/ces-roof-gums.webp',source:'CES job photo',alt:'Solar panels on a dark corrugated roof with gum trees and a cloudy blue sky behind'},
{id:'colorbond-pool',category:'Solar',shape:'portrait',image:'drone-colorbond-pool.webp',width:500,height:500,kind:'Residential · pool home',title:'Panels for a home with a pool.',body:'Arrays on several faces of a hipped Colorbond roof. A pool pump runs in daylight hours, which is exactly when the roof is producing.',href:'/assets/drone-colorbond-pool.webp',source:'CES job photo',alt:'Drone view of a home with a hipped Colorbond roof, a swimming pool and solar panels on several roof faces'},
{id:'battery',category:'Batteries',shape:'landscape',image:'battery.webp',width:1500,height:1000,kind:'Home battery · wall-mounted',title:'Battery and inverter, tidy.',body:'Mounted on an external wall with the conduit run neatly. Backup, capacity and placement are all part of the design chat.',href:'/batteries',source:'cesolutions.com.au',alt:'Home battery and inverter mounted on a timber-clad exterior wall'},
{id:'daniel',category:'Our team',shape:'portrait',image:'ces-installer-selfie.webp',width:1179,height:1572,kind:'Our team · on the roof',title:'Daniel, mid-install.',body:'A licensed electrician with more than 15 years installing solar on the Border, and the person who leads our crews.',href:'/about',source:'cesolutions.com.au',alt:'Daniel Grubisa in a hi-vis shirt on a roof beside newly installed solar panels'},
{id:'people',category:'Our team',shape:'landscape',image:'instagram-crew.webp',width:1600,height:1060,kind:'Our team · the crew',title:'The people behind the panels.',body:'The installers, designers and office team, all on one payroll in Wodonga.',href:'https://www.instagram.com/cesolutions1/p/DdAkDIQIPCf/',source:'@cesolutions1 · Sep 2026',alt:'Thirteen CES staff in black uniforms, photographed in a studio'},
{id:'people-close',category:'Our team',shape:'portrait',image:'instagram-team.webp',width:1200,height:1500,kind:'Our team · your first call',title:'The people you’ll actually talk to.',body:'Ask us about your bills, your roof or the system you already have. We answer in plain language.',href:'https://www.instagram.com/cesolutions1/p/DdISbZLDSY9/',source:'@cesolutions1 · Sep 2026',alt:'Two CES team members in company uniforms'}];
const filters=['All','Solar','Batteries','Our team'] as const;
/** Plain section head: what the grid below is, and where the photos come from. */
function WorkIntro(){
  return <div className="wrap mb-9 max-w-none"><p className="eyebrow">Our work</p><Reveal id="work-heading" lines={['Recent installs','across the Border.']} className="h-sec"/><p className="lede mt-5 max-w-[56ch]">Every photo here is our own work and our own people, taken by our crews or posted on <a className="font-semibold text-white underline underline-offset-4" href="https://www.instagram.com/cesolutions1/">@cesolutions1</a>.</p></div>;
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
  return createPortal(<motion.div ref={rootRef} className="lightbox" data-lenis-prevent="" role="dialog" aria-modal="true" aria-label={p.title} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?0:.2}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <span className="lightbox__count">{index+1} / {items.length}</span>
    <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close"><X size={22} aria-hidden="true"/></button>
    {items.length>1&&<><button type="button" className="lightbox__btn lightbox__prev" onClick={()=>onMove(-1)} aria-label="Previous photo"><ChevronLeft size={24} aria-hidden="true"/></button><button type="button" className="lightbox__btn lightbox__next" onClick={()=>onMove(1)} aria-label="Next photo"><ChevronRight size={24} aria-hidden="true"/></button></>}
    <motion.div key={p.id} className="lightbox__img" initial={{opacity:0,scale:reduce?1:.97}} animate={{opacity:1,scale:1}} transition={{duration:reduce?0:.25}} drag={reduce?false:'x'} dragConstraints={{left:0,right:0}} dragElastic={.2} onDragEnd={(_,i)=>{if(i.offset.x<-60)onMove(1);else if(i.offset.x>60)onMove(-1);}}><img src={'/assets/'+p.image} srcSet={variants(p.image)} sizes="100vw" alt={p.alt} width={p.width} height={p.height} draggable={false}/></motion.div>
    <div className="lightbox__cap"><span>{p.kind}</span><strong>{p.title}</strong><p>{p.body}</p><a href={p.href}>{p.source} <Arrow/></a></div>
  </motion.div>,document.body);
}
/** Three job photos from one category, for the service and team pages. */
export function WorkStrip({category,lines,intro}:{category:Work['category'];lines:string[];intro:string}){
  const items=work.filter(p=>p.category===category).slice(0,3);
  return <section className="on-dark bg-night py-20 text-white md:py-24" aria-label="Photos of our work"><div className="wrap">
    <div className="flex flex-wrap items-end justify-between gap-6"><div className="max-w-2xl"><p className="eyebrow">Our work</p><Reveal lines={lines} className="h-sec"/><p className="lede mt-5">{intro}</p></div><a className="btn btn--ghost" href="/#our-work">See all our work</a></div>
    <div className="mt-10 grid gap-4 md:grid-cols-3">{items.map((p,i)=><Rise key={p.id} delay={i*.08} className="flex"><figure className="m-0 flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-night-2"><img className="aspect-[4/3] w-full object-cover" src={'/assets/'+medium(p.image)} srcSet={variants(p.image)} sizes="(max-width:768px) 100vw, 33vw" alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async"/><figcaption className="p-5"><strong className="block text-[1.1rem] leading-snug">{p.title}</strong><span className="mt-1.5 block text-[15px] text-haze">{p.body}</span></figcaption></figure></Rise>)}</div>
  </div></section>;
}
/** The rest of a category’s photos (after the three the strip shows) as tap-to-enlarge tiles, for the service pages. */
export function WorkGallery({category,lines,intro}:{category:Work['category'];lines:string[];intro:string}){
  const [lit,setLit]=useState<number|null>(null);
  const items=work.filter(p=>p.category===category).slice(3);
  const move=(d:1|-1)=>setLit(i=>i===null?null:(i+d+items.length)%items.length);
  if(!items.length)return null;
  return <section className="py-20 md:py-24" aria-labelledby="gallery-heading"><div className="wrap">
    <div className="max-w-2xl"><p className="eyebrow">Gallery</p><Reveal id="gallery-heading" lines={lines} className="h-sec"/><p className="mt-5 text-[1.08rem] leading-relaxed text-muted">{intro}</p></div>
    <ul className="m-0 mt-10 grid list-none grid-cols-2 gap-3 p-0 md:gap-4 lg:grid-cols-4">{items.map((p,i)=><li key={p.id}><Rise delay={i*.06}><button type="button" className="group block w-full cursor-pointer border-0 bg-transparent p-0 text-left" onClick={()=>setLit(i)} aria-label={'View larger: '+p.title}><span className="relative block overflow-hidden rounded-3xl bg-stone"><img className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" src={'/assets/'+small(p.image)} srcSet={variants(p.image)} sizes="(max-width:1024px) 50vw, 25vw" alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async"/><span className="work-card__kind">{p.kind}</span></span><strong className="mt-3 block text-[1.02rem] leading-snug">{p.title}</strong></button></Rise></li>)}</ul>
  </div>
  <AnimatePresence>{lit!==null&&items[lit]&&<Lightbox items={items} index={lit} onClose={()=>setLit(null)} onMove={move}/>}</AnimatePresence>
  </section>;
}
export function ProjectGallery(){
  const [filter,setFilter]=useState<(typeof filters)[number]>('All');
  const [lit,setLit]=useState<number|null>(null);
  const [all,setAll]=useState(false);
  // Eight, not nine: the feature tile spans two columns, so 2 + 7 fills three rows of three exactly.
  const CAP=8;
  const matching=work.filter(p=>filter==='All'||p.category===filter);
  const visible=all||filter!=='All'?matching:matching.slice(0,CAP);
  const counts=Object.fromEntries(filters.map(f=>[f,f==='All'?work.length:work.filter(p=>p.category===f).length]));
  const move=(d:1|-1)=>setLit(i=>i===null?null:(i+d+visible.length)%visible.length);
  return <section id="our-work" className="on-dark bg-night py-20 text-white md:py-28" aria-labelledby="work-heading"><WorkIntro/><div className="wrap">
    <div className="work-controls" role="group" aria-label="Filter CES photos">{filters.map(v=><button key={v} type="button" aria-pressed={filter===v} onClick={()=>{setFilter(v);setLit(null);setAll(false);}}>{v}<span className="work-controls__n">{counts[v]}</span></button>)}</div>
    <div className={'work-masonry'+(visible.length<matching.length?' is-capped':'')} key={filter}>{visible.map((p,i)=><Rise key={p.id} delay={Math.min(i,4)*.06}><article className={'work-card'+(p.feature&&filter==='All'?' work-card--feature':'')} data-shape={p.shape}><a className="work-image" href={p.href} aria-label={'View larger: '+p.title} onClick={e=>{e.preventDefault();setLit(i);}}><Parallax intensity={p.feature?36:22}><img src={'/assets/'+medium(p.image)} srcSet={variants(p.image)} sizes={p.feature&&filter==='All'?'(max-width:1100px) 100vw, 66vw':'(max-width:600px) 100vw, (max-width:1100px) 50vw, 33vw'} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async"/></Parallax><span className="work-card__kind">{p.kind}</span><span className="work-card__open" aria-hidden="true"><Arrow/></span></a><div className="work-card__body"><h3><a href={p.href}>{p.title}</a></h3><p>{p.body}</p>{p.source!=='CES job photo'&&<span className="work-card__source">{p.source}</span>}</div></article></Rise>)}</div>
    {!all&&filter==='All'&&matching.length>CAP&&<div className="work-showall"><button type="button" onClick={()=>setAll(true)}>Show all {matching.length} photos</button></div>}
    <div className="work-more"><p>Want to see a system like yours? Ask our solar consultant for install photos from your area.</p><a className="btn btn--ghost" href="https://www.instagram.com/cesolutions1/">Follow @cesolutions1 <Arrow/></a></div>
  </div>
  <AnimatePresence>{lit!==null&&visible[lit]&&<Lightbox items={visible} index={lit} onClose={()=>setLit(null)} onMove={move}/>}</AnimatePresence>
  </section>;
}
export function SiteMotion(){useEffect(()=>{const motion=matchMedia('(prefers-reduced-motion: reduce)');const active=new Set<Animation>();let observer:IntersectionObserver|undefined;const stop=()=>{observer?.disconnect();for(const a of active)a.cancel();active.clear();};const start=()=>{stop();if(motion.matches)return;observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){const a=e.target.animate([{transform:'translateY(14px)'},{transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.65,.3,1)',fill:'none'});active.add(a);a.onfinish=()=>active.delete(a);observer?.unobserve(e.target);}}},{threshold:.12});document.querySelectorAll('.section-heading,.team-copy,.reason-list article,.process-list article').forEach(el=>observer?.observe(el));};start();motion.addEventListener('change',start);return()=>{stop();motion.removeEventListener('change',start);};},[]);return null;}
