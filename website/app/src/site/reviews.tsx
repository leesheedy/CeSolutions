import {Star} from 'lucide-react';
import {Marquee} from '@/components/ui/marquee';
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
/** Scrolling row of short review excerpts; pauses on hover, static under reduced motion. */
export function ReviewMarquee(){return <div className="review-marquee"><Marquee pauseOnHover speed="slow" repeat={3} aria-label="Customer review excerpts from SolarQuotes">{reviews.map(r=><article className="review-card" key={r.name+r.date}><div className="review-card__stars" role="img" aria-label={`${r.rating} out of 5`}>{Array.from({length:5},(_,i)=><Star key={i} size={16} aria-hidden="true" className={i<Math.floor(r.rating)?'is-on':i<r.rating?'is-half':''}/>)}<span>{r.rating.toFixed(1)}</span></div><p>“{r.text}”</p><footer><strong>{r.name}</strong><span>{r.area} · {r.date}</span></footer></article>)}</Marquee><p className="review-marquee__source">Excerpts from the 26 reviews on <a href={SOLARQUOTES}>SolarQuotes ↗</a>. Sub-ratings there: installation 5.0, customer service 4.9, value 4.7, system quality 4.7.</p></div>}
