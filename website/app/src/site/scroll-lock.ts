/** Locks page scrolling without losing the scroll position. Returns the unlock function. */
export function lockScroll(){
  const y=window.scrollY;const b=document.body.style;
  const prev={position:b.position,top:b.top,width:b.width,overflow:b.overflow};
  b.position='fixed';b.top=-y+'px';b.width='100%';b.overflow='hidden';
  return()=>{b.position=prev.position;b.top=prev.top;b.width=prev.width;b.overflow=prev.overflow;window.scrollTo(0,y);};
}
