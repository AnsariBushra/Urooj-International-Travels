# Urooj International — Premium Travel Website

Built with Next.js 15 App Router, Tailwind CSS v4, GSAP + ScrollTrigger, and Lenis smooth scroll.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 (CSS-first config in `globals.css`) |
| Animation | GSAP 3 + ScrollTrigger |
| Smooth scroll | Lenis (drives GSAP's ticker, not a separate rAF) |
| Type display | Fraunces (variable, via next/font/google) |
| Type body | Inter (via next/font/google) |

## Get started locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

> Google Fonts downloads at build time — requires internet access on first run.

## Page sections (in order)

1. **Hero** — SVG iris shutter reveal, pinned scroll, background video-ready
2. **Destinations Grid** — Asymmetric 5-card editorial grid, hover image reveal
3. **Parallax Layer** × 2 — Multi-speed scroll layers (bg / image / float) via GSAP scrub
4. **Testimonials** — Auto-rotating quotes, dot nav, scroll reveal
5. **Horizontal Journal** — Pinned horizontal scroll, masonry card stagger
6. **Trip Planner** — 4-step form with GSAP slide transitions, glass-panel UI
7. **Footer** — Velocity-reactive infinite marquee

## Replacing placeholder content

All content lives in `/data` — no component needs editing when assets change:

| File | What to update |
|------|---------------|
| `data/brand.ts` | Name, email, phone, WhatsApp, socials, marquee words |
| `data/destinations.ts` | Destination names, regions, taglines, image paths, pricing |
| `data/testimonials.ts` | Testimonial quotes + journal entry copy |
| `data/types.ts` | TypeScript schema (edit if you add new fields) |

## Replacing placeholder images

Drop real photos into `/public/images/` matching these paths:

```
public/images/hero/hero-landscape.jpg        ← Hero background (1920×1280 min)
public/images/destinations/ladakh-grid.jpg   ← Destination cards (1200×1500 portrait)
public/images/destinations/ladakh-hero.jpg   ← Full-bleed hero per destination
public/images/journal/ladakh-journal.jpg     ← Journal article covers (1400×1000)
```

Pattern: `{slug}-grid.jpg`, `{slug}-hero.jpg`, `{slug}-1.jpg`, `{slug}-2.jpg` for each destination slug.

## Wiring the trip planner to a real backend

See the `TODO` comment in `components/sections/TripPlanner.tsx` — currently the form shows a confirmation UI only. Connect by:

1. Creating `app/api/inquire/route.ts`
2. `POST`-ing the `answers` object there from `usePlannerForm.ts` on submit
3. Use Resend / SendGrid in the API route to forward to your inbox

## Adding a hero background video

In `components/sections/Hero.tsx`, the `.hero-bg-layer` div has a placeholder gradient + static image. To add video:

```tsx
<video
  autoPlay muted loop playsInline
  className="absolute inset-0 h-full w-full object-cover"
>
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>
```

Drop your MP4 into `/public/videos/hero.mp4`.
