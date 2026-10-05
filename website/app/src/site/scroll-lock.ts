type Lenis={stop:()=>void;start:()=>void;scrollTo:(y:number,o:{immediate:boolean;force:boolean})=>void};
const lenis=()=>(window as unknown as {__lenis?:Lenis}).__lenis;
/** Locks page scrolling without losing the scroll position. Returns the unlock function. Smooth scrolling is
 *  stopped while locked and re-synced afterwards, otherwise it would ease back from zero. */
export function lockScroll(){
  const y=window.scrollY;const b=document.body.style;
  const prev={position:b.position,top:b.top,width:b.width,overflow:b.overflow};
  lenis()?.stop();
  b.position='fixed';b.top=-y+'px';b.width='100%';b.overflow='hidden';
  return()=>{b.position=prev.position;b.top=prev.top;b.width=prev.width;b.overflow=prev.overflow;window.scrollTo(0,y);const l=lenis();l?.start();l?.scrollTo(y,{immediate:true,force:true});};
}
