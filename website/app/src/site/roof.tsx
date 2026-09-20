import {useEffect,useRef,useState} from 'react';
import {RotateCcw,ChevronLeft,ChevronRight} from 'lucide-react';
type Point=[number,number,number];
const sub=(a:Point,b:Point):Point=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const dot=(a:Point,b:Point)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a:Point,b:Point):Point=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=(a:Point):Point=>{const d=Math.hypot(...a)||1;return a.map(n=>n/d) as Point;};
/** Lightweight projected 3D geometry. Draws only on resize or explicit user input, never in a continuous loop. */
export function RoofScene({mode='day'}:{mode?:'day'|'evening'}){
 const canvas=useRef<HTMLCanvasElement>(null),box=useRef<HTMLElement>(null);
 const [angle,setAngle]=useState(.65);
 useEffect(()=>{
  const cv=canvas.current,wrap=box.current;if(!cv||!wrap)return;
  const ctx=cv.getContext('2d');if(!ctx)return;
  const draw=()=>{
   const width=wrap.clientWidth,height=Math.max(260,Math.min(460,width*.76));
   const dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(width*dpr);cv.height=Math.round(height*dpr);cv.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   const night=mode==='evening',cam:Point=[Math.sin(angle)*9,5.4,Math.cos(angle)*9],forward=unit(sub([0,1.1,0],cam)),right=unit(cross(forward,[0,1,0])),up=cross(right,forward);
   const focal=width*1.28;
   const project=(p:Point):[number,number]=>{const d=sub(p,cam),z=dot(d,forward);return [width*.47+dot(d,right)*focal/z,height*.46-dot(d,up)*focal/z];};
   const face=(points:Point[],fill:string,stroke?:string)=>{ctx.beginPath();points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke();}};
   const line=(points:Point[],color:string,w=1)=>{ctx.beginPath();points.map(project).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke();};
   const cube=(x:number,y:number,z:number,w:number,h:number,d:number,colors:string[])=>{
    face([[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]],colors[0]);
    face([[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]],colors[1]);
    face([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]],colors[2]);
   };
   const ground=project([0,-.12,0]);ctx.save();ctx.translate(ground[0],ground[1]+height*.12);ctx.scale(1,.3);const shadow=ctx.createRadialGradient(0,0,0,0,0,width*.43);shadow.addColorStop(0,night?'#07171f66':'#174d3835');shadow.addColorStop(1,'#174d3800');ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,width*.43,0,Math.PI*2);ctx.fill();ctx.restore();
   cube(-2.9,-.22,-2.15,5.8,.22,4.5,night?['#243e42','#1c343b','#476462']:['#a2b7a6','#8ca997','#d0ddcf']);
   face([[-2.2,.006,-1.7],[2.65,.006,-1.7],[2.65,.006,1.8],[-2.2,.006,1.8]],night?'#677579':'#dce3df');
   face([[-.1,.015,1.6],[.75,.015,1.6],[.75,.015,2.34],[-.1,.015,2.34]],night?'#89918e':'#e9eeeb');
   // A coherent architectural model: front, gable, roof, inset glazing and external storage.
   cube(-2,0,-1.5,4,1.65,3,night?['#8c9c9f','#657b80','#9cabad']:['#f2f0e7','#c8d6d2','#f9faf4']);
   face([[2,1.65,-1.5],[2,2.65,0],[2,1.65,1.5]],night?'#74888c':'#d3dfd8');
   for(let x=-1.92;x<2;x+=.18)line([[x,.08,1.502],[x,1.58,1.502]],night?'#71878a66':'#cbd3cb70',.55);
   const glass=night?'#f5d793':'#66959c',frame=night?'#c6cfc9':'#ffffff';
   for(const [a,b] of [[-1.65,-.65],[.7,1.65]]){
    face([[a,.52,1.51],[b,.52,1.51],[b,1.3,1.51],[a,1.3,1.51]],glass,frame);
    line([[(a+b)/2,.52,1.515],[(a+b)/2,1.3,1.515]],frame,2);
    line([[a,.91,1.515],[b,.91,1.515]],frame,2);
   }
   face([[-.35,.05,1.51],[.3,.05,1.51],[.3,1.35,1.51],[-.35,1.35,1.51]],night?'#617b80':'#41686b','#e3e9e4');
   const knob=project([.18,.72,1.52]);ctx.fillStyle='#e4ddba';ctx.beginPath();ctx.arc(...knob,1.7,0,Math.PI*2);ctx.fill();
   face([[2.01,.6,-1.08],[2.01,.6,-.32],[2.01,1.3,-.32],[2.01,1.3,-1.08]],glass,frame);
   line([[2.02,.6,-.7],[2.02,1.3,-.7]],frame,2);
   face([[-2.16,1.61,-1.66],[2.16,1.61,-1.66],[2.16,2.72,0],[-2.16,2.72,0]],night?'#243b48':'#425962');
   face([[-2.16,2.72,0],[2.16,2.72,0],[2.16,1.61,1.66],[-2.16,1.61,1.66]],night?'#304955':'#58757b');
   const slope=(u:number,v:number,lift=0):Point=>[u,2.72-1.11*v+lift,1.66*v];
   for(let x=-2.08;x<2.15;x+=.13)line([slope(x,0,.005),slope(x,1,.005)],night?'#64808b50':'#93adb070',.7);
   for(let r=0;r<2;r++)for(let c=0;c<5;c++){
    const x=-1.83+c*.74,v=.1+r*.4,wide=.65,deep=.34;
    face([slope(x,v,.035),slope(x+wide,v,.035),slope(x+wide,v+deep,.035),slope(x,v+deep,.035)],night?'#183542':'#163e51',night?'#5b8291':'#a2c1c6');
    for(let cell=1;cell<4;cell++)line([slope(x+wide*cell/4,v,.041),slope(x+wide*cell/4,v+deep,.041)],night?'#42697a66':'#547d9166',.55);
    line([slope(x,v+deep/2,.04),slope(x+wide,v+deep/2,.04)],'#7c9da555',.55);
    face([slope(x,v,.043),slope(x+wide,v,.043),slope(x+wide,v+.075,.043),slope(x,v+.13,.043)],night?'#ffffff05':'#b7e8fa1a');
   }
   line([[-2.17,2.74,0],[2.17,2.74,0]],night?'#789197':'#b8c9c7',2);
   line([[-2.17,1.6,1.67],[2.17,1.6,1.67]],night?'#9aaeb1':'#f0f1e9',3);
   cube(2.035,.16,.06,.29,1.15,.71,night?['#afbabb','#889a9e','#c6d1d0']:['#f9faf5','#d4dfdd','#ffffff']);
   line([[2.335,1.03,.18],[2.335,1.03,.63]],'#31ba95',3);
   line([[2.1,.05,.85],[2.1,.3,.85],[2.1,.3,.79]],night?'#a6b9b8':'#9aadaa',2);
   const light=project([-2.7,3.8,-2.5]);const glow=ctx.createRadialGradient(light[0],light[1],0,light[0],light[1],night?21:37);glow.addColorStop(0,night?'#d2e4ee70':'#fff7d8');glow.addColorStop(1,night?'#d2e4ee00':'#fff7d800');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(...light,night?21:37,0,Math.PI*2);ctx.fill();
  };
  const observer=new ResizeObserver(draw);observer.observe(wrap);draw();return()=>observer.disconnect();
 },[mode,angle]);
 return <figure ref={box} className="home-model"><canvas ref={canvas} role="img" aria-label={mode==='day'?'Three-dimensional illustration of a home with rooftop solar panels and a wall-mounted battery in daylight.':'The same solar home in the evening, with illuminated windows and a battery.'}/><figcaption className="home-model__controls"><button type="button" aria-label="Rotate house left" disabled={angle<=.25} onClick={()=>setAngle(a=>Math.max(.25,a-.2))}><ChevronLeft size={17}/></button><button type="button" onClick={()=>setAngle(.65)} aria-label="Reset house view"><RotateCcw size={14}/>Rotate view</button><button type="button" aria-label="Rotate house right" disabled={angle>=1.05} onClick={()=>setAngle(a=>Math.min(1.05,a+.2))}><ChevronRight size={17}/></button></figcaption></figure>;
}
