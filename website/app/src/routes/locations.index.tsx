import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/site/content';
import {AreasPage} from '@/site/pages';
export const Route=createFileRoute('/locations/')({head:()=>pageHead('Areas We Serve: Albury-Wodonga, Wagga & More | CES','Where Clean Energy Solutions installs solar and batteries: Wodonga, Albury, Yarrawonga, Wagga Wagga and Shepparton, with the rebates that apply in each.','/locations'),component:AreasPage});
