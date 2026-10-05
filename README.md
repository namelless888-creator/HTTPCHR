# RAMCAD — one-page site

Redesign of icechr.ru for RAMCAD, a cold-chain food producer (ice cream, fish, ready-to-eat products). Next.js App Router, TypeScript, Tailwind CSS v4, shadcn-style component structure.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4** — tokens live in `app/globals.css` as CSS custom properties (`@theme inline`), no `tailwind.config.ts` needed
- **shadcn/ui conventions** — `components.json` sets the default component path to `@/components/ui` (this matters: every shadcn component, and all custom UI components in this project, import siblings through `@/components/ui/*`, so anything placed outside that folder breaks those imports). Shared helpers live in `@/lib/utils` (`cn()`, via `clsx` + `tailwind-merge`).
- **framer-motion**, **lucide-react**, **lenis** (smooth scroll, mounted once in block 6)

### About the shadcn CLI

This sandbox's network policy blocks `ui.shadcn.com`, so `npx shadcn@latest init` / `add` cannot run here. The project structure was built by hand to match exactly what the CLI would generate (`components.json`, `lib/utils.ts`, and a standard Radix-based `components/ui/sheet.tsx`). Once you have access to `ui.shadcn.com` (locally, or by widening this environment's network policy), the CLI will recognize this `components.json` and `npx shadcn@latest add <component>` works normally for anything added later.

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Structure

```
app/
  layout.tsx       # fonts (Playfair Display + Manrope), lenis.css import
  page.tsx          # assembles all 6 sections inside <main id="main">
  globals.css       # palette tokens, section-light theme, stack-layer sticky rules
  api/contact/route.ts
components/
  catalog-block.tsx # wires lib/catalog.ts into the marquee (block 2)
  ui/               # all shadcn-style + custom components
lib/
  catalog.ts        # 56-item catalog data
  utils.ts          # cn()
public/
  images/           # hero-bg.jpg, catalog/01-56.jpg, extras/seld-file.jpg
  videos/           # karta_animation.mp4 (block 6 map animation)
```

## Asset status — placeholders in place, replace before launch

The source material for this task included only the map animation video and a reference screenshot (not meant to be used as a site asset). No real photography was supplied, and the live icechr.ru assets are not reachable from this sandbox's network policy, so these files are flat `#3E6E85` (steel accent) placeholders and must be swapped for real photos before shipping:

- `public/images/hero-bg.jpg` — needs a real background photo, width ≥ 2400px
- `public/images/catalog/01.jpg` … `56.jpg` — needs real product photos; order and captions are already wired up in `lib/catalog.ts` (18 are flagged `hot: true` → "Хит" badge)
- `public/images/extras/seld-file.jpg` — needs a real photo of the herring product

`public/videos/karta_animation.mp4` is the real supplied asset (1920×1080, 14s, H.264) and is already wired into block 6.

The CEO portrait (`/public/images/ceo.jpg`) was intentionally **not** added — the shipped `about-block.tsx` always shows the "МШ" initials avatar, matching the component exactly as specified.

## Content to verify before launch

Copy in blocks 3–5 and contacts was carried over from icechr.ru with the company name swapped to RAMCAD. Confirm before launch:

- Director's name/quote in block 3 (currently "Муса Шаванов")
- The four news items in block 5 (dated 2024, currently linking to the original icechr.ru articles)
- Address, phone, e-mail, and hours in block 6
- The map video still shows the original "ООО «Айсберг»" label and blue linework — re-render it in the RAMCAD palette if needed (it now fills the whole block 6 map layer as a background, so it's more visible than before)

## Design notes

- **Palette: "Морозная сталь" (Frosted Steel)** — chosen over the original cocoa/cream dessert palette via a judge-panel workflow (3 independent proposals, scored by 2 comparative judges on brand fit / accessibility / distinctiveness, then synthesized). The brief: the old cocoa-brown palette read as a confectionery/gelateria brand and said nothing about the cold chain, refrigeration, or the fish line — RAMCAD is a хладокомбинат (cold-storage plant), and the palette should say so.
  - `#0D1B22` **deepfreeze** (dark) — the inside of a freezer in the dark; a blue-black, not a neutral charcoal
  - `#F1F6F8` **frost** (light) — frost on a freezer display case glass; ice-blue, not warm cream
  - `#3E6E85` **steel** (accent) — stainless steel of refrigeration units/compressors; used for cards, borders, glow, buttons, and the catalog section background
  - All three sit in one narrow blue hue band (~197–202°) — no red/green/yellow anywhere, so error/success states stay icon + brand-color only, as before.
  - Contrast: dark/light = 16.1:1 (huge margin over AA). Light text on the steel accent = 5.11:1 (passes AA 4.5:1 for body text; not quite the AAA levels the original cocoa/cream pair hit). Steel as a border/glow against dark = 3.15:1 (passes the 3:1 UI-component threshold; not meant for text). The judge panel tried to push the accent-on-dark ratio higher and found every attempt traded away the accent-on-light ratio by a larger amount — `#3E6E85` is the balanced point.
  - Exactly three colors plus opacity tints of those three — no other hues anywhere, including focus rings and overlays.
- Section rhythm: Hero (dark) → Catalog (steel) → About (frost) → Extras (dark) → News (frost) → Contacts (dark / frost / steel sticky layers).
- Reduced motion: marquee freezes, reveal animations are skipped, and the map video shows its final frame without autoplay.
- **Block 6, map layer**: the map video is a full-bleed background behind the whole sticky section (not a boxed card), with a dark gradient scrim for legibility. The address/phone/e-mail/hours card floats bottom-left as a frosted-glass panel (`bg-background/70` + `backdrop-blur`). Its `currentTime` is scrubbed directly to scroll position — `MapAnimation` reads `section.offsetTop`/`offsetHeight` (stable across the section's own sticky offsetting) against `lenis.scroll` to compute progress, so the route "draws" as the page scrolls rather than autoplaying once. Under `prefers-reduced-motion` it skips the scroll binding entirely and holds the last frame.
