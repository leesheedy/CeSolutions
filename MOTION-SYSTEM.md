# CES — A day of solar
## Cinematic motion system · 20 September 2026

**Deliverable:** a design and implementation specification for the current local CES website. This document defines the target behaviour; it does not claim these changes have been implemented or deployed.

**Creative direction:** calm, precise, locally grounded. Energy moves through the experience as daylight becomes useful power. Photography establishes trust; motion explains relationships. Visitors should remember the team, the work and the next step.

### 1. Concept and current baseline
Brand essence: **confidence**. Visual tension: the stillness of real roofs and people against a small, purposeful movement of light. Signature moment: an illustrative roof receives daylight, then the energy diagram explains how generation supports the home and storage. Technical ambition: one restrained scene with deterministic controls and a complete static equivalent.

The current local source already contains Motion-based reveals and parallax, GSAP diagram choreography, a projected 3D roof drawn on Canvas 2D, moving brand/review rows, and a Wodonga solar clock. It differs from the September 14 cloud export. This specification is grounded in that current source.

**Provisional motion-design assessment: 7/10, from source inspection, not a new browser audit.** The ingredients are coherent, but control and pacing need consolidation. To reach the intended standard: remove overlapping ambient loops; replace moving body copy with stable reading surfaces; stop counting trust figures from zero; make the roof demonstration user-controlled; provide motion preference handling for every controller. A 10/10 craft assessment would require visual tuning and physical-device validation.

### 2. The motion language
- **Arrive:** settle upward by a small distance. Headlines establish hierarchy; supporting text follows.
- **Connect:** a fine solar-coloured rule links chapters and becomes a diagram connection where it explains energy flow.
- **Focus:** one image or diagram gets depth while adjacent text stays still.
- **Respond:** controls acknowledge the action immediately, then settle quickly.
- **Rest:** reading, comparing, estimating and completing a form are deliberately quiet.

Use the current CES colour/type tokens. Solar amber marks activity; ink and paper carry information. Do not animate body-text colour through low-contrast intermediate states.

**Three attention levels:** one signature scene; occasional section introductions; brief control feedback. Never run two dominant scenes in one viewport. A control response can interrupt decorative movement immediately.

### 3. Shared motion tokens
All duration numbers below are design targets, not measured browser guarantees.

| Token | Value | Use |
|---|---|---|
| instant | 0 ms | Focus, errors, selection state, reduced motion |
| press | 90 ms | Button depression |
| response | 160 ms | Hover, selection, tooltip |
| interface | 240 ms | Menus, dialogs, form-step settlement |
| reveal | 560 ms | Headings, images, one-time entrances |
| cinema | 900 ms | A deliberate camera settle |
| stagger | 60 ms | Adjacent items; maximum three delayed starts |
| E-settle | cubic-bezier(.22, 1, .36, 1) | Entrances and release |
| E-interface | cubic-bezier(.2, .7, .2, 1) | Controls and panels |
| E-exit | cubic-bezier(.4, 0, 1, 1) | Short departures |
| E-camera | cubic-bezier(.45, 0, .2, 1) | Camera and intentional scene transitions |
| Scroll mapping | 1:1 progress | Scroll and drag follow the user's position; no decorative easing curve |

Translation vocabulary: 2px control feedback, 8px supporting entrance, 16px heading entrance, 24px maximum decorative image drift. Reverse directions return to the original position. No bounce, overshoot, whip pans, elastic text, pointer-following cursor or magnetic hit targets.

A scrubbed animation has a **scroll range**, not a fixed duration. Its authored timeline length is only a normalization unit. Direct input outranks cinematic timing. Native scrolling remains intact.

### 4. Page entrance and hero score
At the first rendered frame, navigation, headline, actions and a reserved hero image box are available. No logo loader, full-screen curtain or artificial wait.

Enhancement runs only if mounted within 150ms of first content paint, the hero is visible and the visitor has not scrolled, focused a control or followed a hash. Otherwise show the settled state. This prevents a late script from hiding already-visible content.

| Time from enhancement start | Action |
|---|---|
| 0 ms | Keep header and quote/estimate actions stationary. Start headline line 1 at y=16px, opacity=1 → y=0. |
| 60 / 120 ms | Start headline lines 2 / 3, if present, using the same 560ms E-settle curve. |
| 140 ms | Supporting paragraph settles y=8px → 0 over 400ms. Keep it fully readable. |
| 200 ms | Hero photograph settles scale=1.018 → 1 over 900ms E-camera. |
| By 1,100 ms | All entrance motion is finished; the interface rests. |

On mobile: line duration 400ms, stagger 40ms, y=8px; omit the photograph settle. On subsequent navigation: only the page title may settle 8px over 240ms. Browser back/forward restores position without replaying the introduction.

Hero scroll: while its top moves from the viewport top to its bottom reaching the header, the image drifts 0 → 24px downward inside an overscanned crop. Headline, trust information and buttons follow normal document flow. No opacity fade on actionable content. Disable this drift on touch and reduced-motion modes.

### 5. Master animation catalogue
**Shared entry trigger E:** the element's top crosses 84% of viewport height while scrolling forward. Play once per mount; retain the final state when returning upward. If deep-linked or already visible when enhancement starts, settle immediately. Fast scrolling completes pending reveals instead of queueing them.

| ID / surface | Trigger and sequence | Timing / easing / direction | Relationship to action |
|---|---|---|---|
| M01 Page entrance | First eligible mount → headline → support → photograph, as above | 0–1,100ms; E-settle/E-camera; upward text, small image pullback | Interaction cancels outstanding decorative entrances. |
| M02 Hero scroll | Hero enters its scroll range → photo drift | 24px total; 1:1 scroll, optional ≤100ms settle | Reverses with scroll; stops when scroll stops. No pin. |
| M03 Section heading | E → kicker already present → heading lines → short support block | 560ms; 60ms line stagger; support at +120ms/400ms; E-settle; y=16/8→0 | One-time hierarchy cue; paragraphs remain visible. |
| M04 Section handoff | Next section top crosses 90% → 65% of viewport | Decorative rule scaleX=0→1, left origin, direct scroll | Bridges chapters; backgrounds remain fixed, readable surfaces. |
| M05 Service depth | Next service card top moves from 85% → 45% viewport | Previous card's image-only wrapper scale 1→.98; direct scroll | Indicates the next option. Copy and links never shrink or become covered. |
| M06 Project reveal | E → photograph → caption | Photo y=12→0/560ms; caption y=6→0/360ms starts +80ms; E-settle | Reading order matches DOM order; no masonry-wide cascade. |
| M07 Photo parallax | Image top reaches 90% → bottom reaches 10% viewport | Inner image y=-12→12px; scale just sufficient for crop; direct scroll | Decorative only; reverses; off on touch. Never applied to faces in close portraits. |
| M08 Gallery filter | Click/keyboard selection → pressed state → new results | Selection immediate; matching images opacity .85→1 over 160ms E-interface; layout changes once | Keep focus on selected filter; announce final count once. No height tween or stagger delay. |
| M09 Show more | Activation → append cards in DOM order | Newly visible cards y=8→0/240ms E-settle; max 60ms stagger across first 3 | Existing cards stay still. Announce added count; keep the triggering control stable. |
| M10 Photo lightbox | Activate photo → labelled dialog → focus close control | Backdrop opacity 0→1/160ms; image scale .985→1/240ms E-settle | No flying shared-element transition. Close 120ms E-exit, restore trigger focus. |
| M11 Roof camera | “Explore a solar day” activation → single camera settle → ready scene | 900ms E-camera; ≤6° orbit, ≤5% dolly; no roll | Begins only on request; camera then locks while the user examines the day. |
| M12 Roof daylight | Drag time slider, choose Morning/Noon/Evening, or press Play | Drag: immediate. Preset: 360ms E-interface. Play: 2,400ms constant simulation speed | Slider changes light/shadow, not roof geometry. Play once; Pause/Replay available. |
| M13 Energy diagram | Diagram top 78% → bottom 40% viewport → connector emphasis | Six normalized beats; direct scroll, settle ≤100ms; links in flow direction | Static full diagram is always readable. User selection takes ownership until “Follow scroll” is activated. |
| M14 Diagram selection | Activate an accessible node button → selected node → detail | Node border immediate; detail opacity .85→1 over 160ms E-interface | Reading content does not auto-change after manual selection. Focus stays on button. |
| M15 Estimator | Slider/input change → immediate model result → optional meter settlement | Value immediately accurate; bar scaleX settles in 120ms E-interface from left | No rolling digits. Announce result on committed change, not each drag frame. |
| M16 Process sequence | Each process row enters at 78% viewport | Rule scaleY 0→1/360ms; row y=8→0/400ms at +60ms; E-settle | Reinforces order without requiring an extra pinned scroll sequence. |
| M17 Reviews / proof | Review enters viewport | Container y=8→0/400ms E-settle; rating/count static from first paint | No counters from zero and no automatic movement of review text. |
| M18 Brand row | Static row becomes visible; optional next/previous action | Manual carousel scroll only; approximately 240ms E-interface when script-controlled | Autoplay disabled. Keyboard and touch navigation available; all names readable. |
| M19 Header / nav | Scroll past 12px, open a menu, or follow a link | Header border opacity settles 160ms; menu y=-6→0/200ms E-interface | Header size stays fixed. Dropdown responds on click/keyboard; closes on Escape. |
| M20 Mobile menu | Button activation → panel appears → links available | Panel y=-8→0/240ms E-interface; close 160ms E-exit; no link cascade | Update expanded state immediately. Prevent focus reaching background if modal. |
| M21 Hover / button | Pointer enters or focus-visible; press/release | Arrow +3px horizontally/160ms E-interface; inner visual press scale 1→.985/90ms; release 160ms E-settle | Hit area and focus ring stay fixed. Touch gets press feedback, never sticky hover. |
| M22 FAQ | Summary activation → native expanded state and answer | Answer opens immediately; plus rotates 0→45°/160ms E-interface | Content height changes naturally; no height animation or automatic scroll. |
| M23 Quote step | Valid Continue/Back → content swap → step heading focus | New panel x=±8→0, opacity .9→1/200ms E-interface | Forward from right; Back from left. Preserve values; validation errors shown immediately. |
| M24 Form feedback | Focus, invalid input, attachment choice, actual request result | Focus/error immediate; attachment check 120ms; result y=6→0/200ms E-settle | No shaking, confetti or success before confirmed delivery. Email preparation uses “ready,” never “sent.” |
| M25 Loading | Actual outstanding request lasts >200ms → stable status | Text appears at 200ms, no direction; optional 160ms opacity settlement | Use “Loading…”/“Sending…” only for real work; preserve button width and prevent duplicate submission. |
| M26 Page change | Link activation → destination content ready → title | Navigate immediately; incoming title y=8→0/240ms E-settle | No exit gate. Preserve browser history, anchor positioning and destination focus. |
| M27 Final CTA / footer | E on final CTA | One y=8→0/400ms E-settle; border/rule at +80ms/240ms | End the narrative in stillness; phone, address and links remain stationary. |

For all opacity ranges, essential text remains at full contrast. Opacity treatment is for nonessential wrappers/images or transitions between already-labelled states. Focused elements and ancestors snap to their final visible transform before focus is rendered.

### 6. Signature roof scene: camera, object and light
Use the existing projected Canvas 2D roof; a WebGL engine is unnecessary for this composition.

**Camera:** retain target [0, .9, 0]. Initial framing may use [4.9, 2.6, 7.35], settling to the current [4.6, 2.4, 7.0]. Verify that this remains inside the orbit/dolly limits with actual framing. No camera roll, perspective pulse, device-tilt control or pointer-following motion. On mobile, use the settled framing immediately.

**Object:** roof, panels and house remain structurally fixed. Do not float panels out of position, deform roofs or turn the scene into an exploded product model. A selected panel group may receive a thin static outline; no whole-object rotation.

**Light:** a single directional light and its matching shadow tell the story. Noon shortens the shadow; evening lengthens it. Panel highlights remain restrained. Sunset may reveal a warm window as an illustrative stored-energy cue, clearly labelled rather than presented as a live battery state.

**Two distinct modes:** “Wodonga now” uses the existing current-time calculation; “Explore a solar day” is a demonstration controlled by the slider. Never silently jump from a completed demonstration back to current time. Provide an explicit “Return to now” action. Screen-reader slider text gives a time/period, not rapid per-frame captions.

The roof illustration explains orientation and daylight. It is not a generation forecast, measured system output or a photo of a CES installation.

**Fallback:** a fixed noon illustration plus an HTML description and Morning/Noon/Evening information. Canvas failure, missing JavaScript, reduced motion and low-power mode retain this explanation.

### 7. One continuous journey
1. **First light — hero and quote:** give the visitor the proposition and a direct route to action. The form stays still even while the hero settles.
2. **Morning — services:** the same solar rule introduces the options; restrained depth distinguishes each image. No pinned text stack.
3. **Solar noon — estimator and energy flow:** stop decorative parallax around inputs. The diagram owns the motion, explains the chain and respects manual selection.
4. **Afternoon — team and work:** real photos carry the story. Small image entrances echo the hero’s settling direction.
5. **Golden hour — process and reviews:** slow the pace; use still proof and readable testimonials. Motion is a cue to the next step.
6. **Stored sunlight — CTA and FAQ:** the warm accent leads to action; the page ends with stable information and support.

The current day stamps can supply chapter labels. Treat them as **story time**, separate from the optional live Wodonga clock. Do not animate the entire page from day to night as the visitor scrolls; that can contradict the live indicator and destabilize contrast.

Repeat three visual devices: the same horizontal rule, the same 8/16px upward settlement, and the same solar-coloured selected state. Section boundaries keep their current light/dark contrast; continuity comes from those shared devices, not page-wide colour washes.

### 8. Responsive and accessible behaviour
**Full mode:** viewport ≥1100px, height ≥760px, hover-capable fine pointer, no reduced-motion preference. Enables bounded image parallax and the requested roof camera settle.

**Compact mode:** all other viewports/input types. Translation is at most 8px for entrances; durations cap at 400ms. No parallax, camera travel, pinned stacks or opposing gallery-column movement. User-controlled diagrams retain immediate selection feedback.

**Reduced mode:** operating-system preference or a persistent “Reduce motion” site switch. Display final states; disable translation, scale, parallax, camera movement, scrolling marquees, ambient loops and smooth anchor scrolling. Illustrations and diagrams remain usable through instant state changes. If enabled mid-animation, cancel and settle immediately without changing scroll position or form values. System preference takes priority over a stored Full preference. The platform exposes the preference through [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

**Control and semantics:** no information exists only in motion or canvas. Keep one semantic heading per title; split-line spans must preserve the readable heading text. Native buttons, labelled controls, visible focus, Escape handling and dialog focus restoration are mandatory. No interaction depends on hover or precise dragging. Decorative elements are hidden from assistive technology. Announce committed state changes, not continuous scroll progress.

All content renders visibly before enhancement. A noscript rule alone is insufficient for a script that fails after partial initialization; every animation controller must settle visible content on cancellation/error. Off-screen links must not remain tabbable behind clipped reveal masks. Use scroll padding/margins accounting for both sticky header and mobile dock.

### 9. Loading, interruption and performance
- A photograph uses an aspect-ratio-reserved box and static colour/thumbnail while loading. Do not show a branded preloader before navigation or text.
- If a request is fast, no busy indicator flashes. If it lasts >200ms, show stable status. At 8 seconds, add “Taking longer than usual” with a safe cancellation/retry path where supported. Never fabricate percentage progress.
- On pointer/keyboard interaction, cancel unrelated entrances around the active control. On fast scroll, show final section states. On tab hiding, suspend canvas frames and optional loops; on return render the current intended state.
- Prefer transform/opacity for interface motion; they generally avoid the layout/paint work of animating geometry. Do not assume compositing is free or guaranteed. SVG drawing and canvas light/shadow are explicit, localized paint exceptions. Profile them. [Rendering guidance](https://web.dev/articles/animations-guide).
- Use native document scrolling. No added smooth-scroll library, global pointer listener or second timeline driving the same video/canvas transform.
- Existing ownership: Motion handles local entrances; GSAP handles the existing diagram; roof.tsx owns canvas drawing; CSS handles tiny controls. Do not assign a property to two engines. Split wrappers if independent transformations are essential.
- Apply will-change only shortly before an active transform and remove it afterward. Batch layout reads before writes. Measure layout on resize/content change, never inside every animation frame.
- Revert GSAP contexts/triggers when responsive or reduced-motion conditions change; clean up native listeners separately. [GSAP matchMedia documentation](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).
- Cache canvas dimensions until resize; cap pixel ratio at 1.5 initially, allowing 2 only after profiling. Stop RAF entirely when idle/off-screen. Update React captions only when the displayed label changes.
- Design budgets: ≤4 simultaneously moving visual groups; one active large painted scene; no persistent decorative loop; ≤10KB gzip additional motion-controller code, excluding already-present libraries. Lazy-load the roof/diagram enhancements near their viewport.
- Validation targets: smooth 60Hz interaction with no sustained frame drops on a representative mid-range phone; animation work under 4ms per frame at p95 in that test. These are release targets, not present measurements. If exceeded, remove camera/parallax first; preserve direct control feedback.

### 10. Implementation map and change priority
| Existing file | Target change |
|---|---|
| src/site/motion.tsx | Centralize timings/curves; make reveals progressively enhanced and cancellation-safe; stop text parallax and word-by-word opacity scrubbing; keep static trust figures. |
| src/site/sections.tsx | Apply M01–M05; remove hero copy drift and perpetual glow; preserve immediate quote access. |
| src/site/roof.tsx | Replace the automatic 4.2s day sweep with explicit demo controls; add optional one-time camera settle; separate real-time and demonstration state. |
| src/site/flow.tsx | Keep static diagram readable; finite emphasis rather than infinite pulses; accessible node controls; manual selection overrides scroll. |
| src/site/projects.tsx | Apply compact photo reveals, stable filter focus, safe lightbox transitions; avoid remount-driven whole-gallery cascades. |
| src/site/reviews.tsx | Make reviews still or manually navigated; remove automatic reading-content movement. |
| src/site/estimator.tsx | Results stay numerically current; meter settles briefly; debounce announcements, not calculation. |
| src/site/quote-form.tsx / address-field.tsx | Apply step/validation/loading states without delaying input or claiming delivery prematurely. |
| src/site/nav.tsx / shell.tsx | Stable header dimensions; keyboard-first menus; persistent site motion preference. |
| src/site/sun.tsx / src/styles.css | Keep real-time data updates distinct from story choreography; remove large animated shadows and top/height transitions; introduce shared tokens. |

Order: accessibility/fallback contract → tokens/ownership → hero and section rhythm → diagram/roof controls → gallery/forms/micro-interactions → device profiling. Preserve the vendored scroll-scrub engine; it is not mounted by the current homepage and must not be reintroduced alongside another hero timeline.

### 11. Acceptance checks
A future implementation is complete only after these pass:
- Desktop 1440×900, laptop 1280×720, tablet 768×1024, phones 390×844 and 320×568; portrait/landscape and 200% zoom.
- Keyboard-only traversal: focus never hidden by animation, menu, sticky layer, card stack or dock; no trapped focus except an open modal.
- Reduced motion before load and toggled while hero/roof/diagram/menu is active; zero residual decorative RAF after settling.
- JavaScript disabled and enhancement import deliberately failed: headlines, images, service links, reviews and contact details remain available.
- Fast scroll, reverse scroll, direct hash navigation, browser Back and background-tab resume: no replay queue, pinned-space jump or stale state.
- Repeated gallery filtering, estimator drags and quote-step changes: last action wins; no stacked tweens, duplicate announcements or reset inputs.
- Slow network/image failure: stable layout and truthful progress messages; no hidden CTA.
- Chrome/Edge, Firefox and Safari, plus physical iOS Safari and a mid-range Android device. Capture a trace of the roof, diagram and first screen; verify against budgets.
- Record before/after video at identical viewport/scroll input, keyboard observations and performance traces. Recheck contrast in every motion state, not just settled frames.

No new runtime or accessibility results are claimed by this specification. The existing audit files describe prior implementations.

