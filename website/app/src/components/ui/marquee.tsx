/* Adapted from designali-in's Marquee: a CSS-only infinite track. Keyframes and the --animate-marquee
 * theme tokens live in src/styles.css. Static (no animation, single copy) under prefers-reduced-motion. */
import {cn} from '@/lib/utils';
import type {ComponentPropsWithoutRef,ReactNode} from 'react';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'>{
  className?:string;
  /** Reverse the animation direction. */
  reverse?:boolean;
  /** Pause while hovered. */
  pauseOnHover?:boolean;
  children:ReactNode;
  /** Scroll vertically instead of horizontally. */
  vertical?:boolean;
  /** How many copies of the content to lay out (enough to cover the viewport twice). */
  repeat?:number;
  speed?:'slow'|'normal'|'fast';
}

export function Marquee({className,reverse=false,pauseOnHover=false,children,vertical=false,repeat=4,speed='normal',...props}:MarqueeProps){
  const speedVariants={slow:'[--duration:120s]',normal:'[--duration:50s]',fast:'[--duration:18s]'};
  return <div {...props} className={cn('group flex overflow-hidden [--gap:16px] [gap:var(--gap)] motion-reduce:flex-wrap',speedVariants[speed],vertical?'flex-col':'flex-row',className)}>
    {Array.from({length:repeat},(_,i)=><div key={i} aria-hidden={i>0||undefined} className={cn('flex shrink-0 justify-around [gap:var(--gap)] motion-reduce:animate-none motion-reduce:[&:not(:first-child)]:hidden',vertical?'animate-marquee-vertical flex-col':'animate-marquee flex-row',pauseOnHover&&'group-hover:[animation-play-state:paused]',reverse&&'[animation-direction:reverse]')}>{children}</div>)}
  </div>;
}
