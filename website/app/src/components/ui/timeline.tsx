/* Aceternity UI "Timeline" (listed on 21st.dev as aceternity/timeline), from ui.aceternity.com/registry/timeline.json.
 * A rail that fills as you scroll past numbered entries with sticky titles. Changes: the demo heading is
 * removed (the section supplies its own), it renders an ordered list, re-measures on resize, takes a tone,
 * and the rail is fully drawn under reduced motion. */
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';

export interface TimelineEntry{title:string;kicker?:string;content:ReactNode}

export function Timeline({data}:{data:TimelineEntry[]}){
  const ref=useRef<HTMLOListElement>(null);
  const [height,setHeight]=useState(0);
  const reduce=useReducedMotion();
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const measure=()=>setHeight(el.getBoundingClientRect().height);
    measure();
    const ro=new ResizeObserver(measure);ro.observe(el);
    return()=>ro.disconnect();
  },[]);
  const {scrollYProgress}=useScroll({target:ref,offset:['start 55%','end 60%']});
  const heightTransform=useTransform(scrollYProgress,[0,1],[0,height]);
  return <ol ref={ref} className="relative m-0 list-none p-0">
    {data.map((item,index)=><li key={item.title} className="flex justify-start gap-0 pb-10 last:pb-0 md:gap-10 md:pb-14">
      <div className="sticky top-28 z-10 flex max-w-xs items-center self-start md:w-full lg:max-w-sm">
        <div className="absolute left-0 grid size-11 place-items-center rounded-full bg-night ring-1 ring-white/15"><span className="text-[15px] font-bold text-mint tabular-nums">{String(index+1).padStart(2,'0')}</span></div>
        <div className="hidden md:block md:pl-20">{item.kicker&&<p className="mb-1 text-sm font-semibold text-mint">{item.kicker}</p>}<h3 className="text-3xl leading-none font-bold tracking-tight text-white lg:text-[2.6rem]">{item.title}</h3></div>
      </div>
      <div className="relative w-full pl-16 md:pl-4">
        <div className="mb-3 md:hidden">{item.kicker&&<p className="mb-1 text-sm font-semibold text-mint">{item.kicker}</p>}<h3 className="text-2xl leading-tight font-bold tracking-tight text-white">{item.title}</h3></div>
        {item.content}
      </div>
    </li>)}
    <div aria-hidden="true" style={{height:height+'px'}} className="absolute top-0 left-[21px] w-[2px] overflow-hidden bg-white/12 [mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)]">
      <motion.div data-motion="" style={reduce?{height:'100%'}:{height:heightTransform}} className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-b from-mint/20 via-mint to-mint"/>
    </div>
  </ol>;
}
