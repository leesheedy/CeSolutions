/* Service-area pages. Facts here are geographic and programme-level only: distance from the Wodonga office,
 * state (which decides the rebates), postcodes for the enquiry form, and which CES services apply. No install
 * counts, customer names or savings claims beyond the FAQ range CES publishes. Wagga Wagga is confirmed by
 * CES's 31 Aug 2026 Instagram post ("Wagga Wagga, we're coming your way!"); Shepparton and Yarrawonga are
 * target areas named in the September 2026 brief. */
export type Location={
  slug:string;name:string;state:'NSW'|'VIC';postcode:string;region:string;
  /** Approximate road distance and drive time from 79 Elgin Boulevard, Wodonga. */
  fromWodonga:string;
  title:string;description:string;heading:[string,string];intro:string;
  image:string;alt:string;imageWidth:number;imageHeight:number;
  suburbs:string[];
  /** Why solar suits this area: local, checkable, no numbers. */
  why:{title:string;body:string}[];
  rebates:{name:string;who:string;href:string}[];
  faqs:{q:string;a:string}[];
};
const federal=[
{name:'Small-scale Technology Certificates (STCs)',who:'Every eligible solar install, applied as a point-of-sale discount',href:'https://cer.gov.au/schemes/renewable-energy-target/small-scale-renewable-energy-scheme'},
{name:'Cheaper Home Batteries Program',who:'Eligible home batteries, discount applied by the installer and stepping down on a fixed schedule',href:'https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries'}];
const victoria={name:'Solar Victoria panel rebate',who:'Victorian owner-occupiers under the income threshold, with an optional interest-free loan',href:'https://www.solar.vic.gov.au/solar-panel-rebate'};
export const locations:Location[]=[
{slug:'wagga-wagga',name:'Wagga Wagga',state:'NSW',postcode:'2650',region:'the Riverina',fromWodonga:'about 130 km, an hour and a half up the Olympic Highway',
 title:'Solar & Battery Installers Wagga Wagga | Clean Energy Solutions',
 description:'Solar, batteries and EV charging in Wagga Wagga from Clean Energy Solutions. Designed from your bills, installed by our own CEC-accredited electricians. Free quote: (02) 6021 2000.',
 heading:['Solar for Wagga Wagga,','designed from your bills.'],
 intro:'We’re now taking on solar, battery and EV charging work across Wagga Wagga and the Riverina. Same family-owned team, same in-house electricians, quoted from your actual electricity bills.',
 image:'instagram-roof-drone.webp',alt:'Drone view of black solar panels on a red corrugated roof, installed by CES',imageWidth:1600,imageHeight:1600,
 suburbs:['Wagga Wagga','Lake Albert','Estella','Bourkelands','Tatton','Glenfield Park','Kooringal','Forest Hill','Uranquinty','Ladysmith'],
 why:[
 {title:'Long, hot summers with big daytime loads.',body:'Riverina summers mean cooling runs through the middle of the day, exactly when panels generate most. A system sized to that pattern covers the expensive hours from your own roof.'},
 {title:'Wide blocks and simple roofs.',body:'Much of Wagga’s housing sits on generous blocks with unshaded north- and west-facing roof. That gives us room to size a system for a battery or an EV later, not just today’s bill.'},
 {title:'NSW rebates, handled for you.',body:'New South Wales homes get the federal STC discount on panels and the Cheaper Home Batteries discount on storage. There is no state panel rebate in NSW, so we make sure the federal ones are applied properly at quote time.'}],
 rebates:federal,
 faqs:[
 {q:'Do you really cover Wagga Wagga from Wodonga?',a:'Yes. Our team travels up the Olympic Highway for site visits and installs, and we group Riverina jobs so scheduling stays tight. Ella will confirm timing when she quotes.'},
 {q:'Which rebates apply in Wagga Wagga?',a:'The federal STC discount on panels and the federal Cheaper Home Batteries discount on eligible batteries. NSW does not currently run a state panel rebate, so those two are what we apply.'},
 {q:'How long does an install take?',a:'Most residential systems are installed in one day. Larger systems or those with batteries may take two to three days.'}]},
{slug:'shepparton',name:'Shepparton',state:'VIC',postcode:'3630',region:'the Goulburn Valley',fromWodonga:'about 180 km, two hours west along the Murray Valley Highway',
 title:'Solar & Battery Installers Shepparton | Clean Energy Solutions',
 description:'Solar, home batteries and EV charging in Shepparton and the Goulburn Valley from Clean Energy Solutions. Solar Victoria and federal rebates handled. Free quote: (02) 6021 2000.',
 heading:['Solar for Shepparton','and the Goulburn Valley.'],
 intro:'Shepparton households and businesses get the full set of Victorian and federal rebates. We design around your bills, install with our own electricians and handle every application.',
 image:'instagram-shed.webp',alt:'Black solar panels across a new shed roof, installed by CES',imageWidth:1600,imageHeight:1600,
 suburbs:['Shepparton','Mooroopna','Kialla','Shepparton North','Tatura','Kialla Lakes','Grahamvale','Shepparton East','Toolamba','Murchison'],
 why:[
 {title:'Farms, sheds and cool rooms run on daytime power.',body:'The Goulburn Valley’s orchards, dairies and packing sheds draw heavily through daylight hours. Solar on a shed roof offsets that load directly, and a battery can carry pumps and cool rooms into the evening.'},
 {title:'Three rebates, not two.',body:'Victorian owner-occupiers can stack the Solar Victoria panel rebate on top of the federal STC discount, and eligible batteries get the federal Cheaper Home Batteries discount as well. We apply for all of them.'},
 {title:'Sized for what’s coming next.',body:'An EV charger, a heat-pump hot water system or a bigger shed all change the design. Tell us now and we’ll leave room in the inverter and switchboard for it.'}],
 rebates:[victoria,...federal],
 faqs:[
 {q:'Which rebates apply in Shepparton?',a:'Three: the Solar Victoria panel rebate for eligible owner-occupiers, the federal STC discount on panels, and the federal Cheaper Home Batteries discount on eligible batteries. We handle the Solar Victoria application and the distributor paperwork.'},
 {q:'Do you do commercial and farm work in the Goulburn Valley?',a:'Yes. Sheds, packing facilities and dairies are a good fit for solar because their demand is in daylight. Send a recent bill and we’ll size it from your actual consumption.'},
 {q:'How far is Shepparton from your office?',a:'About two hours west of Wodonga. We plan Goulburn Valley site visits and installs in runs, and Ella confirms dates when she quotes.'}]},
{slug:'yarrawonga',name:'Yarrawonga',state:'VIC',postcode:'3730',region:'Lake Mulwala and the Murray',fromWodonga:'about 90 km, just over an hour along the Murray Valley Highway',
 title:'Solar & Battery Installers Yarrawonga | Clean Energy Solutions',
 description:'Solar, home batteries and EV charging in Yarrawonga, Mulwala and along the Murray from Clean Energy Solutions. Victorian and federal rebates handled. Free quote: (02) 6021 2000.',
 heading:['Solar for Yarrawonga','and the Murray.'],
 intro:'From Yarrawonga and Mulwala to Cobram and Rutherglen, we design solar and battery systems from your bills and install them with our own CEC-accredited electricians.',
 image:'instagram-rooftop.webp',alt:'Solar panels on a metal roof beneath a cloudy sky, photographed by CES',imageWidth:1200,imageHeight:1500,
 suburbs:['Yarrawonga','Mulwala','Cobram','Rutherglen','Bundalong','Tungamah','Katamatite','Corowa','Barooga','Wilby'],
 why:[
 {title:'Two states, one river.',body:'Yarrawonga is Victorian; Mulwala and Corowa across the bridge are in New South Wales. The rebates differ, so we check your address first and quote against the programmes that actually apply to it.'},
 {title:'Holiday homes and lake living.',body:'Plenty of Yarrawonga homes sit empty for stretches. Export credits keep working while you’re away, and a battery with backup keeps the fridge and security running if the grid drops.'},
 {title:'Close enough for a quick site visit.',body:'We’re just over an hour away, so a roof check and a follow-up are easy to fit in, and the same team that quotes is the team that installs.'}],
 rebates:[victoria,...federal],
 faqs:[
 {q:'Which rebates apply in Yarrawonga?',a:'On the Victorian side (Yarrawonga, Bundalong, Cobram, Rutherglen) eligible owner-occupiers get the Solar Victoria panel rebate plus the federal STC and Cheaper Home Batteries discounts. On the NSW side (Mulwala, Corowa, Barooga) the two federal discounts apply.'},
 {q:'Can you help with a holiday house we’re not always at?',a:'Yes. We size for the way the house is actually used, set up monitoring so you can see it from anywhere, and design battery backup around what needs to stay on when you’re away.'},
 {q:'How soon can someone come out?',a:'Yarrawonga is just over an hour from our Wodonga office. Ella will book a site visit when she comes back with your quote, usually within a business day of your enquiry.'}]}];
export const locationBySlug=Object.fromEntries(locations.map(l=>[l.slug,l]));
