import {createFileRoute,notFound} from '@tanstack/react-router';
import {ArrowRight,Car,MapPin} from 'lucide-react';
import {Header,Footer,Arrow} from '@/site/shell';
import {pageHead,SITE} from '@/site/content';
import {locationBySlug,locations} from '@/site/locations';
import {Kicker,QuoteBand} from '@/site/sections';
import {Parallax,Reveal,Rise} from '@/site/motion';
export const Route=createFileRoute('/locations/$slug')({loader:({params})=>{const l=locationBySlug[params.slug];if(!l)throw notFound();return l;},head:({loaderData})=>loaderData?pageHead(loaderData.title,loaderData.description,'/locations/'+loaderData.slug):{},component:LocationPage});
function LocationPage(){
  const l=Route.useLoaderData();
  const others=locations.filter(o=>o.slug!==l.slug);
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE+'/'},{'@type':'ListItem',position:2,name:'Locations',item:SITE+'/locations/'+l.slug},{'@type':'ListItem',position:3,name:l.name,item:SITE+'/locations/'+l.slug}]},
    {'@type':'Service','@id':SITE+'/locations/'+l.slug+'#service',name:'Solar and battery installation in '+l.name,provider:{'@id':SITE+'/#business'},areaServed:{'@type':'City',name:l.name,address:{'@type':'PostalAddress',addressLocality:l.name,addressRegion:l.state,postalCode:l.postcode,addressCountry:'AU'}},serviceType:['Solar panel installation','Home battery installation','EV charger installation']},
    {'@type':'FAQPage',mainEntity:l.faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))}]};
  return <><Header/><main id="main">
    <section className="loc-hero wrap"><a href="/" className="breadcrumb">Home / Locations / {l.name}</a><div className="loc-hero__copy"><Kicker>{`Serving ${l.name}, ${l.state} ${l.postcode}`}</Kicker><Reveal as="h1" lines={l.heading} stagger={.08}/><Rise delay={.2}><p className="loc-hero__intro">{l.intro}</p><div className="hero-action-row"><a href="#quote" className="hero-quote">Get a free quote <ArrowRight size={18} aria-hidden="true"/></a><a href="tel:+61260212000" className="hero-call">(02) 6021 2000</a></div><ul className="loc-facts"><li><MapPin size={18} aria-hidden="true"/>{l.name} is in {l.region}</li><li><Car size={18} aria-hidden="true"/>{l.fromWodonga} from our Wodonga office</li></ul></Rise></div><Parallax className="loc-hero__media" intensity={40}><img src={'/assets/'+l.image} alt={l.alt} width={l.imageWidth} height={l.imageHeight} fetchPriority="high" decoding="async"/></Parallax></section>
    <section className="loc-why wrap" aria-labelledby="loc-why-heading"><div className="section-heading"><div><Kicker>Why solar works here</Kicker><Reveal id="loc-why-heading" lines={['Built around',`${l.name}.`]}/></div></div><div className="loc-why__grid">{l.why.map((w,i)=><Rise key={w.title} delay={i*.08}><article><span className="loc-why__n">{String(i+1).padStart(2,'0')}</span><h3>{w.title}</h3><p>{w.body}</p></article></Rise>)}</div></section>
    <section className="loc-rebates" aria-labelledby="loc-rebates-heading"><div className="wrap loc-rebates__grid"><div><Kicker light>{`Rebates in ${l.state}`}</Kicker><Reveal id="loc-rebates-heading" lines={[l.rebates.length===3?'Three rebates':'Two rebates',`for ${l.name} homes.`]}/><Rise delay={.15}><p>We apply for every one of these as part of your quote. Eligibility and equipment requirements apply; we confirm them against your address and installation date.</p></Rise></div><ul className="loc-rebates__list">{l.rebates.map((r,i)=><Rise key={r.name} delay={.1+i*.08}><li><a href={r.href}><strong>{r.name}</strong><span>{r.who}</span><ArrowRight size={20} aria-hidden="true"/></a></li></Rise>)}</ul></div></section>
    <section className="loc-areas wrap" aria-labelledby="loc-areas-heading"><Kicker>Areas we cover</Kicker><h2 id="loc-areas-heading">Around {l.name}</h2><ul className="loc-areas__list">{l.suburbs.map(s=><li key={s}>{s}</li>)}</ul><p>Somewhere nearby that isn’t listed? Send your address with the form below and our solar consultant will confirm.</p></section>
    <QuoteBand/>
    <section className="loc-faq wrap" aria-labelledby="loc-faq-heading"><div><Kicker>FAQ</Kicker><Reveal id="loc-faq-heading" lines={[`${l.name} questions,`,'answered.']}/></div><div className="faq-list">{l.faqs.map((f,i)=><Rise key={f.q} delay={i*.06}><details open={i===0}><summary>{f.q}<span aria-hidden="true">+</span></summary><p>{f.a}</p></details></Rise>)}</div></section>
    <section className="loc-others wrap" aria-label="Other service areas"><p>Also serving</p><div>{others.map(o=><a key={o.slug} href={'/locations/'+o.slug}>{o.name}, {o.state} <Arrow/></a>)}<a href="/">Albury-Wodonga <Arrow/></a></div></section>
  </main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/></>;
}
