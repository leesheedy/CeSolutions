import {useRef} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';
import {HardHat,Ruler,Smartphone} from 'lucide-react';
import {ScrollStroke} from '@/components/ui/svg-follow-scroll';
import {Arrow} from './shell';
import {Parallax,ParallaxBackdrop,Reveal,Rise,Stack,StackItem} from './motion';
export const MAPS='https://www.google.com/maps/search/?api=1&query=79%20Elgin%20Boulevard%20Wodonga%20Victoria%203690';
/** Light, centred hero: a brand-gradient stroke draws behind the headline as you scroll, and the
 * (labelled) generated illustration sits below in a rounded panel that rises slightly. */
export function Hero(){
  const ref=useRef<HTMLElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
  const mediaY=useTransform(scrollYProgress,[0,1],[0,-140]);
  return <section ref={ref} className="hero2" aria-label="Solar and batteries in Albury-Wodonga">
    <div className="hero2__copy wrap"><ScrollStroke progress={scrollYProgress} className="hero2__stroke" from={.15} strokeWidth={18}/>
      <p className="eyebrow">Solar &amp; batteries · Albury-Wodonga</p>
      <Reveal as="h1" lines={['Cut your power bill','in half. Or more.']} stagger={.08}/>
      <Rise delay={.25}><p className="hero2__body">Designed from your electricity bills. Installed by our own local electricians. Most CES households save 50–100% on power and pay the system off in 3 to 6 years.</p><div className="hero-action-row"><a href="/contact" className="hero-quote">Get my free quote <Arrow/></a><a href="tel:+61260212000" className="hero-call">Call (02) 6021 2000</a></div><a href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/" className="hero-review"><strong>4.8/5</strong><span>26 SolarQuotes ratings ↗</span></a><p className="hero-note">Typical range. Your figure depends on system size and when you use power — we calculate it from your actual bills before you decide anything.</p></Rise>
    </div>
    <motion.div className="hero2__media wrap" data-motion="" style={reduce?undefined:{y:mediaY}}><img src="/assets/hero-backdrop.webp" alt="Illustration: a regional Australian home with black solar panels on a corrugated roof at golden hour" width={2048} height={878} fetchPriority="high" decoding="async"/><span className="hero__caption">Illustration · real CES installs are in <a href="#our-work">our work</a></span></motion.div>
  </section>;
}
const steps=[
{Icon:Ruler,title:'We design it from your bills',body:'Bree reads your recent bills and your roof, then sizes a system around how you actually use power. You see the expected savings before you sign anything.'},
{Icon:HardHat,title:'Our own electricians install it',body:'CEC-accredited, on our payroll and led by Daniel. Most homes are finished in a day, with the distributor paperwork handled for you.'},
{Icon:Smartphone,title:'You watch it work. We stay on call.',body:'A monitoring app on your phone shows what you generate, use and export. The same local team answers the phone afterwards.'}];
/** Plain-language summary of what CES does, in the order a customer experiences it. */
export function WhatWeDo(){return <section className="what-strip wrap" aria-label="What Clean Energy Solutions does">{steps.map((s,i)=><Rise key={s.title} delay={i*.1}><article><span className="what-icon"><s.Icon size={26} strokeWidth={1.75} aria-hidden="true"/></span><h3>{s.title}</h3><p>{s.body}</p></article></Rise>)}</section>}
const services=[
{id:'solar',href:'/solar',kicker:'01 / Residential solar',title:['Put your roof','to work.'],body:'Panels sized to your roof and your bills, so daytime power comes from above you instead of the grid.',cta:'Explore solar',image:'instagram-rooftop.webp',alt:'Solar panels on a metal roof, shared by CES on Instagram',width:512,height:640},
{id:'battery',href:'/batteries',kicker:'02 / Battery storage',title:['Keep your solar','for after sunset.'],body:'Store the surplus and run the evening on it instead of buying power back at peak rates. Blackout backup if you want it.',cta:'Explore batteries',image:'battery.webp',alt:'Home battery system featured by Clean Energy Solutions',width:1500,height:1000},
{id:'business',href:'/commercial-solar',kicker:'03 / Business & commercial',title:['Make your working hours','work for your bill.'],body:'Daytime demand is a natural match for solar. We plan around your premises, roof and operating schedule.',cta:'Explore business solar',image:'instagram-crew.webp',alt:'The CES team together at their workplace',width:640,height:427}];
/** Three service cards that pin under the header and stack as you scroll. */
export function ServiceStack(){return <Stack className="service-stack" total={services.length}>{services.map((s,i)=><StackItem key={s.id} index={i}><a className={'stack-card service-'+s.id} href={s.href}><div className="service-copy"><span>{s.kicker}</span><h3>{s.title[0]}<br/>{s.title[1]}</h3><p>{s.body}</p><span className="service-destination">{s.cta} <Arrow/></span></div><Parallax className="service-image" intensity={44}><img src={'/assets/'+s.image} alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async"/></Parallax></a></StackItem>)}</Stack>}
/** Full-bleed storefront band: the photo scrolls slower than the copy over it. */
export function VisitBand(){return <ParallaxBackdrop image="/assets/team.webp" alt="The Clean Energy Solutions shopfront on the corner of Elgin Boulevard, Wodonga"><span className="eyebrow">Visit us</span><Reveal lines={['Come and see us','on Elgin Boulevard.']}/><Rise delay={.2}><p>79 Elgin Boulevard, Wodonga. Bring a recent bill and we’ll talk through your options in person.</p><div className="band__links"><a href={MAPS}>Get directions <Arrow/></a><a href="tel:+61260212000">(02) 6021 2000</a></div></Rise></ParallaxBackdrop>}
