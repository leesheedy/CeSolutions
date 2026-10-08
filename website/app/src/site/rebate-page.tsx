/* /battery-rebate: how the federal home battery discount works and how to claim it. Informational page.
 * Figures that change (certificate prices, the per-kWh factor) are deliberately left to the official pages it
 * links to; what is stated here is the structure of the program. Reviewed 9 October 2026. */
import {ArrowRight,Phone} from 'lucide-react';
import {Header,Footer,Faq} from './shell';
import {jsonLd,SITE} from './content';
import {CtaBand,PageHero,PHONE,PHONE_HREF,QuoteBand,VisitBand} from './sections';
import {WorkStrip} from './projects';
import {Reviews} from './reviews';

const PAGE=SITE+'/battery-rebate';
const steps:[string,string][]=[
['Check you have, or are getting, solar','The discount is for a battery connected to rooftop solar. It can be a new solar and battery system, or a battery added to panels you already own.'],
['Get a quote from an accredited installer','The battery must be on the Clean Energy Council approved product list and installed by a Solar Accreditation Australia accredited installer. That is what makes the install eligible.'],
['See the discount on the quote','You do not apply to the government and wait for a cheque. The installer claims the certificates and takes their value off your price, so the quote already shows what you pay.'],
['Sign the paperwork on install day','When the battery is installed and commissioned you sign a form assigning the certificates to the installer. The discount is set by the installation date, not the day you signed the contract.'],
['Connect it and start using it','We commission the battery, set up the monitoring app and show you how it runs. If you want to join a virtual power plant later, the battery is ready for it.']];
const tiers:[string,string][]=[['The first 14 kWh','Full discount'],['Above 14 kWh, up to 28 kWh','60% of the full rate'],['Above 28 kWh, up to 50 kWh','15% of the full rate'],['Above 50 kWh','No discount on the extra capacity']];
const faqs=[
{q:'How do I get the home battery rebate?',a:'Choose an eligible battery and have it installed with rooftop solar by an accredited installer. The installer claims the federal Cheaper Home Batteries discount for you and takes it off the price, so you pay the discounted amount. There is no separate application for the household to lodge.'},
{q:'Who is eligible for the Cheaper Home Batteries Program?',a:'Homes, small businesses and community organisations with new or existing rooftop solar. The program is not means tested. The battery must be on the Clean Energy Council approved list, be between 5 kWh and 100 kWh in nominal capacity, and be installed by a Solar Accreditation Australia accredited installer. Batteries connected to the grid must be capable of joining a virtual power plant.'},
{q:'Do I need solar panels to get the battery rebate?',a:'Yes. The battery has to be installed with a new solar system or added to an existing one. A battery on its own, with no solar, is not eligible.'},
{q:'Can I add a battery to my existing solar and still get the discount?',a:'Yes. Retrofitting a battery to panels you already have is eligible. We check your existing inverter and switchboard first, because that decides which batteries will work with your system.'},
{q:'Is the battery rebate going down?',a:'Yes. The discount steps down over time and the program is scheduled to run until 2030. It also changed on 1 May 2026, when larger batteries moved to a tiered rate. Because the discount is set by the date of installation, an earlier install gets the higher rate.'},
{q:'Does a bigger battery get a bigger rebate?',a:'Up to a point. Since 1 May 2026 the first 14 kWh of usable capacity gets the full rate, capacity above 14 kWh and up to 28 kWh gets 60% of it, and capacity above 28 kWh and up to 50 kWh gets 15%. Capacity above 50 kWh gets no discount. For most homes that makes sizing the battery to your evening use the best value.'},
{q:'Do I have to join a virtual power plant?',a:'No. A grid-connected battery has to be capable of joining a virtual power plant to be eligible, but joining one is your choice.'},
{q:'Is the battery rebate different in Albury and Wodonga?',a:'The federal discount is the same on both sides of the border. New South Wales also runs a separate incentive for households that connect a battery to a virtual power plant, which can apply to Albury addresses. Victoria does not currently offer a state battery rebate, so Wodonga homes use the federal discount. We check what your address is eligible for when we quote.'},
{q:'How much will I save with the battery rebate?',a:'It depends on the usable capacity of the battery and the date it is installed, because the discount is calculated per kilowatt-hour and the rate changes over time. Your CES quote shows the discount as a dollar amount against the battery you have chosen, before you commit.'}];
const schema={'@context':'https://schema.org','@graph':[
{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE+'/'},{'@type':'ListItem',position:2,name:'Home Batteries',item:SITE+'/batteries'},{'@type':'ListItem',position:3,name:'Battery rebate',item:PAGE}]},
{'@type':'Article','@id':PAGE+'#article',headline:'How to get the home battery rebate',description:'A plain-English guide to the federal Cheaper Home Batteries Program: who is eligible, how the discount is applied, how battery size changes it and what applies in Albury-Wodonga.',url:PAGE,inLanguage:'en-AU',datePublished:'2026-10-09',dateModified:'2026-10-09',author:{'@id':SITE+'/#business'},publisher:{'@id':SITE+'/#business'},mainEntityOfPage:PAGE},
{'@type':'HowTo','@id':PAGE+'#howto',name:'How to get the home battery rebate',step:steps.map(([name,text],i)=>({'@type':'HowToStep',position:i+1,name,text}))},
{'@type':'FAQPage','@id':PAGE+'#faq',mainEntity:faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))}]};
const more=[['Home Batteries','/batteries','Brands, sizing and retrofits'],['Residential solar','/solar','Panels sized to your roof and bills'],['Areas we cover','/locations','Both sides of the border']];

export function BatteryRebatePage(){return <><Header/><main id="main">
  <PageHero crumbs={[{label:'Home',href:'/'},{label:'Home Batteries',href:'/batteries'},{label:'Battery rebate'}]} lines={['How to get the','home battery rebate.']} intro="The federal Cheaper Home Batteries Program takes a discount off an eligible home battery when it is installed with solar. Here is who qualifies, how you get it, and what applies on each side of the border." image="ces-powerwalls-enclosure.webp" alt="Two Tesla Powerwall batteries in a purpose-built enclosure, installed by Clean Energy Solutions">
    <div className="mt-8 flex flex-wrap gap-3"><a className="btn btn--mint" href="/#quote">Get my battery quote <ArrowRight size={18} aria-hidden="true"/></a><a className="btn btn--ghost" href={PHONE_HREF}><Phone size={17} aria-hidden="true"/>{PHONE}</a></div>
  </PageHero>
  <section className="py-16 md:py-24"><div className="wrap grid gap-14 lg:grid-cols-[1fr_340px] lg:gap-20">
    <div className="prose max-w-[820px]">
      <h2 className="!mt-0">The short answer</h2>
      <p>You get the battery rebate by having an eligible battery installed with rooftop solar by an accredited installer. <strong>The installer claims the discount and takes it off your price.</strong> You do not lodge an application, and you do not wait for a refund.</p>
      <p>The program is run by the Australian Government. It started on 1 July 2025, is not means tested, and is scheduled to run until 2030 with the discount stepping down along the way.</p>
      <h2>Who is eligible</h2>
      <ul>
        <li><strong>Homes, small businesses and community organisations</strong> with new or existing rooftop solar.</li>
        <li><strong>An approved battery.</strong> It must be on the Clean Energy Council approved product list and between 5 kWh and 100 kWh in nominal capacity.</li>
        <li><strong>An accredited installer.</strong> The install has to be done by an installer accredited with Solar Accreditation Australia.</li>
        <li><strong>Ready for a virtual power plant.</strong> A battery connected to the grid must be capable of joining one. Joining is optional.</li>
        <li><strong>Installed, not just ordered.</strong> The discount that applies is the one in force on the day the battery is installed.</li>
      </ul>
      <h2>How to get it, step by step</h2>
      <ol className="m-0 mt-5 grid list-none gap-3 p-0">{steps.map(([t,b],i)=><li key={t} className="grid max-w-none gap-1 rounded-3xl border border-line p-6 md:grid-cols-[44px_1fr] md:gap-4"><span className="text-[15px] font-bold text-brand tabular-nums md:pt-0.5" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><span><strong className="block text-[1.12rem] leading-snug">{t}</strong><span className="mt-1.5 block">{b}</span></span></li>)}</ol>
      <h2>How battery size changes the discount</h2>
      <p>The discount is worked out per kilowatt-hour of usable capacity. Since 1 May 2026 it is tiered, so a very large battery no longer earns the full rate on every kilowatt-hour.</p>
      <div className="mt-5 overflow-hidden rounded-3xl border border-line"><table className="w-full border-collapse text-left text-[16px]"><caption className="sr-only">Cheaper Home Batteries discount by usable battery capacity, from 1 May 2026</caption><thead><tr className="bg-stone"><th scope="col" className="px-5 py-3.5 font-semibold text-ink">Usable capacity</th><th scope="col" className="px-5 py-3.5 font-semibold text-ink">Discount rate</th></tr></thead><tbody>{tiers.map(([c,r])=><tr key={c} className="border-t border-line"><th scope="row" className="px-5 py-3.5 font-medium text-ink">{c}</th><td className="px-5 py-3.5 text-muted">{r}</td></tr>)}</tbody></table></div>
      <p className="mt-5">For most households that makes the sensible size the one that covers your evening and overnight use, not the biggest battery that fits on the wall. We size it from your power bills.</p>
      <h2>Why the install date matters</h2>
      <p>The discount steps down over time, and the rate is fixed by the installation date. A battery installed sooner gets a higher rate than the same battery installed after the next step down. Ask any installer to confirm in writing that the install can be done before a change, and that the quoted price will be honoured.</p>
      <h2>Albury, Wodonga and the border</h2>
      <p>The federal discount is the same in New South Wales and Victoria. What differs is the state layer on top.</p>
      <ul>
        <li><strong>Victoria (Wodonga, Yarrawonga, Shepparton).</strong> There is no state battery rebate at the moment. The Solar Victoria panel rebate is separate and applies to solar panels for eligible owner-occupiers.</li>
        <li><strong>New South Wales (Albury, Wagga Wagga).</strong> NSW runs a separate incentive for connecting a battery to a virtual power plant. It can be used alongside the federal discount, and the amount depends on the battery and the provider.</li>
      </ul>
      <p>See what applies in <a href="/locations/wodonga/home-batteries">Wodonga</a>, <a href="/locations/albury/home-batteries">Albury</a>, <a href="/locations/yarrawonga/home-batteries">Yarrawonga</a>, <a href="/locations/wagga-wagga/home-batteries">Wagga Wagga</a> and <a href="/locations/shepparton/home-batteries">Shepparton</a>.</p>
      <h2>What CES does for you</h2>
      <p>We check your address and your existing system, recommend a battery sized to your usage, and show the discount as a dollar amount on your quote. We then handle the certificates and the distributor paperwork, and our own licensed electricians do the install.</p>
      <p>Program rules and rates change. This page was last reviewed on 9 October 2026. For the current rules, see the <a href="https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries">Australian Government program page</a> and the <a href="https://cer.gov.au/">Clean Energy Regulator</a>.</p>
    </div>
    <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Get a battery quote"><div className="rounded-3xl bg-stone p-6"><h2 className="text-[1.15rem] font-bold">See your discount in dollars</h2><p className="mt-2 text-[15.5px] text-muted">Send a recent bill and we’ll quote a battery sized to your home, with the rebate already taken off.</p><a className="btn btn--mint mt-5 w-full" href="/#quote">Get my battery quote <ArrowRight size={18} aria-hidden="true"/></a><ul className="m-0 mt-5 grid list-none p-0">{more.map(([name,href,desc])=><li key={href} className="border-t border-line"><a href={href} className="group flex items-center justify-between gap-4 py-4"><span><strong className="block text-[16px] font-semibold">{name}</strong><span className="text-[14.5px] text-muted">{desc}</span></span><ArrowRight size={18} aria-hidden="true" className="flex-none text-brand transition-transform duration-300 group-hover:translate-x-1"/></a></li>)}</ul></div></aside>
  </div></section>
  <QuoteBand/>
  <WorkStrip category="Batteries" lines={['Batteries we’ve','installed.']} intro="Recent battery installs, in garages and outdoors."/>
  <Reviews/>
  <Faq id="rebate-faq" items={faqs} lines={['Battery rebate:','common questions.']} intro="Straight answers. If yours isn’t here, ring us and ask."/>
  <VisitBand/><CtaBand quote="/#quote"/>
</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/></>}
