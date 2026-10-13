export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'О компании', href: '/#about' },
  { label: 'Новости', href: '/news' },
  { label: 'Контакты', href: '/contacts' },
];
