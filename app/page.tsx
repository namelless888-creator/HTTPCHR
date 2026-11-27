import { Landing } from '@/components/landing';
import { pageMetadata } from '@/lib/seo';
import { SITE_DESCRIPTION } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'RAMKAD — создаём вкус, сохраняем свежесть',
  description: SITE_DESCRIPTION,
  path: '/',
});

export default function Page() {
  return <Landing page='home' />;
}
