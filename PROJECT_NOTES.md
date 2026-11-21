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
- Missing REF media is tracked by path: `public/images/herring/` needs `fish-fillets.webp`, `fish-oil-180.webp`, `fish-oil-500.webp`, `fish-ruby.webp`, `fish-spices.webp`, `fish-steaks.webp`, `hero-scene.webp`, all eight `label-*.webp` files, `packaging-tub.webp`, `studio-ice.webp`, and `waves.svg`; `public/images/` also needs `product-stage-bg.png`, `product-podium-cutout.png`, and `product-reference-cutout.png`.

## Direction card photos

- The user-supplied ZIP `Премиальное мороженое MARZO на льду.zip` contains both exact photographs for the “Эксперты в холоде” cards: `Премиальное мороженое MARZO на льду.png` for the left ice cream card and `04-cold-haze.png` for the right fish card. They are installed as byte-for-byte PNG copies in `public/images/directions/`.
- Rollback branch: `backup/pre-exact-directions-20261121`.

## Fish catalog integration

- Rollback branch: `backup/pre-fish-catalog-20261121`.
- The uploaded `ramcad-aisberg-collection (1).zip` exceeds the environment's 32 MiB transfer limit. Its product files are still pending; request smaller ZIP parts or a direct download link.
- The current source describes eight Айсберг products in `lib/herring.ts`, but `public/images/herring/` is still missing. The catalog navigation and standalone HTML export are prepared for these products; do not publish the fish catalog until the archive assets are installed and checked.
