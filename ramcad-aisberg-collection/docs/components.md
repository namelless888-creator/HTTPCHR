# Компоненты и файлы

| Деталь | HTML / класс | Ресурс / поведение |
|---|---|---|
| Шапка | `.site-header` | Логотип, меню, телефон |
| Логотип RAMCAD | `.brand-pill` | Текст Prata; отдельный SVG в `assets/brand/` |
| Навигация | `.main-nav` | Текущий раздел окрашен `accentTint` товара |
| Мобильное меню | `.menu-toggle` | `aria-expanded`, Escape, сброс при расширении окна |
| Хлебные крошки | `.breadcrumbs` | Каталог и текущая масса |
| Общая композиция | `.photo-composition` | Абсолютные слои в сцене 1774 × 887 |
| Основа упаковки | `.photo-pack .pack-base` | `assets/packaging/tub-blank.png` |
| Этикетка | `.pack-label` | Оригинальный `products/<id>/label.png` |
| Блик упаковки | `.pack-sheen` | Слабый CSS-градиент |
| Рыба | `.photo-fish` | Только файл, закреплённый за этим товаром |
| Волны | `.wave-pattern` | `assets/patterns/waves.svg`, opacity .35 |
| Переключение галереи | `.gallery-dots` | scene / pack / fish, статус для скринридера |
| Название | `.product-intro` | Один h1 с отдельной строкой подвида |
| Цена по запросу | `.wholesale-card` | Доступный диалог с телефоном |
| Характеристики | `.product-facts` | Бренд, формат, масса |
| Описание | `.product-accordion` | Нативные `details` / `summary` |
| Возврат | `.back-link` | Реальная ссылка на каталог комплекта |
| Контактный диалог | `.wholesale-dialog` | Нативный dialog, Escape, кнопка закрытия |

Стили: сначала `tokens.css`, затем `page-base.css`, затем `collection.css`. Поведение: `scripts/site-config.js`, затем `scripts/page.js`.

Конструктор использует `scripts/products.js`, `styles/constructor-base.css`, `styles/constructor.css` и `scripts/constructor.js`. Эти файлы не нужны на публичной странице товара. При переносе в React/Vue/Svelte данные можно импортировать из `products.json`; глобальная переменная используется только для локального просмотра HTML без fetch.

Векторные макеты — вспомогательные файлы для дизайнерской сборки. Текст в них переведён в контуры; в HTML весь текст остаётся доступным, выделяемым и индексируемым.
