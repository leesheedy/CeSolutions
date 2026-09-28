import {ArrowRight,BadgeCheck,Clock,HardHat,Headset,MessageCircle,PencilRuler,Phone,ShieldCheck,Star,Users} from 'lucide-react';
import {Arrow} from './shell';
import {ChecklistFormRegistration,QuoteForm} from './quote-form';
import {Parallax,ParallaxBackdrop,Reveal,Rise,Stack,StackItem} from './motion';
export const MAPS='https://www.google.com/maps/search/?api=1&query=79%20Elgin%20Boulevard%20Wodonga%20Victoria%203690';
const variants=(img:string)=>img.startsWith('ces-')?[600,900,1200].map(w=>`/assets/${img.replace('.webp','')}-${w}.webp ${w}w`).join(', '):undefined;
const medium=(img:string)=>img.startsWith('ces-')?img.replace('.webp','-1200.webp'):img;
/* Copy rules: every figure below is one CES publishes (50–100% bill reduction, 3–6 yr payback, one-day
 * installs, 25–30 yr panels, 4.8/5 from 26 SolarQuotes ratings, Daniel's 15+ years). No staff are named
 * except Daniel; the consultant is "our solar consultant". */
/** Full-bleed hero on CES's own drone photograph of an install: headline naming the area, one line of
 *  what we do, two equal ways in (quote or phone), and the review score in the first viewport — the
 *  pattern the established Border installers (Stag, KDEC) and the national leaders all share.
 *  Two equally weighted actions, not one button and a phone number in small print: home-improvement
 *  pages that offer a click, a form and a phone convert at 4.0% against a 2.6% median (Unbounce). */
export function Hero(){
  return <section className="hero3" aria-labelledby="hero-heading">
    <div className="hero3__bg"><img src="/assets/ces-drone-hero-1920.webp" srcSet="/assets/ces-drone-hero-760.webp 760w, /assets/ces-drone-hero-1200.webp 1200w, /assets/ces-drone-hero-1920.webp 1920w" sizes="100vw" alt="" width={1920} height={1080} fetchPriority="high" decoding="async"/></div>
    <div className="hero3__shade" aria-hidden="true"/>
    <div className="hero3__copy wrap">
      <Reveal as="h1" id="hero-heading" lines={['Solar and batteries for','Albury-Wodonga homes.']} stagger={.08}/>
      <Rise delay={.2}><p className="hero3__body">Designed from your actual power bills and installed by our own CEC-accredited electricians, usually in a single day. Savings typically land between 50% and 100% of your bill.</p>
<div className="hero-action-row"><a href="#quote" className="hero-quote">Get a free quote <ArrowRight size={18} aria-hidden="true"/></a><a href="tel:+61260212000" className="hero-call-cta"><Phone size={17} aria-hidden="true"/>(02) 6021 2000</a></div>
{/* Scope first (the form is genuinely three steps), then the fear that stops an Australian clicking a
    solar "free quote" — being sold to a panel of brokers — answered positively, then the reply time. */}
<p className="hero-note">Three quick questions. Your details go to CES in Wodonga and nowhere else, and we reply within one business day.</p>
<ul className="hero-trust" aria-label="Why people choose CES"><li><a href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/"><span className="hero-trust__stars" aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={15} fill="currentColor"/>)}</span><strong>4.8/5</strong><span>26 reviews on SolarQuotes</span></a></li><li><ShieldCheck size={17} aria-hidden="true"/>No subcontractors</li><li><BadgeCheck size={17} aria-hidden="true"/>25–30 yr panel warranties</li></ul></Rise>
    </div>
    <span className="hero__caption">Drone photo of a CES install. See more of <a href="#our-work">our work</a>.</span>
  </section>;
}
/** Black band under the hero: pitch on the left, the three-step enquiry form on the right. */
export function QuoteBand(){return <section id="quote" className="quote-band" aria-labelledby="quote-heading"><div className="wrap quote-band__grid"><div className="quote-band__pitch"><Reveal id="quote-heading" lines={['Get a real number,','not a sales pitch.']}/><Rise delay={.15}><p>Tell us what you’re after and send a bill. We design around how you use power, then come back with clear pricing. No pressure, no call centre.</p><p className="quote-band__promise"><Clock size={20} aria-hidden="true"/>Reply within one business day</p><a className="quote-band__call" href="tel:+61260212000"><span className="quote-band__call-icon"><Phone size={22} aria-hidden="true"/></span><span>Prefer to talk?<strong>(02) 6021 2000</strong></span></a></Rise></div><QuoteForm/><ChecklistFormRegistration/></div></section>}
const services=[
{id:'solar',href:'/solar',title:['Put your roof','to work.'],body:'Panels sized to your roof and your bills, so daytime power comes from above you instead of the grid. Most systems pay for themselves in 3–6 years.',cta:'See solar options',image:'ces-roof-gums.webp',alt:'Solar panels on a dark corrugated roof under a cloudy blue sky, installed by CES',width:1536,height:1536},
{id:'battery',href:'/batteries',title:['Keep your solar','for after sunset.'],body:'Store the surplus and run the evening on it instead of buying power back at peak rates. Blackout backup if you want it. The federal battery discount is open now.',cta:'See battery options',image:'ces-garage-byd-fronius.webp',alt:'Garage with two battery towers, two Fronius inverters and an EV charger installed by CES',width:1600,height:1200},
{id:'business',href:'/commercial-solar',title:['Make your working hours','work for your bill.'],body:'Sheds, shops, cool rooms and offices run in daylight, exactly when panels produce. We design around your roof and your operating hours.',cta:'See business solar',image:'instagram-shed.webp',alt:'Black solar panels across a new shed roof, installed by CES',width:1600,height:1600}];
/** Three service cards that pin under the header and stack as you scroll. */
export function ServiceStack(){return <Stack className="service-stack" total={services.length}>{services.map((s,i)=><StackItem key={s.id} index={i}><a className={'stack-card service-'+s.id} href={s.href}><div className="service-copy"><h3>{s.title[0]}<br/>{s.title[1]}</h3><p>{s.body}</p><span className="service-destination">{s.cta} <Arrow/></span></div><Parallax className="service-image" intensity={44}><img src={'/assets/'+medium(s.image)} srcSet={variants(s.image)} sizes="(max-width:860px) 100vw, 55vw" alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async"/></Parallax></a></StackItem>)}</Stack>}
const reasons=[
{Icon:ShieldCheck,title:'Products that last',body:'Tesla, Sungrow, Sigenergy, BYD, Fronius, Enphase and Jinko. Brands we know and can service, with 25–30 year panel warranties.'},
{Icon:HardHat,title:'Our own licensed, accredited electricians',body:'Led by Daniel, with more than 15 years installing solar on the Border. No subcontractors. Tidy work on every roof.'},
{Icon:Users,title:'Rated 4.8/5 by real customers',body:'26 SolarQuotes reviews: installation 5.0, customer service 4.9. The people who quote and install are the ones who answer the phone.'}];
/** "Why choose CES": photo on the left, three reasons with icons on the right (Framer "About us" section). */
export function WhyChoose(){return <section className="why wrap" aria-labelledby="why-heading"><Parallax className="why__photo" intensity={30}><img src="/assets/ces-install-crew-roof.webp" srcSet="/assets/ces-install-crew-roof-600.webp 600w, /assets/ces-install-crew-roof.webp 721w" sizes="(max-width:860px) 100vw, 50vw" alt="Two CES installers fixing solar panels to rails on a corrugated roof" width={721} height={721} loading="lazy" decoding="async"/></Parallax><div className="why__copy"><Reveal id="why-heading" lines={['Installed by the people','who answer the phone.']}/><p className="why__intro">No call centre, no subcontractors. The electricians who quote your job install it, and they’re the ones who pick up when you ring two years later.</p><ul className="why__list">{reasons.map((r,i)=><Rise key={r.title} delay={.2+i*.08}><li><span className="why__icon"><r.Icon size={26} strokeWidth={1.75} aria-hidden="true"/></span><div><h3>{r.title}</h3><p>{r.body}</p></div></li></Rise>)}</ul></div></section>}
const steps=[
{Icon:MessageCircle,title:'Consultation',body:'A quick chat about your bills, your roof and what you want to achieve. Free, at your place or ours.'},
{Icon:PencilRuler,title:'Tailored design',body:'We design the system around your usage, with expected savings and clear pricing.'},
{Icon:HardHat,title:'Installation',body:'Our own licensed electricians install it, usually in a single day, and leave the site tidy.'},
{Icon:Headset,title:'Ongoing support',body:'We set up your monitoring app, handle the rebate paperwork and stay on the phone after.'}];
/** Dark band with the four steps from first call to after-install support. */
export function ProcessCards(){return <section className="process4" aria-labelledby="process-heading"><div className="wrap"><div className="process4__head"><div><Reveal id="process-heading" lines={['Simple from start','to support.']}/><Rise delay={.15}><p>Four steps, one team. You’ll know what it costs, what it saves and when it happens before you commit to anything.</p></Rise></div><a className="btn-pill" href="#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a></div><ol className="process4__cards">{steps.map((s,i)=><Rise key={s.title} delay={.1+i*.08}><li><div className="process4__top"><span className="process4__icon"><s.Icon size={22} strokeWidth={1.75} aria-hidden="true"/></span><span className="process4__n">{String(i+1).padStart(2,'0')}</span></div><h3>{s.title}</h3><p>{s.body}</p></li></Rise>)}</ol></div></section>}
/** Full-bleed storefront band: the photo scrolls slower than the copy over it. */
export function VisitBand(){return <ParallaxBackdrop image="/assets/team.webp" alt="The Clean Energy Solutions shopfront on the corner of Elgin Boulevard, Wodonga" width={1800} height={992}><Reveal lines={['Come and see us','on Elgin Boulevard.']}/><Rise delay={.2}><p>79 Elgin Boulevard, Wodonga. Bring a recent bill and we’ll talk through your options in person. No appointment needed.</p><div className="band__links"><a href={MAPS}>Get directions <Arrow/></a><a href="tel:+61260212000">(02) 6021 2000</a></div></Rise></ParallaxBackdrop>}
