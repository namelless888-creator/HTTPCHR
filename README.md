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

The source material for this task included only the map animation video and a reference screenshot (not meant to be used as a site asset). No real photography was supplied, and the live icechr.ru assets are not reachable from this sandbox's network policy, so these files are flat `#4A2E1B` (cocoa) placeholders and must be swapped for real photos before shipping:

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
- The map video still shows the original "ООО «Айсберг»" label and blue linework — re-render it in the RAMCAD palette if needed

## Design notes

- Exactly three colors (`#4A2E1B` cocoa, `#1A1A1A` ink, `#F5F5DC` cream) plus opacity tints of those three — no other hues anywhere, including focus rings and overlays.
- Section rhythm: Hero (ink) → Catalog (cocoa) → About (cream) → Extras (ink) → News (cream) → Contacts (ink / cream / cocoa sticky layers).
- Reduced motion: marquee freezes, reveal animations are skipped, and the map video shows its final frame without autoplay.
