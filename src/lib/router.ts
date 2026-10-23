import { useState, useEffect } from 'react';

export type RouteLocation =
  | { route: 'dashboard' }
  | { route: 'editor'; siteId: string }
  | { route: 'preview'; siteId: string }
  | { route: 'public'; slug: string };

function parseLocation(): RouteLocation {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const pathname = window.location.pathname.replace(/^\//, '');

  const target = hash || pathname;

  if (target.startsWith('editor/')) {
    const siteId = target.replace('editor/', '');
    return { route: 'editor', siteId };
  }

  if (target.startsWith('preview/')) {
    const siteId = target.replace('preview/', '');
    return { route: 'preview', siteId };
  }

  if (target.startsWith('site/')) {
    const slug = target.replace('site/', '');
    return { route: 'public', slug };
  }

  return { route: 'dashboard' };
}

export function useRouter() {
  const [currentRoute, setCurrentRoute] = useState<RouteLocation>(() => {
    if (typeof window === 'undefined') return { route: 'dashboard' };
    return parseLocation();
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (loc: RouteLocation) => {
    let hash = '';
    if (loc.route === 'dashboard') {
      hash = '';
    } else if (loc.route === 'editor') {
      hash = `#/editor/${loc.siteId}`;
    } else if (loc.route === 'preview') {
      hash = `#/preview/${loc.siteId}`;
    } else if (loc.route === 'public') {
      hash = `#/site/${loc.slug}`;
    }

    window.location.hash = hash;
    setCurrentRoute(loc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { currentRoute, navigateTo };
}
