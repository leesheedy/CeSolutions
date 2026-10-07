/* Homepage and shared page sections (October 2026 rebuild). Markup is Tailwind utilities on the tokens in
 * site.css; the interactive pieces come from src/components/ui.
 *
 * Copy rules, unchanged: every figure below is one CES publishes (50–100% bill reduction, 3–6 yr payback,
 * one-day installs, 25–30 yr panels, 4.8/5 from 26 SolarQuotes ratings, Daniel's 15+ years). No staff are
 * named except Daniel; the consultant is "our solar consultant". */
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowRight,ArrowUpRight,BatteryCharging,Building2,Car,Check,ChevronRight,Clock,Droplets,HardHat,HelpCircle,MapPin,Pause,Phone,Play,ShieldCheck,Star,Sun,Users} from 'lucide-react';
import {useCalm} from './a11y';
import {ChecklistFormRegistration,QuoteForm} from './quote-form';
import {Parallax,Reveal,Rise} from './motion';
import {BentoCard,BentoGrid} from '@/components/ui/bento-grid';
import {InfiniteSlider} from '@/components/ui/infinite-slider';
import {NumberTicker} from '@/components/ui/number-ticker';
import {Timeline} from '@/components/ui/timeline';
import {SOLARQUOTES} from './reviews';

export const MAPS='https://www.google.com/maps/search/?api=1&query=79%20Elgin%20Boulevard%20Wodonga%20Victoria%203690';
export const PHONE_HREF='tel:+61260212000';
export const PHONE='(02) 6021 2000';
const srcset=(img:string)=>img.startsWith('ces-')?[600,900,1200].map(w=>`/assets/${img.replace('.webp','')}-${w}.webp ${w}w`).join(', '):undefined;
const medium=(img:string)=>img.startsWith('ces-')?img.replace('.webp','-1200.webp'):img;
export const Stars=({size=16,className=''}:{size?:number;className?:string})=><span className={'inline-flex gap-0.5 text-sun '+className} aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={size} fill="currentColor" strokeWidth={0}/>)}</span>;

/** Section heading block: optional eyebrow, the title (lines rise out of a mask), optional standfirst. */
export function SectionHead({eyebrow,lines,id,children,center}:{eyebrow?:string;lines:string[];id?:string;children?:ReactNode;center?:boolean}){
  return <div className={center?'mx-auto max-w-3xl text-center':'max-w-3xl'}>
    {eyebrow&&<p className={'eyebrow'+(center?' justify-center':'')}>{eyebrow}</p>}
    <Reveal id={id} lines={lines} className="h-sec"/>
    {children&&<Rise delay={.12}><div className="lede mt-5">{children}</div></Rise>}
  </div>;
}

/** The drone clip. Mounted on the client only, so the prerendered HTML carries just the poster image (that
 *  is the LCP element). Skipped under reduced motion, data saver and 2G; paused when the hero is off screen. */
const HERO_FILM='/assets/ces-hero-loop-3.mp4';
function HeroFilm(){
  const [on,setOn]=useState(false);
  const [lit,setLit]=useState(false);
  const [paused,setPaused]=useState(false);
  const calm=useCalm();
  // Two copies of the clip take turns. The native `loop` attribute seeks back to the start when the clip ends,
  // and the decoder restarting there froze the picture for a moment on every pass. Instead the idle copy sits
  // decoded at 0:00 and is cut to the moment the playing one ends, so nothing ever seeks mid-play. The cut is
  // invisible because the file is edited to loop: its last frame runs straight into its first.
  const vids=useRef<(HTMLVideoElement|null)[]>([null,null]);
  const cur=useRef(0);
  const [front,setFront]=useState(0);
  const [prev,setPrev]=useState<number|null>(null);
  const [cut,setCut]=useState(false);
  const held=useRef(false);held.current=paused;
  useEffect(()=>{
    const c=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    setOn(!calm&&!c?.saveData&&!/2g/.test(c?.effectiveType??''));
  },[calm]);
  useEffect(()=>{
    const all=vids.current;if(!all[0])return;
    // React sets `muted` as a property after the element exists; browsers decide autoplay on the property,
    // so set it and start playback explicitly rather than trusting the attribute.
    for(const v of all)if(v){v.muted=true;v.defaultMuted=true;}
    const active=()=>all[cur.current];
    const play=()=>{if(!held.current)void active()?.play().catch(()=>{});};
    play();
    let swapping=false,timer:number|undefined;
    const swap=()=>{
      const from=active(),to=all[1-cur.current];
      if(!from||!to||swapping||to.readyState<3)return false;
      swapping=true;setCut(true);setPrev(cur.current);cur.current=1-cur.current;setFront(cur.current);
      void to.play().catch(()=>{});
      // The finished copy stays underneath for a moment, then rewinds out of sight ready for its next turn.
      timer=window.setTimeout(()=>{from.pause();from.currentTime=0;setPrev(null);swapping=false;},250);
      return true;
    };
    // If the other copy isn't ready (slow connection, throttled tab), fall back to a plain restart.
    const ended=(e:Event)=>{const v=active();if(e.target===v&&v&&!swapping&&!swap()){v.currentTime=0;play();}};
    for(const v of all)v?.addEventListener('ended',ended);
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)play();else if(!swapping)for(const v of all)v?.pause();},{threshold:.05});
    io.observe(all[0]);
    return()=>{io.disconnect();window.clearTimeout(timer);for(const v of all)v?.removeEventListener('ended',ended);};
  },[on]);
  if(!on)return null;
  const toggle=()=>{const v=vids.current[cur.current];if(!v)return;if(paused){setPaused(false);held.current=false;void v.play().catch(()=>{});}else{setPaused(true);v.pause();}};
  return <><div className="absolute inset-0 isolate" aria-hidden="true">{[0,1].map(i=><video key={i} ref={el=>{vids.current[i]=el;}} className={'hero-film'+(lit&&(i===front||i===prev)?' is-lit':'')+(i===front?' is-front':'')+(cut?' is-cut':'')} src={i===0||lit?HERO_FILM:undefined} autoPlay={i===0} muted playsInline preload="auto" tabIndex={-1} disablePictureInPicture onPlaying={i===0?()=>setLit(true):undefined}/>)}</div>
    {/* WCAG 2.2.2: anything that moves for more than five seconds needs a way to stop it. */}
    <button type="button" onClick={toggle} aria-pressed={paused} className="absolute right-5 bottom-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-night/55 px-4 text-[14px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-night/80 max-lg:top-[calc(var(--nav-h)+16px)] max-lg:bottom-auto max-lg:min-h-10 max-lg:px-3">{paused?<Play size={15} aria-hidden="true"/>:<Pause size={15} aria-hidden="true"/>}{paused?'Play video':'Pause video'}</button></>;
}

const heroProof=['Our own licensed electricians, no subcontractors','Most home systems installed in a single day','25–30 year panel warranties','Shopfront at 79 Elgin Boulevard, Wodonga'];
/** Full-bleed hero over CES's own drone footage of an install. */
export function Hero(){
  return <section className="on-dark relative isolate flex min-h-[min(100svh,940px)] items-end overflow-hidden bg-night text-white" aria-labelledby="hero-heading">
    <img className="absolute inset-0 size-full object-cover" src="/assets/ces-drone-hero-1920.webp" srcSet="/assets/ces-drone-hero-760.webp 760w, /assets/ces-drone-hero-1200.webp 1200w, /assets/ces-drone-hero-1920.webp 1920w" sizes="100vw" alt="" width={1920} height={1080} fetchPriority="high" decoding="async"/>
    <HeroFilm/>
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,29,43,.72)_0%,rgba(10,29,43,.18)_26%,rgba(10,29,43,.5)_56%,rgba(10,29,43,.94)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(10,29,43,.74)_0%,rgba(10,29,43,.38)_24%,rgba(10,29,43,.72)_52%,rgba(10,29,43,.96)_100%)]" aria-hidden="true"/>
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,29,43,.78)_0%,rgba(10,29,43,.3)_55%,rgba(10,29,43,0)_100%)] max-lg:hidden" aria-hidden="true"/>
    <div className="wrap relative z-10 grid gap-10 pt-[calc(var(--nav-h)+88px)] pb-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] lg:items-end lg:gap-16 lg:pb-20">
      <div>
        <Rise><a href={SOLARQUOTES} className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-2 pr-4 pl-3 text-[14.5px] font-medium backdrop-blur-md transition-colors hover:bg-white/20"><Stars size={15}/><span><strong className="font-bold">4.8/5</strong> from 26 SolarQuotes reviews</span><ArrowUpRight size={15} aria-hidden="true"/></a></Rise>
        <Reveal as="h1" id="hero-heading" className="h-display sm:[&_.reveal__line]:whitespace-nowrap" lines={['Solar and batteries','for Albury-Wodonga','homes.']} stagger={.08}/>
        <Rise delay={.2}>
          <p className="mt-6 max-w-[52ch] text-[clamp(1.08rem,1.4vw,1.28rem)] leading-relaxed text-white/90">Designed from your actual power bills and installed by our own licensed electricians, usually in a single day. Savings typically land between 50% and 100% of your bill.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#quote" className="btn btn--mint">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a href={PHONE_HREF} className="btn btn--ghost"><Phone size={17} aria-hidden="true"/>{PHONE}</a></div>
          <p className="mt-5 max-w-[54ch] text-[14.5px] leading-relaxed text-white/75">Three quick questions. Your details go to CES in Wodonga and nowhere else, and we reply within one business day.</p>
        </Rise>
      </div>
      <Rise delay={.35} className="lg:justify-self-end">
        <ul className="grid gap-3 rounded-3xl border border-white/15 bg-night/45 p-6 backdrop-blur-xl sm:grid-cols-2 lg:max-w-sm lg:grid-cols-1" aria-label="Why people choose CES">
          {heroProof.map(t=><li key={t} className="flex items-start gap-3 text-[15.5px] leading-snug font-medium"><span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-mint text-night"><Check size={13} strokeWidth={3} aria-hidden="true"/></span>{t}</li>)}
        </ul>
      </Rise>
    </div>
  </section>;
}

const stats:{value:number;decimals?:number;suffix:string;label:string}[]=[
{value:4.8,decimals:1,suffix:'/5',label:'Average rating on SolarQuotes'},
{value:26,suffix:'',label:'Independent customer reviews'},
{value:15,suffix:'+',label:'Years installing solar on the Border'},
{value:1,suffix:' day',label:'Typical home installation'}];
const brands=['Tesla','Sungrow','Sigenergy','BYD','Fronius','Enphase','Jinko'];
/** Proof directly under the hero: four published figures, then the equipment brands on a slow rail. */
export function ProofBar(){
  return <section className="border-b border-line bg-white" aria-label="Clean Energy Solutions in numbers">
    <div className="wrap">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-12 md:grid-cols-4 md:py-14">
        {stats.map((s,i)=><div key={s.label} className="flex flex-col-reverse md:border-l md:border-line md:pl-7 md:first:border-l-0 md:first:pl-0">
          <dt className="mt-2 text-[15px] leading-snug text-muted">{s.label}</dt>
          <dd className="text-[clamp(2.2rem,4vw,3.4rem)] leading-none font-bold tracking-tight text-ink"><NumberTicker value={s.value} decimalPlaces={s.decimals??0} delay={i*.12}/><span className="text-brand">{s.suffix}</span></dd>
        </div>)}
      </dl>
      <div className="flex flex-col gap-4 border-t border-line py-7 md:flex-row md:items-center md:gap-10">
        <p className="flex-none text-[15px] font-semibold text-ink">Equipment we install and service</p>
        <InfiniteSlider className="fade-x min-w-0 flex-1" gap={56} speed={38} speedOnHover={14}>
          {brands.map(b=><span key={b} className="text-[1.35rem] font-bold tracking-tight whitespace-nowrap text-muted">{b}</span>)}
        </InfiniteSlider>
      </div>
    </div>
  </section>;
}

const Shot=({image,alt,position}:{image:string;alt:string;position?:string})=><><img className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={position?{objectPosition:position}:undefined} src={'/assets/'+medium(image)} srcSet={srcset(image)} sizes="(max-width:768px) 100vw, 50vw" alt={alt} loading="lazy" decoding="async"/><div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/5" aria-hidden="true"/></>;
/** What CES installs, as a bento grid: the three main services carry photographs, the rest are compact tiles. */
export function Services(){
  return <section id="solutions" className="bg-stone py-20 md:py-28" aria-labelledby="services-heading">
    <div className="wrap">
      <div className="grid items-end gap-6 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
        <SectionHead eyebrow="What we install" id="services-heading" lines={['Solar, batteries and EV charging.','One local team.']}/>
        <Rise delay={.12}><p className="lede">Start with panels or go the whole way to a battery and an EV charger. Either way we design around your bills and what you’re planning next, and we’re still on the phone years later.</p></Rise>
      </div>
      <Rise delay={.1}><BentoGrid className="mt-12">
        <BentoCard tone="dark" className="md:col-span-3 md:row-span-2" Icon={Sun} name="Put your roof to work." description="Panels sized to your roof and your bills, so daytime power comes from above you instead of the grid. Most systems pay for themselves in 3–6 years." href="/solar" cta="See solar options" background={<Shot image="ces-roof-big-sky.webp" alt="Two rows of solar panels on a white corrugated roof under a bright blue sky, installed by CES" position="50% 62%"/>}/>
        <BentoCard tone="dark" className="md:col-span-3" Icon={BatteryCharging} name="Keep your solar for after sunset." description="Store the surplus and run the evening on it instead of buying power back at peak rates. The federal battery discount is open now." href="/batteries" cta="See battery options" background={<Shot image="ces-powerwalls-enclosure.webp" alt="Two Tesla Powerwall batteries in a purpose-built enclosure, installed by CES" position="50% 22%"/>}/>
        <BentoCard tone="dark" className="md:col-span-3" Icon={Building2} name="Make your working hours work for your bill." description="Sheds, shops, cool rooms and offices run in daylight, exactly when panels produce." href="/commercial-solar" cta="See business solar" background={<Shot image="ces-roof-sunset-hills.webp" alt="Rows of solar panels on a shed roof at sunset, installed by CES" position="50% 70%"/>}/>
        <BentoCard className="md:col-span-2" Icon={Car} name="EV charging" description="A wall charger wired to run from your own roof first." href="#quote" cta="Ask about EV chargers"/>
        <BentoCard className="md:col-span-2" Icon={Droplets} name="Hot water heat pumps" description="Replace the electric tank with one that uses a fraction of the power." href="#quote" cta="Ask about heat pumps"/>
        <BentoCard className="md:col-span-2" Icon={HelpCircle} name="Not sure where to start?" description="Send a bill. Our solar consultant works out what suits your home and replies within one business day." href="#quote" cta="Get my free quote"/>
      </BentoGrid></Rise>
    </div>
  </section>;
}

const promises=['Designed from your actual usage, not a brochure','Clear pricing with expected savings, before you commit','Free, no obligation, no pushy follow-up'];
/** Dark band: the pitch on the left, the three-step enquiry form on the right. */
export function QuoteBand(){
  return <section id="quote" className="on-dark relative overflow-hidden bg-night py-20 text-white md:py-28" aria-labelledby="quote-heading">
    <div className="grain pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_20%_30%,#000,transparent)]" aria-hidden="true"/>
    <div className="pointer-events-none absolute -top-40 -left-40 size-[520px] rounded-full bg-brand/30 blur-[120px]" aria-hidden="true"/>
    <div className="wrap relative grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-16">
      <div>
        <SectionHead eyebrow="Free quote" id="quote-heading" lines={['Get a real number,','not a sales pitch.']}>Tell us what you’re after and send a bill. We design around how you use power, then come back with clear pricing. No pressure, no call centre.</SectionHead>
        <Rise delay={.2}>
          <ul className="mt-8 grid gap-3.5">{promises.map(p=><li key={p} className="flex items-start gap-3 text-[16.5px] font-medium"><span className="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-mint/15 text-mint"><Check size={14} strokeWidth={3} aria-hidden="true"/></span>{p}</li>)}</ul>
          <p className="mt-8 flex items-center gap-2.5 text-[15.5px] font-semibold text-mint"><Clock size={18} aria-hidden="true"/>Reply within one business day</p>
          <a href={PHONE_HREF} className="mt-6 flex max-w-sm items-center gap-4 rounded-2xl border border-white/12 bg-white/6 p-4 transition-colors hover:bg-white/10"><span className="grid size-12 flex-none place-items-center rounded-full bg-mint text-night"><Phone size={20} aria-hidden="true"/></span><span className="text-[15px] text-haze">Prefer to talk?<strong className="block text-[1.35rem] leading-tight font-bold text-white">{PHONE}</strong></span></a>
        </Rise>
      </div>
      <QuoteForm/>
      <ChecklistFormRegistration/>
    </div>
  </section>;
}

const reasons=[
{Icon:ShieldCheck,title:'Products that last',body:'Tesla, Sungrow, Sigenergy, BYD, Fronius, Enphase and Jinko. Brands we know and can service, with 25–30 year panel warranties.'},
{Icon:HardHat,title:'Our own licensed, accredited electricians',body:'Led by Daniel, with more than 15 years installing solar on the Border. No subcontractors. Tidy work on every roof.'},
{Icon:Users,title:'Rated 4.8/5 by real customers',body:'26 SolarQuotes reviews: installation 5.0, customer service 4.9. The people who quote and install are the ones who answer the phone.'}];
/** Why CES: the crew photograph beside three reasons. */
export function WhyChoose(){
  return <section className="py-20 md:py-28" aria-labelledby="why-heading">
    <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
      <div className="relative">
        <Parallax className="mx-auto aspect-square max-w-[540px] rounded-[32px] max-lg:aspect-[4/3] max-lg:max-w-none" intensity={18}><img className="size-full object-cover" src="/assets/ces-install-crew-roof.webp" srcSet="/assets/ces-install-crew-roof-600.webp 600w, /assets/ces-install-crew-roof.webp 721w" sizes="(max-width:1024px) 100vw, 50vw" alt="Two CES installers fixing solar panels to rails on a corrugated roof" width={721} height={721} loading="lazy" decoding="async"/></Parallax>
        <a href={SOLARQUOTES} className="absolute right-4 bottom-4 flex items-center gap-3 rounded-2xl bg-white p-4 pr-5 shadow-[var(--shadow-card)] lg:right-0 lg:bottom-8 xl:right-2"><span className="text-[2rem] leading-none font-bold tracking-tight text-ink">4.8</span><span className="flex flex-col gap-1 text-[13.5px] leading-tight text-muted"><Stars size={14}/>26 SolarQuotes reviews</span></a>
      </div>
      <div>
        <SectionHead eyebrow="Why CES" id="why-heading" lines={['Installed by the people','who answer the phone.']}>No call centre, no subcontractors. The electricians who quote your job install it, and they’re the ones who pick up when you ring two years later.</SectionHead>
        <ul className="mt-9 grid gap-0">{reasons.map((r,i)=><li key={r.title} className="border-t border-line"><Rise delay={.15+i*.08} className="flex gap-5 py-6"><span className="grid size-12 flex-none place-items-center rounded-2xl bg-tint text-brand"><r.Icon size={24} strokeWidth={1.75} aria-hidden="true"/></span><div><h3 className="text-[1.2rem] leading-snug font-bold tracking-tight">{r.title}</h3><p className="mt-1.5 text-[16px] text-muted">{r.body}</p></div></Rise></li>)}</ul>
        <Rise delay={.4}><a href="/about" className="link-arrow mt-4">Meet the team <ArrowRight size={17} aria-hidden="true"/></a></Rise>
      </div>
    </div>
  </section>;
}

const steps=[
{title:'Consultation',kicker:'Free, at your place or ours',body:'A quick chat about your bills, your roof and what you want to achieve.'},
{title:'Tailored design',kicker:'Built from your usage',body:'We design the system around how you use power, with expected savings and clear pricing.'},
{title:'Installation',kicker:'Usually a single day',body:'Our own licensed electricians install it and leave the site tidy.'},
{title:'Ongoing support',kicker:'Still here afterwards',body:'We set up your monitoring app, handle the rebate paperwork and stay on the phone after.'}];
/** Four steps on a rail that fills as you scroll. */
export function Process(){
  return <section className="on-dark relative overflow-hidden bg-night py-20 text-white md:py-28" aria-labelledby="process-heading">
    <div className="pointer-events-none absolute -right-40 bottom-0 size-[480px] rounded-full bg-brand/25 blur-[130px]" aria-hidden="true"/>
    <div className="wrap relative">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHead eyebrow="How it goes" id="process-heading" lines={['Simple from start','to support.']}>Four steps, one team. You’ll know what it costs, what it saves and when it happens before you commit to anything.</SectionHead>
        <Rise delay={.15}><a className="btn btn--mint" href="#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a></Rise>
      </div>
      <div className="mt-14 md:mt-20"><Timeline data={steps.map(s=>({title:s.title,kicker:s.kicker,content:<p className="rounded-3xl border border-white/10 bg-white/5 p-6 text-[17px] leading-relaxed text-white/85 md:p-7">{s.body}</p>}))}/></div>
    </div>
  </section>;
}

const rebates=[
{who:'Federal, every eligible install',name:'STC discount on panels',body:'Comes off the price you pay for the panels.',href:'https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme'},
{who:'Federal program',name:'Cheaper Home Batteries',body:'A discount on eligible home batteries that steps down on a fixed schedule.',href:'https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries'},
{who:'Victorian households',name:'Solar Victoria panel rebate',body:'For Victorian owner-occupiers who meet Solar Victoria’s eligibility rules.',href:'https://www.solar.vic.gov.au/solar-panel-rebate'}];
export function Rebates(){
  return <section id="rebates" className="py-20 md:py-28" aria-labelledby="rebates-heading">
    <div className="wrap">
      <div className="grid items-end gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <SectionHead eyebrow="Rebates" id="rebates-heading" lines={['Rebates on both sides','of the border.']}/>
        <Rise delay={.12}><p className="lede">Every eligible solar install gets the federal STC discount on panels, and eligible home batteries get the federal Cheaper Home Batteries discount. Both come off the price you pay. We handle the applications and the distributor paperwork.</p></Rise>
      </div>
      <ul className="mt-12 grid gap-4 md:grid-cols-3">{rebates.map((r,i)=><li key={r.name} className="flex"><Rise delay={i*.08} className="flex w-full"><a href={r.href} className="group flex w-full flex-col rounded-3xl border border-line bg-white p-7 transition-[border-color,box-shadow] duration-300 hover:border-brand/50 hover:shadow-[var(--shadow-card)]"><span className="text-sm font-semibold text-brand">{r.who}</span><h3 className="mt-2 text-[1.45rem] leading-tight font-bold tracking-tight">{r.name}</h3><p className="mt-3 text-[16px] text-muted">{r.body}</p><span className="mt-auto flex items-center gap-2 pt-7 text-[15px] font-semibold text-ink">Official program page<ArrowUpRight size={17} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></span></a></Rise></li>)}</ul>
      <p className="mt-6 max-w-[80ch] text-[14.5px] text-muted">The battery discount steps down on a fixed schedule, so an earlier install date gets the bigger discount. Eligibility and equipment requirements apply. Solar Victoria applies to Victorian properties only; Albury customers are covered by the federal programs. Confirm current requirements for your installation date.</p>
    </div>
  </section>;
}

/** The shopfront: photograph, address and directions. */
export function VisitBand(){
  return <section className="pb-20 md:pb-28" aria-labelledby="visit-heading">
    <div className="wrap">
      <div className="on-dark relative isolate grid overflow-hidden rounded-[32px] bg-night text-white lg:grid-cols-2">
        <div className="relative z-10 p-8 md:p-14">
          <SectionHead eyebrow="Visit us" id="visit-heading" lines={['Come and see us','on Elgin Boulevard.']}>Bring a recent bill and we’ll talk through your options in person. No appointment needed.</SectionHead>
          <Rise delay={.2}>
            <address className="mt-8 flex items-start gap-3 text-[17px] font-medium"><MapPin size={20} className="mt-1 flex-none text-mint" aria-hidden="true"/><span>79 Elgin Boulevard<br/>Wodonga, Victoria 3690</span></address>
            <div className="mt-8 flex flex-wrap gap-3"><a href={MAPS} className="btn btn--mint">Get directions <ArrowUpRight size={18} aria-hidden="true"/></a><a href={PHONE_HREF} className="btn btn--ghost"><Phone size={17} aria-hidden="true"/>{PHONE}</a></div>
          </Rise>
        </div>
        <div className="relative min-h-[280px]"><img className="absolute inset-0 size-full object-cover object-[50%_45%]" src="/assets/shopfront-elgin.jpg" alt="The Clean Energy Solutions shopfront on Elgin Boulevard, Wodonga, with a CES ute parked out the front" width={1080} height={1354} loading="lazy" decoding="async"/><div className="absolute inset-0 bg-gradient-to-r from-night via-night/20 to-transparent max-lg:bg-gradient-to-b" aria-hidden="true"/></div>
      </div>
    </div>
  </section>;
}

/** Closing call to action, used at the foot of every page. */
export function CtaBand({quote='#quote'}:{quote?:string}){
  return <section className="pb-20 md:pb-28" aria-labelledby="cta-heading">
    <div className="wrap">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-tint px-8 py-14 text-center md:px-16 md:py-20">
        <div className="pointer-events-none absolute -top-32 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-mint/50 blur-[110px]" aria-hidden="true"/>
        <div className="relative">
          <Reveal id="cta-heading" lines={['Ready to see your number?']} className="h-sec"/>
          <Rise delay={.12}><p className="lede mx-auto mt-5 max-w-[56ch]">Send us a bill. Our solar consultant gets back to you within one business day, then designs your system from your actual usage, with expected savings and clear pricing.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><a className="btn btn--primary" href={quote}>Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a className="btn btn--outline" href={PHONE_HREF}><Phone size={17} aria-hidden="true"/>Call {PHONE}</a></div></Rise>
        </div>
      </div>
    </div>
  </section>;
}

export type Crumb={label:string;href?:string};
/** Dark opening band for every interior page: breadcrumb, title, standfirst, actions, optional photograph. */
export function PageHero({crumbs,lines,intro,image,alt,children,imageWidth=1400,imageHeight=800}:{crumbs:Crumb[];lines:string[];intro?:string;image?:string;alt?:string;children?:ReactNode;imageWidth?:number;imageHeight?:number}){
  return <section className="on-dark relative isolate overflow-hidden bg-night text-white">
    <div className="grain pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_70%_at_15%_20%,#000,transparent)]" aria-hidden="true"/>
    <div className="pointer-events-none absolute -top-48 right-0 size-[560px] rounded-full bg-brand/30 blur-[130px]" aria-hidden="true"/>
    <div className={'wrap relative grid gap-10 pt-[calc(var(--nav-h)+48px)] pb-14 md:pb-20 lg:gap-16 '+(image?'lg:grid-cols-[1.05fr_.95fr] lg:items-start':'')}>
      <div>
        <nav aria-label="Breadcrumb"><ol className="m-0 mb-7 flex list-none flex-wrap items-center gap-1.5 p-0 text-[14.5px] text-haze">{crumbs.map((c,i)=><li key={c.label} className="flex items-center gap-1.5">{i>0&&<ChevronRight size={14} aria-hidden="true" className="opacity-60"/>}{c.href?<a href={c.href} className="transition-colors hover:text-white">{c.label}</a>:i===crumbs.length-1?<span aria-current="page" className="font-semibold text-white">{c.label}</span>:<span>{c.label}</span>}</li>)}</ol></nav>
        <Reveal as="h1" lines={lines} className="h-page" stagger={.08}/>
        <Rise delay={.2}>{intro&&<p className="lede mt-6 max-w-[56ch]">{intro}</p>}{children}</Rise>
      </div>
      {image&&<Rise delay={.15}><div className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10 lg:mt-12"><img className="aspect-[3/2] size-full object-cover" src={'/assets/'+medium(image)} srcSet={srcset(image)} sizes="(max-width:1024px) 100vw, 46vw" alt={alt??''} width={imageWidth} height={imageHeight} fetchPriority="high" decoding="async"/></div></Rise>}
    </div>
  </section>;
}
