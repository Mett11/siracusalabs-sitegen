import React from 'react';
import { useRouter } from './lib/router';
import { CmsDashboard } from './components/dashboard/CmsDashboard';
import { SiteEditor } from './components/editor/SiteEditor';
import { PreviewScreen } from './components/preview/PreviewScreen';
import { PublicSiteView } from './components/renderer/PublicSiteView';

export default function App() {
  const { currentRoute, navigateTo } = useRouter();

  if (currentRoute.route === 'editor') {
    return (
      <SiteEditor
        siteId={currentRoute.siteId}
        onNavigateToDashboard={() => navigateTo({ route: 'dashboard' })}
        onNavigateToPreview={(id) => navigateTo({ route: 'preview', siteId: id })}
        onNavigateToPublic={(slug) => navigateTo({ route: 'public', slug })}
      />
    );
  }

  if (currentRoute.route === 'preview') {
    return (
      <PreviewScreen
        siteId={currentRoute.siteId}
        onNavigateToDashboard={() => navigateTo({ route: 'dashboard' })}
        onNavigateToEditor={(id) => navigateTo({ route: 'editor', siteId: id })}
        onNavigateToPublic={(slug) => navigateTo({ route: 'public', slug })}
      />
    );
  }

  if (currentRoute.route === 'public') {
    return (
      <PublicSiteView
        slug={currentRoute.slug}
        onNavigateToDashboard={() => navigateTo({ route: 'dashboard' })}
        onNavigateToEditor={(id) => navigateTo({ route: 'editor', siteId: id })}
      />
    );
  }

  // Default: CMS Dashboard
  return (
    <CmsDashboard
      onNavigateToEditor={(siteId) => navigateTo({ route: 'editor', siteId })}
      onNavigateToPreview={(siteId) => navigateTo({ route: 'preview', siteId })}
      onNavigateToPublic={(slug) => navigateTo({ route: 'public', slug })}
    />
  );
}
