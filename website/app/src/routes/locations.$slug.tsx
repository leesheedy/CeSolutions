import {createFileRoute,notFound} from '@tanstack/react-router';
import {pageHead} from '@/site/content';
import {locationBySlug} from '@/site/locations';
import {LocationPage} from '@/site/pages';
export const Route=createFileRoute('/locations/$slug')({loader:({params})=>{const l=locationBySlug[params.slug];if(!l)throw notFound();return l;},head:({loaderData})=>loaderData?pageHead(loaderData.title,loaderData.description,'/locations/'+loaderData.slug):{},component:Page});
function Page(){const l=Route.useLoaderData();return <LocationPage l={l}/>;}
