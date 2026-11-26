'use client';

import { useEffect } from 'react';

/**
 * Client-side replacement for old icechr.ru addresses on static hosting.
 * Real 301 rules live in public/_redirects for hosts that support them;
 * this page keeps the path useful on GitHub Pages, which does not.
 */
export function LegacyRedirect({ to, label }: { to: string; label: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <main className='legacy-redirect'>
      <p>Страница переехала на новый адрес.</p>
      <a href={to}>{label}</a>
    </main>
  );
}
