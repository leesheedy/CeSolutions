/* Scroll and entrance motion for the CES site.
 *
 * Adapted from 21st.dev components and rewritten on `motion/react`:
 *   Parallax         ← pulkitxm "Parallax Image" (#20023), scroll-linked via useScroll
 *   Reveal           ← soralabs "Text Reveal (Mask)" (#19257), explicit lines, no measuring
 *   ScrollWords      ← motion.dev "Scroll word reveal" (#24525)
 *   Marquee          ← 7ovr "Logo Cloud Marquee" (#21470), CSS-only track
 *   Stack/StackItem  ← danielpetho "Stacking Cards" (#25275), cards pin and scale back
 *   ParallaxColumns  ← manuarora700 "Parallax Grid Scroll" (#1224), columns at two speeds
 *
 * Every component keeps content readable with JavaScript off (noscript sheet in
 * __root.tsx) and under prefers-reduced-motion (rule in styles.css).
 */
import {Children,Fragment,createContext,useContext,useEffect,useRef,useState,type CSSProperties,type ElementType,type ReactNode} from 'react';
import {animate,motion,useInView,useMotionValueEvent,useReducedMotion,useScroll,useTransform,type MotionValue} from 'motion/react';

const EXPO=[0.19,1,0.22,1] as const;
const VIEW={once:true,margin:'0px 0px -14% 0px'} as const;
const THROUGH:['start end','end start']=['start end','end start'];

/** Image wrapper that drifts vertically as it crosses the viewport. */
export function Parallax({children,className,intensity=34,scale=1.12}:{children:ReactNode;className?:string;intensity?:number;scale?:number}){
  const ref=useRef<HTMLDivElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const y=useTransform(scrollYProgress,[0,1],[-intensity,intensity]);
  return <div ref={ref} className={className?'parallax '+className:'parallax'}><motion.div className="parallax__layer" data-motion="" style={reduce?undefined:{y,scale}}>{children}</motion.div></div>;
}

/** Heading whose lines slide up out of a mask. Pass each visual line separately.
 * The heading itself is observed: the masked spans sit outside their clip until
 * they animate, so an observer on them would never report an intersection. */
export function Reveal({as='h2',lines,className,stagger=.09,duration=.9,delay=0,id}:{as?:ElementType;lines:string[];className?:string;stagger?:number;duration?:number;delay?:number;id?:string}){
  const Tag=as;
  const ref=useRef<HTMLElement>(null);
  const inView=useInView(ref,VIEW);
  return <Tag ref={ref} id={id} className={className} aria-label={lines.join(' ')}>{lines.map((line,i)=><span className="reveal__line" key={i} aria-hidden="true"><motion.span className="reveal__inner" data-motion="" initial={{y:'112%'}} animate={inView?{y:0}:{y:'112%'}} transition={{duration,delay:delay+i*stagger,ease:EXPO}}>{line}</motion.span></span>)}</Tag>;
}

/** Sentence whose words rise in one after another. */
export function RevealWords({as='p',text,className,stagger=.035,delay=0}:{as?:ElementType;text:string;className?:string;stagger?:number;delay?:number}){
  const Tag=as;
  const words=text.split(' ');
  return <Tag className={className} aria-label={text}>{words.map((w,i)=><Fragment key={i}><motion.span className="reveal__word" data-motion="" aria-hidden="true" initial={{y:10,opacity:0}} whileInView={{y:0,opacity:1}} viewport={VIEW} transition={{duration:.55,delay:delay+i*stagger,ease:EXPO}}>{w}</motion.span>{i<words.length-1?' ':null}</Fragment>)}</Tag>;
}

/** Block that rises and fades in when it enters the viewport. */
export function Rise({children,className,delay=0}:{children:ReactNode;className?:string;delay?:number}){
  return <motion.div className={className} data-motion="" initial={{y:22,opacity:0}} whileInView={{y:0,opacity:1}} viewport={VIEW} transition={{duration:.75,delay,ease:EXPO}}>{children}</motion.div>;
}

function Word({children,progress,start,end}:{children:string;progress:MotionValue<number>;start:number;end:number}){
  const opacity=useTransform(progress,[start,end],[.16,1]);
  return <motion.span aria-hidden="true" data-motion="" style={{opacity}}>{children}</motion.span>;
}

/** Statement that lights up word by word as it scrolls through the viewport. */
export function ScrollWords({text,className}:{text:string;className?:string}){
  const ref=useRef<HTMLParagraphElement>(null);
  const {scrollYProgress}=useScroll({target:ref,offset:['start 0.85','end 0.45']});
  const words=text.split(' ');
  const span=.8,win=.22;
  return <p ref={ref} className={className} aria-label={text}>{words.map((w,i)=>{const start=words.length<=1?0:(i/(words.length-1))*span;return <Fragment key={i}><Word progress={scrollYProgress} start={start} end={Math.min(1,start+win)}>{w}</Word>{i<words.length-1?' ':null}</Fragment>;})}</p>;
}

/** Number that counts up from zero the first time it is seen. */
export function Counter({value,decimals=0,prefix='',suffix=''}:{value:number;decimals?:number;prefix?:string;suffix?:string}){
  const ref=useRef<HTMLSpanElement>(null);
  const reduce=useReducedMotion();
  const inView=useInView(ref,{once:true,margin:'0px 0px -8% 0px'});
  const format=(v:number)=>prefix+v.toFixed(decimals)+suffix;
  useEffect(()=>{const el=ref.current;if(!el||!inView||reduce)return;const controls=animate(0,value,{duration:1.4,ease:EXPO,onUpdate:v=>{el.textContent=format(v);}});return()=>controls.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[inView,reduce,value,decimals,prefix,suffix]);
  return <span ref={ref}>{format(value)}</span>;
}

/** Infinite horizontal track of wordmarks; pauses on hover, static under reduced motion. */
export function Marquee({items,label}:{items:string[];label:string}){
  return <div className="marquee" aria-label={label} role="list"><div className="marquee__track">{[...items,...items].map((name,i)=><span key={i} role={i<items.length?'listitem':undefined} aria-hidden={i>=items.length?true:undefined} className={'marquee__item brand-'+name.toLowerCase()}>{name}</span>)}</div></div>;
}

/** Moves its children on scroll at a different rate from the page: y in px, x and opacity optional. */
export function Float({children,className,y=[40,-40],x,opacity,decorative}:{children:ReactNode;className?:string;y?:[number,number];x?:[string,string];opacity?:[number,number];decorative?:boolean}){
  const ref=useRef<HTMLDivElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:THROUGH});
  const yv=useTransform(scrollYProgress,[0,1],y);
  const xv=useTransform(scrollYProgress,[0,1],x??['0%','0%']);
  const ov=useTransform(scrollYProgress,[0,1],opacity??[1,1]);
  return <motion.div ref={ref} className={className} aria-hidden={decorative||undefined} data-motion="" style={reduce?undefined:{y:yv,x:xv,opacity:ov}}>{children}</motion.div>;
}

/** Full-bleed photo that scrolls slower than the page, with the copy drifting over it. */
export function ParallaxBackdrop({image,alt,children,className,eager,width=1024,height=562,label}:{image:string;alt:string;children:ReactNode;className?:string;eager?:boolean;width?:number;height?:number;label?:string}){
  const ref=useRef<HTMLElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:eager?['start start','end start']:THROUGH});
  const y=useTransform(scrollYProgress,[0,1],eager?['0%','18%']:['-14%','14%']);
  const copyY=useTransform(scrollYProgress,[0,1],eager?[0,-90]:[70,-50]);
  return <section ref={ref} className={className?'band '+className:'band'} aria-label={label}><motion.div className="band__bg" data-motion="" style={reduce?undefined:{y}}><img src={image} alt={alt} loading={eager?'eager':'lazy'} fetchPriority={eager?'high':undefined} decoding="async" width={width} height={height}/></motion.div><div className="band__shade" aria-hidden="true"/><motion.div className="band__content" data-motion="" style={reduce?undefined:{y:copyY}}>{children}</motion.div></section>;
}

const StackContext=createContext<{progress:MotionValue<number>;total:number}|null>(null);

/** Container for cards that pin under the header and scale back as the next one arrives. */
export function Stack({children,className,total}:{children:ReactNode;className?:string;total:number}){
  const ref=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
  return <StackContext.Provider value={{progress:scrollYProgress,total}}><div ref={ref} className={className}>{children}</div></StackContext.Provider>;
}

export function StackItem({index,children,className}:{index:number;children:ReactNode;className?:string}){
  const ctx=useContext(StackContext);
  if(!ctx)throw new Error('StackItem must sit inside Stack');
  const reduce=useReducedMotion();
  const {progress,total}=ctx;
  // A card starts shrinking once the next card begins covering it; the last card never shrinks.
  const last=index>=total-1;
  const from=last?0:(index+1)/total;
  const scale=useTransform(progress,[from,1],[1,last?1:1-(total-1-index)*.05]);
  const style={'--stack-index':index} as CSSProperties;
  return <div className={className?'stack-item '+className:'stack-item'} style={style}><motion.div className="stack-card-wrap" data-motion="" style={reduce||last?undefined:{scale}}>{children}</motion.div></div>;
}

/** Two columns that move at different rates while the grid passes through the viewport. */
export function ParallaxColumns({children,className}:{children:ReactNode;className?:string}){
  const ref=useRef<HTMLDivElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:THROUGH});
  const left=useTransform(scrollYProgress,[0,1],[30,-50]);
  const right=useTransform(scrollYProgress,[0,1],[-90,90]);
  const items=Children.toArray(children);
  return <div ref={ref} className={className?'pcols '+className:'pcols'}><motion.div className="pcol" data-motion="" style={reduce?undefined:{y:left}}>{items.filter((_,i)=>i%2===0)}</motion.div><motion.div className="pcol" data-motion="" style={reduce?undefined:{y:right}}>{items.filter((_,i)=>i%2===1)}</motion.div></div>;
}

function Chip({children,scrollY,factor,reduce}:{children:ReactNode;scrollY:MotionValue<number>;factor:number;reduce:boolean}){
  const y=useTransform(scrollY,v=>v*factor);
  return <motion.span className="hero-chip" data-motion="" style={reduce?undefined:{y}}>{children}</motion.span>;
}

/** Decorative fact chips layered over the pinned hero; each scrolls at its own rate. */
export function HeroChips({items}:{items:string[]}){
  const {scrollY}=useScroll();
  const reduce=useReducedMotion();
  return <div className="hero-chips" aria-hidden="true">{items.map((t,i)=><Chip key={t} scrollY={scrollY} factor={.22+i*.2} reduce={!!reduce}>{t}</Chip>)}</div>;
}

/** Adds `is-scrolled` to the sticky header once the page has moved. */
export function useScrolled(threshold=12){
  const [scrolled,setScrolled]=useState(false);
  const {scrollY}=useScroll();
  useMotionValueEvent(scrollY,'change',v=>setScrolled(v>threshold));
  return scrolled;
}
