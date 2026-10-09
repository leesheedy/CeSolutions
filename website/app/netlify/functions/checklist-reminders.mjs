// Follows up people who asked for the "what to send us" checklist and have not sent anything: one reminder two
// days after the checklist, one more on day six, then it stops. Uploading through the link, the team's "Stop
// reminders" button and the customer's "No thanks" link all close the request, and only open ones are reminded.
//
// Runs every hour (cron is UTC) and only sends between 8am and 6pm Melbourne time, so a reminder lands about
// two days after the checklist at a civil hour whichever side of daylight saving it is. Scheduled functions
// only run on the published deploy.
import {REMINDER_DAYS,all,forget,nextStep,openStore,renderReminder,saveIfUnchanged,sendEmail,sender} from '../lib/checklist.mjs';

const MAX_PER_RUN=25;
const REPLY_TO=process.env.CHECKLIST_REPLY_TO||'info@cesolutions.com.au';
const melbourneHour=()=>Number(new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Melbourne',hour:'numeric',hourCycle:'h23'}).format(new Date()));

export default async()=>{
  const key=process.env.RESEND_API_KEY,from=sender();
  if(!key||!from)return;
  const hour=melbourneHour();
  if(hour<8||hour>=18)return;
  const store=openStore(),now=Date.now();
  let sent=0;
  for(const {token,rec,etag} of await all(store)){
    const step=nextStep(rec,now);
    if(step==='forget'){await forget(store,token);continue;}
    if(step==='finish'){await saveIfUnchanged(store,token,{...rec,status:'done'},etag);continue;}
    if(step==='skip'||sent>=MAX_PER_RUN)continue;
    const n=step.remind;
    // Claim the reminder before sending: if the record changed since it was read (a stop, an upload), skip it.
    const next={...rec,reminders:n,lastReminderAt:now,status:n>=REMINDER_DAYS.length?'done':'open'};
    if(!await saveIfUnchanged(store,token,next,etag))continue;
    const m=renderReminder(rec,token,n);
    if(await sendEmail(key,{from,to:[rec.email],reply_to:REPLY_TO,subject:m.subject,text:m.text,html:m.html}))sent++;
    else console.error('reminder not sent',token.slice(0,6),n);
  }
  console.log('checklist reminders sent:',sent);
};

export const config={schedule:'0 * * * *'};
