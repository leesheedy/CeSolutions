import {createFileRoute,notFound} from '@tanstack/react-router';
import {pageHead} from '@/site/content';
import {locationBySlug,townServiceBySlug,townServiceDescription,townServiceTitle} from '@/site/locations';
import {LocationServicePage} from '@/site/pages';
export const Route=createFileRoute('/locations/$slug_/$service')({loader:({params})=>{const l=locationBySlug[params.slug],s=townServiceBySlug[params.service];if(!l||!s)throw notFound();return {l,s};},head:({loaderData})=>loaderData?pageHead(townServiceTitle(loaderData.l,loaderData.s),townServiceDescription(loaderData.l,loaderData.s),'/locations/'+loaderData.l.slug+'/'+loaderData.s.slug):{},component:Page});
function Page(){const {l,s}=Route.useLoaderData();return <LocationServicePage l={l} s={s}/>;}
