/* Magic UI "Border Beam" (listed on 21st.dev as magicui/border-beam), from magicui.design/r/border-beam.json.
 * A single light travelling a card's border. Unchanged apart from brand colours as defaults and standing
 * still under reduced motion. */
import {motion,useReducedMotion,type MotionStyle} from 'motion/react';
import {cn} from '@/lib/utils';

export function BorderBeam({className,size=120,delay=0,duration=9,colorFrom='var(--mint)',colorTo='var(--brand)',reverse=false,initialOffset=0,borderWidth=1.5}:{className?:string;size?:number;delay?:number;duration?:number;colorFrom?:string;colorTo?:string;reverse?:boolean;initialOffset?:number;borderWidth?:number}){
  const reduce=useReducedMotion();
  if(reduce)return null;
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]" style={{'--border-beam-width':`${borderWidth}px`} as React.CSSProperties}>
    <motion.div className={cn('absolute aspect-square bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent',className)} style={{width:size,offsetPath:`rect(0 auto auto 0 round ${size}px)`,'--color-from':colorFrom,'--color-to':colorTo} as MotionStyle} initial={{offsetDistance:`${initialOffset}%`}} animate={{offsetDistance:reverse?[`${100-initialOffset}%`,`${-initialOffset}%`]:[`${initialOffset}%`,`${100+initialOffset}%`]}} transition={{repeat:Infinity,ease:'linear',duration,delay:-delay}}/>
  </div>;
}
