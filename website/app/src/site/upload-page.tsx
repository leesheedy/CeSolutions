/* /upload?t=<token>: where the link in the "what to send us" checklist email lands. Four slots (bill, roof,
 * meter box, battery spot) that post to Netlify Forms as `checklist-upload`; the token rides along as `ref` so
 * the team email can say whose files they are and the reminders stop. Photos are shrunk exactly as on the
 * enquiry form. The page is prerendered so Netlify registers the form; the token is read on the client. */
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {ArrowRight,Check,Phone} from 'lucide-react';
import {Header,Footer} from './shell';
import {FILES,MAX_BYTES,fmtSize,post,shrink} from './quote-form';
import {PageHero,PHONE,PHONE_HREF} from './sections';

type Picked={name:string;size:number;file:File;busy?:boolean};
export function UploadPage(){
  const [token,setToken]=useState('');
  // unknown until the link has been checked; a link the site cannot match still uploads, the team is told so.
  const [who,setWho]=useState<{first:string;known:boolean}|null>(null);
  const [files,setFiles]=useState<Record<string,Picked>>({});
  const [state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle');
  const doneRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const t=new URLSearchParams(location.search).get('t')??'';
    let live=true;
    void (async()=>{
      let first='',known=false;
      if(/^[a-f0-9]{32}$/.test(t)){
        // A lookup that fails outright (offline, a blip) is not treated as a bad link.
        try{const r=await fetch('/api/checklist-link?a=info&t='+t);const d=r.ok?await r.json() as {ok:boolean;first?:string}:{ok:false,first:''};first=d.first??'';known=!!d.ok;}catch{known=true;}
      }
      if(live){setToken(t);setWho({first,known});}
    })();
    return()=>{live=false;};
  },[]);
  useEffect(()=>{if(state==='sent'){doneRef.current?.scrollIntoView({block:'center'});doneRef.current?.focus({preventScroll:true});}},[state]);
  const picked=Object.values(files),preparing=picked.some(f=>f.busy);
  const tooBig=picked.some(f=>!f.busy&&f.size>MAX_BYTES);
  const overTotal=!tooBig&&!preparing&&picked.reduce((n,f)=>n+f.size,0)>MAX_BYTES;
  const pick=(name:string,file:File|undefined)=>{
    if(!file){setFiles(prev=>{const n={...prev};delete n[name];return n;});return;}
    setFiles(prev=>({...prev,[name]:{name:file.name,size:file.size,file,busy:true}}));
    void shrink(file).then(small=>setFiles(prev=>prev[name]?.file===file?{...prev,[name]:{name:small.name,size:small.size,file:small}}:prev));
  };
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!picked.length||tooBig||overTotal||preparing)return;
    setState('sending');
    const fd=new FormData(e.currentTarget);
    for(const [name] of FILES){const f=files[name];if(f)fd.set(name,f.file,f.file.name);else fd.delete(name);}
    setState(await post(fd,45_000)?'sent':'error');
  }
  return <><Header/><main id="main">
    <PageHero crumbs={[{label:'Home',href:'/'},{label:'Send your files'}]} lines={who?.first?[`Hi ${who.first}, send us`,'your bill and photos.']:['Send us your bill','and photos.']} intro="Add whatever you have handy. One item is enough to get started, and you can come back to this page to send more."/>
    <section className="bg-stone py-14 md:py-20"><div className="wrap"><div className="mx-auto max-w-[680px]">
      {who&&!who.known&&<p className="qf__err mb-4" role="status">We couldn’t match this link to a request, so please make sure the address in your browser is the full link from our email. You can still send files here, or reply to the email with them attached.</p>}
      <div>{state==='sent'?
        <div ref={doneRef} tabIndex={-1} className="qf qf--done" role="status"><span className="qf__tick"><Check size={28} aria-hidden="true"/></span><h3>Got them, thanks.</h3><p>Your files are with the team in Wodonga. Our solar consultant will be in touch within one business day. If it’s urgent, ring <a href={PHONE_HREF}>{PHONE}</a>.</p></div>:
        <form className="qf" name="checklist-upload" method="POST" action="/upload?sent=1" encType="multipart/form-data" data-netlify="true" data-netlify-honeypot="company" onSubmit={submit} aria-busy={state==='sending'}>
          <input type="hidden" name="form-name" value="checklist-upload"/>
          <input type="hidden" name="ref" value={token} readOnly/>
          <p className="qf__hp" aria-hidden="true" inert><label>Company<input name="company" tabIndex={-1} autoComplete="off"/></label></p>
          <fieldset className="qf__step"><legend className="qf__q">What can you send?<small>A photo from your phone is fine for all of these</small></legend>
            <div className="qf__files">{FILES.map(([name,label,accept])=>{const f=files[name];const big=!!f&&!f.busy&&f.size>MAX_BYTES;return <label key={name} className={big?'qf__file is-bad':f?'qf__file is-on':'qf__file'}><input type="file" name={name} accept={accept} onChange={e=>pick(name,e.target.files?.[0])}/><span className="qf__file-icon">{f&&!big&&!f.busy?<Check size={18} aria-hidden="true"/>:'+'}</span><span className="qf__file-text"><strong>{label}</strong><em>{f?(f.busy?'Preparing photo…':big?`Too big (${fmtSize(f.size)}) — max 7.5 MB`:`${f.name} · ${fmtSize(f.size)}`):'Tap to add a photo or file'}</em></span></label>;})}</div>
          </fieldset>
          <div className="qf__nav"><button type="submit" className="qf__next" disabled={state==='sending'||!picked.length||tooBig||overTotal||preparing}>{state==='sending'?'Sending…':preparing?'Preparing photos…':'Send to CES'}<ArrowRight size={18} aria-hidden="true"/></button></div>
          {overTotal&&<p className="qf__err" role="alert">Together these files are over 7.5 MB. Send them in two goes: remove one, send, then come back for the rest.</p>}
          {tooBig&&<p className="qf__err" role="alert">One of the files is over 7.5 MB. Please pick a smaller one or leave it out.</p>}
          {state==='error'&&<p className="qf__err" role="alert">That didn’t send. Check your connection and try again, or reply to our email with the files attached, or call <a href={PHONE_HREF}>{PHONE}</a>.</p>}
          <p className="qf__note">Your files go only to CES in Wodonga.</p>
        </form>}
      </div>
      <p className="mt-8 flex items-center gap-2.5 text-[15.5px] text-muted"><Phone size={17} aria-hidden="true"/>Rather talk it through? Call <a className="font-semibold text-ink underline underline-offset-2" href={PHONE_HREF}>{PHONE}</a>.</p>
    </div></div></section>
  </main><Footer/></>;
}
