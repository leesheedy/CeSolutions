/* Magic UI "Bento Grid" (listed on 21st.dev as magicui/bento-grid), from magicui.design/r/bento-grid.json.
 * Changes: the whole card is the link (one tab stop, a full-size hit area), the call to action is always
 * visible instead of appearing on hover (hover does not exist on a phone), and colours come from the site
 * tokens rather than neutral-*. */
import type {ComponentPropsWithoutRef,ElementType,ReactNode} from 'react';
import {ArrowRight} from 'lucide-react';
import {cn} from '@/lib/utils';

export function BentoGrid({children,className,...props}:ComponentPropsWithoutRef<'div'>){
  return <div className={cn('grid w-full grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem]',className)} {...props}>{children}</div>;
}

export function BentoCard({name,className,background,Icon,description,href,cta,tone='light'}:{name:string;className?:string;background?:ReactNode;Icon:ElementType;description:string;href:string;cta:string;tone?:'light'|'dark'}){
  const dark=tone==='dark';
  return <a href={href} className={cn('group relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl transition-shadow duration-300',background?'min-h-[18rem]':'md:min-h-[17rem]',dark?'bg-night text-white':'bg-white text-ink ring-1 ring-line hover:shadow-[0_24px_48px_-28px_rgba(10,29,43,.35)]',className)}>
    {background&&<div className="absolute inset-0">{background}</div>}
    <span className={cn('relative z-10 m-6 mb-0 grid size-11 flex-none md:m-7 md:mb-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-90',dark?'bg-white/12 text-mint backdrop-blur':'bg-tint text-brand')}><Icon size={22} strokeWidth={1.75} aria-hidden="true"/></span>
    <div className="relative z-10 flex flex-col gap-2 p-6 md:p-7">
      <h3 className="text-[1.4rem] leading-tight font-bold tracking-tight">{name}</h3>
      <p className={cn('max-w-[46ch] text-[15.5px] leading-relaxed',dark?'text-white/80':'text-muted')}>{description}</p>
      <span className={cn('mt-2 inline-flex items-center gap-2 text-[15px] font-semibold',dark?'text-mint':'text-brand')}>{cta}<ArrowRight size={17} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1"/></span>
    </div>
  </a>;
}
