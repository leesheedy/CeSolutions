import {createFileRoute} from '@tanstack/react-router';
import {Header,Footer} from '@/site/shell';
import {pageHead} from '@/site/content';
export const Route=createFileRoute('/privacy')({head:()=>pageHead('Privacy Policy | Clean Energy Solutions','How Clean Energy Solutions handles the details you send through this website: what we collect, why, who sees it and how to contact us about it.','/privacy'),component:Privacy});
/* Plain-language statement of what this site actually does with visitor data. Keep it in step with the
 * enquiry form (quote-form.tsx), the address suggestions (address-field.tsx) and the checklist email
 * (netlify/functions/send-checklist.mjs). CES should have it checked before launch. */
function Privacy(){return <><Header/><main id="main" className="wrap legal-page"><h1>Privacy policy</h1><p className="legal-page__lede">Clean Energy Solutions (CES), 79 Elgin Boulevard, Wodonga VIC 3690, runs this website. This page explains what we collect when you use it and what we do with it. Last updated 20 September 2026.</p>
<h2>What we collect</h2><p>When you send an enquiry we collect your name, phone number, suburb or postcode, the service you select, and any optional email address or message you provide. The enquiry form does not request bills, photos or other file uploads.</p>
<h2>Why we collect it</h2><p>To design a system for your property, prepare your quote, apply for rebates on your behalf where you ask us to, and contact you about your enquiry. We do not sell or rent your details, and we do not use them for marketing you have not asked for.</p>
<h2>Who handles it</h2><p>Netlify hosts this site and receives form submissions on our behalf. Submissions are stored there while we work on your enquiry. The form does not send your typed address to a mapping service.</p>
<h2>Cookies and analytics</h2><p>This site does not set tracking cookies and does not currently run analytics. If that changes, this page will say what is used and why.</p>
<h2>Your details, your call</h2><p>You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Email <a href="mailto:info@cesolutions.com.au">info@cesolutions.com.au</a> or call <a href="tel:+61260212000">(02) 6021 2000</a>. We handle personal information in line with the Australian Privacy Principles.</p>
</main><Footer/></>}
