import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';
import {ArrowRight,BadgeCheck,Clock,HardHat,Headset,MessageCircle,PencilRuler,Phone,ShieldCheck,Star,Users} from 'lucide-react';
import {Arrow} from './shell';
import {ChecklistFormRegistration,QuoteForm} from './quote-form';
import {Parallax,ParallaxBackdrop,Reveal,Rise,ScrollWords,Stack,StackItem} from './motion';
export const MAPS='https://www.google.com/maps/search/?api=1&query=79%20Elgin%20Boulevard%20Wodonga%20Victoria%203690';
const variants=(img:string)=>img.startsWith('ces-')?[600,900,1200].map(w=>`/assets/${img.replace('.webp','')}-${w}.webp ${w}w`).join(', '):undefined;
const medium=(img:string)=>img.startsWith('ces-')?img.replace('.webp','-1200.webp'):img;
/** Small uppercase label with the corner-bracket device used across the Framer reference. */
export function Kicker({children,light}:{children:string;light?:boolean}){return <span className={light?'kicker kicker--light':'kicker'}><span aria-hidden="true" className="kicker__bl"/><span aria-hidden="true" className="kicker__tr"/>{children}</span>}
/* Copy rules: every figure below is one CES publishes (50–100% bill reduction, 3–6 yr payback, one-day
 * installs, 25–30 yr panels, 4.8/5 from 26 SolarQuotes ratings, Daniel's 15+ years). No staff are named
 * except Daniel; the consultant is "our solar consultant". */
/** The hero drone shot. A slow pass over a real CES install, playing on its own rather than driven by
 *  the scroll: scaling a still reads as a zoom, not as flying. The clip runs at a quarter of the speed
 *  it was rendered at, with the intermediate frames interpolated so the drift stays smooth instead of
 *  stepping, and it plays forward then backward so the loop has no cut.
 *  It mounts only where it earns its weight: no reduced-motion preference, a viewport wide enough that
 *  the copy is not covering the frame, and a connection that is neither metered nor 2G. Everywhere else
 *  the still underneath carries the hero. It pauses once the hero leaves the screen. */
function HeroFilm(){
  const [show,setShow]=useState(false);
  const [lit,setLit]=useState(false);
  const ref=useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const conn=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(!window.matchMedia('(min-width: 861px)').matches)return;
    if(conn?.saveData)return;
    if(conn?.effectiveType&&/(^|-)2g$/.test(conn.effectiveType))return;
    setShow(true);
  },[]);
  useEffect(()=>{
    const el=ref.current;
    if(!el||!show)return;
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)void el.play().catch(()=>{});else el.pause();},{threshold:0});
    io.observe(el);
    return()=>io.disconnect();
  },[show]);
  if(!show)return null;
  return <video ref={ref} className={lit?'hero3__film is-lit':'hero3__film'} autoPlay muted loop playsInline
    preload="auto" aria-hidden="true" tabIndex={-1} onPlaying={()=>setLit(true)}
    // The name is versioned on purpose: /assets/* is cached for a week, so replacing a clip in place
    // leaves every returning visitor on the old one. A new filename is the only reliable cache bust.
    src="/assets/ces-drone-hero-loop-2.mp4"/>;
}
/** Full-bleed hero on the drone shot: kicker, sentence-case headline, one line, two actions. */
export function Hero(){
  const ref=useRef<HTMLElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
  // The drone carries the movement now, so the scroll only adds a little depth behind it. A 1.38 scale
  // on top of a moving camera fought it; at 1.1 it reads as parallax.
  const bgScale=useTransform(scrollYProgress,[0,1],[1,1.1]);
  const bgY=useTransform(scrollYProgress,[0,1],['0%','12%']);
  const copyY=useTransform(scrollYProgress,[0,1],[0,-70]);

  return <section ref={ref} className="hero3" aria-label="Solar and batteries in Albury-Wodonga">
    <motion.div className="hero3__bg" data-motion="" style={reduce?undefined:{y:bgY,scale:bgScale}}><img src="/assets/ces-drone-hero-1920.webp" srcSet="/assets/ces-drone-hero-760.webp 760w, /assets/ces-drone-hero-1200.webp 1200w, /assets/ces-drone-hero-1920.webp 1920w" sizes="100vw" alt="" width={1920} height={1080} fetchPriority="high" decoding="async"/><HeroFilm/></motion.div><div className="hero3__glow" aria-hidden="true"/>
    <div className="hero3__shade" aria-hidden="true"/>
    <motion.div className="hero3__copy wrap" data-motion="" style={reduce?undefined:{y:copyY}}>
      <Kicker light>Your local solar & battery installers</Kicker>
      <Reveal as="h1" lines={['Cut your power bill in half.','Or wipe it out.']} stagger={.08}/>
      <Rise delay={.22}><p className="hero3__body">Solar, batteries and EV charging. We design from your actual bills, and our own Albury-Wodonga electricians install it, usually in a day. Savings typically land between 50% and 100% of your bill.</p>{/* Two equally weighted ways in, not one button and a phone number in small print. Home-improvement
    pages that offer a click, a form and a phone convert at 4.0% against a 2.6% median across 977,200
    conversions (Unbounce Conversion Benchmark), and CES's nearest Albury rivals both sell on talking
    to a person. The phone therefore leaves the trust row and becomes a real action. */}
<div className="hero-action-row"><a href="#quote" className="hero-quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a href="tel:+61260212000" className="hero-call-cta"><Phone size={17} aria-hidden="true"/>(02) 6021 2000</a></div>
{/* The label tested well as it is; the leverage is here. Scope first (the form is genuinely three
    steps), then the fear that actually stops an Australian clicking a solar "free quote" — being sold
    to a panel of brokers — answered positively rather than by naming it, then the reply time. */}
<p className="hero-note">Three questions, about two minutes. Your details go to CES in Wodonga and nowhere else. We reply within one business day.</p>
<a href="#estimate" className="hero-secondary">See what I’d save<span>no details needed</span></a><ul className="hero-trust" aria-label="Why people choose CES"><li><a href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/"><span className="hero-trust__stars" aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={13} fill="currentColor"/>)}</span><strong>4.8/5</strong><span>26 SolarQuotes ratings ↗</span></a></li><li><ShieldCheck size={15} aria-hidden="true"/>Own local electricians</li><li><BadgeCheck size={15} aria-hidden="true"/>25–30 yr panel warranties</li></ul></Rise>
    </motion.div>
    {/* The backdrop is no longer an illustration, so the label cannot say it is. The property, the roof
        and the array are our own drone photograph; the camera move over it is generated. Both facts. */}
    <span className="hero__caption">Our drone photo of a CES install, animated · more in <a href="#our-work">our work</a></span>
  </section>;
}
/** Black band under the hero: pitch on the left, the three-step enquiry form on the right. */
export function QuoteBand(){return <section id="quote" className="quote-band" aria-labelledby="quote-heading"><div className="wrap quote-band__grid"><div className="quote-band__pitch"><Kicker light>Free quote</Kicker><Reveal id="quote-heading" lines={['Get a real number,','not a sales pitch.']}/><Rise delay={.15}><p>Tell us what you’re after and send a bill. We design around how you use power, then come back with clear pricing. No pressure, no call centre.</p><p className="quote-band__promise"><Clock size={20} aria-hidden="true"/>Reply within one business day</p><a className="quote-band__call" href="tel:+61260212000"><span className="quote-band__call-icon"><Phone size={22} aria-hidden="true"/></span><span>Prefer to talk?<strong>(02) 6021 2000</strong></span></a></Rise></div><QuoteForm/><ChecklistFormRegistration/></div></section>}
const services=[
{id:'solar',href:'/solar',kicker:'01 / Residential solar',title:['Put your roof','to work.'],body:'Panels sized to your roof and your bills, so daytime power comes from above you instead of the grid. Most systems pay for themselves in 3–6 years.',cta:'See solar options',image:'ces-roof-gums.webp',alt:'Solar panels on a dark corrugated roof under a cloudy blue sky, installed by CES',width:1536,height:1536},
{id:'battery',href:'/batteries',kicker:'02 / Home batteries',title:['Keep your solar','for after sunset.'],body:'Store the surplus and run the evening on it instead of buying power back at peak rates. Blackout backup if you want it. The federal battery discount is open now.',cta:'See battery options',image:'ces-garage-byd-fronius.webp',alt:'Garage with two battery towers, two Fronius inverters and an EV charger installed by CES',width:1600,height:1200},
{id:'business',href:'/commercial-solar',kicker:'03 / Business & farm',title:['Make your working hours','work for your bill.'],body:'Sheds, shops, cool rooms and offices run in daylight, exactly when panels produce. We design around your roof and your operating hours.',cta:'See business solar',image:'instagram-shed.webp',alt:'Black solar panels across a new shed roof, installed by CES',width:1600,height:1600}];
/** Three service cards that pin under the header and stack as you scroll. */
export function ServiceStack(){return <Stack className="service-stack" total={services.length}>{services.map((s,i)=><StackItem key={s.id} index={i}><a className={'stack-card service-'+s.id} href={s.href}><div className="service-copy"><span>{s.kicker}</span><h3>{s.title[0]}<br/>{s.title[1]}</h3><p>{s.body}</p><span className="service-destination">{s.cta} <Arrow/></span></div><Parallax className="service-image" intensity={44}><img src={'/assets/'+medium(s.image)} srcSet={variants(s.image)} sizes="(max-width:860px) 100vw, 55vw" alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async"/></Parallax></a></StackItem>)}</Stack>}
const reasons=[
{Icon:ShieldCheck,title:'Products that last',body:'Tesla, Sungrow, Sigenergy, BYD, Fronius, Enphase and Jinko. Brands we know and can service, with 25–30 year panel warranties.'},
{Icon:HardHat,title:'Our own licensed, accredited electricians',body:'Led by Daniel, with more than 15 years installing solar on the Border. No subcontractors. Tidy work on every roof.'},
{Icon:Users,title:'Rated 4.8/5 by real customers',body:'26 SolarQuotes reviews: installation 5.0, customer service 4.9. The people who quote and install are the ones who answer the phone.'}];
/** "Why choose CES": photo on the left, three reasons with icons on the right (Framer "About us" section). */
export function WhyChoose(){return <section className="why wrap" aria-labelledby="why-heading"><Parallax className="why__photo" intensity={30}><img src="/assets/ces-install-crew-roof.webp" srcSet="/assets/ces-install-crew-roof-600.webp 600w, /assets/ces-install-crew-roof.webp 721w" sizes="(max-width:860px) 100vw, 50vw" alt="Two CES installers fixing solar panels to rails on a corrugated roof" width={721} height={721} loading="lazy" decoding="async"/></Parallax><div className="why__copy"><Kicker>Why choose CES</Kicker><Reveal id="why-heading" lines={['Installed by the people','who answer the phone.']}/><ScrollWords className="why__intro" text="No call centre, no subcontractors. The electricians who quote your job install it. They’re the ones who pick up when you ring two years later."/><ul className="why__list">{reasons.map((r,i)=><Rise key={r.title} delay={.2+i*.08}><li><span className="why__icon"><r.Icon size={26} strokeWidth={1.75} aria-hidden="true"/></span><div><h3>{r.title}</h3><p>{r.body}</p></div></li></Rise>)}</ul></div></section>}
const steps=[
{Icon:MessageCircle,title:'Consultation',body:'A quick chat about your bills, your roof and what you want to achieve. Free, at your place or ours.'},
{Icon:PencilRuler,title:'Tailored design',body:'We design the system around your usage, with expected savings and clear pricing.'},
{Icon:HardHat,title:'Installation',body:'Our own licensed electricians install it, usually in a single day, and leave the site tidy.'},
{Icon:Headset,title:'Ongoing support',body:'We set up your monitoring app, handle the rebate paperwork and stay on the phone after.'}];
/** Black band with four mint step cards (Framer "Process" section). */
export function ProcessCards(){return <section className="process4" aria-labelledby="process-heading"><div className="wrap"><div className="process4__head"><div><Kicker light>Our process</Kicker><Reveal id="process-heading" lines={['Simple from start','to support.']}/><Rise delay={.15}><p>Four steps, one team. You’ll know what it costs, what it saves and when it happens before you commit to anything.</p></Rise></div><a className="btn-pill" href="#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a></div><ol className="process4__cards">{steps.map((s,i)=><Rise key={s.title} delay={.1+i*.08}><li><div className="process4__top"><span className="process4__icon"><s.Icon size={22} strokeWidth={1.75} aria-hidden="true"/></span><span className="process4__n">{String(i+1).padStart(2,'0')}</span></div><h3>{s.title}</h3><p>{s.body}</p></li></Rise>)}</ol></div></section>}
/** Full-bleed storefront band: the photo scrolls slower than the copy over it. */
export function VisitBand(){return <ParallaxBackdrop image="/assets/team.webp" alt="The Clean Energy Solutions shopfront on the corner of Elgin Boulevard, Wodonga" width={1800} height={992}><Kicker light>Visit us</Kicker><Reveal lines={['Come and see us','on Elgin Boulevard.']}/><Rise delay={.2}><p>79 Elgin Boulevard, Wodonga. Bring a recent bill and we’ll talk through your options in person. No appointment needed.</p><div className="band__links"><a href={MAPS}>Get directions <Arrow/></a><a href="tel:+61260212000">(02) 6021 2000</a></div></Rise></ParallaxBackdrop>}
