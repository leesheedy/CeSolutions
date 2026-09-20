import {createFileRoute} from '@tanstack/react-router';
import {HomePage} from '@/site/clean-home';
import {description,pageHead} from '@/site/content';
export const Route=createFileRoute('/')({head:()=>pageHead('Solar & Battery Installers Albury-Wodonga | CES',description,'/'),component:HomePage});
