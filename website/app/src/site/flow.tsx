/* GSAP-driven pieces. GSAP and ScrollTrigger are loaded on the client only, after mount; the markup is
 * complete and readable without them, and `prefers-reduced-motion` skips every hidden start state. */
import {useEffect} from 'react';

/** Fills the line beside the process steps and lights each step as it reaches the middle of the viewport. */
export function ProcessMotion(){
  useEffect(()=>{
    const list=document.querySelector<HTMLElement>('.process-list');
    if(!list||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let cleanup=()=>{};
    void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      if(!list.isConnected)return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx=gsap.context(()=>{
        const fill=list.querySelector<HTMLElement>('.process-line i');
        if(fill)gsap.fromTo(fill,{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:list,start:'top 65%',end:'bottom 60%',scrub:.4}});
        for(const step of list.querySelectorAll<HTMLElement>('article')){
          ScrollTrigger.create({trigger:step,start:'top 62%',end:'bottom 40%',toggleClass:{targets:step,className:'is-active'}});
        }
      },list);
      list.classList.add('gsap-ready');
      cleanup=()=>{ctx.revert();list.classList.remove('gsap-ready');};
    });
    return()=>cleanup();
  },[]);
  return null;
}
