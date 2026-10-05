import {Facebook,Instagram} from './nav';
export {Header} from './nav';
import {ArrowUpRight,Mail,MapPin,Phone} from 'lucide-react';
import {atAGlance,faqs} from './content';
import {Reveal,Rise} from './motion';
const MAPS_LINK='https://www.google.com/maps/search/?api=1&query=79%20Elgin%20Boulevard%20Wodonga%20Victoria%203690';
/** Marks a link that leaves the site. */
export function Arrow(){return <ArrowUpRight size={17} aria-hidden="true"/>}
const footerColumns=[
{title:'Services',links:[['Residential solar','/solar'],['Home batteries','/batteries'],['Commercial solar','/commercial-solar'],['How solar works','/solar#how-it-works'],['Rebates','/#rebates']]},
{title:'Company',links:[['Our team','/about'],['Our work','/#our-work'],['Reviews','/#reviews'],['FAQ','/#faq'],['Contact','/contact']]},
{title:'Areas',links:[['Albury-Wodonga','/'],['Wagga Wagga','/locations/wagga-wagga'],['Shepparton','/locations/shepparton'],['Yarrawonga','/locations/yarrawonga']]}];
/** Footer: brand and contact details, three link columns, then the legal line. */
export function Footer(){
  return <footer className="on-dark bg-night text-white">
    <div className="wrap grid gap-12 pt-16 pb-12 md:pt-20 lg:grid-cols-[1.15fr_2fr] lg:gap-20">
      <div>
        <a href="/" className="brand" aria-label="Clean Energy Solutions home"><img src="/assets/logo-wide-420.webp" width="420" height="120" alt="Clean Energy Solutions" loading="lazy" className="!w-[210px]"/></a>
        <p className="mt-6 max-w-[40ch] text-[16px] text-haze">Family-owned solar and battery installers on the Border. Designed from your bills, installed by our own electricians, supported by people you can call.</p>
        <ul className="m-0 mt-7 grid list-none gap-3.5 p-0 text-[16px]">
          <li><a href="tel:+61260212000" className="inline-flex items-center gap-3 font-semibold hover:text-mint"><Phone size={18} className="text-mint" aria-hidden="true"/>(02) 6021 2000</a></li>
          <li><a href="mailto:info@cesolutions.com.au" className="inline-flex items-center gap-3 hover:text-mint"><Mail size={18} className="text-mint" aria-hidden="true"/>info@cesolutions.com.au</a></li>
          <li><a href={MAPS_LINK} className="inline-flex items-start gap-3 hover:text-mint"><MapPin size={18} className="mt-1 flex-none text-mint" aria-hidden="true"/><address>79 Elgin Boulevard<br/>Wodonga, Victoria 3690</address></a></li>
        </ul>
        <ul className="m-0 mt-7 flex list-none gap-2.5 p-0" aria-label="Social links">
          <li><a href="https://www.facebook.com/CESolutionsNSW/" aria-label="CES on Facebook" className="grid size-11 place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-mint hover:text-night"><Facebook size={19}/></a></li>
          <li><a href="https://www.instagram.com/cesolutions1/" aria-label="CES on Instagram" className="grid size-11 place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-mint hover:text-night"><Instagram size={19}/></a></li>
        </ul>
      </div>
      <nav className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3" aria-label="Footer navigation">{footerColumns.map(c=><div key={c.title}><h2 className="text-[15px] font-bold tracking-normal text-white">{c.title}</h2><ul className="m-0 mt-4 grid list-none gap-1 p-0">{c.links.map(([label,href])=><li key={label}><a href={href} className="inline-flex min-h-10 items-center text-[16px] text-haze transition-colors hover:text-white">{label}</a></li>)}</ul></div>)}</nav>
    </div>
    <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/10 py-7 text-[14.5px] text-haze"><span>© {new Date().getFullYear()} Clean Energy Solutions</span><span>Serving Albury-Wodonga, Wagga Wagga, Shepparton and Yarrawonga</span><a href="/privacy" className="inline-flex min-h-10 items-center hover:text-white">Privacy policy</a></div>
  </footer>;
}
/** Questions and answers as native disclosure widgets: they work without JavaScript and every answer is in
 *  the HTML for search and answer engines. The homepage version also carries the "at a glance" fact list. */
export function Faq({items=faqs,lines=['Questions?','We’ve got answers.'],intro='Quick answers to the most common questions about solar, batteries, installation and savings.',glance=false,flush=false,id='faq'}:{items?:{q:string;a:string}[];lines?:string[];intro?:string;glance?:boolean;flush?:boolean;id?:string}){
  return <section id={id} className={flush?'pb-20 md:pb-28':'py-20 md:py-28'} aria-labelledby={id+'-heading'}>
    <div className="wrap grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow">FAQ</p><Reveal id={id+'-heading'} lines={lines} className="h-sec"/>
        <p className="lede mt-5 max-w-[44ch]">{intro}</p>
        <a className="link-arrow mt-6" href="tel:+61260212000"><Phone size={17} aria-hidden="true"/>Call (02) 6021 2000</a>
      </div>
      <div><div className="faq-list">{items.map((f,i)=><Rise key={f.q} delay={i*.05}><details open={i===0}><summary>{f.q}<span aria-hidden="true">+</span></summary><p>{f.a}</p></details></Rise>)}</div>{glance&&<div className="mt-10 rounded-3xl bg-stone p-6 md:p-7"><h3 className="text-[1.1rem] font-bold">Clean Energy Solutions at a glance</h3><dl className="mt-4 grid gap-0">{atAGlance.map(([k,v])=><div key={k} className="grid grid-cols-[112px_1fr] gap-4 border-t border-line py-3 text-[15px] leading-snug"><dt className="font-semibold text-ink">{k}</dt><dd className="text-muted">{v}</dd></div>)}</dl></div>}</div>
    </div>
  </section>;
}
