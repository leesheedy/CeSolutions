/* Property-address combobox. Suggestions come from Google Places (Autocomplete New + Place Details) when
 * VITE_GOOGLE_PLACES_KEY is set at build time, otherwise from Photon (OpenStreetMap, no key). Either way the
 * visible input stays a plain required text field named `address`, so typing an address by hand still works
 * and the no-JS POST is unchanged. Picking a suggestion also fills hidden suburb/state/postcode fields.
 * OpenStreetMap knows most streets here but few house numbers, so a typed number (or unit, "3/14") is split
 * off, the street is looked up on its own, and the number is put back on the front of every suggestion. */
import {useEffect,useId,useRef,useState} from 'react';
import {Check,MapPin} from 'lucide-react';

type Suggestion={id:string;main:string;secondary:string;full:string;suburb?:string;state?:string;postcode?:string};
type Parts={suburb:string;state:string;postcode:string};
const KEY=import.meta.env.VITE_GOOGLE_PLACES_KEY as string|undefined;
const PROVIDER:'google'|'osm'=KEY?'google':'osm';
// Bias results toward the Wodonga office; covers Albury-Wodonga, Wagga, Shepparton and Yarrawonga comfortably.
const OFFICE={lat:-36.121,lng:146.888},RADIUS_M=250_000;
/** sessionStorage key for the address draft; the enquiry form clears it once the enquiry is sent. */
export const ADDRESS_DRAFT='ces-enquiry-address';
// Mainland Australia and Tasmania, as Photon's bbox (minLon,minLat,maxLon,maxLat).
const AU_BBOX='112.9,-43.8,153.7,-9.2';
// "12", "12A", "1/11", "1-11", "Unit 1, 11", "Flat 3/14", "Lot 5", followed by at least the start of a street name.
const NUMBER=/^\s*((?:(?:unit|flat|apt|shop|lot|u)\.?\s*)?\d+[a-z]?(?:\s*[/-]\s*\d+[a-z]?|\s*,?\s+\d+[a-z]?(?=[\s,]))?)[\s,]+(\S.{2,})$/i;
const WORDS:Record<string,string>={unit:'Unit',u:'Unit',flat:'Flat',apt:'Apt',shop:'Shop',lot:'Lot'};
/** Splits "1/11 smith st" into the unit/house number ("1/11") and the street to look up ("smith st"). */
export function splitNumber(q:string):{number?:string;street:string}{
  const m=NUMBER.exec(q);if(!m)return {street:q};
  const number=m[1].replace(/\s*([/-])\s*/g,'$1').replace(/^([a-z]+)\.?\s*/i,(_,w:string)=>(WORDS[w.toLowerCase()]??w)+' ').replace(/\s+/g,' ').trim();
  return {number,street:m[2]};
}
const STATE_ABBR:Record<string,string>={'New South Wales':'NSW',Victoria:'VIC',Queensland:'QLD','South Australia':'SA','Western Australia':'WA',Tasmania:'TAS','Northern Territory':'NT','Australian Capital Territory':'ACT'};

async function suggestGoogle(q:string,token:string,signal:AbortSignal):Promise<Suggestion[]>{
  const res=await fetch('https://places.googleapis.com/v1/places:autocomplete',{method:'POST',signal,headers:{'Content-Type':'application/json','X-Goog-Api-Key':KEY!},body:JSON.stringify({input:q,sessionToken:token,includedRegionCodes:['au'],languageCode:'en-AU',locationBias:{circle:{center:{latitude:OFFICE.lat,longitude:OFFICE.lng},radius:RADIUS_M}}})});
  if(!res.ok)throw new Error(String(res.status));
  const data=await res.json() as {suggestions?:{placePrediction?:{placeId:string;text:{text:string};structuredFormat?:{mainText:{text:string};secondaryText?:{text:string}}}}[]};
  return (data.suggestions??[]).flatMap(s=>{const p=s.placePrediction;if(!p)return [];return [{id:p.placeId,main:p.structuredFormat?.mainText.text??p.text.text,secondary:p.structuredFormat?.secondaryText?.text??'',full:p.text.text}];});
}
async function detailsGoogle(id:string,token:string):Promise<Partial<Parts>&{full?:string}>{
  const res=await fetch(`https://places.googleapis.com/v1/places/${id}?sessionToken=${token}`,{headers:{'X-Goog-Api-Key':KEY!,'X-Goog-FieldMask':'formattedAddress,addressComponents'}});
  if(!res.ok)return {};
  const d=await res.json() as {formattedAddress?:string;addressComponents?:{types:string[];longText:string;shortText:string}[]};
  const find=(t:string)=>d.addressComponents?.find(c=>c.types.includes(t));
  return {full:d.formattedAddress,suburb:find('locality')?.longText,state:find('administrative_area_level_1')?.shortText,postcode:find('postal_code')?.longText};
}
async function suggestOsm(q:string,signal:AbortSignal):Promise<Suggestion[]>{
  const {number,street:lookFor}=splitNumber(q);
  const res=await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(lookFor)}&limit=15&lang=en&lat=${OFFICE.lat}&lon=${OFFICE.lng}&bbox=${AU_BBOX}&layer=house&layer=street`,{signal});
  if(!res.ok)throw new Error(String(res.status));
  const data=await res.json() as {features:{properties:Record<string,string|undefined>}[]};
  const seen=new Set<string>();
  return data.features.flatMap(({properties:p})=>{
    if(p.countrycode!=='AU')return [];
    const street=p.street??(p.osm_key==='highway'?p.name:undefined);
    const suburb=p.district??p.city??p.locality??p.town??p.village;
    if(number&&!street)return [];
    const main=number?number+' '+street:[p.housenumber,street].filter(Boolean).join(' ')||p.name||'';
    if(!main)return [];
    const state=p.state?STATE_ABBR[p.state]??p.state:undefined;
    const secondary=[suburb,state,p.postcode].filter(Boolean).join(' ');
    const full=[main,secondary].filter(Boolean).join(', ');
    if(seen.has(full))return [];seen.add(full);
    return [{id:full,main,secondary,full,suburb,state,postcode:p.postcode}];
  }).slice(0,6);
}

export function AddressField(){
  const listId=useId();
  const [value,setValue]=useState('');
  const [parts,setParts]=useState<Parts>({suburb:'',state:'',postcode:''});
  const [items,setItems]=useState<Suggestion[]>([]);
  const [open,setOpen]=useState(false);
  const [hi,setHi]=useState(-1);
  const [pending,setPending]=useState(false);
  const [flip,setFlip]=useState(false);
  const [busy,setBusy]=useState(false);
  const [none,setNone]=useState(false);
  const [left,setLeft]=useState(false);
  // Suggestions only show while the field has focus: left open after tabbing away, the list sat over the
  // Continue button and a tap on it picked an address instead.
  const [focused,setFocused]=useState(false);
  const cancel=()=>{abort.current?.abort();window.clearTimeout(timer.current);setBusy(false);setPending(false);setOpen(false);setNone(false);};
  const token=useRef<string>('');
  const abort=useRef<AbortController|null>(null);
  const timer=useRef<number|undefined>(undefined);
  const rootRef=useRef<HTMLDivElement>(null);
  const chosen=useRef<string>('');
  useEffect(()=>{const close=(e:PointerEvent)=>{if(!rootRef.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[]);
  // The address is kept for the visit, like the rest of the form, so a refresh doesn't lose it.
  const restored=useRef(false);
  useEffect(()=>{
    try{const d=JSON.parse(sessionStorage.getItem(ADDRESS_DRAFT)||'null') as {value?:string;parts?:Parts}|null;if(d?.value){chosen.current=d.value;setValue(d.value);if(d.parts)setParts(d.parts);}}catch{/* storage blocked or malformed: start empty */}
    restored.current=true;
  },[]);
  useEffect(()=>{if(!restored.current)return;try{if(value)sessionStorage.setItem(ADDRESS_DRAFT,JSON.stringify({value,parts}));else sessionStorage.removeItem(ADDRESS_DRAFT);}catch{/* ignore */}},[value,parts]);
  function search(q:string){
    abort.current?.abort();window.clearTimeout(timer.current);
    if(q.trim().length<3){setItems([]);setOpen(false);setBusy(false);setPending(false);setNone(false);return;}
    setBusy(true);setPending(true);setNone(false);
    timer.current=window.setTimeout(async()=>{
      const ctl=new AbortController();abort.current=ctl;
      if(!token.current)token.current=crypto.randomUUID();
      try{const found=PROVIDER==='google'?await suggestGoogle(q,token.current,ctl.signal):await suggestOsm(q,ctl.signal);if(ctl.signal.aborted)return;setItems(found);setOpen(found.length>0);setNone(found.length===0);setHi(found.length===1?0:-1);}
      catch(err){if((err as Error).name!=='AbortError'){setItems([]);setOpen(false);}}
      finally{if(!ctl.signal.aborted){setBusy(false);setPending(false);}}
    },220);
  }
  async function choose(s:Suggestion){
    setOpen(false);setItems([]);setNone(false);chosen.current=s.full;setValue(s.full);
    let p:Partial<Parts>&{full?:string}={suburb:s.suburb,state:s.state,postcode:s.postcode};
    if(PROVIDER==='google'){p=await detailsGoogle(s.id,token.current);token.current='';if(p.full){chosen.current=p.full;setValue(p.full);}}
    setParts({suburb:p.suburb??'',state:p.state??'',postcode:p.postcode??''});
  }
  function onKey(e:React.KeyboardEvent<HTMLInputElement>){
    if(e.key==='Escape'&&(pending||open)){e.stopPropagation();cancel();return;}
    if(e.key==='Enter'&&pending){e.preventDefault();e.stopPropagation();return;}
    if(!open||items.length===0)return;
    if(e.key==='ArrowDown'){e.preventDefault();setHi(h=>(h+1)%items.length);}
    else if(e.key==='ArrowUp'){e.preventDefault();setHi(h=>(h-1+items.length)%items.length);}
    else if(e.key==='Enter'){if(hi>=0){e.preventDefault();e.stopPropagation();void choose(items[hi]);}}
    else if(e.key==='Tab'&&!e.shiftKey&&hi>=0)void choose(items[hi]);
  }
  const expanded=focused&&((open&&items.length>0)||busy||none);
  const statusId=listId+'-status';
  const found=[parts.suburb,parts.state,parts.postcode].filter(Boolean).join(' ');
  // Typed by hand with no postcode in it: ask for one, but never block the form over it.
  const vague=!found&&left&&!focused&&value.trim().length>0&&!/\b\d{4}\b/.test(value);
  useEffect(()=>{
    if(!expanded)return;
    const input=rootRef.current?.querySelector('input[name=address]');
    if(!input)return;
    const below=window.innerHeight-input.getBoundingClientRect().bottom-72; // 72px clears the mobile dock
    setFlip(below<220);
  },[expanded,items.length]);
  return <div ref={rootRef} className="addr">
    <label className="qf__field qf__field--wide"><span>Property address</span>
      <input name="address" value={value} onChange={e=>{setValue(e.target.value);if(e.target.value!==chosen.current)setParts({suburb:'',state:'',postcode:''});search(e.target.value);}} onFocus={()=>{setFocused(true);if(items.length)setOpen(true);}} onBlur={()=>{setFocused(false);setLeft(true);setOpen(false);setNone(false);}} onKeyDown={onKey} autoComplete="street-address" required maxLength={200} placeholder="Start typing your street address" role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={listId} aria-describedby={found||vague?statusId:undefined} aria-activedescendant={expanded&&hi>=0?`${listId}-${hi}`:undefined} data-busy={busy||undefined}/>
    </label>
    {found?<p id={statusId} className="addr__status is-ok"><Check size={15} aria-hidden="true"/>Found it: {found}</p>:vague?<p id={statusId} className="addr__status">Please add your suburb or postcode so we quote the right property.</p>:null}
    <input type="hidden" name="suburb" value={parts.suburb}/><input type="hidden" name="state" value={parts.state}/><input type="hidden" name="postcode" value={parts.postcode}/>
    <ul id={listId} role="listbox" aria-label="Address suggestions" tabIndex={-1} className={flip?"addr__list is-above":"addr__list"} hidden={!expanded}>{busy&&items.length===0&&<li className="addr__busy" aria-live="polite">Searching…</li>}
      {items.map((s,i)=><li key={s.id} id={`${listId}-${i}`} role="option" aria-selected={i===hi} className={i===hi?'is-hi':''} onPointerDown={e=>e.preventDefault()} onClick={()=>void choose(s)} onPointerMove={()=>setHi(i)}><MapPin size={16} aria-hidden="true"/><span><strong>{s.main}</strong>{s.secondary&&<em>{s.secondary}</em>}</span></li>)}
      {none&&!busy&&<li className="addr__busy" aria-live="polite">No match yet. Keep typing, or just enter the full address yourself.</li>}
      <li className="addr__credit" aria-hidden="true">{PROVIDER==='google'?'Suggestions by Google':'Suggestions © OpenStreetMap contributors'}</li>
    </ul>
  </div>;
}
