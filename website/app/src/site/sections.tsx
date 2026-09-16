import {useEffect,useRef} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';
import {ArrowRight,BadgeCheck,Clock,HardHat,Headset,MessageCircle,PencilRuler,Phone,ShieldCheck,Star,Users} from 'lucide-react';
import {Arrow} from './shell';
import {ChecklistFormRegistration,QuoteForm} from './quote-form';
import {Parallax,ParallaxBackdrop,Reveal,Rise,Stack,StackItem} from './motion';
export const MAPS='https://www.google.com/maps/search/?api=1&query=79%20Elgin%20Boulevard%20Wodonga%20Victoria%203690';
/** Small uppercase label with the corner-bracket device used across the Framer reference. */
export function Kicker({children,light}:{children:string;light?:boolean}){return <span className={light?'kicker kicker--light':'kicker'}><span aria-hidden="true" className="kicker__bl"/><span aria-hidden="true" className="kicker__tr"/>{children}</span>}
/** Full-bleed hero on the (labelled) illustration: kicker, sentence-case headline, one line, two actions. */
export function Hero(){
  const ref=useRef<HTMLElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
  const bgY=useTransform(scrollYProgress,[0,1],['0%','22%']);
  const video=useRef<HTMLVideoElement>(null);
  useEffect(()=>{const v=video.current;if(!v)return;const ready=()=>v.classList.add('is-ready');if(v.readyState>=3)ready();else v.addEventListener('canplay',ready,{once:true});return()=>v.removeEventListener('canplay',ready);},[]);
  const copyY=useTransform(scrollYProgress,[0,1],[0,-70]);
  return <section ref={ref} className="hero3" aria-label="Solar and batteries in Albury-Wodonga">
    <motion.div className="hero3__bg" data-motion="" style={reduce?undefined:{y:bgY}}><img src="/assets/hero-backdrop.webp" alt="" width={2048} height={878} fetchPriority="high" decoding="async"/>{!reduce&&<video ref={video} className="hero3__video" autoPlay muted loop playsInline preload="metadata" poster="/assets/hero-backdrop.webp" aria-hidden="true"><source src="/assets/hero-loop.webm" type="video/webm"/><source src="/assets/hero-loop.mp4" type="video/mp4"/></video>}</motion.div><div className="hero3__glow" aria-hidden="true"/>
    <div className="hero3__shade" aria-hidden="true"/>
    <motion.div className="hero3__copy wrap" data-motion="" style={reduce?undefined:{y:copyY}}>
      <Kicker light>Your local clean energy experts</Kicker>
      <Reveal as="h1" lines={['Power your home','for less.']} stagger={.08}/>
      <Rise delay={.22}><p className="hero3__body">Solar, batteries and EV charging designed from your bills and installed by our own Albury-Wodonga electricians. Most CES households cut their power bill by 50–100%.</p><div className="hero-action-row"><a href="#quote" className="hero-quote">Get a free quote <ArrowRight size={18} aria-hidden="true"/></a></div><ul className="hero-trust" aria-label="Why people choose CES"><li><a href="tel:+61260212000"><Phone size={15} aria-hidden="true"/><strong>(02) 6021 2000</strong></a></li><li><a href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/"><span className="hero-trust__stars" aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={13} fill="currentColor"/>)}</span><strong>4.8/5</strong><span>26 SolarQuotes ratings ↗</span></a></li><li><ShieldCheck size={15} aria-hidden="true"/>Own local electricians</li><li><BadgeCheck size={15} aria-hidden="true"/>25–30 yr panel warranties</li></ul></Rise>
    </motion.div>
    <span className="hero__caption">Illustration · real CES installs are in <a href="#our-work">our work</a></span>
  </section>;
}
/** Black band under the hero: pitch on the left, the three-step enquiry form on the right. */
export function QuoteBand(){return <section id="quote" className="quote-band" aria-labelledby="quote-heading"><div className="wrap quote-band__grid"><div className="quote-band__pitch"><Kicker light>Get started</Kicker><Reveal id="quote-heading" lines={['Let’s talk about','your energy needs.']}/><Rise delay={.15}><p>Three quick steps and Ella, our solar consultant, comes back with a tailored design and clear pricing. No pressure, no call centre.</p><p className="quote-band__promise"><Clock size={20} aria-hidden="true"/>We respond within one business day</p><a className="quote-band__call" href="tel:+61260212000"><span className="quote-band__call-icon"><Phone size={22} aria-hidden="true"/></span><span>Prefer to talk?<strong>(02) 6021 2000</strong></span></a></Rise></div><QuoteForm/><ChecklistFormRegistration/></div></section>}
const services=[
{id:'solar',href:'/solar',kicker:'01 / Residential solar',title:['Put your roof','to work.'],body:'Panels sized to your roof and your bills, so daytime power comes from above you instead of the grid.',cta:'Explore solar',image:'instagram-rooftop.webp',alt:'Solar panels on a metal roof, shared by CES on Instagram',width:1200,height:1500},
{id:'battery',href:'/batteries',kicker:'02 / Battery storage',title:['Keep your solar','for after sunset.'],body:'Store the surplus and run the evening on it instead of buying power back at peak rates. Blackout backup if you want it.',cta:'Explore batteries',image:'battery.webp',alt:'Home battery system featured by Clean Energy Solutions',width:1500,height:1000},
{id:'business',href:'/commercial-solar',kicker:'03 / Business & commercial',title:['Make your working hours','work for your bill.'],body:'Daytime demand is a natural match for solar. We plan around your premises, roof and operating schedule.',cta:'Explore business solar',image:'instagram-shed.webp',alt:'Black solar panels across a new shed roof, installed by CES',width:1600,height:1600}];
/** Three service cards that pin under the header and stack as you scroll. */
export function ServiceStack(){return <Stack className="service-stack" total={services.length}>{services.map((s,i)=><StackItem key={s.id} index={i}><a className={'stack-card service-'+s.id} href={s.href}><div className="service-copy"><span>{s.kicker}</span><h3>{s.title[0]}<br/>{s.title[1]}</h3><p>{s.body}</p><span className="service-destination">{s.cta} <Arrow/></span></div><Parallax className="service-image" intensity={44}><img src={'/assets/'+s.image} alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async"/></Parallax></a></StackItem>)}</Stack>}
const reasons=[
{Icon:ShieldCheck,title:'Reliable products',body:'Tesla, Sungrow, Sigenergy, BYD, Fronius, Enphase and Jinko — brands we know, backed by 25–30 year panel warranties.'},
{Icon:HardHat,title:'Skilled, careful workmanship',body:'Installed by our own CEC-accredited electricians, led by Daniel, with attention to detail on every roof.'},
{Icon:Users,title:'A team you can actually call',body:'The people who quote, install and answer the phone afterwards all work from the same Wodonga office.'}];
/** "Why choose CES": photo on the left, three reasons with icons on the right (Framer "About us" section). */
export function WhyChoose(){return <section className="why wrap" aria-labelledby="why-heading"><Parallax className="why__photo" intensity={30}><img src="/assets/instagram-roof-drone.webp" alt="Drone view of black solar panels on a red corrugated roof, installed by CES" width={1600} height={1600} loading="lazy" decoding="async"/></Parallax><div className="why__copy"><Kicker>Why choose CES</Kicker><Reveal id="why-heading" lines={['Quality today.','Support for the future.']}/><Rise delay={.15}><p className="why__intro">We focus on reliable products, careful workmanship and systems designed around how you actually use power.</p></Rise><ul className="why__list">{reasons.map((r,i)=><Rise key={r.title} delay={.2+i*.08}><li><span className="why__icon"><r.Icon size={26} strokeWidth={1.75} aria-hidden="true"/></span><div><h3>{r.title}</h3><p>{r.body}</p></div></li></Rise>)}</ul></div></section>}
const steps=[
{Icon:MessageCircle,title:'Consultation',body:'We learn about your property, energy use, budget and goals.'},
{Icon:PencilRuler,title:'Tailored design',body:'Bree designs a system around your bills and your roof, with the expected savings.'},
{Icon:HardHat,title:'Installation',body:'Our licensed team completes a safe, tidy installation, usually in a day.'},
{Icon:Headset,title:'Ongoing support',body:'We set up your monitoring app and stay on the phone afterwards.'}];
/** Black band with four mint step cards (Framer "Process" section). */
export function ProcessCards(){return <section className="process4" aria-labelledby="process-heading"><div className="wrap"><div className="process4__head"><div><Kicker light>Our process</Kicker><Reveal id="process-heading" lines={['Simple from start','to support.']}/><Rise delay={.15}><p>Clear advice, a tailored design and a professional installation, without making the process complicated.</p></Rise></div><a className="btn-pill" href="#quote">Get a quote <ArrowRight size={18} aria-hidden="true"/></a></div><ol className="process4__cards">{steps.map((s,i)=><Rise key={s.title} delay={.1+i*.08}><li><div className="process4__top"><span className="process4__icon"><s.Icon size={22} strokeWidth={1.75} aria-hidden="true"/></span><span className="process4__n">{String(i+1).padStart(2,'0')}</span></div><h3>{s.title}</h3><p>{s.body}</p></li></Rise>)}</ol></div></section>}
/** Full-bleed storefront band: the photo scrolls slower than the copy over it. */
export function VisitBand(){return <ParallaxBackdrop image="/assets/team.webp" alt="The Clean Energy Solutions shopfront on the corner of Elgin Boulevard, Wodonga" width={1800} height={992}><Kicker light>Visit us</Kicker><Reveal lines={['Come and see us','on Elgin Boulevard.']}/><Rise delay={.2}><p>79 Elgin Boulevard, Wodonga. Bring a recent bill and we’ll talk through your options in person.</p><div className="band__links"><a href={MAPS}>Get directions <Arrow/></a><a href="tel:+61260212000">(02) 6021 2000</a></div></Rise></ParallaxBackdrop>}
