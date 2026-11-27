<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RAMCAD

Сайт хладокомбината: мороженое MARZO и рыбные пресервы «Айсберг». Не выдумывай
факты, цены, сроки, условия поставки, отзывы и ответы FAQ — бери их из
`lib/`, `lib/news.ts` и подтверждённых материалов.

## Как отвечать

- Обращение «Boss», язык русский, ответы короткие и только по результату.
- Без промежуточных сообщений о ходе работы, если их не просили.

## Перед правками

- Сохрани текущий вариант: ветка или коммит, если Boss не запретил.
- Не деплой, не коммить и не пушь без явного подтверждения.
- Политика конфиденциальности остаётся черновиком до проверки юристом.

## Скиллы

Для интерфейса и текста используй глобального агента `web-craft`. Он
подключает `web-design-guidelines`, `emil-design-eng`, при необходимости
`shadcn` и спрашивает разрешение перед `humanizer-ru`.

## Проверка

- `npm.cmd run build` и `npx.cmd eslint` для изменённых файлов.
- Ширины 320, 360, 390, 768, 1280, 1920 px: нет горизонтального скролла,
  битых изображений и ошибок JS.
- Фокус видим, `prefers-reduced-motion` уважается.
- `node scripts/design-audit.mjs` — CDP-аудит и скриншоты в `%TEMP%\opencode`.
- После изменений обнови статические экспорты: `node scripts/export-html.mjs`
  и `node scripts/export-embedded.mjs --preview`.

## Оформление

- Один `h1` на страницу.
- Шрифты: Manrope для интерфейса, Playfair для истории и статей.
- Анимации только на `transform` и `opacity`, без `transition: all`.
- Ховер только под `@media (hover: hover) and (pointer: fine)`.

