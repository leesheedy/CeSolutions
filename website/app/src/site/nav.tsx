/* Site header. Desktop: Radix NavigationMenu (src/components/ui/navigation-menu.tsx, viewport=false so each
 * panel opens under its own trigger) with three panels — Solar & batteries, Areas, About — plus phone and the
 * quote CTA. Phone/tablet: a hamburger opens a full-screen menu (Motion) with the same links grouped, big tap
 * targets, the phone number and the quote CTA pinned at the bottom. Body scroll locks while it is open; Escape
 * and any link close it; focus goes to the close button and returns to the hamburger afterwards. */
import {useEffect,useRef,useState} from 'react';
import {useRouterState} from '@tanstack/react-router';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {ArrowRight,BadgePercent,BatteryCharging,Building2,Car,Droplets,HelpCircle,Images,Mail,MapPin,Menu,Phone,Star,Sun,Users,Workflow,X,type LucideProps} from 'lucide-react';
import type {ComponentType} from 'react';
import {NavigationMenu,NavigationMenuContent,NavigationMenuItem,NavigationMenuLink,NavigationMenuList,NavigationMenuTrigger} from '@/components/ui/navigation-menu';
import {useScrolled} from './motion';

// Lucide no longer ships brand marks; these are the Simple Icons paths.
export const Facebook=({size=20}:{size?:number})=><svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>;
export const Instagram=({size=20}:{size?:number})=><svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.8053.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3614 1.0567.4168 2.2263.0603 1.2655.0741 1.6452.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>;

type Item={href:string;title:string;desc:string;Icon?:ComponentType<LucideProps>};
const SOLUTIONS:Item[]=[
{href:'/solar',Icon:Sun,title:'Residential solar',desc:'Panels sized to your roof and your bills'},
{href:'/batteries',Icon:BatteryCharging,title:'Home batteries',desc:'Run the evening on your own power'},
{href:'/commercial-solar',Icon:Building2,title:'Business & farm solar',desc:'Sheds, shops, cool rooms, offices'},
{href:'/#quote',Icon:Car,title:'EV charging',desc:'Charge the car from your roof'},
{href:'/#quote',Icon:Droplets,title:'Hot water heat pumps',desc:'Replace the electric tank'},
{href:'/#flow-heading',Icon:Workflow,title:'How it works',desc:'Sun to switchboard in six steps'}];
const ABOUT:Item[]=[
{href:'/about',Icon:Users,title:'Our team',desc:'Family-owned, our own electricians'},
{href:'/#our-work',Icon:Images,title:'Our work',desc:'Real installs from our crews'},
{href:'/#reviews',Icon:Star,title:'Reviews',desc:'4.8/5 from 26 SolarQuotes ratings'},
{href:'/#rebates',Icon:BadgePercent,title:'Rebates',desc:'What’s open now and how we apply'},
{href:'/#faq',Icon:HelpCircle,title:'FAQ',desc:'Costs, savings, payback, cloudy days'}];
const AREAS:Item[]=[
{href:'/',title:'Albury-Wodonga',desc:'Home base · 79 Elgin Boulevard'},
{href:'/locations/wagga-wagga',title:'Wagga Wagga',desc:'Riverina · NSW rebates'},
{href:'/locations/shepparton',title:'Shepparton',desc:'Goulburn Valley · VIC rebates'},
{href:'/locations/yarrawonga',title:'Yarrawonga',desc:'Both sides of the border'}];
const PHONE='tel:+61260212000';

function PanelLink({item,current}:{item:Item;current:string}){
  return <li><NavigationMenuLink asChild active={item.href===current}><a href={item.href} className="nm-link">{item.Icon&&<span className="nm-link__icon"><item.Icon size={18} strokeWidth={1.75} aria-hidden="true"/></span>}<span><strong>{item.title}</strong><em>{item.desc}</em></span></a></NavigationMenuLink></li>;
}

function DesktopNav({current}:{current:string}){
  return <NavigationMenu viewport={false} className="desk-nav" aria-label="Main navigation">
    <NavigationMenuList className="desk-nav__list">
      <NavigationMenuItem><NavigationMenuTrigger className="nm-trigger">Solar & batteries</NavigationMenuTrigger><NavigationMenuContent className="nm-panel nm-panel--wide">
        <div className="nm-panel__grid"><ul className="nm-panel__links">{SOLUTIONS.map(i=><PanelLink key={i.title} item={i} current={current}/>)}</ul>
        <NavigationMenuLink asChild><a href="/#quote" className="nm-feature"><span className="nm-feature__kicker">Free quote</span><strong>Not sure where to start?</strong><p>Send a bill. Our solar consultant designs the right setup and replies within one business day.</p><span className="nm-feature__cta">Get my free quote <ArrowRight size={16} aria-hidden="true"/></span></a></NavigationMenuLink></div>
      </NavigationMenuContent></NavigationMenuItem>
      <NavigationMenuItem><NavigationMenuLink asChild active={current==='/'&&false}><a href="/#our-work" className="nm-trigger nm-trigger--plain">Our work</a></NavigationMenuLink></NavigationMenuItem>
      <NavigationMenuItem><NavigationMenuTrigger className="nm-trigger">Areas</NavigationMenuTrigger><NavigationMenuContent className="nm-panel"><ul className="nm-panel__links nm-panel__links--one">{AREAS.map(i=><li key={i.title}><NavigationMenuLink asChild active={i.href===current}><a href={i.href} className="nm-link"><span className="nm-link__icon"><MapPin size={18} strokeWidth={1.75} aria-hidden="true"/></span><span><strong>{i.title}</strong><em>{i.desc}</em></span></a></NavigationMenuLink></li>)}</ul></NavigationMenuContent></NavigationMenuItem>
      <NavigationMenuItem><NavigationMenuTrigger className="nm-trigger">About</NavigationMenuTrigger><NavigationMenuContent className="nm-panel"><ul className="nm-panel__links nm-panel__links--one">{ABOUT.map(i=><PanelLink key={i.title} item={i} current={current}/>)}</ul></NavigationMenuContent></NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>;
}

function MobileMenu({open,onClose,closeRef}:{open:boolean;onClose:()=>void;closeRef:React.RefObject<HTMLButtonElement|null>}){
  const reduce=useReducedMotion();
  const primary=[['Solar','/solar',Sun],['Batteries','/batteries',BatteryCharging],['Business & farm','/commercial-solar',Building2],['EV charging','/#quote',Car],['Hot water heat pumps','/#quote',Droplets]] as const;
  const secondary=[['How it works','/#flow-heading'],['Our work','/#our-work'],['Our team','/about'],['Reviews','/#reviews'],['Rebates','/#rebates'],['FAQ','/#faq']] as const;
  const t=(i:number)=>reduce?{duration:0}:{duration:.32,delay:.06+i*.035,ease:[.2,.65,.3,1] as const};
  return <AnimatePresence>{open&&<motion.div className="mnav" role="dialog" aria-modal="true" aria-label="Menu" id="mobile-menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?0:.22}}>
    <motion.div className="mnav__panel" initial={{y:reduce?0:28}} animate={{y:0}} exit={{y:reduce?0:20}} transition={reduce?{duration:0}:{type:'spring',stiffness:300,damping:32}} onClick={e=>{if((e.target as HTMLElement).closest('a'))onClose();}}>
      <div className="mnav__top"><a href="/" className="brand" aria-label="Clean Energy Solutions home"><img src="/assets/logo-wide-full.png" width="1905" height="542" alt="Clean Energy Solutions"/></a><button ref={closeRef} type="button" className="mnav__close" onClick={onClose}><X size={20} aria-hidden="true"/>Close</button></div>
      <nav className="mnav__body" aria-label="Menu">
        <p className="mnav__label">What we do</p>
        <ul className="mnav__primary">{primary.map(([label,href,Icon],i)=><motion.li key={label} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={t(i)}><a href={href}><span className="mnav__icon"><Icon size={20} strokeWidth={1.75} aria-hidden="true"/></span>{label}<ArrowRight size={18} aria-hidden="true" className="mnav__arrow"/></a></motion.li>)}</ul>
        <p className="mnav__label">Company</p>
        <ul className="mnav__secondary">{secondary.map(([label,href],i)=><motion.li key={label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={t(i+5)}><a href={href}>{label}</a></motion.li>)}</ul>
        <p className="mnav__label">Areas we serve</p>
        <motion.ul className="mnav__chips" initial={{opacity:0}} animate={{opacity:1}} transition={t(11)}>{AREAS.map(a=><li key={a.title}><a href={a.href}>{a.title}</a></li>)}</motion.ul>
      </nav>
      <motion.div className="mnav__cta" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={t(8)}>
        <a href="/#quote" className="mnav__quote">Get my free quote <ArrowRight size={18} aria-hidden="true"/></a>
        <a href={PHONE} className="mnav__call"><Phone size={18} aria-hidden="true"/>(02) 6021 2000</a>
        <p className="mnav__promise">Reply within one business day · Free, no obligation</p>
        <div className="mnav__foot"><a href="mailto:info@cesolutions.com.au"><Mail size={16} aria-hidden="true"/>info@cesolutions.com.au</a><span><a href="https://www.facebook.com/CESolutionsNSW/" aria-label="CES on Facebook"><Facebook size={18}/></a><a href="https://www.instagram.com/cesolutions1/" aria-label="CES on Instagram"><Instagram size={18}/></a></span></div>
      </motion.div>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

export function Header(){
  const path=useRouterState({select:s=>s.location.pathname});
  const [open,setOpen]=useState(false);
  const scrolled=useScrolled();
  const trigger=useRef<HTMLButtonElement>(null);
  const closeBtn=useRef<HTMLButtonElement>(null);
  const close=()=>{setOpen(false);trigger.current?.focus();};
  useEffect(()=>{
    if(!open)return;
    document.body.style.overflow='hidden';
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')close();};
    document.addEventListener('keydown',onKey);
    const id=window.setTimeout(()=>closeBtn.current?.focus(),50);
    return()=>{document.body.style.overflow='';document.removeEventListener('keydown',onKey);window.clearTimeout(id);};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[open]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={scrolled?'site-header is-scrolled':'site-header'}>
      <a href="/" className="brand" aria-label="Clean Energy Solutions home"><img src="/assets/logo-wide-full.png" width="1905" height="542" alt="Clean Energy Solutions"/></a>
      <DesktopNav current={path}/>
      <a className="nav-phone" href={PHONE}><Phone size={18} aria-hidden="true"/>(02) 6021 2000</a>
      <a className="nav-quote" href="/#quote">Get a free quote</a>
      <button className="menu-toggle" type="button" ref={trigger} aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(o=>!o)}>Menu<Menu size={22} aria-hidden="true"/></button>
    </header>
    <MobileMenu open={open} onClose={close} closeRef={closeBtn}/>
    <nav className="mobile-dock" aria-label="Quick contact"><a href={PHONE}>Call local team</a><a href="/#quote">Get a free quote</a></nav>
  </>;
}
