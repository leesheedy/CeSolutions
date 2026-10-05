import {createFileRoute} from '@tanstack/react-router';
import {Header,Footer,Faq} from '@/site/shell';
import {businessSchema,description,jsonLd,pageHead} from '@/site/content';
import {ProjectGallery} from '@/site/projects';
import {CtaBand,Hero,Process,ProofBar,QuoteBand,Rebates,Services,VisitBand,WhyChoose} from '@/site/sections';
import {Reviews} from '@/site/reviews';
import {Estimator} from '@/site/estimator';
export const Route=createFileRoute('/')({head:()=>{const h=pageHead('Solar & Battery Installers Albury-Wodonga | CES',description,'/');return {...h,links:[...h.links,{rel:'preload',as:'image',href:'/assets/ces-drone-hero-1920.webp',imageSrcSet:'/assets/ces-drone-hero-760.webp 760w, /assets/ces-drone-hero-1200.webp 1200w, /assets/ces-drone-hero-1920.webp 1920w',imageSizes:'100vw',fetchPriority:'high'}]};},component:Home});
/* Order: the offer and proof first, then the form while intent is highest, then the reasons to believe it
 * (people, reviews, work), then the detail for people still deciding (numbers, process, how it works, rebates). */
function Home(){return <><Header/><main id="main">
  <Hero/><ProofBar/><Services/><QuoteBand/><WhyChoose/><Reviews/><ProjectGallery/><Estimator/><Process/><Rebates/><VisitBand/><Faq glance flush/><CtaBand/>
</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(businessSchema)}}/></>}
