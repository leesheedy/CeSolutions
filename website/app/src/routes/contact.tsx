import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/site/content';
import {ContactPage} from '@/site/pages';
export const Route=createFileRoute('/contact')({head:()=>pageHead('Get a Solar & Battery Quote | Clean Energy Solutions','Get a free solar and battery quote from the local CES team in Wodonga. Send a bill for a system design, expected savings and clear pricing. Call (02) 6021 2000.','/contact'),component:ContactPage});
