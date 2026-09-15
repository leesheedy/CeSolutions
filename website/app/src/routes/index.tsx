import {createFileRoute} from '@tanstack/react-router';
import {ArrowRight} from 'lucide-react';
import {Header,Footer,Faq} from '@/site/shell';
import {businessSchema,description,pageHead} from '@/site/content';
import {ProjectGallery} from '@/site/projects';
import {Hero,Kicker,ProcessCards,QuoteBand,ServiceStack,VisitBand,WhyChoose} from '@/site/sections';
import {SystemFlow} from '@/site/flow';
import {ReviewMarquee} from '@/site/reviews';
import {Counter,Marquee,Reveal,RevealWords,Rise} from '@/site/motion';
export const Route=createFileRoute('/')({head:()=>pageHead('Solar & Battery Installers Albury-Wodonga | Clean Energy Solutions',description,'/'),component:Home});
const brands=['Tesla','Sungrow','Sigenergy','BYD','Fronius','Enphase','Jinko'];
// Section order follows the Framer reference: hero → enquiry → services → proof → why us → process → CTA → FAQ → reviews.
function Home(){return <><Header/><main id="main"><Hero/><QuoteBand/>
<section id="solutions" className="services-section wrap"><div className="section-heading"><div><Kicker>What we do</Kicker><Reveal lines={['Power your home,','your way.']}/></div><Rise delay={.15}><p>From solar and battery storage to EV charging, we design smarter energy systems around your home, your bills and what you’re planning next.</p></Rise></div><ServiceStack/></section>
<section className="trust-strip" aria-label="Why choose Clean Energy Solutions"><div><strong><Counter value={4.8} decimals={1}/><span className="unit">/5</span></strong><span>Rated by 26 customers on SolarQuotes</span></div><div><strong><Counter value={15} suffix="+"/></strong><span>Years Daniel has installed solar on the Border</span></div><div><strong>In-house</strong><span>Our own CEC-accredited electricians</span></div><div><strong><Counter value={1}/> day</strong><span>Most home systems are installed in a single day</span></div></section>
<SystemFlow/>
<WhyChoose/>
<ProjectGallery/>
<ProcessCards/>
<section className="brand-section"><p>Equipment we install and help you compare</p><Marquee items={brands} label="Equipment brands offered by CES"/></section>
<section id="reviews" className="review-section"><div className="wrap"><Kicker>Testimonials</Kicker><Reveal lines={['Trusted by homeowners','across the Border.']}/><a className="review-score" href="https://www.solarquotes.com.au/installer-review/clean-energy-solutions/"><strong>4.8<span>/5</span></strong><span>26 SolarQuotes ratings<br/><small>Checked 14 September 2026 · Read reviews ↗</small></span></a><h3 className="sr-only">Featured review</h3><RevealWords as="blockquote" text="“A professional and very seamless process from start to finish.”"/><Rise delay={.3}><p className="review-detail">Bree visited promptly after the first enquiry and answered every question. Three weeks later Jacob installed the new panels, battery and inverter in a day.</p><p>Lois Nolan <span>· CES customer</span></p></Rise></div><ReviewMarquee/></section>
<VisitBand/>
<section className="rebate-section wrap"><div><Kicker>Rebates</Kicker><Reveal lines={['Two rebates are','open right now.']}/><Rise delay={.2}><p>The federal Cheaper Home Batteries Program discounts eligible home batteries at the point of sale, and the discount steps down on a fixed schedule. Victorian owner-occupiers may also qualify for the Solar Victoria panel rebate.</p><p>We handle the applications and the distributor paperwork. You pay the reduced price.</p></Rise></div><div className="rebate-links"><a href="https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries"><span>Federal program<small>Cheaper Home Batteries</small></span><ArrowRight size={22} aria-hidden="true"/></a><a href="https://www.solar.vic.gov.au/solar-panel-rebate"><span>Victorian households<small>Solar Victoria panel rebate</small></span><ArrowRight size={22} aria-hidden="true"/></a><p>Eligibility and equipment requirements apply. Solar Victoria applies to Victorian properties only; Albury customers are covered by the federal programs. Confirm current requirements for your installation date.</p></div></section>
<section className="cta-split"><Reveal lines={['Get your','tailored quote.']} className="cta-split__title"/><Rise delay={.15}><p>Tell us a little about your home’s energy needs. We’ll prepare a system design with clear pricing and no pressure.</p><a className="btn-pill" href="#quote">Get a quote <ArrowRight size={18} aria-hidden="true"/></a></Rise></section>
<Faq/></main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(businessSchema).replace(/</g,'\\u003c')}}/></>}
