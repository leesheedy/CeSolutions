import {createFileRoute,notFound} from '@tanstack/react-router';
import {pageHead,pages} from '@/site/content';
import {ServicePage} from '@/site/pages';
export const Route=createFileRoute('/$page')({loader:({params})=>{const p=pages[params.page];if(!p)throw notFound();return p;},head:({loaderData,params})=>loaderData?pageHead(loaderData.title,loaderData.description,'/'+params.page):{},component:Page});
function Page(){const p=Route.useLoaderData();const {page}=Route.useParams();return <ServicePage p={p} page={page}/>;}
