import {ArrowRight,ArrowUpRight,Check,Info,Phone,ShieldCheck,Star} from 'lucide-react';
import {Header,Footer} from './shell';
import {QuoteForm} from './quote-form';
import {Estimator} from './estimator';
import {businessSchema} from './content';
import './refresh.css';
import './revamp.css';

const reviews='https://www.solarquotes.com.au/installer-review/clean-energy-solutions/';
const questions=[
 ['Is my home suitable for solar?','Your roof, shading, switchboard and electricity use all matter. We review your property before recommending equipment, so the design starts with your home.'],
 ['How much will a system cost?','Your quote depends on the equipment, system size and installation requirements. We explain the scope, upfront price and estimated savings before you decide.'],
 ['Can I add a battery to existing solar?','Often, yes. We check your inverter, available solar surplus and storage needs first. Backup during an outage requires compatible equipment and a suitable installation.'],
 ['What incentives could apply?','Eligibility depends on your property, equipment and the program requirements at the time. We help identify applicable incentives in your quote.'],
];
export function HomePage(){return <><Header/><main id="main" className="ces-home">
<section className="home-hero home-wrap">
 <div className="home-hero__copy"><p className="home-eyebrow">Solar & batteries · Albury-Wodonga</p><h1>Your roof.<br/><span>Lower bills.</span></h1><p className="home-hero__intro">Make your own power. Keep more of it. Get solar and batteries designed for your home, installed by your local CES team.</p><div className="home-actions"><a className="home-button" href="#quote">Get my free quote <ArrowUpRight size={20}/></a><a className="home-phone" href="tel:+61260212000"><Phone size={18}/>(02) 6021 2000</a></div><p className="home-assurance"><Check size={16}/> Free advice. Clear pricing. No obligation — we call back within one business day.</p><a className="home-rating" href={reviews}><span aria-label="5 star graphic" className="home-stars" aria-hidden="true">{[1,2,3,4,5].map(n=><Star key={n} size={15} fill="currentColor"/>)}</span><strong>4.8/5</strong><span>on SolarQuotes <ArrowUpRight size={14}/></span></a></div>
 <figure className="home-hero__photo"><img src="/assets/ces-drone-pool-tile-1200.webp" srcSet="/assets/ces-drone-pool-tile-600.webp 600w, /assets/ces-drone-pool-tile-900.webp 900w, /assets/ces-drone-pool-tile-1200.webp 1200w" sizes="(max-width:760px) 100vw, 55vw" width={1200} height={1200} alt="CES solar installation on a tiled home with a swimming pool" fetchPriority="high"/><figcaption><span>Good energy, closer to home.</span><span>Actual CES installation <ArrowUpRight size={17}/></span></figcaption></figure>
</section>
<div className="home-proof home-wrap"><span><b>4.8/5</b> from 26 SolarQuotes ratings</span><span>Our own <b>in-house electricians</b></span><span><b>Family-owned</b> in Wodonga</span><span>Most installs done <b>in a day</b></span><span><b>25–30 year</b> panel warranties</span></div>
<section id="solutions" className="home-services home-wrap"><div className="home-section-head"><h2>Better energy.<br/>Built around you.</h2><p>Start with solar. Add storage when it makes sense. We’ll help you find the right fit.</p></div><div className="home-service-grid">
<a href="/solar" className="home-service"><img src="/assets/ces-roof-gums-900.webp" alt="Solar panels installed by CES on a corrugated roof" width={900} height={900} loading="lazy"/><div><span>01 / Solar</span><h3>Put your roof to work.</h3><p>Generate power through the day and buy less from the grid.</p><span className="home-service__link">Explore solar <ArrowUpRight size={21}/></span></div></a>
<a href="/batteries" className="home-service"><img src="/assets/ces-garage-byd-fronius-900.webp" alt="CES battery and inverter installation in a garage" width={900} height={675} loading="lazy"/><div><span>02 / Batteries</span><h3>Keep the sun for later.</h3><p>Store surplus solar to use when your home needs it.</p><span className="home-service__link">Explore batteries <ArrowUpRight size={21}/></span></div></a>
</div><a className="home-business" href="/commercial-solar"><span>Powering a business or farm?</span><strong>Let’s put your working hours to work. <ArrowRight size={20}/></strong></a></section>
<Estimator/>
<section id="our-work" className="home-work home-wrap"><div className="home-section-head"><h2>Real roofs.<br/>Real local work.</h2><p>A few installations from our own crews. Thoughtful layouts, tidy work and equipment that suits the property.</p></div><div className="home-work-grid">
<figure><img src="/assets/ces-roof-sunset-hills-1200.webp" sizes="(max-width:860px) 100vw, 33vw" srcSet="/assets/ces-roof-sunset-hills-600.webp 600w, /assets/ces-roof-sunset-hills-1200.webp 1200w" width={1200} height={900} loading="lazy" alt="CES rooftop solar array overlooking paddocks and hills at sunset"/><figcaption>Shed roof, last light. Farm buildings make good solar hosts.</figcaption></figure>
<figure><img src="/assets/ces-powerwalls-enclosure-900.webp" sizes="(max-width:860px) 50vw, 33vw" srcSet="/assets/ces-powerwalls-enclosure-600.webp 600w, /assets/ces-powerwalls-enclosure-900.webp 900w" width={900} height={900} loading="lazy" alt="Two Tesla Powerwall batteries installed by CES in a protective enclosure"/><figcaption>Two Powerwalls, out of the weather.</figcaption></figure>
<figure><img src="/assets/ces-drone-rural-court-900.webp" sizes="(max-width:860px) 50vw, 33vw" srcSet="/assets/ces-drone-rural-court-600.webp 600w, /assets/ces-drone-rural-court-900.webp 900w" width={900} height={900} loading="lazy" alt="Aerial view of a country home with a CES solar array on its north-facing roof"/><figcaption>Country home, north-facing array.</figcaption></figure>
<figure><img src="/assets/ces-install-battery-wiring-900.webp" sizes="(max-width:860px) 50vw, 33vw" srcSet="/assets/ces-install-battery-wiring-600.webp 600w, /assets/ces-install-battery-wiring-900.webp 900w" width={900} height={900} loading="lazy" alt="A CES electrician wiring a home battery beneath its inverter"/><figcaption>Our own electrician, commissioning a battery.</figcaption></figure>
<figure><img src="/assets/ces-roof-gums-900.webp" sizes="(max-width:860px) 50vw, 33vw" srcSet="/assets/ces-roof-gums-600.webp 600w, /assets/ces-roof-gums-900.webp 900w" width={900} height={900} loading="lazy" alt="Solar panels on a dark corrugated roof with gum trees behind"/><figcaption>Panels, clouds and gum trees.</figcaption></figure>
<figure><img src="/assets/ces-drone-pool-faces-900.webp" sizes="(max-width:860px) 50vw, 33vw" srcSet="/assets/ces-drone-pool-faces-600.webp 600w, /assets/ces-drone-pool-faces-900.webp 900w" width={900} height={506} loading="lazy" alt="Drone view of a large home with CES panels across several roof faces"/><figcaption>A big roof, used properly.</figcaption></figure>
</div><a href="https://www.instagram.com/cesolutions1/" className="home-text-link">More from our crews on Instagram <ArrowUpRight size={18}/></a></section>
<section className="promise"><div className="home-wrap promise__grid">
<div><p className="home-eyebrow">The CES promise</p><h2>What you get,<br/>in writing.</h2><p className="promise__lede">No fine print you have to go looking for. These are the things we hold ourselves to on every job.</p></div>
<ul className="promise__list">
<li><ShieldCheck size={20}/><div><h3>Our own electricians, on your roof</h3><p>No subcontractors. The people who quote your job are the people who install it.</p></div></li>
<li><ShieldCheck size={20}/><div><h3>Most homes finished in a day</h3><p>If yours needs longer &mdash; a bigger system, or a tricky site &mdash; we tell you before you commit.</p></div></li>
<li><ShieldCheck size={20}/><div><h3>25&ndash;30 year panel warranties</h3><p>On the brands we install, and we help you claim if you ever need to.</p></div></li>
<li><ShieldCheck size={20}/><div><h3>A local person afterwards</h3><p>Rated 4.8/5 across 26 SolarQuotes ratings. Ring the Wodonga office and you get the same team.</p></div></li>
</ul></div></section>

<section className="checks"><div className="home-wrap checks__grid">
<div className="checks__intro"><p className="home-eyebrow">Before you commit</p><h2>What can change<br/>a quote.</h2><p>Most solar quotes look the same until someone climbs on the roof. These are the things we check first, so there are no surprises later.</p></div>
<div><ul className="checks__list">
<li><b>Your switchboard</b><span>Older boards sometimes need an upgrade before a system can be connected safely.</span></li>
<li><b>Meter and network approval</b><span>Your meter may need changing, and your distributor sets the export conditions.</span></li>
<li><b>Roof type and access</b><span>Tile, two-storey or steep roofs need different mounting and access equipment.</span></li>
<li><b>Cable run</b><span>A long run from the array to the switchboard adds materials and labour.</span></li>
<li><b>Shading and orientation</b><span>Trees, chimneys and which way the roof faces all change the layout and the yield.</span></li>
<li><b>Where a battery can sit</b><span>Storage needs a suitable wall, ventilation and clearance from living spaces.</span></li>
</ul>
<p className="checks__note"><Info size={17}/><span>We look at all of this before we quote, and we tell you what it means for the price before you decide anything. If your property isn&rsquo;t a good fit for solar, we&rsquo;ll say so.</span></p></div>
</div></section>

<section className="home-local home-wrap"><div className="home-local__photo"><img src="/assets/ces-install-crew-roof.webp" width={721} height={721} loading="lazy" alt="Two CES electricians installing panels on a roof"/></div><div className="home-local__copy"><p className="home-eyebrow">Your local team</p><h2>Good people.<br/>Good energy.</h2><p>Solar is a long-term decision. Choose a team you can talk to before, during and after the installation.</p><ol><li><span>01</span><div><h3>We listen first.</h3><p>Your bills, your home and your plans shape the recommendation.</p></div></li><li><span>02</span><div><h3>You know what you’re getting.</h3><p>Clear equipment choices, installation scope and upfront pricing.</p></div></li><li><span>03</span><div><h3>We’re here afterwards.</h3><p>Our Wodonga team stays available for advice and support.</p></div></li></ol><a className="home-text-link" href="/about">Meet the CES team <ArrowUpRight size={18}/></a></div></section>
<section id="reviews" className="home-review"><div className="home-wrap home-review__inner"><div><div className="home-stars" aria-hidden="true">★★★★★</div><p>From our customers</p><a href={reviews}>Read the SolarQuotes reviews <ArrowUpRight size={17}/></a><small>4.8/5 from 26 ratings, checked 14 September 2026.</small></div><figure><blockquote>“Customer service was excellent, installation was on time and they did a fantastic job. Would definitely recommend.”</blockquote><figcaption>Adam · Albury area · December 2024</figcaption></figure></div></section>
<section id="faq" className="home-faq home-wrap"><div><h2>A little clarity<br/>before you start.</h2><p>Still have a question?<br/><a href="tel:+61260212000">Talk to us on (02) 6021 2000</a></p></div><div>{questions.map(([q,a],i)=><details key={q} id={i===3?'rebates':undefined}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
<section id="quote" className="home-quote"><div className="home-wrap home-quote__inner"><div className="quote-aside"><div><p className="home-eyebrow">Let&rsquo;s talk solar</p><h2>A better energy<br/>plan starts here.</h2><p>Tell us about your property. We&rsquo;ll help you compare your options and take the next step with confidence.</p></div>
<ul className="quote-aside__points">
<li><Check size={18}/><span>A design built around your roof and your bills, not a package off a shelf</span></li>
<li><Check size={18}/><span>Clear pricing and scope before you commit to anything</span></li>
<li><Check size={18}/><span>No obligation, and no pushy follow-up</span></li>
</ul>
<a className="home-quote__phone" href="tel:+61260212000"><Phone size={21}/>(02) 6021 2000</a>
<p className="home-quote__address">79 Elgin Boulevard, Wodonga<br/>Local advice. Free quote. No obligation.</p>
<div className="quote-aside__crew"><p>Your enquiry goes straight to the Wodonga office &mdash; <b>not a call centre</b>.</p></div></div><QuoteForm/></div></section>
</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({...businessSchema,'@graph':businessSchema['@graph'].filter(x=>x['@type']!=='FAQPage')}).replace(/</g,'\\u003c')}}/></>}
