/* Adapted from skiperui's "text-scroll-animation" (Skiper31): characters and images converge from the
 * edges as a section scrolls. `motion/react` replaces framer-motion; Lenis smooth scrolling is left out
 * because the site already runs native scroll with Motion and GSAP ScrollTrigger. Under reduced motion
 * (and before hydration) everything renders in its final position. */
import {motion,useReducedMotion,useTransform,type MotionValue} from 'motion/react';
import {cn} from '@/lib/utils';

const RANGE:[number,number]=[0,.5];

interface UnitProps{index:number;centerIndex:number;progress:MotionValue<number>;className?:string}

/** A single character that slides in from the side and untilts as `progress` runs 0 → 0.5. */
export function ScrollChar({char,index,centerIndex,progress,className}:UnitProps&{char:string}){
  const reduce=useReducedMotion();
  const offset=index-centerIndex;
  const x=useTransform(progress,RANGE,[offset*50,0]);
  const rotateX=useTransform(progress,RANGE,[offset*50,0]);
  return <motion.span className={cn('inline-block will-change-transform',char===' '&&'w-[.35em]',className)} data-motion="" style={reduce?undefined:{x,rotateX}} aria-hidden="true">{char===' '?' ':char}</motion.span>;
}

/** A whole line of characters converging on its centre. */
export function ScrollChars({text,progress,className,charClassName}:{text:string;progress:MotionValue<number>;className?:string;charClassName?:string}){
  const chars=text.split('');
  const center=Math.floor(chars.length/2);
  return <span className={className} style={{perspective:'500px'}}><span className="sr-only">{text}</span>{chars.map((c,i)=><ScrollChar key={i} char={c} index={i} centerIndex={center} progress={progress} className={charClassName}/>)}</span>;
}

export interface ScrollPhoto{src:string;alt:string;width:number;height:number;href?:string}

/** An image that fans in with a tilt (Skiper31's CharacterV3), settling flat at centre. */
export function ScrollPhotoItem({photo,index,centerIndex,progress,className,spread=90,tilt=14,drop=20}:UnitProps&{photo:ScrollPhoto;spread?:number;tilt?:number;drop?:number}){
  const reduce=useReducedMotion();
  const offset=index-centerIndex;
  const x=useTransform(progress,RANGE,[offset*spread,0]);
  const rotate=useTransform(progress,RANGE,[offset*tilt,0]);
  const y=useTransform(progress,RANGE,[-Math.abs(offset)*drop,0]);
  const scale=useTransform(progress,RANGE,[.75,1]);
  const img=<img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async"/>;
  return <motion.figure className={cn('m-0 shrink-0 will-change-transform',className)} data-motion="" style={reduce?undefined:{x,rotate,y,scale,transformOrigin:'center'}}>{photo.href?<a href={photo.href}>{img}</a>:img}</motion.figure>;
}

/** A row of photos that fan in from both sides. */
export function ScrollPhotos({photos,progress,className,itemClassName,spread,tilt,drop}:{photos:ScrollPhoto[];progress:MotionValue<number>;className?:string;itemClassName?:string;spread?:number;tilt?:number;drop?:number}){
  const center=(photos.length-1)/2;
  return <div className={className} style={{perspective:'500px'}}>{photos.map((p,i)=><ScrollPhotoItem key={p.src} photo={p} index={i} centerIndex={center} progress={progress} className={itemClassName} spread={spread} tilt={tilt} drop={drop}/>)}</div>;
}
