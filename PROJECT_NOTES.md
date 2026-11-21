# Working agreements

- Before replacing important components or assets, create a named Git rollback point.
- Immediately report every missing dependency, image, video, font, route, or stylesheet needed by uploaded files.
- Do not invent missing product facts or photography; use an explicit temporary compatibility stub only when it is needed to test the rest of the site.

## Current component experiment

- Baseline rollback branch: `backup/pre-component-swap-20261115-28dda84`
- Baseline commit: `28dda8484a09b95798999bbba025e9dcec99c5ee`
- The seven uploaded TSX components were installed for evaluation on 2026-11-15.

## REF integration

- Pre-REF rollback branch: `backup/pre-ref-merge-20261115-14be2f4`
- Pre-REF commit: `14be2f4aab3586fe33202e304fa265fdeb7f9982`
- REF source snapshot inspected: `26fa2a4c93e1cb4176a8a97bc08139c5b857ab17`.
- Git commit dates, rather than checkout file mtimes, are used to identify newer REF files.
- REF supplies the herring routes, product data, and component styles, but does not contain their referenced product photography.
- The herring media missing from REF has been supplied by the collection added in HTTPCHR commit `531d8d1` (branch `claude/sleepy-euler-puv12g`). The unused `hero-scene.webp` is not needed by the current composition. Other REF media still missing: `public/images/product-stage-bg.png`, `product-podium-cutout.png`, and `product-reference-cutout.png`.

## Direction card photos

- The user-supplied ZIP `Премиальное мороженое MARZO на льду.zip` contains both exact photographs for the “Эксперты в холоде” cards: `Премиальное мороженое MARZO на льду.png` for the left ice cream card and `04-cold-haze.png` for the right fish card. They are installed as byte-for-byte PNG copies in `public/images/directions/`.
- Rollback branch: `backup/pre-exact-directions-20261121`.

## Fish catalog integration

- Rollback branch: `backup/pre-fish-catalog-20261121`.
- The uploaded ZIP exceeded the environment's 32 MiB transfer limit, but the same collection was found in HTTPCHR commit `531d8d1`. Its `products.json` contains eight products. All eight current entries in `lib/herring.ts` were checked against the source metadata and scene coordinates.
- The fish catalog and standalone HTML export include all eight products. Web assets copied from the collection are the six fish cutouts, eight original label renders, shared ice background, packaging shell, and wave pattern. Rollback branch before installing these assets: `backup/pre-fish-assets-20261121`.
