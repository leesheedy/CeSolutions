/* Magic UI "Number Ticker" (listed on 21st.dev as magicui/number-ticker), from magicui.design/r/number-ticker.json.
 * Changes: en-AU formatting, renders the final value on the server and under reduced motion so the
 * figure is in the HTML for crawlers and no-JS visitors. */
import {useEffect,useRef,type ComponentPropsWithoutRef} from 'react';
import {useInView,useMotionValue,useSpring} from 'motion/react';
import {useCalm} from '@/site/a11y';
import {cn} from '@/lib/utils';

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'>{value:number;startValue?:number;delay?:number;decimalPlaces?:number}

export function NumberTicker({value,startValue=0,delay=0,className,decimalPlaces=0,...props}:NumberTickerProps){
  const ref=useRef<HTMLSpanElement>(null);
  const reduce=useCalm();
  const motionValue=useMotionValue(startValue);
  const springValue=useSpring(motionValue,{damping:34,stiffness:170});
  const isInView=useInView(ref,{once:true,margin:'0px'});
  const format=(n:number)=>Intl.NumberFormat('en-AU',{minimumFractionDigits:decimalPlaces,maximumFractionDigits:decimalPlaces}).format(Number(n.toFixed(decimalPlaces)));
  useEffect(()=>{
    if(reduce){if(ref.current)ref.current.textContent=format(value);return;}
    if(!isInView)return;
    // Start the count from the low value only once it is on screen; until then the real figure stays put.
    motionValue.jump(startValue);springValue.jump(startValue);
    const timer=setTimeout(()=>motionValue.set(value),delay*1000);
    return()=>clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isInView,reduce,value,startValue,delay]);
  useEffect(()=>springValue.on('change',latest=>{if(ref.current&&!reduce)ref.current.textContent=format(latest);}),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [springValue,decimalPlaces,reduce]);
  return <span ref={ref} className={cn('inline-block tabular-nums',className)} {...props}>{format(value)}</span>;
}
