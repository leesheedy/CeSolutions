/* Motion Primitives "Infinite Slider" (listed on 21st.dev as ibelick/infinite-slider), from
 * motion-primitives.com/c/infinite-slider.json. Changes: a ResizeObserver replaces react-use-measure (one
 * dependency fewer), the duplicate set is hidden from assistive tech, and it holds still under reduced motion. */
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {animate,motion,useMotionValue} from 'motion/react';
import {useCalm} from '@/site/a11y';
import {cn} from '@/lib/utils';

export type InfiniteSliderProps={children:ReactNode;gap?:number;speed?:number;speedOnHover?:number;direction?:'horizontal'|'vertical';reverse?:boolean;className?:string};

export function InfiniteSlider({children,gap=16,speed=100,speedOnHover,direction='horizontal',reverse=false,className}:InfiniteSliderProps){
  const [currentSpeed,setCurrentSpeed]=useState(speed);
  const ref=useRef<HTMLDivElement>(null);
  const [size,setSize]=useState(0);
  const translation=useMotionValue(0);
  const [isTransitioning,setIsTransitioning]=useState(false);
  const [key,setKey]=useState(0);
  const reduce=useCalm();
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const measure=()=>setSize(direction==='horizontal'?el.offsetWidth:el.offsetHeight);
    measure();
    const ro=new ResizeObserver(measure);ro.observe(el);
    return()=>ro.disconnect();
  },[direction]);
  useEffect(()=>{
    if(reduce){translation.set(0);return;}
    if(!size)return;
    const contentSize=size+gap;
    const from=reverse?-contentSize/2:0,to=reverse?0:-contentSize/2;
    const controls=isTransitioning
      ?animate(translation,[translation.get(),to],{ease:'linear',duration:Math.abs(translation.get()-to)/currentSpeed,onComplete:()=>{setIsTransitioning(false);setKey(k=>k+1);}})
      :animate(translation,[from,to],{ease:'linear',duration:Math.abs(to-from)/currentSpeed,repeat:Infinity,repeatType:'loop',repeatDelay:0,onRepeat:()=>{translation.set(from);}});
    return()=>controls.stop();
  },[key,translation,currentSpeed,size,gap,isTransitioning,reverse,reduce]);
  const hoverProps=speedOnHover!==undefined?{onHoverStart:()=>{setIsTransitioning(true);setCurrentSpeed(speedOnHover);},onHoverEnd:()=>{setIsTransitioning(true);setCurrentSpeed(speed);}}:{};
  return <div className={cn(reduce?'overflow-x-auto':'overflow-hidden',className)} tabIndex={reduce?0:undefined} role={reduce?'region':undefined} aria-label={reduce?'Scrollable row':undefined}>
    <motion.div ref={ref} className="flex w-max" data-motion="" style={{...(direction==='horizontal'?{x:translation}:{y:translation}),gap:`${gap}px`,flexDirection:direction==='horizontal'?'row':'column'}} {...hoverProps}>
      {children}
      {!reduce&&<div aria-hidden="true" className="contents">{children}</div>}
    </motion.div>
  </div>;
}
