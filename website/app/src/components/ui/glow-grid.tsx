/* Pointer-lit card grid.
 *
 * Adapted from two 21st.dev components onto one listener:
 *   aceternity "Glowing Effect"  – a border that lights up nearest the pointer
 *   "Spotlight Card"             – a soft radial wash that follows the pointer across the surface
 *
 * One pointermove on the grid writes --gx/--gy (pointer position inside each card, px) and --glow
 * (0–1, how close the pointer is) onto every `[data-glow]` child, so neighbouring cards catch the light
 * too, the way the Aceternity version does. All drawing is CSS (polish.css → `.glow-card`). No state,
 * no re-render. Touch devices and reduced-motion users simply get the resting card.
 */
import {useRef,type ElementType,type ReactNode} from 'react';

const REACH=220; // px beyond a card's edge at which it still picks up some light

export function GlowGrid({as:Tag='div',className,children,...rest}:{as?:ElementType;className?:string;children:ReactNode}&Record<string,unknown>){
  const ref=useRef<HTMLElement>(null);
  const frame=useRef(0);
  const move=(e:React.PointerEvent)=>{
    if(e.pointerType!=='mouse')return;
    const {clientX:x,clientY:y}=e;
    cancelAnimationFrame(frame.current);
    frame.current=requestAnimationFrame(()=>{
      ref.current?.querySelectorAll<HTMLElement>('[data-glow]').forEach(card=>{
        const r=card.getBoundingClientRect();
        const dx=Math.max(r.left-x,0,x-r.right),dy=Math.max(r.top-y,0,y-r.bottom);
        const glow=Math.max(0,1-Math.hypot(dx,dy)/REACH);
        card.style.setProperty('--gx',`${x-r.left}px`);
        card.style.setProperty('--gy',`${y-r.top}px`);
        card.style.setProperty('--glow',glow.toFixed(3));
      });
    });
  };
  const leave=()=>{cancelAnimationFrame(frame.current);ref.current?.querySelectorAll<HTMLElement>('[data-glow]').forEach(c=>c.style.setProperty('--glow','0'));};
  return <Tag ref={ref} className={className} onPointerMove={move} onPointerLeave={leave} {...rest}>{children}</Tag>;
}
