# Digital Pillars — Motion Site V3

A fixed-viewport, cinematic digital-agency presentation inspired by the supplied reference video. It is intentionally not a conventional long scrolling website.

## Interaction model
- Wheel / trackpad: advance between five cinematic scenes.
- Touch swipe: advance scenes.
- Arrow/Page keys: navigate scenes.
- Service cards are real links to dedicated pages.
- Small AI assistant dock opens a click-only FAQ modal.
- Review arrows change the testimonial card.
- Brief opens a functional mailto contact form.
- Pointer tilt + magnetic CTAs are enabled only for fine pointers.

## Native 3D
The hero object is rendered in WebGL from procedural geometry. It is not a static AI image. The renderer includes translucent-looking faceted pillar geometry, particles, depth, lighting and scene-specific camera movement.

## Deploy
Static site. No Next.js. In Vercel choose Framework = Other, Root Directory = folder containing index.html, Build Command = npm run build, Output Directory = .
