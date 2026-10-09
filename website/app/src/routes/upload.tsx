import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/site/content';
import {UploadPage} from '@/site/upload-page';
// Reached only from the personal link in the checklist email, so it is kept out of search results and the sitemap.
export const Route=createFileRoute('/upload')({head:()=>{const h=pageHead('Send Us Your Bill and Photos | Clean Energy Solutions','Upload a recent power bill and photos of your roof, meter box and battery location for your Clean Energy Solutions quote.','/upload');return {...h,meta:[...h.meta,{name:'robots',content:'noindex'}]};},component:UploadPage});
