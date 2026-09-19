import {createFileRoute} from '@tanstack/react-router';
import {DayStamp} from '@/site/sun';
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
<section id="solutions" className="services-section wrap"><DayStamp at="09:00" label="Morning"/><div className="section-heading"><div><Kicker>What we do</Kicker><Reveal lines={['Solar, batteries, EV.','One local team.']}/></div><Rise delay={.15}><p>Start with what you want your energy system to do. Generate daytime power, store it for later or plan for an EV. We’ll help you choose what makes sense for your property.</p></Rise></div><ServiceStack/></section>
<section className="trust-strip" aria-label="Why choose Clean Energy Solutions"><div><strong><Counter value={4.8} decimals={1}/><span className="unit">/5</span></strong><span>Rated by 26 customers on SolarQuotes</span></div><div><strong><Counter value={15} suffix="+"/></strong><span>Years Daniel has installed solar on the Border</span></div><div><strong><Counter value={25} suffix="–30 yr"/></strong><span>Panel warranties on the brands we install</span></div><div><strong><Counter value={1}/> day</strong><span>Most home systems are installed in a single day</span></div></section>
<Estimator/>
<SystemFlow/>
<WhyChoose/>
<ProjectGallery/>
<ProcessCards/>
<section className="brand-section"><p>Equipment we install and help you compare</p><Marquee items={brands} label="Equipment brands offered by CES"/></section>
<section id="reviews" className="review-section"><div className="wrap"><DayStamp at="17:45" label="Golden hour"/><Kicker>Reviews</Kicker><Reveal lines={['Trusted by homeowners','across the Border.']}/><a className="review-score" href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/"><strong>4.8<span>/5</span></strong><span>26 SolarQuotes ratings<br/><small>Checked 14 September 2026 · Read reviews ↗</small></span></a><h3 className="sr-only">Featured review</h3><RevealWords as="blockquote" text="“Customer service was excellent, installation was on time and they did a fantastic job. Would definitely recommend.”"/><Rise delay={.3}><p className="review-detail">One of the 26 verified ratings on <a href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/">SolarQuotes ↗</a> — read them all before you decide.</p><p>Adam <span>· Albury area, NSW · December 2024</span></p></Rise></div><ReviewMarquee/></section>
<VisitBand/>
<section id="rebates" className="rebate-section wrap"><DayStamp at="19:30" label="Dusk"/><div><Kicker>Rebates</Kicker><Reveal lines={['Check the support','available for your home.']}/><Rise delay={.2}><p>Eligible solar and battery systems may qualify for Australian Government incentives. Some Victorian households may also qualify for Solar Victoria support. Your property, equipment and eligibility determine what applies.</p><p>We’ll help you understand the requirements and identify any eligible incentives in your quote, so you can compare the cost with the proposed equipment and installation.</p></Rise></div><div className="rebate-links"><a href="https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme"><span>Federal · every eligible install<small>STC discount on panels</small></span><ArrowRight size={22} aria-hidden="true"/></a><a href="https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries"><span>Federal program<small>Cheaper Home Batteries</small></span><ArrowRight size={22} aria-hidden="true"/></a><a href="https://www.solar.vic.gov.au/solar-panel-rebate"><span>Victorian households<small>Solar Victoria panel rebate</small></span><ArrowRight size={22} aria-hidden="true"/></a><p>Eligibility and equipment requirements apply. Solar Victoria applies to Victorian properties only; Albury customers are covered by the federal programs. Confirm current requirements for your installation date.</p></div></section>
<section className="cta-split"><DayStamp at="21:00" label="Running on stored sun"/><Reveal lines={['Make your next bill','the start of a better plan.']} className="cta-split__title"/><Rise delay={.15}><p>Start with a free, no-obligation quote. Tell us about your property and we’ll help you compare the options, estimated savings and upfront cost. You don’t need to have it all worked out.</p><a className="btn-pill" href="#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a></Rise></section>
<Faq/></main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(businessSchema).replace(/</g,'\\u003c')}}/></>}
