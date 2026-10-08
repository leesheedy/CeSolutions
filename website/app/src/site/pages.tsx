/* Page bodies for the interior routes. They live here rather than in src/routes because the route files are
 * linted against arbitrary Tailwind values (scripts/check-ui.mjs); the routes keep the loader, head and wiring. */
import {ArrowRight,ArrowUpRight,BatteryCharging,Building2,Car,Mail,MapPin,Phone,Sun} from 'lucide-react';
import {Header,Footer,Faq} from './shell';
import {QuoteForm,ChecklistFormRegistration} from './quote-form';
import {jsonLd,pageFaqs,pageSchema,SITE,type PageContent} from './content';
import {locationOrder,townServiceDescription,townServiceFaqs,townServices,townServiceSections,type Location,type TownService} from './locations';
import {Estimator} from './estimator';
import {CtaBand,MAPS,PageHero,PHONE,PHONE_HREF,QuoteBand,SectionHead,VisitBand} from './sections';
import {Rise} from './motion';
import {WorkGallery,WorkStrip} from './projects';
import {Reviews} from './reviews';
import {SystemFlow} from './flow';

const labels:Record<string,string>={solar:'Residential solar',batteries:'Home Batteries','commercial-solar':'Commercial solar',about:'Our team'};
const strips:Record<string,['Solar'|'Batteries'|'Our team',string[],string]>={
solar:['Solar',['Some of our','recent solar jobs.'],'Homes, sheds and farms around the Border, all installed by our own electricians.'],
batteries:['Batteries',['Batteries we’ve','installed.'],'Recent battery installs, in garages and outdoors.'],
'commercial-solar':['Solar',['Sheds and roofs','we’ve fitted out.'],'Recent installs by our own crews.'],
about:['Our team',['The people','behind the panels.'],'The crews, designers and office team, all on one payroll in Wodonga.']};
const related=[['Residential solar','/solar','Panels sized to your roof and your bills'],['Home Batteries','/batteries','Run the evening on your own power'],['Battery rebate guide','/battery-rebate','Who qualifies and how to get it'],['Commercial solar','/commercial-solar','Sheds, shops, cool rooms and offices'],['Our team','/about','Family-owned, our own electricians']];
// The About page tells its three sections beside photos of the people and the shopfront, alternating sides.
const aboutPhotos:[string,number,number,string,string][]=[
['ces-installer-selfie.webp',1179,1572,'Daniel Grubisa in a hi-vis shirt on a roof beside newly installed solar panels','Daniel Grubisa, licensed electrician, on the job'],
['instagram-team.webp',1200,1500,'Two CES team members in company uniforms','Two of the team you’ll talk to'],
['shopfront-elgin.jpg',1080,1354,'The Clean Energy Solutions shopfront on Elgin Boulevard, Wodonga, with a CES ute parked out the front','Our shopfront at 79 Elgin Boulevard, Wodonga']];
const aboutFacts:[string,string][]=[['15+','years installing solar on the Border'],['4.8/5','from 26 SolarQuotes reviews'],['In-house','licensed electricians on every job']];
function AboutStory({p}:{p:PageContent}){
  return <section className="py-20 md:py-28"><div className="wrap">
    <Rise><dl className="m-0 grid gap-4 sm:grid-cols-3">{aboutFacts.map(([n,l])=><div key={l} className="flex flex-col-reverse rounded-3xl bg-stone p-6"><dt className="mt-1.5 text-[15px] leading-snug text-muted">{l}</dt><dd className="m-0 text-[clamp(1.8rem,3vw,2.5rem)] leading-none font-bold tracking-tight text-brand">{n}</dd></div>)}</dl></Rise>
    <div className="mt-14 grid gap-16 md:mt-20 md:gap-24">{p.sections.map((s,i)=>{const [img,w,h,alt,cap]=aboutPhotos[i%aboutPhotos.length];return <Rise key={s.title}><article className="grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
      <figure className={'m-0 '+(i%2?'md:order-2':'')}><img className="aspect-[4/5] w-full rounded-3xl object-cover" src={'/assets/'+img} alt={alt} width={w} height={h} loading="lazy" decoding="async"/><figcaption className="mt-3 text-[14.5px] text-muted">{cap}</figcaption></figure>
      <div><span className="text-[15px] font-bold text-brand tabular-nums" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h2 className="mt-2 text-[clamp(1.7rem,2.8vw,2.4rem)] leading-tight font-bold tracking-tight">{s.title}</h2><p className="mt-4 max-w-[60ch] text-[1.08rem] leading-relaxed text-muted">{s.body}</p>{i===p.sections.length-1&&<div className="mt-7 flex flex-wrap gap-3"><a className="btn btn--mint" href="/#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a className="btn btn--outline" href={PHONE_HREF}><Phone size={17} aria-hidden="true"/>{PHONE}</a></div>}</div>
    </article></Rise>;})}</div>
  </div></section>;
}
export function ServicePage({p,page}:{p:PageContent;page:string}){
  const label=labels[page]??page;const qa=pageFaqs[page];
  return <><Header/><main id="main">
    <PageHero crumbs={[{label:'Home',href:'/'},{label}]} lines={p.heading.split('\n')} intro={p.intro} image={p.image} alt={p.alt}>
      <div className="mt-8 flex flex-wrap gap-3"><a className="btn btn--mint" href="/#quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a className="btn btn--ghost" href={PHONE_HREF}><Phone size={17} aria-hidden="true"/>{PHONE}</a></div>
    </PageHero>
    {page==='about'?<AboutStory p={p}/>:<section className="py-20 md:py-28"><div className="wrap grid gap-14 lg:grid-cols-[1fr_340px] lg:gap-20">
      <div className="grid gap-4">{p.sections.map((s,i)=><Rise key={s.title} delay={i*.05}><article className="grid gap-3 rounded-3xl border border-line p-7 md:grid-cols-[56px_1fr] md:gap-6 md:p-9"><span className="text-[15px] font-bold text-brand tabular-nums md:pt-2" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><div><h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight font-bold tracking-tight">{s.title}</h2><p className="mt-4 max-w-[66ch] text-[1.08rem] leading-relaxed text-muted">{s.body}</p></div></article></Rise>)}</div>
      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="More from Clean Energy Solutions"><div className="rounded-3xl bg-stone p-6"><h2 className="text-[1.15rem] font-bold">Keep exploring</h2><ul className="m-0 mt-3 grid list-none p-0">{related.filter(([,href])=>href!=='/'+page).map(([name,href,desc])=><li key={href} className="border-t border-line"><a href={href} className="group flex items-center justify-between gap-4 py-4"><span><strong className="block text-[16px] font-semibold">{name}</strong><span className="text-[14.5px] text-muted">{desc}</span></span><ArrowRight size={18} aria-hidden="true" className="flex-none text-brand transition-transform duration-300 group-hover:translate-x-1"/></a></li>)}</ul></div></aside>
    </div></section>}
    {page==='solar'&&<SystemFlow/>}
    <WorkStrip category={strips[page]?.[0]??'Solar'} lines={strips[page]?.[1]??['Recent work.']} intro={strips[page]?.[2]??''}/>
    {page==='solar'&&<WorkGallery category="Solar" lines={['More solar installs.']} intro="A few more roofs we’ve done lately. Tap any photo to see it larger."/>}
    <Reviews/>
    {qa&&<div><Faq items={qa} lines={[label+':','common questions.']} intro="Straight answers. If yours isn’t here, ring us and ask."/></div>}
    <VisitBand/><CtaBand quote="/#quote"/>
  </main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(pageSchema(page,label,p))}}/></>;
}

const next=['Our solar consultant calls or emails within one business day.','We design from your bill, and visit if the roof or switchboard needs a look.','You get a design, expected savings and clear pricing, then it’s your call. Most home systems are installed in a day by our own electricians.'];
const contactSchema={'@context':'https://schema.org','@graph':[{'@type':'ContactPage','@id':SITE+'/contact#page',url:SITE+'/contact',name:'Contact Clean Energy Solutions',about:{'@id':SITE+'/#business'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE+'/'},{'@type':'ListItem',position:2,name:'Contact',item:SITE+'/contact'}]}]};
export function ContactPage(){return <><Header/><main id="main">
  <PageHero crumbs={[{label:'Home',href:'/'},{label:'Contact'}]} lines={['Let’s start','with your bills.']} intro="Send a recent bill and our solar consultant designs a system around how you actually use power, with expected savings and clear pricing. Free, no obligation, no call centre."/>
  <section className="py-16 md:py-24"><div className="wrap grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
    <div>
      <ul className="m-0 grid list-none gap-3 p-0">
        <li><a href={PHONE_HREF} className="flex items-center gap-4 rounded-3xl border border-line p-5 transition-colors hover:border-brand"><span className="grid size-12 flex-none place-items-center rounded-2xl bg-tint text-brand"><Phone size={22} aria-hidden="true"/></span><span className="text-[14.5px] text-muted">Call the local team<strong className="block text-[1.4rem] leading-tight font-bold text-ink">{PHONE}</strong></span></a></li>
        <li><a href="mailto:info@cesolutions.com.au" className="flex items-center gap-4 rounded-3xl border border-line p-5 transition-colors hover:border-brand"><span className="grid size-12 flex-none place-items-center rounded-2xl bg-tint text-brand"><Mail size={22} aria-hidden="true"/></span><span className="text-[14.5px] text-muted">Email<strong className="block text-[1.1rem] leading-tight font-bold break-all text-ink">info@cesolutions.com.au</strong></span></a></li>
        <li><a href={MAPS} className="flex items-center gap-4 rounded-3xl border border-line p-5 transition-colors hover:border-brand"><span className="grid size-12 flex-none place-items-center rounded-2xl bg-tint text-brand"><MapPin size={22} aria-hidden="true"/></span><span className="text-[14.5px] text-muted">Visit the shopfront<address className="block text-[1.1rem] leading-snug font-bold text-ink">79 Elgin Boulevard, Wodonga VIC 3690</address></span></a></li>
      </ul>
      <h2 className="mt-12 text-[1.6rem] font-bold tracking-tight">What happens next?</h2>
      <ol className="m-0 mt-5 grid list-none gap-0 p-0">{next.map((t,i)=><li key={t} className="flex gap-4 border-t border-line py-4 text-[16.5px] text-muted"><span className="grid size-8 flex-none place-items-center rounded-full bg-brand text-[14px] font-bold text-white">{i+1}</span>{t}</li>)}</ol>
      <p className="mt-6 text-[15.5px] text-muted">Outside Albury-Wodonga? We also cover <a className="font-semibold text-brand underline underline-offset-4" href="/locations/wagga-wagga">Wagga Wagga</a>, <a className="font-semibold text-brand underline underline-offset-4" href="/locations/shepparton">Shepparton</a> and <a className="font-semibold text-brand underline underline-offset-4" href="/locations/yarrawonga">Yarrawonga</a>. Put your address in the form and we’ll confirm.</p>
    </div>
    <div id="quote" className="self-start rounded-[28px] ring-1 ring-line"><QuoteForm/><ChecklistFormRegistration/></div>
  </div></section>
</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(contactSchema)}}/></>}

const provider={'@id':SITE+'/#business','@type':'LocalBusiness',name:'Clean Energy Solutions',url:SITE,telephone:'+61260212000',address:{'@type':'PostalAddress',streetAddress:'79 Elgin Boulevard',addressLocality:'Wodonga',addressRegion:'VIC',postalCode:'3690',addressCountry:'AU'}};
const city=(l:Location)=>({'@type':'City',name:l.name,address:{'@type':'PostalAddress',addressLocality:l.name,addressRegion:l.state,postalCode:l.postcode,addressCountry:'AU'}});
const qa=(items:{q:string;a:string}[])=>items.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}));
const crumbSchema=(items:[string,string][])=>({'@type':'BreadcrumbList',itemListElement:items.map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))});
const officeLine=(l:Location)=>l.officeLine??(l.fromWodonga.charAt(0).toUpperCase()+l.fromWodonga.slice(1)+' from our Wodonga office');
function HeroActions(){return <div className="mt-8 flex flex-wrap gap-3"><a href="#quote" className="btn btn--mint">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a href={PHONE_HREF} className="btn btn--ghost"><Phone size={17} aria-hidden="true"/>{PHONE}</a></div>}
function RebateList({l,only}:{l:Location;only?:(name:string)=>boolean}){
  const items=only?l.rebates.filter(r=>only(r.name)):l.rebates;
  return <ul className="m-0 grid list-none gap-3 self-start p-0">{items.map((r,i)=><li key={r.name}><Rise delay={.1+i*.08}><a href={r.href} className="group flex items-center justify-between gap-6 rounded-3xl border border-line bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-brand/50 hover:shadow-[var(--shadow-card)]"><span><strong className="block text-[1.15rem] leading-snug font-bold">{r.name}</strong><span className="mt-1 block text-[15.5px] text-muted">{r.who}</span></span><ArrowUpRight size={20} aria-hidden="true" className="flex-none text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></a></Rise></li>)}</ul>;
}
function OtherAreas({current}:{current?:string}){
  return <section className="pb-16" aria-label="Other service areas"><div className="wrap flex flex-wrap items-center gap-3 border-t border-line pt-10"><p className="mr-2 text-[16px] font-semibold max-sm:w-full">Also serving</p>{locationOrder.filter(o=>o.slug!==current).map(o=><a key={o.slug} href={'/locations/'+o.slug} className="btn btn--outline btn--sm">{o.name}, {o.state} <ArrowRight size={16} aria-hidden="true"/></a>)}</div></section>;
}
const serviceCards=(l:Location)=>[
{Icon:Sun,name:`Solar panels in ${l.name}`,body:'Panels sized to your roof and your bills. Savings usually land between 50% and 100% of your bill.',href:`/locations/${l.slug}/solar-panels`,cta:`Solar panels ${l.name}`},
{Icon:BatteryCharging,name:`Home Batteries in ${l.name}`,body:'Run the evening on your own stored solar. The federal battery discount is open now.',href:`/locations/${l.slug}/home-batteries`,cta:`Home Batteries ${l.name}`},
{Icon:Building2,name:'Business and farm solar',body:'Sheds, shops, cool rooms and offices run in daylight, exactly when panels produce.',href:'/commercial-solar',cta:'Commercial solar'}];

/** Town page: what we do there, why it suits the place, the rebates for that state, proof, the form, questions. */
export function LocationPage({l}:{l:Location}){
  const url=SITE+'/locations/'+l.slug;
  const schema={'@context':'https://schema.org','@graph':[
    crumbSchema([['Home',SITE+'/'],['Areas',SITE+'/locations'],[l.name,url]]),
    {'@type':'Service','@id':url+'#service',name:'Solar and battery installation in '+l.name,url,provider,areaServed:city(l),serviceType:['Solar panel installation','Home battery installation','EV charger installation'],hasOfferCatalog:{'@type':'OfferCatalog',name:'Services in '+l.name,itemListElement:townServices.map(s=>({'@type':'Offer',itemOffered:{'@type':'Service',name:s.label+' in '+l.name,url:url+'/'+s.slug}}))}},
    {'@type':'FAQPage','@id':url+'#faq',mainEntity:qa(l.faqs)}]};
  return <><Header/><main id="main">
    <PageHero crumbs={[{label:'Home',href:'/'},{label:'Areas',href:'/locations'},{label:l.name}]} lines={l.heading} intro={l.intro} image={l.image} alt={l.alt} imageWidth={l.imageWidth} imageHeight={l.imageHeight}>
      <HeroActions/>
      <ul className="m-0 mt-8 grid list-none gap-2.5 p-0 text-[15.5px] text-haze"><li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 flex-none text-mint" aria-hidden="true"/>{l.name} is in {l.region}</li><li className="flex items-start gap-3"><Car size={18} className="mt-0.5 flex-none text-mint" aria-hidden="true"/>{officeLine(l)}</li></ul>
    </PageHero>
    <section className="py-20 md:py-28" aria-labelledby="loc-services-heading"><div className="wrap">
      <SectionHead eyebrow={'What we install in '+l.name} id="loc-services-heading" lines={['Solar, Batteries','and EV charging.']}>One local team for the design, the install and the support afterwards.</SectionHead>
      <div className="mt-12 grid gap-4 md:grid-cols-3">{serviceCards(l).map((c,i)=><Rise key={c.href} delay={i*.08} className="flex"><a href={c.href} className="group flex w-full flex-col rounded-3xl border border-line p-7 transition-[border-color,box-shadow] duration-300 hover:border-brand/50 hover:shadow-[var(--shadow-card)]"><span className="grid size-12 place-items-center rounded-2xl bg-tint text-brand"><c.Icon size={24} strokeWidth={1.75} aria-hidden="true"/></span><h3 className="mt-5 text-[1.35rem] leading-tight font-bold tracking-tight">{c.name}</h3><p className="mt-3 text-[16px] text-muted">{c.body}</p><span className="link-arrow mt-auto pt-6">{c.cta} <ArrowRight size={17} aria-hidden="true"/></span></a></Rise>)}</div>
    </div></section>
    <section className="bg-stone py-20 md:py-28" aria-labelledby="loc-why-heading"><div className="wrap">
      <SectionHead eyebrow={'Solar in '+l.name} id="loc-why-heading" lines={['Built around',`${l.name}.`]}/>
      <div className="mt-12 grid gap-4 md:grid-cols-3">{l.why.map((w,i)=><Rise key={w.title} delay={i*.08} className="flex"><article className="w-full rounded-3xl border border-line bg-white p-7"><span className="text-[15px] font-bold text-brand tabular-nums" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h3 className="mt-3 text-[1.35rem] leading-tight font-bold tracking-tight">{w.title}</h3><p className="mt-3 text-[16px] text-muted">{w.body}</p></article></Rise>)}</div>
    </div></section>
    <section className="py-20 md:py-28" aria-labelledby="loc-rebates-heading"><div className="wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
      <SectionHead eyebrow="Rebates" id="loc-rebates-heading" lines={[l.rebates.length===3?'Three rebates':'Two rebates',`for ${l.name} homes.`]}>We apply for every one of these as part of your quote. Eligibility and equipment requirements apply; we confirm them against your address and installation date.</SectionHead>
      <RebateList l={l}/>
    </div></section>
    <QuoteBand/>
    <Estimator/>
    <Reviews/>
    <section className="py-20 md:py-24" aria-labelledby="loc-areas-heading"><div className="wrap">
      <p className="eyebrow">Service area</p><h2 id="loc-areas-heading" className="h-sec">Around {l.name}.</h2>
      <ul className="m-0 mt-8 flex list-none flex-wrap gap-2.5 p-0">{l.suburbs.map(s=><li key={s} className="rounded-full border border-line px-4 py-2 text-[15.5px] font-medium">{s}</li>)}</ul>
      <p className="lede mt-7 max-w-[60ch]">Somewhere nearby that isn’t listed? Send your address with the form above and our solar consultant will confirm.</p>
    </div></section>
    <div className="border-t border-line"><Faq id="loc-faq" items={l.faqs} lines={[`${l.name} questions,`,'answered.']} intro={`What people in ${l.name} ask us most.`}/></div>
    <OtherAreas current={l.slug}/>
    <CtaBand/>
  </main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/></>;
}

/** Town × service page, e.g. solar panels in Wagga Wagga. */
export function LocationServicePage({l,s}:{l:Location;s:TownService}){
  const url=`${SITE}/locations/${l.slug}/${s.slug}`;
  const solar=s.slug==='solar-panels';
  const faqs=townServiceFaqs(l,s),sections=townServiceSections(l,s);
  const other=townServices.find(o=>o.slug!==s.slug)!;
  const schema={'@context':'https://schema.org','@graph':[
    crumbSchema([['Home',SITE+'/'],['Areas',SITE+'/locations'],[l.name,SITE+'/locations/'+l.slug],[s.label,url]]),
    {'@type':'Service','@id':url+'#service',name:`${s.label} in ${l.name}`,serviceType:solar?'Residential solar panel installation':'Home battery installation',description:townServiceDescription(l,s),url,provider,areaServed:city(l)},
    {'@type':'FAQPage','@id':url+'#faq',mainEntity:qa(faqs)}]};
  return <><Header/><main id="main">
    <PageHero crumbs={[{label:'Home',href:'/'},{label:'Areas',href:'/locations'},{label:l.name,href:'/locations/'+l.slug},{label:s.label}]} lines={solar?['Solar panels',`in ${l.name}.`]:['Home Batteries',`in ${l.name}.`]} intro={solar?`Solar panels for ${l.name} homes, designed from your actual electricity bills and installed by our own licensed electricians, usually in a single day.`:`Home batteries for ${l.name}, sized to your usage and installed by our own licensed electricians. Store your daytime solar and run the evening on it.`} image={solar?l.image:'ces-powerwalls-enclosure.webp'} alt={solar?l.alt:'Two Tesla Powerwall batteries in a purpose-built enclosure, installed by CES'} imageWidth={solar?l.imageWidth:1600} imageHeight={solar?l.imageHeight:1200}>
      <HeroActions/>
      <ul className="m-0 mt-8 grid list-none gap-2.5 p-0 text-[15.5px] text-haze"><li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 flex-none text-mint" aria-hidden="true"/>{l.name}, {l.state} {l.postcode}</li><li className="flex items-start gap-3"><Car size={18} className="mt-0.5 flex-none text-mint" aria-hidden="true"/>{officeLine(l)}</li></ul>
    </PageHero>
    <section className="py-20 md:py-28"><div className="wrap grid gap-14 lg:grid-cols-[1fr_340px] lg:gap-20">
      <div className="grid gap-4">{sections.map((sec,i)=><Rise key={sec.title} delay={i*.05}><article className="grid gap-3 rounded-3xl border border-line p-7 md:grid-cols-[56px_1fr] md:gap-6 md:p-9"><span className="text-[15px] font-bold text-brand tabular-nums md:pt-2" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><div><h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight font-bold tracking-tight">{sec.title}</h2><p className="mt-4 max-w-[66ch] text-[1.08rem] leading-relaxed text-muted">{sec.body}</p></div></article></Rise>)}</div>
      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label={'More for '+l.name}><div className="rounded-3xl bg-stone p-6"><h2 className="text-[1.15rem] font-bold">More for {l.name}</h2><ul className="m-0 mt-3 grid list-none p-0">{[[`${other.label} in ${l.name}`,`/locations/${l.slug}/${other.slug}`,solar?'Store your solar for the evening':'Panels sized to your roof and bills'],[`All services in ${l.name}`,'/locations/'+l.slug,'Solar, Batteries and EV charging'],[s.parentLabel,s.parent,'How we design and install it']].map(([name,href,desc])=><li key={href} className="border-t border-line"><a href={href} className="group flex items-center justify-between gap-4 py-4"><span><strong className="block text-[16px] font-semibold">{name}</strong><span className="text-[14.5px] text-muted">{desc}</span></span><ArrowRight size={18} aria-hidden="true" className="flex-none text-brand transition-transform duration-300 group-hover:translate-x-1"/></a></li>)}</ul></div></aside>
    </div></section>
    <section className="bg-stone py-20 md:py-28" aria-labelledby="ts-rebates-heading"><div className="wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
      <SectionHead eyebrow="Rebates" id="ts-rebates-heading" lines={[solar?'Solar rebates':'The battery rebate',`in ${l.name}.`]}>{l.name} is in {l.state==='VIC'?'Victoria':'New South Wales'}. We apply for what your address is eligible for as part of your quote, and confirm it against your installation date.</SectionHead>
      <RebateList l={l} only={n=>solar?!/Batteries/.test(n):/Batteries/.test(n)}/>
    </div></section>
    <QuoteBand/>
    {solar&&<Estimator/>}
    <WorkStrip category={solar?'Solar':'Batteries'} lines={solar?['Some of our','recent solar jobs.']:['Batteries we’ve','installed.']} intro={solar?'Homes, sheds and farms around the Border, all installed by our own electricians.':'Recent battery installs, in garages and outdoors.'}/>
    <Reviews/>
    <Faq id="ts-faq" items={faqs} lines={[`${s.label} in ${l.name}:`,'common questions.']} intro="Straight answers. If yours isn’t here, ring us and ask."/>
    <OtherAreas current={l.slug}/>
    <CtaBand/>
  </main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/></>;
}

/** /locations: every town we serve, with its state and the pages for it. */
export function AreasPage(){
  const schema={'@context':'https://schema.org','@graph':[crumbSchema([['Home',SITE+'/'],['Areas',SITE+'/locations']]),{'@type':'CollectionPage','@id':SITE+'/locations#page',url:SITE+'/locations',name:'Areas we serve',about:{'@id':SITE+'/#business'},hasPart:locationOrder.map(l=>({'@type':'WebPage',name:'Solar and Batteries in '+l.name,url:SITE+'/locations/'+l.slug}))}]};
  return <><Header/><main id="main">
    <PageHero crumbs={[{label:'Home',href:'/'},{label:'Areas'}]} lines={['Where we install','solar and Batteries.']} intro="We’re based at 79 Elgin Boulevard, Wodonga, and install across Albury-Wodonga and out to Yarrawonga, Wagga Wagga and Shepparton. The rebates depend on which side of the border you’re on, so each area has its own page."><div className="mt-8 flex flex-wrap gap-3"><a href="/#quote" className="btn btn--mint">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a><a href={PHONE_HREF} className="btn btn--ghost"><Phone size={17} aria-hidden="true"/>{PHONE}</a></div></PageHero>
    <section className="py-20 md:py-28"><div className="wrap grid gap-4 md:grid-cols-2 lg:grid-cols-3">{locationOrder.map((l,i)=><Rise key={l.slug} delay={Math.min(i,3)*.06} className="flex"><article className="flex w-full flex-col overflow-hidden rounded-3xl border border-line"><a href={'/locations/'+l.slug} className="block overflow-hidden"><img className="aspect-[16/10] w-full object-cover transition-transform duration-700 hover:scale-[1.03]" src={'/assets/'+(l.image.startsWith('ces-')?l.image.replace('.webp','-900.webp'):l.image)} alt={l.alt} width={l.imageWidth} height={l.imageHeight} loading={i<3?'eager':'lazy'} decoding="async"/></a><div className="flex flex-1 flex-col p-7"><p className="text-sm font-semibold text-brand">{l.state==='VIC'?'Victoria':'New South Wales'} · {l.rebates.length} rebates</p><h2 className="mt-2 text-[1.6rem] leading-tight font-bold tracking-tight"><a href={'/locations/'+l.slug}>{l.name}</a></h2><p className="mt-3 text-[16px] text-muted">{officeLine(l)}. {l.suburbs.slice(1,5).join(', ')} and surrounds.</p><ul className="m-0 mt-auto grid list-none gap-1 p-0 pt-6"><li><a className="link-arrow min-h-10" href={'/locations/'+l.slug}>Solar and Batteries in {l.name} <ArrowRight size={16} aria-hidden="true"/></a></li>{townServices.map(s=><li key={s.slug}><a className="link-arrow min-h-10" href={`/locations/${l.slug}/${s.slug}`}>{s.label} {l.name} <ArrowRight size={16} aria-hidden="true"/></a></li>)}</ul></div></article></Rise>)}</div></section>
    <CtaBand quote="/#quote"/>
  </main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/></>;
}

/* Plain-language statement of what this site actually does with visitor data. Keep it in step with the
 * enquiry form (quote-form.tsx), the address suggestions (address-field.tsx) and the checklist email
 * (netlify/functions/send-checklist.mjs). CES should have it checked before launch. */
export function PrivacyPage(){return <><Header/><main id="main">
  <PageHero crumbs={[{label:'Home',href:'/'},{label:'Privacy policy'}]} lines={['Privacy policy']} intro="Clean Energy Solutions (CES), 79 Elgin Boulevard, Wodonga VIC 3690, runs this website. This page explains what we collect when you use it and what we do with it. Last updated 16 September 2026."/>
  <section className="py-16 md:py-24"><div className="wrap prose max-w-[820px]">
    <h2 className="!mt-0">What we collect</h2><p>When you send an enquiry we collect what you type into the form: your name, phone number, email address, property address, the services you are interested in, anything you write in the message box, and any files you attach (such as a power bill or photos of your roof, meter box or a possible battery location). If you ask us to email you a checklist, we collect your name, email and the services you selected.</p>
    <h2>Why we collect it</h2><p>To design a system for your property, prepare your quote, apply for rebates on your behalf where you ask us to, and contact you about your enquiry. We do not sell or rent your details, and we do not use them for marketing you have not asked for.</p>
    <h2>Who handles it</h2><ul><li><strong>Netlify</strong> hosts this site and receives form submissions on our behalf; we retrieve them from Netlify and they are stored there while we work on your enquiry.</li><li><strong>Resend</strong> sends the optional “what to send us” checklist email if you request one.</li><li>The address field asks a mapping service for suggestions as you type. By default that is <strong>Photon (OpenStreetMap)</strong>; if Google address suggestions are enabled, the text you type in that field is sent to <strong>Google Places</strong>. Only the characters you type in the address box are sent — nothing else from the form.</li></ul>
    <h2>Cookies and analytics</h2><p>This site does not set tracking cookies and does not currently run analytics. If that changes, this page will say what is used and why.</p>
    <h2>Your details, your call</h2><p>You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Email <a href="mailto:info@cesolutions.com.au">info@cesolutions.com.au</a> or call <a href="tel:+61260212000">(02) 6021 2000</a>. We handle personal information in line with the Australian Privacy Principles.</p>
  </div></section>
</main><Footer/></>}

/** 404 and error states, inside the site chrome. */
export function MessagePage({code,title,body,children}:{code:string;title:string;body:string;children:React.ReactNode}){
  return <main id="main" className="on-dark relative isolate grid min-h-[88svh] place-items-center overflow-hidden bg-night px-6 pt-[var(--nav-h)] text-center text-white">
    <div className="pointer-events-none absolute top-1/3 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-brand/30 blur-[130px]" aria-hidden="true"/>
    <div className="relative max-w-xl py-20"><p className="text-[15px] font-semibold text-mint">{code}</p><h1 className="h-page mt-4">{title}</h1><p className="lede mt-5">{body}</p><div className="mt-9 flex flex-wrap justify-center gap-3">{children}</div></div>
  </main>;
}
