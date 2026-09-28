import {createFileRoute} from '@tanstack/react-router';
import {ArrowRight,ArrowUpRight,BadgeCheck,MapPin,Star,Wrench} from 'lucide-react';
import {Header,Footer,Faq} from '@/site/shell';
import {businessSchema,description,pageHead} from '@/site/content';
import {ProjectGallery} from '@/site/projects';
import {Hero,ProcessCards,QuoteBand,ServiceStack,VisitBand,WhyChoose} from '@/site/sections';
import {SystemFlow} from '@/site/flow';
import {ReviewGrid,SOLARQUOTES} from '@/site/reviews';
import {Estimator} from '@/site/estimator';
import {Reveal,Rise} from '@/site/motion';
export const Route=createFileRoute('/')({head:()=>pageHead('Solar & Battery Installers Albury-Wodonga | CES',description,'/'),component:Home});
const brands=['Tesla','Sungrow','Sigenergy','BYD','Fronius','Enphase','Jinko'];
/** Proof directly under the hero, the way established installers lead: rating, who does the work, how long, where. */
function TrustBar(){return <section className="trust-bar" aria-label="Why homeowners choose Clean Energy Solutions"><ul className="wrap">
  <li><a href={SOLARQUOTES}><span className="trust-bar__stars" aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={16} fill="currentColor"/>)}</span><span><strong>4.8 out of 5</strong>26 reviews on SolarQuotes</span></a></li>
  <li><BadgeCheck size={22} aria-hidden="true"/><span><strong>CEC-accredited electricians</strong>Our own staff, no subcontractors</span></li>
  <li><Wrench size={22} aria-hidden="true"/><span><strong>15+ years on the Border</strong>Led by Daniel, a local electrician</span></li>
  <li><MapPin size={22} aria-hidden="true"/><span><strong>Local shopfront</strong>79 Elgin Boulevard, Wodonga</span></li>
</ul></section>}
function Home(){return <><Header/><main id="main"><Hero/><TrustBar/><QuoteBand/>
<section id="solutions" className="services-section wrap"><div className="section-heading"><Reveal lines={['Solar, batteries and EV charging.','One local team.']}/><Rise delay={.15}><p>Start with panels or go the whole way to a battery and an EV charger. Either way we design around your bills and what you’re planning next, and we’re still on the phone years later.</p></Rise></div><ServiceStack/></section>
<WhyChoose/>
<section id="reviews" className="review-section" aria-labelledby="reviews-heading"><div className="wrap review-section__head"><h2 id="reviews-heading">What our customers say</h2><a className="review-score" href={SOLARQUOTES}><span className="review-score__stars" aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={18} fill="currentColor"/>)}</span><span><strong>4.8 out of 5</strong> from 26 reviews on SolarQuotes <ArrowUpRight size={15} aria-hidden="true"/></span></a></div><ReviewGrid/></section>
<ProjectGallery/>
<ProcessCards/>
<Estimator/>
<SystemFlow/>
<section className="brand-section" aria-labelledby="brands-heading"><div className="wrap"><h2 id="brands-heading">Equipment we install</h2><ul className="brand-list">{brands.map(b=><li key={b}>{b}</li>)}</ul><p>Panels, inverters and batteries we know and can service locally, with 25–30 year panel warranties.</p></div></section>
<VisitBand/>
<section id="rebates" className="rebate-section wrap"><div><Reveal lines={['Rebates on both sides','of the border.']}/><Rise delay={.2}><p>Every eligible solar install gets the federal STC discount on panels, and eligible home batteries get the federal Cheaper Home Batteries discount. Both come off the price you pay. Victorian owner-occupiers may also qualify for the Solar Victoria panel rebate.</p><p>The battery discount steps down on a fixed schedule, so an earlier install date gets the bigger discount. We handle the applications and the distributor paperwork.</p></Rise></div><div className="rebate-links"><a href="https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme"><span>Federal, every eligible install<small>STC discount on panels</small></span><ArrowUpRight size={20} aria-hidden="true"/></a><a href="https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries"><span>Federal program<small>Cheaper Home Batteries</small></span><ArrowUpRight size={20} aria-hidden="true"/></a><a href="https://www.solar.vic.gov.au/solar-panel-rebate"><span>Victorian households<small>Solar Victoria panel rebate</small></span><ArrowUpRight size={20} aria-hidden="true"/></a><p>Eligibility and equipment requirements apply. Solar Victoria applies to Victorian properties only; Albury customers are covered by the federal programs. Confirm current requirements for your installation date.</p></div></section>
<section className="cta-split"><Reveal lines={['Ready to see your number?']} className="cta-split__title"/><Rise delay={.15}><p>Send us a bill. Our solar consultant gets back to you within one business day, then designs your system from your actual usage, with expected savings and clear pricing. Free, no obligation, no pushy follow-up.</p><div className="cta-split__actions"><a className="btn-pill" href="#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a className="btn-outline" href="tel:+61260212000">Call (02) 6021 2000</a></div></Rise></section>
<Faq/></main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(businessSchema).replace(/</g,'\\u003c')}}/></>}
