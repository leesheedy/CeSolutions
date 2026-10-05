import {ArrowUpRight,Star} from 'lucide-react';
import {InfiniteSlider} from '@/components/ui/infinite-slider';
import {Reveal,Rise} from './motion';
export const SOLARQUOTES='https://www.solarquotes.com.au/installer-review/clean-energy-solutions/';
// Contiguous excerpts from the public SolarQuotes listing (4.8/5 from 26 ratings, checked 15 September 2026).
// First names and postcode areas as published there; nothing is paraphrased or joined across omissions.
const reviews=[
{name:'Ben',area:'Wodonga area, VIC',date:'August 2026',rating:5,text:'Installation was quick, professional and the finished product looks great.'},
{name:'Phillip',area:'Holbrook area, NSW',date:'July 2026',rating:5,text:'They came and looked at the job at 11am and had a quote emailed to me by 4.30 pm same day.'},
{name:'Tania',area:'North East VIC',date:'July 2026',rating:5,text:'The installation guys were great, clean, tidy and very polite.'},
{name:'Rod',area:'Albury area, NSW',date:'February 2026',rating:5,text:'Combined with our solar panels and inverter we have been in credit over the last 4 to 5 months.'},
{name:'Julie',area:'North East VIC',date:'December 2025',rating:5,text:'Also received a follow up personal phone call after installation.'},
{name:'Adele',area:'Albury, NSW',date:'March 2025',rating:5,text:'From the moment we reached out the service was second to none. Highly recommend.'},
{name:'Adam',area:'Albury area, NSW',date:'December 2024',rating:5,text:'Customer service was excellent, installation was on time and they did a fantastic job. Would definitely recommend.'},
{name:'Peter',area:'Wodonga, VIC',date:'July 2024',rating:5,text:'Prompt, efficient, no nonsense. Didnt have to worry about anything.'},
{name:'Maree',area:'Albury, NSW',date:'April 2024',rating:4.5,text:'On time, very tidy and respectful.'},
{name:'Steve',area:'Wodonga, VIC',date:'August 2024',rating:5,text:'The quoting process was great straight forward professional and a Fair Price Quoted.'}];
type Review=(typeof reviews)[number];
const StarRow=({rating,size=16}:{rating:number;size?:number})=><span className="inline-flex gap-0.5 text-sun" role="img" aria-label={`${rating} out of 5`}>{Array.from({length:5},(_,i)=><Star key={i} size={size} strokeWidth={0} fill="currentColor" className={i<Math.round(rating)?'':'opacity-30'} aria-hidden="true"/>)}</span>;
function ReviewCard({r}:{r:Review}){return <article className="flex w-[min(86vw,400px)] flex-none flex-col rounded-3xl border border-line bg-white p-7"><div className="flex items-center gap-2.5"><StarRow rating={r.rating}/><span className="text-[15px] font-bold tabular-nums">{r.rating.toFixed(1)}</span></div><p className="mt-4 text-[1.1rem] leading-relaxed text-ink">“{r.text}”</p><footer className="mt-auto flex items-center gap-3 pt-6"><span className="grid size-10 flex-none place-items-center rounded-full bg-tint text-[15px] font-bold text-brand" aria-hidden="true">{r.name[0]}</span><span className="text-[14.5px] leading-tight text-muted"><strong className="block text-[15.5px] text-ink">{r.name}</strong>{r.area} · {r.date}</span></footer></article>;}
/** Review excerpts on two slow rails moving in opposite directions; they slow right down under the pointer. */
export function Reviews(){
  return <section id="reviews" className="overflow-hidden bg-stone py-20 md:py-28" aria-labelledby="reviews-heading">
    <div className="wrap flex flex-wrap items-end justify-between gap-8">
      <div className="max-w-2xl"><p className="eyebrow">Reviews</p><Reveal id="reviews-heading" lines={['What our customers say']} className="h-sec"/></div>
      <Rise delay={.1}><a href={SOLARQUOTES} className="group flex items-center gap-4 rounded-2xl border border-line bg-white py-4 pr-5 pl-5 transition-shadow hover:shadow-[var(--shadow-card)]"><span className="text-[2.5rem] leading-none font-bold tracking-tight">4.8</span><span className="text-[14.5px] leading-snug text-muted"><StarRow rating={5} size={17}/><span className="block">from 26 reviews on SolarQuotes</span></span><ArrowUpRight size={18} aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></a></Rise>
    </div>
    <div className="fade-x mt-12 grid gap-4" aria-label="Customer review excerpts from SolarQuotes">
      <InfiniteSlider gap={16} speed={34} speedOnHover={8}>{reviews.slice(0,5).map(r=><ReviewCard key={r.name+r.date} r={r}/>)}</InfiniteSlider>
      <InfiniteSlider gap={16} speed={34} speedOnHover={8} reverse>{reviews.slice(5).map(r=><ReviewCard key={r.name+r.date} r={r}/>)}</InfiniteSlider>
    </div>
    <p className="wrap mt-8 text-[14.5px] text-muted">Excerpts from the 26 reviews on <a href={SOLARQUOTES} className="font-semibold text-ink underline underline-offset-4">SolarQuotes</a>. Sub-ratings there: installation 5.0, customer service 4.9, value 4.7, system quality 4.7.</p>
  </section>;
}
