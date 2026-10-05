/* Accessibility preferences and smooth scrolling.
 *
 * Four switches a visitor can set for themselves, remembered on their device: pause animations, higher
 * contrast, larger text, underlined links. Each one is an attribute on <html> that site.css reads, so the
 * choice applies before React loads (see `a11yBoot`, inlined in the document head) and costs nothing when off.
 *
 * "Pause animations" is the site's WCAG 2.2.2 control: it stops the hero video, the moving rails, parallax,
 * entrance motion and smooth scrolling. `useCalm()` is true when that switch is on OR the operating system
 * asks for reduced motion, and is what every moving component checks. */
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {Accessibility,X} from 'lucide-react';

export type Prefs={calm:boolean;contrast:boolean;large:boolean;underline:boolean};
const KEY='ces-a11y',EVENT='ces-a11y-change';
const NONE:Prefs={calm:false,contrast:false,large:false,underline:false};
/** Runs in <head> before first paint so a saved preference never flashes off then on. */
export const a11yBoot=`try{var p=JSON.parse(localStorage.getItem('${KEY}')||'{}'),d=document.documentElement;for(var k in p)if(p[k])d.setAttribute('data-'+k,'')}catch(e){}`;

let cache:Prefs=NONE,cacheRaw='';
function read():Prefs{
  let raw='';
  try{raw=localStorage.getItem(KEY)??'';}catch{/* storage blocked: preferences last for the visit only */}
  if(raw!==cacheRaw){cacheRaw=raw;try{cache={...NONE,...(JSON.parse(raw||'{}') as Partial<Prefs>)};}catch{cache=NONE;}}
  return cache;
}
function write(next:Prefs){
  const raw=JSON.stringify(next);
  try{localStorage.setItem(KEY,raw);}catch{/* see read() */}
  cacheRaw=raw;cache=next;
  for(const k of Object.keys(next) as (keyof Prefs)[])document.documentElement.toggleAttribute('data-'+k,next[k]);
  window.dispatchEvent(new Event(EVENT));
}
const subscribe=(fn:()=>void)=>{window.addEventListener(EVENT,fn);window.addEventListener('storage',fn);return()=>{window.removeEventListener(EVENT,fn);window.removeEventListener('storage',fn);};};
export const usePrefs=()=>useSyncExternalStore(subscribe,read,()=>NONE);

const mq=()=>matchMedia('(prefers-reduced-motion: reduce)');
const subscribeMotion=(fn:()=>void)=>{const m=mq();m.addEventListener('change',fn);return()=>m.removeEventListener('change',fn);};
/** True when motion should hold still: the visitor's own switch, or the operating system setting. */
export function useCalm(){
  const os=useSyncExternalStore(subscribeMotion,()=>mq().matches,()=>false);
  return usePrefs().calm||os;
}

/** Inertial scrolling for mouse-wheel users on desktop. Touch devices keep native scrolling (it is already
 *  smooth, and overriding it fights the browser), and it is off whenever motion is paused. Lenis moves the
 *  real window scroll position, so sticky elements, anchors, ScrollTrigger and Motion's useScroll all still work. */
export function SmoothScroll(){
  const calm=useCalm();
  useEffect(()=>{
    if(calm||!matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches)return;
    let raf=0,alive=true;
    let lenis:{raf:(t:number)=>void;destroy:()=>void}|undefined;
    void import('lenis').then(({default:Lenis})=>{
      if(!alive)return;
      const l=new Lenis({duration:1.05,anchors:{offset:-92},autoRaf:false});
      lenis=l;(window as unknown as {__lenis?:unknown}).__lenis=l;
      const tick=(t:number)=>{l.raf(t);raf=requestAnimationFrame(tick);};
      raf=requestAnimationFrame(tick);
    });
    return()=>{alive=false;cancelAnimationFrame(raf);lenis?.destroy();delete (window as unknown as {__lenis?:unknown}).__lenis;};
  },[calm]);
  return null;
}

const OPTIONS:{key:keyof Prefs;label:string;hint:string}[]=[
{key:'calm',label:'Pause animations',hint:'Stops the video, moving rows and scroll effects'},
{key:'contrast',label:'Higher contrast',hint:'Darker text and stronger outlines'},
{key:'large',label:'Larger text',hint:'Makes everything on the page bigger'},
{key:'underline',label:'Underline links',hint:'Marks every link in the text'}];

/** The round button in the corner and the panel it opens. A plain disclosure, not a modal: nothing behind it
 *  is blocked, Escape or a click outside closes it, and focus goes back to the button. */
export function AccessibilityMenu(){
  const prefs=usePrefs();
  const [open,setOpen]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  const button=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!open)return;
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);button.current?.focus();}};
    const onDown=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};
    document.addEventListener('keydown',onKey);document.addEventListener('pointerdown',onDown);
    return()=>{document.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',onDown);};
  },[open]);
  const any=Object.values(prefs).some(Boolean);
  return <div ref={root} className="a11y">
    <button ref={button} type="button" className="a11y__toggle" aria-expanded={open} aria-controls="a11y-panel" onClick={()=>setOpen(o=>!o)}><Accessibility size={22} aria-hidden="true"/><span className="sr-only">Accessibility options</span>{any&&<span className="a11y__dot" aria-hidden="true"/>}</button>
    {open&&<div id="a11y-panel" className="a11y__panel" role="group" aria-labelledby="a11y-title">
      <div className="a11y__head"><h2 id="a11y-title">Accessibility</h2><button type="button" className="a11y__close" onClick={()=>{setOpen(false);button.current?.focus();}}><X size={18} aria-hidden="true"/><span className="sr-only">Close accessibility options</span></button></div>
      <ul>{OPTIONS.map(o=><li key={o.key}><button type="button" role="switch" aria-checked={prefs[o.key]} className="a11y__switch" onClick={()=>write({...prefs,[o.key]:!prefs[o.key]})}><span><strong>{o.label}</strong><em>{o.hint}</em></span><span className="a11y__track" aria-hidden="true"><span/></span></button></li>)}</ul>
      <button type="button" className="a11y__reset" disabled={!any} onClick={()=>write(NONE)}>Reset to default</button>
    </div>}
  </div>;
}
