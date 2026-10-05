import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/site/content';
import {PrivacyPage} from '@/site/pages';
export const Route=createFileRoute('/privacy')({head:()=>pageHead('Privacy Policy | Clean Energy Solutions','How Clean Energy Solutions handles the details you send through this website: what we collect, why, who sees it and how to contact us about it.','/privacy'),component:PrivacyPage});
