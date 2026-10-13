'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone } from 'lucide-react';
import { NAV_LINKS } from '@/lib/nav-links';
import { cn } from '@/lib/utils';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

// Pinned open over the home page's hero; everywhere else it's a slim handle
// that expands on hover (and on keyboard focus, for anyone tabbing through it).
export const SideNav: React.FC = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    if (pathname !== '/') return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  const expanded = (pathname === '/' && heroInView) || hovered || focused;

  return (
    <nav
      aria-label='Боковая навигация'
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className='fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 md:block'
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-r-2xl border border-l-0 border-border bg-background/85 shadow-xl backdrop-blur-md transition-[width] duration-300 ease-out motion-reduce:transition-none',
          expanded ? 'w-56' : 'w-10'
        )}
      >
        {/* Collapsed handle */}
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
            expanded ? 'pointer-events-none opacity-0' : 'opacity-100'
          )}
        >
          <Menu className='size-4 text-muted-foreground' />
        </div>

        {/* Expanded content */}
        <div
          className={cn(
            'flex flex-col gap-1 py-6 transition-opacity duration-300',
            expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          {NAV_LINKS.map((l) => {
            const hashIndex = l.href.indexOf('#');
            const isHashLink = hashIndex !== -1;
            const base = isHashLink ? l.href.slice(0, hashIndex) : l.href;
            const active = !isHashLink && (base === '/' ? pathname === '/' : pathname === base || pathname.startsWith(`${base}/`));
            return (
              <Link
                key={l.href}
                href={l.href}
                tabIndex={expanded ? 0 : -1}
                className={cn(
                  'group/link relative flex items-center whitespace-nowrap py-2.5 pl-6 pr-5 text-sm font-semibold tracking-wide transition-colors',
                  focusRing,
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-transform duration-300',
                    active ? 'scale-y-100' : 'scale-y-0 group-hover/link:scale-y-100'
                  )}
                />
                {l.label}
              </Link>
            );
          })}
          <a
            href='tel:+79389042323'
            tabIndex={expanded ? 0 : -1}
            className={cn('mt-4 flex items-center gap-2 whitespace-nowrap px-6 py-2 text-sm font-semibold text-foreground', focusRing)}
          >
            <Phone aria-hidden className='size-4 shrink-0' />
            +7 (938) 904-23-23
          </a>
        </div>
      </div>
    </nav>
  );
};
