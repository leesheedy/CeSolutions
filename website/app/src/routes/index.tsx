import {createFileRoute} from '@tanstack/react-router';
import {ArrowRight} from 'lucide-react';
import {Header,Footer,Faq} from '@/site/shell';
import {businessSchema,description,pageHead} from '@/site/content';
import {ProjectGallery} from '@/site/projects';
import {Hero,Kicker,ProcessCards,QuoteBand,ServiceStack,VisitBand,WhyChoose} from '@/site/sections';
import {SystemFlow} from '@/site/flow';
import {ReviewMarquee} from '@/site/reviews';
import {Estimator} from '@/site/estimator';
import {Counter,Marquee,Reveal,RevealWords,Rise} from '@/site/motion';
export const Route=createFileRoute('/')({head:()=>pageHead('Solar & Battery Installers Albury-Wodonga | CES',description,'/'),component:Home});
const brands=['Tesla','Sungrow','Sigenergy','BYD','Fronius','Enphase','Jinko'];
// Section order follows the Framer reference: hero → enquiry → services → proof → why us → process → CTA → FAQ → reviews.
function Home(){return <><Header/><main id="main"><Hero/><QuoteBand/>
<section id="solutions" className="services-section wrap"><div className="section-heading"><div><Kicker>What we do</Kicker><Reveal lines={['Solar, batteries, EV.','One local team.']}/></div><Rise delay={.15}><p>Start with panels or go the whole way to a battery and an EV charger. Either way we design around your bills and what you’re planning next — and we’re still on the phone years later.</p></Rise></div><ServiceStack/></section>
<section className="trust-strip" aria-label="Why choose Clean Energy Solutions"><div><strong><Counter value={4.8} decimals={1}/><span className="unit">/5</span></strong><span>Rated by 26 customers on SolarQuotes</span></div><div><strong><Counter value={15} suffix="+"/></strong><span>Years Daniel has installed solar on the Border</span></div><div><strong><Counter value={25} suffix="–30 yr"/></strong><span>Panel warranties on the brands we install</span></div><div><strong><Counter value={1}/> day</strong><span>Most home systems are installed in a single day</span></div></section>
<Estimator/>
<SystemFlow/>
<WhyChoose/>
<ProjectGallery/>
<ProcessCards/>
<section className="brand-section"><p>Equipment we install and help you compare</p><Marquee items={brands} label="Equipment brands offered by CES"/></section>
<section id="reviews" className="review-section"><div className="wrap"><Kicker>Reviews</Kicker><Reveal lines={['Trusted by homeowners','across the Border.']}/><a className="review-score" href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/"><strong>4.8<span>/5</span></strong><span>26 SolarQuotes ratings<br/><small>Checked 14 September 2026 · Read reviews ↗</small></span></a><h3 className="sr-only">Featured review</h3><RevealWords as="blockquote" text="“Customer service was excellent, installation was on time and they did a fantastic job. Would definitely recommend.”"/><Rise delay={.3}><p className="review-detail">One of the 26 verified ratings on <a href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/">SolarQuotes ↗</a> — read them all before you decide.</p><p>Adam <span>· Albury area, NSW · December 2024</span></p></Rise></div><ReviewMarquee/></section>
<VisitBand/>
<section id="rebates" className="rebate-section wrap"><div><Kicker>Rebates</Kicker><Reveal lines={['Rebates are open','on both sides of the border.']}/><Rise delay={.2}><p>Every eligible solar install gets the federal STC discount on panels, and eligible home batteries get the federal Cheaper Home Batteries discount — both taken off the price you pay. Victorian owner-occupiers may also qualify for the Solar Victoria panel rebate.</p><p>The battery discount steps down on a fixed schedule, so an earlier install date gets the bigger discount. We handle the applications and the distributor paperwork — you just pay the reduced price.</p></Rise></div><div className="rebate-links"><a href="https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme"><span>Federal · every eligible install<small>STC discount on panels</small></span><ArrowRight size={22} aria-hidden="true"/></a><a href="https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries"><span>Federal program<small>Cheaper Home Batteries</small></span><ArrowRight size={22} aria-hidden="true"/></a><a href="https://www.solar.vic.gov.au/solar-panel-rebate"><span>Victorian households<small>Solar Victoria panel rebate</small></span><ArrowRight size={22} aria-hidden="true"/></a><p>Eligibility and equipment requirements apply. Solar Victoria applies to Victorian properties only; Albury customers are covered by the federal programs. Confirm current requirements for your installation date.</p></div></section>
<section className="cta-split"><Reveal lines={['Ready to see','your number?']} className="cta-split__title"/><Rise delay={.15}><p>Send us a bill. Our solar consultant gets back to you within one business day, then designs your system from your actual usage — expected savings and clear pricing included. Free, no obligation, no pushy follow-up.</p><a className="btn-pill" href="#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a></Rise></section>
<Faq/></main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(businessSchema).replace(/</g,'\\u003c')}}/></>}
