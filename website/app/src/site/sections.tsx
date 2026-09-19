import {useEffect,useRef} from 'react';
import {DayStamp} from './sun';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';
import {ArrowRight,BadgeCheck,Clock,HardHat,Headset,MessageCircle,PencilRuler,Phone,ShieldCheck,Star,Users} from 'lucide-react';
import {Arrow} from './shell';
import {ChecklistFormRegistration,QuoteForm} from './quote-form';
import {Parallax,ParallaxBackdrop,Reveal,Rise,Stack,StackItem} from './motion';
export const MAPS='https://www.google.com/maps/search/?api=1&query=79%20Elgin%20Boulevard%20Wodonga%20Victoria%203690';
const variants=(img:string)=>img.startsWith('ces-')?[600,900,1200].map(w=>`/assets/${img.replace('.webp','')}-${w}.webp ${w}w`).join(', '):undefined;
const medium=(img:string)=>img.startsWith('ces-')?img.replace('.webp','-1200.webp'):img;
/** Small uppercase label with the corner-bracket device used across the Framer reference. */
export function Kicker({children,light}:{children:string;light?:boolean}){return <span className={light?'kicker kicker--light':'kicker'}><span aria-hidden="true" className="kicker__bl"/><span aria-hidden="true" className="kicker__tr"/>{children}</span>}
/* Copy rules: every figure below is one CES publishes (50–100% bill reduction, 3–6 yr payback, one-day
 * installs, 25–30 yr panels, 4.8/5 from 26 SolarQuotes ratings, Daniel's 15+ years). No staff are named
 * except Daniel; the consultant is "our solar consultant". */
/** Full-bleed hero on the (labelled) illustration: kicker, sentence-case headline, one line, two actions. */
export function Hero(){
  const ref=useRef<HTMLElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
  const bgY=useTransform(scrollYProgress,[0,1],['0%','22%']);
  const copyY=useTransform(scrollYProgress,[0,1],[0,-70]);

  return <section ref={ref} className="hero3" aria-label="Solar and batteries in Albury-Wodonga">
    <motion.div className="hero3__bg" data-motion="" style={reduce?undefined:{y:bgY}}><img src="/assets/hero-backdrop.webp" alt="" width={2048} height={878} fetchPriority="high" decoding="async"/></motion.div><div className="hero3__glow" aria-hidden="true"/>
    <div className="hero3__shade" aria-hidden="true"/>
    <motion.div className="hero3__copy wrap" data-motion="" style={reduce?undefined:{y:copyY}}>
      <Kicker light>Your local solar & battery installers</Kicker>
      <Reveal as="h1" lines={['Lower power bills.','Solar built around you.']} stagger={.08}/>
      <Rise delay={.22}><p className="hero3__body">Make more of your roof and buy less power from the grid. Our Albury-Wodonga team designs solar, batteries and EV charging around your bills, with clear pricing and local support after installation.</p><div className="hero-action-row"><a href="#quote" className="hero-quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a href="#estimate" className="hero-secondary">Explore potential savings</a></div><ul className="hero-trust" aria-label="Why people choose CES"><li><a href="tel:+61260212000"><Phone size={15} aria-hidden="true"/><strong>(02) 6021 2000</strong></a></li><li><a href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/"><span className="hero-trust__stars" aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={13} fill="currentColor"/>)}</span><strong>4.8/5</strong><span>26 SolarQuotes ratings ↗</span></a></li><li><ShieldCheck size={15} aria-hidden="true"/>Own local electricians</li><li><BadgeCheck size={15} aria-hidden="true"/>25–30 yr panel warranties</li></ul></Rise>
    </motion.div>
    <span className="hero__caption">Illustration · real CES installs are in <a href="#our-work">our work</a></span>
  </section>;
}
/** Black band under the hero: pitch on the left, the three-step enquiry form on the right. */
export function QuoteBand(){return <section id="quote" className="quote-band" aria-labelledby="quote-heading"><div className="wrap quote-band__grid"><DayStamp at="rise" label="First light" light/><div className="quote-band__pitch"><Kicker light>Free quote</Kicker><Reveal id="quote-heading" lines={['Find the right system.','Know what it could save.']}/><Rise delay={.15}><p>Tell us about your property and what you’d like to change. We’ll discuss your options, assess your energy use and prepare a tailored quote. No bill handy? You can send it later.</p><p className="quote-band__promise"><Clock size={20} aria-hidden="true"/>Free quote. No obligation to go ahead.</p><a className="quote-band__call" href="tel:+61260212000"><span className="quote-band__call-icon"><Phone size={22} aria-hidden="true"/></span><span>Prefer to talk?<strong>(02) 6021 2000</strong></span></a></Rise></div><QuoteForm/><ChecklistFormRegistration/></div></section>}
const services=[
{id:'solar',href:'/solar',kicker:'01 / Residential solar',title:['Put your roof','to work.'],body:'Turn roof space into power you can use every day. We match the panels and inverter to your usage, then explain the cost and estimated savings before you decide.',cta:'See solar options',image:'ces-roof-gums.webp',alt:'Solar panels on a dark corrugated roof under a cloudy blue sky, installed by CES',width:1536,height:1536},
{id:'battery',href:'/batteries',kicker:'02 / Home batteries',title:['Keep your solar','for after sunset.'],body:'Use more of your solar after sunset. We’ll check your existing system, storage needs and whether compatible blackout backup belongs in your design.',cta:'See battery options',image:'ces-garage-byd-fronius.webp',alt:'Garage with two battery towers, two Fronius inverters and an EV charger installed by CES',width:1600,height:1200},
{id:'business',href:'/commercial-solar',kicker:'03 / Business & farm',title:['Make your working hours','work for your bill.'],body:'Sheds, shops, cool rooms and offices run in daylight — exactly when panels produce. We design around your roof and your operating hours.',cta:'See business solar',image:'instagram-shed.webp',alt:'Black solar panels across a new shed roof, installed by CES',width:1600,height:1600}];
/** Three service cards that pin under the header and stack as you scroll. */
export function ServiceStack(){return <Stack className="service-stack" total={services.length}>{services.map((s,i)=><StackItem key={s.id} index={i}><a className={'stack-card service-'+s.id} href={s.href}><div className="service-copy"><span>{s.kicker}</span><h3>{s.title[0]}<br/>{s.title[1]}</h3><p>{s.body}</p><span className="service-destination">{s.cta} <Arrow/></span></div><Parallax className="service-image" intensity={44}><img src={'/assets/'+medium(s.image)} srcSet={variants(s.image)} sizes="(max-width:860px) 100vw, 55vw" alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async"/></Parallax></a></StackItem>)}</Stack>}
const reasons=[
{Icon:ShieldCheck,title:'Equipment chosen for your home',body:'Compare established brands with advice on performance, monitoring and warranties. We explain the differences so you can choose with confidence.'},
{Icon:HardHat,title:'Installed by our local electricians',body:'Our in-house team is led by Daniel, with more than 15 years in solar and electrical installation. You know who to contact before and after the job.'},
{Icon:Users,title:'Rated 4.8/5 by real customers',body:'Read independent CES customer experiences on SolarQuotes, then see our installation photos. The 4.8/5 rating is a snapshot checked in September 2026.'}];
/** "Why choose CES": photo on the left, three reasons with icons on the right (Framer "About us" section). */
export function WhyChoose(){return <section className="why wrap" aria-labelledby="why-heading"><DayStamp at="14:00" label="Full sun"/><Parallax className="why__photo" intensity={30}><img src="/assets/ces-install-crew-roof.webp" srcSet="/assets/ces-install-crew-roof-600.webp 600w, /assets/ces-install-crew-roof.webp 721w" sizes="(max-width:860px) 100vw, 50vw" alt="Two CES installers fixing solar panels to rails on a corrugated roof" width={721} height={721} loading="lazy" decoding="async"/></Parallax><div className="why__copy"><Kicker>Why choose CES</Kicker><Reveal id="why-heading" lines={['Local from your first question','to life after installation.']}/><Rise delay={.15}><p className="why__intro">Choosing solar means comparing equipment, prices and promises. We help you make sense of the options, install with our own electricians and stay available when you need support.</p></Rise><ul className="why__list">{reasons.map((r,i)=><Rise key={r.title} delay={.2+i*.08}><li><span className="why__icon"><r.Icon size={26} strokeWidth={1.75} aria-hidden="true"/></span><div><h3>{r.title}</h3><p>{r.body}</p></div></li></Rise>)}</ul></div></section>}
const steps=[
{Icon:MessageCircle,title:'Tell us what matters',body:'Lower bills, more stored power or an EV on the way? Tell us about your property and plans. A recent electricity bill helps.'},
{Icon:PencilRuler,title:'Compare your options',body:'Get a recommended system, itemised pricing and estimated performance, with the assumptions explained. You decide whether to proceed.'},
{Icon:HardHat,title:'Plan your installation',body:'We agree the scope and timing, coordinate the connection requirements and install your system with our own electricians.'},
{Icon:Headset,title:'Know how to use it',body:'We explain monitoring and how to make use of your solar. Your local team remains a phone call away for ongoing support.'}];
/** Black band with four mint step cards (Framer "Process" section). */
export function ProcessCards(){return <section className="process4" aria-labelledby="process-heading"><div className="wrap"><DayStamp at="17:00" label="Low sun" light/><div className="process4__head"><div><Kicker light>Our process</Kicker><Reveal id="process-heading" lines={['Simple from start','to support.']}/><Rise delay={.15}><p>A clear recommendation, an agreed installation plan and someone local to call. Here’s what happens after you enquire.</p></Rise></div><a className="btn-pill" href="#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a></div><ol className="process4__cards">{steps.map((s,i)=><Rise key={s.title} delay={.1+i*.08}><li><div className="process4__top"><span className="process4__icon"><s.Icon size={22} strokeWidth={1.75} aria-hidden="true"/></span><span className="process4__n">{String(i+1).padStart(2,'0')}</span></div><h3>{s.title}</h3><p>{s.body}</p></li></Rise>)}</ol></div></section>}
/** Full-bleed storefront band: the photo scrolls slower than the copy over it. */
export function VisitBand(){return <ParallaxBackdrop image="/assets/team.webp" alt="The Clean Energy Solutions shopfront on the corner of Elgin Boulevard, Wodonga" width={1800} height={992}><Kicker light>Visit us</Kicker><Reveal lines={['Come and see us','on Elgin Boulevard.']}/><Rise delay={.2}><p>Visit us at 79 Elgin Boulevard, Wodonga. Bring a recent bill and talk through your options with our local team. Call ahead to arrange a time.</p><div className="band__links"><a href={MAPS}>Get directions <Arrow/></a><a href="tel:+61260212000">(02) 6021 2000</a></div></Rise></ParallaxBackdrop>}
