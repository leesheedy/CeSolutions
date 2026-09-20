/* The site's light source. One clock governs the page: a NOAA solar-position calculation for the Wodonga
 * office (36.1214°S, 146.8881°E) writes custom properties onto <html>, and the CSS reads them for sky colour,
 * shadow direction and warmth. Nothing here is decorative — if it moves, it is the day passing.
 * No dependencies, ~2 KB, recalculated every five minutes. */
import {useEffect,useState} from 'react';

const LAT=-36.1214,LON=146.8881;
const rad=(d:number)=>d*Math.PI/180,deg=(r:number)=>r*180/Math.PI;

function orbit(msUTC:number){
  const jd=msUTC/86400000+2440587.5,t=(jd-2451545)/36525;
  const L0=(280.46646+t*(36000.76983+t*0.0003032))%360;
  const M=357.52911+t*(35999.05029-0.0001537*t);
  const e=0.016708634-t*(0.000042037+0.0000001267*t);
  const C=Math.sin(rad(M))*(1.914602-t*(0.004817+0.000014*t))+Math.sin(rad(2*M))*(0.019993-0.000101*t)+Math.sin(rad(3*M))*0.000289;
  const lam=L0+C-0.00569-0.00478*Math.sin(rad(125.04-1934.136*t));
  const eps=23+(26+(21.448-t*(46.815+t*(0.00059-t*0.001813)))/60)/60+0.00256*Math.cos(rad(125.04-1934.136*t));
  const decl=deg(Math.asin(Math.sin(rad(eps))*Math.sin(rad(lam))));
  const y=Math.tan(rad(eps/2))**2;
  const eot=4*deg(y*Math.sin(2*rad(L0))-2*e*Math.sin(rad(M))+4*e*y*Math.sin(rad(M))*Math.cos(2*rad(L0))-0.5*y*y*Math.sin(4*rad(L0))-1.25*e*e*Math.sin(2*rad(M)));
  return {decl,eot};
}
/** Wodonga wall-clock parts for an instant, via the IANA zone so AEST/AEDT is always right. */
function parts(d:Date){
  const f=new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Melbourne',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
  const o:Record<string,string>={};
  for(const p of f.formatToParts(d))o[p.type]=p.value;
  return {y:+o.year,m:+o.month,d:+o.day,hh:+(o.hour==='24'?'0':o.hour),mm:+o.minute};
}
function tzHours(d:Date){
  const p=parts(d);
  return Math.round((Date.UTC(p.y,p.m-1,p.d,p.hh,p.mm)-Math.floor(d.getTime()/60000)*60000)/1800000)/2;
}
function position(p:ReturnType<typeof parts>,tz:number,minutes:number){
  const {decl,eot}=orbit(Date.UTC(p.y,p.m-1,p.d,0,0)-tz*3600000+minutes*60000);
  const tst=(((minutes+eot+4*LON-60*tz)%1440)+1440)%1440;
  const ha=tst/4-180;
  const el=deg(Math.asin(Math.sin(rad(LAT))*Math.sin(rad(decl))+Math.cos(rad(LAT))*Math.cos(rad(decl))*Math.cos(rad(ha))));
  const c=(Math.sin(rad(LAT))*Math.sin(rad(el))-Math.sin(rad(decl)))/(Math.cos(rad(LAT))*Math.cos(rad(el)));
  const a=deg(Math.acos(Math.max(-1,Math.min(1,c))));
  return {el,az:ha>0?(a+180)%360:(540-a)%360};
}
function riseSet(p:ReturnType<typeof parts>,tz:number){
  const {decl,eot}=orbit(Date.UTC(p.y,p.m-1,p.d,2));
  const cosH=(Math.cos(rad(90.833))-Math.sin(rad(LAT))*Math.sin(rad(decl)))/(Math.cos(rad(LAT))*Math.cos(rad(decl)));
  if(cosH>1||cosH<-1)return null;
  const H=deg(Math.acos(cosH)),noon=(720-4*LON-eot)/60+tz;
  return {rise:noon-H/15,noon,set:noon+H/15};
}
const hhmm=(h:number)=>{const m=Math.round((((h%24)+24)%24)*60);return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;};

export type Sun={el:number;az:number;phase:'night'|'dawn'|'day'|'dusk';time:string;rise:string;noon:string;set:string;progress:number};

/** Sky colours sampled by solar elevation — the only gradients on the site that aren't a fact. */
function sky(el:number,rising:boolean):[string,string]{
  if(el<-8)return ['#060B10','#0A1219'];
  if(el<-0.5)return rising?['#13202E','#0B1723']:['#1A1A2A','#0C141E'];
  if(el<5)return rising?['#3C2A24','#16202C']:['#43251C','#151E29'];
  if(el<14)return ['#4A3524','#18242F'];
  if(el<32)return ['#2F4859','#172733'];
  return ['#2A566E','#16252F'];
}
/** Sun colour through atmosphere: deep orange at the horizon, pale gold overhead. */
function warmth(el:number){
  if(el<0)return '#FF6B35';
  if(el<6)return '#FF7A3D';
  if(el<16)return '#FF9A2E';
  if(el<34)return '#FFB000';
  return '#FFC94D';
}

export function useSun():Sun|null{
  const [sun,setSun]=useState<Sun|null>(null);
  useEffect(()=>{
    const tick=()=>{
      const now=new Date(),tz=tzHours(now),p=parts(now);
      const mins=p.hh*60+p.mm;
      const cur=position(p,tz,mins),rs=riseSet(p,tz);
      const rising=cur.az<180;
      const [a,b]=sky(cur.el,rising);
      const phase:Sun['phase']=cur.el<-6?'night':cur.el<4?(rising?'dawn':'dusk'):'day';
      // Shadow falls opposite the sun. az 0°=N, 90°=E; screen x is east, screen y is south (toward the viewer).
      const len=Math.min(26,Math.max(4,16/Math.tan(rad(Math.max(cur.el,6)))));
      const root=document.documentElement.style;
      root.setProperty('--sun-el',cur.el.toFixed(2));
      root.setProperty('--sun-az',cur.az.toFixed(1));
      root.setProperty('--daylight',String(Math.max(0,Math.min(1,(cur.el+6)/34)).toFixed(3)));
      root.setProperty('--sky-a',a);
      root.setProperty('--sky-b',b);
      root.setProperty('--solar',warmth(cur.el));
      const lit=cur.el>0;
      root.setProperty('--shadow-x',(lit?-Math.sin(rad(cur.az))*len:0).toFixed(1)+'px');
      root.setProperty('--shadow-y',(lit?Math.cos(rad(cur.az))*len:13).toFixed(1)+'px');
      document.documentElement.dataset.phase=phase;
      setSun({el:cur.el,az:cur.az,phase,time:hhmm(p.hh+p.mm/60),
        rise:rs?hhmm(rs.rise):'—',noon:rs?hhmm(rs.noon):'—',set:rs?hhmm(rs.set):'—',
        progress:rs?Math.max(0,Math.min(1,(mins/60-rs.rise)/(rs.set-rs.rise))):0});
    };
    tick();
    const id=window.setInterval(tick,300000);
    return()=>window.clearInterval(id);
  },[]);
  return sun;
}

/** Mounts the light engine. Nothing is drawn any more: the clock rail on the right margin and the
 * per-section day stamps came off on 21 Sep 2026. `useSun` still runs, because it is what writes
 * --solar, --sky-a/b, --daylight and the shadow offsets onto <html> — the page's colour still tracks
 * the real sun over Wodonga, it just no longer says so in numbers. One instance, in the header. */
export function SunLayer(){
  useSun();
  return null;
}

/* DayStamp lived here: the per-section "06:04 / First light" markers, plus a once-a-day cache of
 * today's rise, noon and set times that only those markers read. Both removed 21 Sep 2026. */
