import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/site/content';
import {BatteryRebatePage} from '@/site/rebate-page';
export const Route=createFileRoute('/battery-rebate')({head:()=>pageHead('How to Get the Home Battery Rebate (2026 Guide) | Clean Energy Solutions','How the federal Cheaper Home Batteries rebate works: who is eligible, how the discount comes off your quote, how battery size changes it, and what applies in Albury-Wodonga.','/battery-rebate'),component:BatteryRebatePage});
