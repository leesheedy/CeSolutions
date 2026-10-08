/* Service-area pages. Facts here are geographic and programme-level only: distance from the Wodonga office,
 * state (which decides the rebates), postcodes for the enquiry form, and which CES services apply. No install
 * counts, customer names or savings claims beyond the FAQ range CES publishes. Wagga Wagga is confirmed by
 * CES's 31 Aug 2026 Instagram post ("Wagga Wagga, we're coming your way!"); Shepparton and Yarrawonga are
 * target areas named in the September 2026 brief. */
export type Location={
  slug:string;name:string;state:'NSW'|'VIC';postcode:string;region:string;
  /** Approximate road distance and drive time from 79 Elgin Boulevard, Wodonga. */
  fromWodonga:string;
  /** Replaces the "…from our Wodonga office" line; used for Wodonga itself. */
  officeLine?:string;
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
const victoria={name:'Solar Victoria panel rebate',who:'Victorian owner-occupiers who meet Solar Victoria’s current eligibility rules — we check before we quote',href:'https://www.solar.vic.gov.au/solar-panel-rebate'};
export const locations:Location[]=[
{slug:'wagga-wagga',name:'Wagga Wagga',state:'NSW',postcode:'2650',region:'the Riverina',fromWodonga:'about 130 km, an hour and a half up the Olympic Highway',
 title:'Solar & Battery Installers Wagga Wagga | CES',
 description:'Solar, batteries and EV charging in Wagga Wagga, designed from your bills and installed by our own accredited electricians. Free quote: (02) 6021 2000.',
 heading:['Solar for Wagga Wagga,','designed from your bills.'],
 intro:'We’re now taking on solar, battery and EV charging work across Wagga Wagga and the Riverina. Same family-owned team, same in-house electricians, quoted from your actual electricity bills.',
 image:'ces-drone-pool-tile.webp',alt:'Drone view of a tile-roof home with solar panels across several roof faces, installed by CES',imageWidth:1600,imageHeight:900,
 suburbs:['Wagga Wagga','Lake Albert','Estella','Bourkelands','Tatton','Glenfield Park','Kooringal','Forest Hill','Uranquinty','Ladysmith'],
 why:[
 {title:'Long, hot summers with big daytime loads.',body:'Riverina summers mean cooling runs through the middle of the day, exactly when panels generate most. A system sized to that pattern can cover the expensive hours from your own roof.'},
 {title:'Wide blocks and simple roofs.',body:'Much of Wagga’s housing sits on generous blocks with unshaded north- and west-facing roof. That gives us room to size a system for a battery or an EV later, not just today’s bill.'},
 {title:'NSW rebates, handled for you.',body:'New South Wales homes get the federal STC discount on panels and the Cheaper Home Batteries discount on storage. There is no state panel rebate in NSW, so we make sure the federal ones are applied properly at quote time.'}],
 rebates:federal,
 faqs:[
 {q:'Do you really cover Wagga Wagga from Wodonga?',a:'Yes. Our team travels up the Olympic Highway for site visits and installs, and we group Riverina jobs so scheduling stays tight. Our solar consultant will confirm timing with your quote.'},
 {q:'Which rebates apply in Wagga Wagga?',a:'The federal STC discount on panels and the federal Cheaper Home Batteries discount on eligible batteries. NSW does not currently run a state panel rebate, so those two are what we apply.'},
 {q:'How long does an install take?',a:'Most home systems are installed in a single day by our own electricians. If yours needs longer — a larger system, or a battery on a tricky site — our solar consultant tells you before you commit, and we leave the site tidy either way.'}]},
{slug:'shepparton',name:'Shepparton',state:'VIC',postcode:'3630',region:'the Goulburn Valley',fromWodonga:'about 180 km, two hours west along the Murray Valley Highway',
 title:'Solar & Battery Installers Shepparton | CES',
 description:'Solar, home batteries and EV charging in Shepparton and the Goulburn Valley. Solar Victoria and federal rebates handled. Free quote: (02) 6021 2000.',
 heading:['Solar for Shepparton','and the Goulburn Valley.'],
 intro:'Shepparton households and businesses get the full set of Victorian and federal rebates. We design around your bills, install with our own electricians and handle every application.',
 image:'ces-roof-sunset-hills.webp',alt:'Rows of solar panels on a farm shed roof at sunset with paddocks behind, installed by CES',imageWidth:1600,imageHeight:1200,
 suburbs:['Shepparton','Mooroopna','Kialla','Shepparton North','Tatura','Kialla Lakes','Grahamvale','Shepparton East','Toolamba','Murchison'],
 why:[
 {title:'Farms, sheds and cool rooms run on daytime power.',body:'The Goulburn Valley’s orchards, dairies and packing sheds draw heavily through daylight hours. Solar on a shed roof offsets that load directly, and a battery can carry pumps and cool rooms into the evening.'},
 {title:'Three rebates, not two.',body:'Victorian owner-occupiers can stack the Solar Victoria panel rebate on top of the federal STC discount, and eligible batteries get the federal Cheaper Home Batteries discount as well. We apply for all of them.'},
 {title:'Sized for what’s coming next.',body:'An EV charger, a heat-pump hot water system or a bigger shed all change the design. Tell us now and we’ll leave room in the inverter and switchboard for it.'}],
 rebates:[victoria,...federal],
 faqs:[
 {q:'Which rebates apply in Shepparton?',a:'Three: the Solar Victoria panel rebate for eligible owner-occupiers, the federal STC discount on panels, and the federal Cheaper Home Batteries discount on eligible batteries. We handle the Solar Victoria application and the distributor paperwork.'},
 {q:'Do you do commercial and farm work in the Goulburn Valley?',a:'Yes. Sheds, packing facilities and dairies are a good fit for solar because their demand is in daylight. Send a recent bill and we’ll size it from your actual consumption.'},
 {q:'How far is Shepparton from your office?',a:'About two hours west of Wodonga. We plan Goulburn Valley site visits and installs in runs, and our solar consultant confirms dates with your quote.'}]},
{slug:'yarrawonga',name:'Yarrawonga',state:'VIC',postcode:'3730',region:'Lake Mulwala and the Murray',fromWodonga:'about 90 km, just over an hour along the Murray Valley Highway',
 title:'Solar & Battery Installers Yarrawonga | CES',
 description:'Solar, home batteries and EV charging in Yarrawonga, Mulwala and along the Murray. Victorian and federal rebates handled. Free quote: (02) 6021 2000.',
 heading:['Solar for Yarrawonga','and the Murray.'],
 intro:'From Yarrawonga and Mulwala to Cobram and Rutherglen, we design solar and battery systems from your bills and install them with our own accredited electricians.',
 image:'ces-drone-rural-court.webp',alt:'Aerial view of a country home with solar panels on its roof, installed by CES',imageWidth:1600,imageHeight:1095,
 suburbs:['Yarrawonga','Mulwala','Cobram','Rutherglen','Bundalong','Tungamah','Katamatite','Corowa','Barooga','Wilby'],
 why:[
 {title:'Two states, one river.',body:'Yarrawonga is Victorian; Mulwala and Corowa across the bridge are in New South Wales. The rebates differ, so we check your address first and quote with the rebates that actually apply to it.'},
 {title:'Holiday homes and lake living.',body:'Plenty of Yarrawonga homes sit empty for stretches. Export credits keep working while you’re away, and a battery with backup can keep the fridge and security running if the grid drops.'},
 {title:'Close enough for a quick site visit.',body:'We’re just over an hour away, so a roof check and a follow-up are easy to fit in, and the same team that quotes is the team that installs.'}],
 rebates:[victoria,...federal],
 faqs:[
 {q:'Which rebates apply in Yarrawonga?',a:'On the Victorian side (Yarrawonga, Bundalong, Cobram, Rutherglen) eligible owner-occupiers get the Solar Victoria panel rebate plus the federal STC and Cheaper Home Batteries discounts. On the NSW side (Mulwala, Corowa, Barooga) the two federal discounts apply.'},
 {q:'Can you help with a holiday house we’re not always at?',a:'Yes. We size for the way the house is actually used, set up monitoring so you can see it from anywhere, and design battery backup around what needs to stay on when you’re away.'},
 {q:'How soon can someone come out?',a:'Yarrawonga is just over an hour from our Wodonga office. Our solar consultant replies within one business day to book a site visit, and the same team that quotes is the team that installs.'}]},
{slug:'albury',name:'Albury',state:'NSW',postcode:'2640',region:'southern New South Wales, on the Murray',fromWodonga:'just across the river, about ten minutes',
 title:'Solar & Battery Installers Albury | CES',
 description:'Solar panels, home batteries and EV charging in Albury, designed from your bills and installed by our own electricians. Federal rebates handled. Call (02) 6021 2000.',
 heading:['Solar for Albury,','from the team across the river.'],
 intro:'Albury is home ground for us. Our shopfront is ten minutes away in Wodonga, our own electricians do every install, and we quote from your actual electricity bills.',
 image:'ces-drone-pool-faces.webp',alt:'Drone view of a large home with solar panels on several faces of its metal roof, installed by CES',imageWidth:1600,imageHeight:900,
 suburbs:['Albury','Lavington','Thurgoona','East Albury','West Albury','North Albury','South Albury','Springdale Heights','Glenroy','Hamilton Valley','Table Top','Jindera','Howlong'],
 why:[
 {title:'A local team, ten minutes away.',body:'A roof check, a follow-up or a question two years later is a short drive, not a call centre ticket. The people who quote your job are the people who install it.'},
 {title:'NSW rebates, applied properly.',body:'Albury homes get the federal STC discount on panels and the federal Cheaper Home Batteries discount on eligible batteries. The Solar Victoria rebate stops at the river, so we quote Albury addresses with the two that apply.'},
 {title:'Designed for how you live.',body:'Cooling through summer, a pool pump, working from home or an EV on the way all change the right system size. We start with your bills and what you’re planning next.'}],
 rebates:federal,
 faqs:[
 {q:'Which rebates apply in Albury?',a:'The federal STC discount on panels and the federal Cheaper Home Batteries discount on eligible batteries. Albury is in New South Wales, so the Solar Victoria panel rebate does not apply. We handle the applications and the distributor paperwork.'},
 {q:'Where is your office?',a:'79 Elgin Boulevard, Wodonga, about ten minutes from central Albury. You can drop in with a recent bill, no appointment needed.'},
 {q:'How long does an install take in Albury?',a:'Most home systems are installed in a single day by our own electricians. If yours needs longer, our solar consultant tells you before you commit.'}]},
{slug:'wodonga',name:'Wodonga',state:'VIC',postcode:'3690',region:'North East Victoria',fromWodonga:'',officeLine:'Our shopfront is at 79 Elgin Boulevard, Wodonga',
 title:'Solar & Battery Installers Wodonga | CES',
 description:'Solar panels, home batteries and EV charging in Wodonga from the local team on Elgin Boulevard. Solar Victoria and federal rebates handled. Call (02) 6021 2000.',
 heading:['Solar for Wodonga,','from Elgin Boulevard.'],
 intro:'We’re a family-owned Wodonga business with a shopfront on Elgin Boulevard. We design your system from your bills, our own electricians install it, and the same people answer the phone afterwards.',
 image:'shopfront-elgin.jpg',alt:'The Clean Energy Solutions shopfront on Elgin Boulevard, Wodonga, with a CES ute parked out the front',imageWidth:1080,imageHeight:1354,
 suburbs:['Wodonga','West Wodonga','Baranduda','Leneva','Killara','Bandiana','Bonegilla','Barnawartha','Kiewa','Tangambalanga','Yackandandah','Chiltern','Beechworth'],
 why:[
 {title:'Walk in with a bill.',body:'Our shopfront is at 79 Elgin Boulevard. Bring a recent bill and we’ll talk through your options in person, no appointment needed.'},
 {title:'Three rebates, not two.',body:'Victorian owner-occupiers can add the Solar Victoria panel rebate to the federal STC discount, and eligible batteries get the federal Cheaper Home Batteries discount as well. We apply for all of them.'},
 {title:'Our own electricians, start to finish.',body:'Led by Daniel, with more than 15 years installing solar on the Border. No subcontractors, and a local team on the phone after the install.'}],
 rebates:[victoria,...federal],
 faqs:[
 {q:'Which rebates apply in Wodonga?',a:'Three: the Solar Victoria panel rebate for eligible owner-occupiers, the federal STC discount on panels, and the federal Cheaper Home Batteries discount on eligible batteries. We handle the Solar Victoria application and the distributor paperwork.'},
 {q:'Can I come and see you in person?',a:'Yes. We’re at 79 Elgin Boulevard, Wodonga. Bring a recent bill and we’ll talk it through, no appointment needed.'},
 {q:'How long does an install take in Wodonga?',a:'Most home systems are installed in a single day by our own electricians. If yours needs longer, our solar consultant tells you before you commit.'}]}];
export const locationBySlug=Object.fromEntries(locations.map(l=>[l.slug,l]));
/** Display order: home ground first, then by distance. */
export const locationOrder=['wodonga','albury','yarrawonga','wagga-wagga','shepparton'].map(s=>locationBySlug[s]);

/* ── Town × service pages ("solar panels in Wagga Wagga", "home batteries in Albury") ───────────────────
 * What makes each one a real page and not a doorway: the rebates differ by state, each town has its own
 * note on how the service fits there, and the questions are answered for that town. The service copy
 * itself restates only what the main service pages and the FAQ already say. */
export type TownService={slug:'solar-panels'|'home-batteries';label:string;noun:string;parent:string;parentLabel:string};
export const townServices:TownService[]=[
{slug:'solar-panels',label:'Solar panels',noun:'solar',parent:'/solar',parentLabel:'Residential solar'},
{slug:'home-batteries',label:'Home Batteries',noun:'home battery',parent:'/batteries',parentLabel:'Home Batteries'}];
export const townServiceBySlug=Object.fromEntries(townServices.map(s=>[s.slug,s]));
/** One town-specific paragraph per service, grounded in the same facts as the town page. */
const notes:Record<string,Record<TownService['slug'],string>>={
'wagga-wagga':{'solar-panels':'Riverina summers keep cooling running through the middle of the day, which is when panels generate most. Wagga’s wide blocks and unshaded north- and west-facing roofs give us room to size a system properly.','home-batteries':'A battery lets a Wagga home carry its own daytime solar into the evening, when the cooling is still running and grid power costs most. New South Wales has no state battery rebate, so the federal Cheaper Home Batteries discount is the one we apply.'},
shepparton:{'solar-panels':'Shepparton households can add the Solar Victoria panel rebate to the federal STC discount, and the Goulburn Valley’s sheds and farm buildings draw most of their power in daylight, when a roof of panels is producing.','home-batteries':'In the Goulburn Valley a battery can carry pumps, cool rooms or an evening household load on stored solar. Eligible batteries get the federal Cheaper Home Batteries discount, and we design the solar and storage together.'},
yarrawonga:{'solar-panels':'Yarrawonga is Victorian, so eligible owner-occupiers can add the Solar Victoria panel rebate to the federal STC discount. Across the bridge in Mulwala and Corowa the federal discount applies on its own, so we check your address first.','home-batteries':'Plenty of Yarrawonga homes sit empty for stretches. A battery designed with backup can keep the fridge and security running if the grid drops, and monitoring lets you see it from anywhere.'},
albury:{'solar-panels':'Albury is in New South Wales, so the federal STC discount on panels is the rebate that applies. We’re ten minutes away in Wodonga, which makes a roof check before the quote and a follow-up after the install easy.','home-batteries':'For an Albury home with spare daytime solar, a battery moves that power into the evening instead of buying it back at peak rates. The federal Cheaper Home Batteries discount applies to eligible batteries and we handle the paperwork.'},
wodonga:{'solar-panels':'Wodonga owner-occupiers can add the Solar Victoria panel rebate to the federal STC discount on panels. Our shopfront is on Elgin Boulevard, so you can bring a bill in and see the options in person.','home-batteries':'A battery lets a Wodonga home run the evening on its own stored solar. Eligible batteries get the federal Cheaper Home Batteries discount, and you can talk through brands and backup options at our Elgin Boulevard shopfront.'}};
export const townNote=(town:string,service:TownService['slug'])=>notes[town][service];
const rebateNames=(l:Location,service:TownService['slug'])=>service==='solar-panels'?(l.state==='VIC'?'the Solar Victoria panel rebate for eligible owner-occupiers and the federal STC discount':'the federal STC discount on panels'):'the federal Cheaper Home Batteries discount on eligible batteries';
/** Body sections for a town × service page: what you get, how it works here, and what happens next. */
export function townServiceSections(l:Location,s:TownService):{title:string;body:string}[]{
  return s.slug==='solar-panels'?[
  {title:`Solar sized to your ${l.name} home.`,body:`We review your electricity bills, your roof space and what you’re planning next, then design the panel layout and inverter around how you actually use power. Savings usually land between 50% and 100% of your bill, and most systems pay for themselves in 3 to 6 years.`},
  {title:`What makes ${l.name} different.`,body:townNote(l.slug,s.slug)},
  {title:'Installed by our own electricians.',body:'Most home systems are installed in a single day by our own licensed electricians, not subcontractors. The panels we install carry 25 to 30 year warranties, and you have a local team on the phone afterwards.'}]:[
  {title:`Storage that fits your ${l.name} home.`,body:`The right battery size depends on how much spare solar you generate and how much power you use after dark. We start with your usage, check your existing inverter and switchboard if you already have panels, and recommend a battery from Tesla, BYD, Sungrow or Sigenergy.`},
  {title:`What makes ${l.name} different.`,body:townNote(l.slug,s.slug)},
  {title:'Be clear about backup.',body:'Blackout protection is a specific design requirement, not an automatic feature of every battery. Tell us which appliances matter during an outage and we design the backup circuits and compatible equipment around them.'}];
}
export function townServiceFaqs(l:Location,s:TownService):{q:string;a:string}[]{
  return s.slug==='solar-panels'?[
  {q:`How much do solar panels cost in ${l.name}?`,a:`It depends on the size of the system, the panels and inverter you choose, and whether you add a battery, so we don’t publish a price list. Send us a recent bill and our solar consultant will quote a real number for your ${l.name} home, free and with no obligation.`},
  {q:`Which solar rebates apply in ${l.name}?`,a:`${l.name} is in ${l.state==='VIC'?'Victoria':'New South Wales'}, so ${rebateNames(l,s.slug)} ${l.state==='VIC'?'apply':'applies'}. We handle the applications and the distributor paperwork.`},
  {q:`How much will solar save a ${l.name} household?`,a:'Savings usually range between 50% and 100% of your electricity costs, depending on system size and when you use power. We estimate your figure from your actual usage before you commit.'},
  {q:'How long does installation take?',a:'Most home systems are installed in a single day by our own electricians. If yours needs longer, our solar consultant tells you before you commit.'}]:[
  {q:`Which battery rebate applies in ${l.name}?`,a:`Eligible home batteries in ${l.name} get ${rebateNames(l,s.slug)}. The discount steps down on a fixed schedule, so an earlier install date gets the bigger discount. We handle the paperwork.`},
  {q:'Can a battery be added to my existing solar?',a:'Usually, yes. A retrofit assessment checks your existing inverter, switchboard and system configuration, and we recommend a battery that is compatible with it.'},
  {q:'Will a battery keep the power on in a blackout?',a:'Only if it is designed to. Blackout protection is a specific design requirement, not an automatic feature of every battery installation. Tell us which appliances matter and we design for them.'},
  {q:'Which battery brands do you install?',a:'Tesla, BYD, Sungrow and Sigenergy. We explain usable storage, power output, warranty terms and monitoring so you can compare them properly.'}];
}
export const townServiceTitle=(l:Location,s:TownService)=>s.slug==='solar-panels'?`Solar Panels ${l.name} | Installers & Rebates | CES`:`Home Batteries ${l.name} | Solar Battery Installers | CES`;
export const townServiceDescription=(l:Location,s:TownService)=>s.slug==='solar-panels'?`Solar panels in ${l.name}, ${l.state}: designed from your bills, installed by our own electricians, ${l.state==='VIC'?'Solar Victoria and federal':'federal'} rebates handled. Free quote.`:`Home battery installation in ${l.name}, ${l.state}: Tesla, BYD, Sungrow and Sigenergy, the federal battery discount handled. Free quote from CES.`;
