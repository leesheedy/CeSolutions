/* The roof. One 3D object on the site, and it is the product: a section of gabled roof with a north-facing
 * panel array, lit by the same solar position that governs the rest of the page.
 *
 * Hand-drawn on a 2D canvas with real perspective projection and flat shading rather than a WebGL library —
 * a Spline or three.js runtime would have cost 300–600 KB for one moment, on a site where we just removed an
 * 823 KB hero video. Flat shading also suits the surveyor direction better than a photoreal render would.
 *
 * Geometry is in metres. +X east, +Y up, +Z north — so the panels face +Z, which is correct for 36°S. */
import {useEffect,useRef,useState} from 'react';
import {solarDay} from './sun';

type V3=[number,number,number];
const sub=(a:V3,b:V3):V3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const cross=(a:V3,b:V3):V3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a:V3,b:V3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const norm=(a:V3):V3=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];};
const rad=(d:number)=>d*Math.PI/180;

// House: 4 m wide, 3 m deep, 1.15 m to the eaves, 22.6° roof pitch (0.8 m rise over 1.5 m).
const W=2,D=1.5,WALL=1.15,RIDGE=1.95;
/** A point on the north slope: u across the ridge (−2…2), v from ridge (0) to eave (1). */
const slope=(u:number,v:number):V3=>[u,RIDGE-(RIDGE-WALL)*v,D*v];
const ROOF_N=norm([0,D,RIDGE-WALL]);      // north slope normal
const WALL_N:V3=[0,0,1];                   // north wall
const END_N:V3=[1,0,0];                    // east end

// Camera sits north-east and a little above, so the lit slope faces the viewer.
const CAM:V3=[4.6,2.4,7.0],TARGET:V3=[0,0.9,0];
// Framing: view centre and focal length, kept in one place so the horizon maths can't drift from the projection.
const CX=0.57,CY=0.50,FOCAL=1.5;
const FWD=norm(sub(TARGET,CAM)),RIGHT=norm(cross(FWD,[0,1,0])),UP=cross(RIGHT,FWD);

function makeProject(cx:number,cy:number,focal:number){
  return (p:V3):[number,number]|null=>{
    const d=sub(p,CAM),z=dot(d,FWD);
    if(z<=0.05)return null;
    return [cx+dot(d,RIGHT)*focal/z,cy-dot(d,UP)*focal/z];
  };
}
/** Where a point lands on the ground when the sun is at S. */
const shadowOf=(p:V3,S:V3):V3=>S[1]<=0.02?p:[p[0]-S[0]*(p[1]/S[1]),0,p[2]-S[2]*(p[1]/S[1])];

const PANEL_COLS=5,PANEL_ROWS=2;

export function RoofScene(){
  const wrap=useRef<HTMLDivElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  const [caption,setCaption]=useState('');

  useEffect(()=>{
    const cv=canvas.current,box=wrap.current;
    if(!cv||!box)return;
    const ctx=cv.getContext('2d');
    if(!ctx)return;
    const day=solarDay();
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let minutes=day.nowMinutes,raf=0,sweep:number|null=null;

    const draw=()=>{
      const cssW=box.clientWidth||520,cssH=Math.round(Math.min(340,Math.max(220,cssW*0.62)));
      const dpr=Math.min(window.devicePixelRatio||1,2);
      if(cv.width!==Math.round(cssW*dpr)){cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);}
      cv.style.height=cssH+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,cssW,cssH);

      const {el,az}=day.at(minutes);
      const lit=el>0;
      // Unit vector from the scene toward the sun. az 0°=N, 90°=E.
      const S=norm([Math.cos(rad(el))*Math.sin(rad(az)),Math.sin(rad(el)),Math.cos(rad(el))*Math.cos(rad(az))]);
      const cx=cssW*CX,cy=cssH*CY,focal=cssH*FOCAL;
      const project=makeProject(cx,cy,focal);

      // Sky, sampled from the same table the page uses.
      const [a,b]=day.sky(el,az<180);
      const g=ctx.createLinearGradient(0,0,0,cssH);
      g.addColorStop(0,a);g.addColorStop(1,b);
      ctx.fillStyle=g;ctx.fillRect(0,0,cssW,cssH);

      const face=(pts:(V3)[],fill:string,stroke?:string)=>{
        const p=pts.map(project);
        if(p.some(q=>!q))return;
        ctx.beginPath();
        p.forEach((q,i)=>i?ctx.lineTo(q![0],q![1]):ctx.moveTo(q![0],q![1]));
        ctx.closePath();ctx.fillStyle=fill;ctx.fill();
        if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
      };
      /** Flat shading: a little ambient, plus diffuse from the sun. */
      const shade=(n:V3,base:[number,number,number],amb=0.30)=>{
        const k=amb+(lit?Math.max(0,dot(n,S))*0.78:0);
        return `rgb(${base.map(c=>Math.round(Math.min(255,c*k))).join(',')})`;
      };

      // Ground to the true horizon: the screen row where a ray parallel to the ground plane lands.
      const dH=norm([FWD[0],0,FWD[2]]);
      const horizonY=cy-dot(dH,UP)*focal/dot(dH,FWD);
      ctx.fillStyle=lit?'#16232B':'#0B141B';
      ctx.fillRect(0,horizonY,cssW,cssH-horizonY);
      ctx.beginPath();ctx.moveTo(0,horizonY+.5);ctx.lineTo(cssW,horizonY+.5);
      ctx.strokeStyle=lit?'rgba(150,180,200,.20)':'rgba(120,150,175,.12)';ctx.lineWidth=1;ctx.stroke();
      ctx.save();ctx.beginPath();ctx.rect(0,horizonY,cssW,cssH-horizonY);ctx.clip();
      const cc=project([0,0.02,0]),ce=project([W*1.5,0.02,D*1.5]);
      if(cc&&ce){const rx=Math.abs(ce[0]-cc[0]),ry=Math.max(6,Math.abs(ce[1]-cc[1])*0.9);
        const ao=ctx.createRadialGradient(cc[0],cc[1],0,cc[0],cc[1],rx);
        ao.addColorStop(0,'rgba(3,7,11,.55)');ao.addColorStop(1,'rgba(3,7,11,0)');
        ctx.save();ctx.translate(cc[0],cc[1]);ctx.scale(1,ry/rx);ctx.translate(-cc[0],-cc[1]);
        ctx.fillStyle=ao;ctx.beginPath();ctx.arc(cc[0],cc[1],rx,0,Math.PI*2);ctx.fill();ctx.restore();}
      if(lit&&el>2){
        const outline:V3[]=[[-W,RIDGE,0],[W,RIDGE,0],[W,WALL,D],[-W,WALL,D],[W,0,-D],[-W,0,-D]];
        face(outline.map(p=>shadowOf(p,S)),'rgba(4,8,12,0.45)');
      }
      ctx.restore();

      // Walls, then the gable end, then the lit slope and its panels.
      face([[-W,WALL,D],[W,WALL,D],[W,0,D],[-W,0,D]],shade(WALL_N,[196,214,226],0.22));
      face([[W,WALL,D],[W,WALL,-D],[W,0,-D],[W,0,D]],shade(END_N,[150,170,184],0.20));
      face([[W,WALL,D],[W,RIDGE,0],[W,WALL,-D]],shade(END_N,[168,186,200],0.20));

      // A lit window while the sun is down — the house running on stored sun.
      if(!lit){
        face([[-1.25,0.34,D+0.002],[-0.35,0.34,D+0.002],[-0.35,0.92,D+0.002],[-1.25,0.92,D+0.002]],'#FFB000');
        face([[0.45,0.34,D+0.002],[1.25,0.34,D+0.002],[1.25,0.92,D+0.002],[0.45,0.92,D+0.002]],'rgba(255,176,0,.55)');
      }

      face([[-W,RIDGE,0],[W,RIDGE,0],[W,WALL,D],[-W,WALL,D]],shade(ROOF_N,[122,140,152],0.26));

      // Panels: same normal as the slope, darker base, and a specular kick when the sun is square on.
      const facing=lit?Math.max(0,dot(ROOF_N,S)):0;
      // A narrow specular lobe: monocrystalline glass stays dark and only lifts when the sun is square on.
      const spec=Math.pow(facing,6);
      for(let r=0;r<PANEL_ROWS;r++)for(let c=0;c<PANEL_COLS;c++){
        const u0=-1.78+c*0.72,u1=u0+0.64;
        const v0=0.14+r*0.40,v1=v0+0.34;
        const k=0.34+facing*0.30;
        const fill=`rgb(${Math.round(18*k+spec*40)},${Math.round(26*k+spec*58)},${Math.round(38*k+spec*94)})`;
        face([slope(u0,v0),slope(u1,v0),slope(u1,v1),slope(u0,v1)],fill,`rgba(150,176,196,${(0.16+facing*0.24).toFixed(2)})`);
      }

      // Ridge line, and the sun itself when it is up.
      const r0=project([-W,RIDGE,0]),r1=project([W,RIDGE,0]);
      if(r0&&r1){ctx.beginPath();ctx.moveTo(r0[0],r0[1]);ctx.lineTo(r1[0],r1[1]);ctx.strokeStyle='rgba(216,232,240,.5)';ctx.lineWidth=1.25;ctx.stroke();}
      if(lit){
        const sp=project([S[0]*14,S[1]*14,S[2]*14]);
        if(sp){
          const glow=ctx.createRadialGradient(sp[0],sp[1],0,sp[0],sp[1],30);
          glow.addColorStop(0,'rgba(255,200,80,.85)');glow.addColorStop(1,'rgba(255,176,0,0)');
          ctx.fillStyle=glow;ctx.beginPath();ctx.arc(sp[0],sp[1],30,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='#FFD98A';ctx.beginPath();ctx.arc(sp[0],sp[1],5,0,Math.PI*2);ctx.fill();
        }
      }

      const pct=Math.round(facing*100);
      setCaption(`${day.label(minutes)} · SUN ${el.toFixed(0)}° · ${lit?`ARRAY ${pct}% TO THE SUN`:'RUNNING ON STORED SUN'}`);
    };

    // One pass of the day when it first comes into view, then it settles on the real time now.
    const io=new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting||sweep!==null||reduce)return;
      sweep=performance.now();
      const step=(t:number)=>{
        const p=Math.min(1,(t-(sweep as number))/4200);
        minutes=day.riseMinutes+(day.setMinutes-day.riseMinutes)*p;
        draw();
        if(p<1)raf=requestAnimationFrame(step);
        else{minutes=day.nowMinutes;draw();}
      };
      raf=requestAnimationFrame(step);
    },{threshold:0.4});
    io.observe(box);

    draw();
    let rt=0;
    const onResize=()=>{window.clearTimeout(rt);rt=window.setTimeout(draw,160);};
    window.addEventListener('resize',onResize);
    return()=>{io.disconnect();cancelAnimationFrame(raf);window.clearTimeout(rt);window.removeEventListener('resize',onResize);};
  },[]);

  return <figure ref={wrap} className="roof">
    <canvas ref={canvas} className="roof__canvas" role="img"
      aria-label="A north-facing solar array on a gabled roof, drawn with the sun in its real position over Wodonga today."/>
    <figcaption className="roof__cap">{caption||' '}</figcaption>
  </figure>;
}
