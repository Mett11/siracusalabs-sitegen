import React, { useEffect, useState } from 'react';
import { ArrowLeft, Globe, Eye, Lock, Edit3 } from 'lucide-react';
import { Site } from '../../types';
import { siteRepository } from '../../lib/storage';
import { GutkowskinoTemplate } from './gutkowskino/GutkowskinoTemplate';
import { AtelierMinimalTemplate } from './atelier/AtelierMinimalTemplate';

interface PublicSiteViewProps {
  slug?: string;
  siteId?: string;
  isDraftPreview?: boolean;
  onNavigateToDashboard: () => void;
  onNavigateToEditor?: (siteId: string) => void;
}

export const PublicSiteView: React.FC<PublicSiteViewProps> = ({
  slug,
  siteId,
  isDraftPreview = false,
  onNavigateToDashboard,
  onNavigateToEditor,
}) => {
  const [site, setSite] = useState<Site | null | undefined>(undefined);

  useEffect(() => {
    if (isDraftPreview && siteId) {
      const found = siteRepository.getSiteById(siteId);
      setSite(found || null);
    } else if (slug) {
      const published = siteRepository.getPublishedSiteBySlug(slug);
      setSite(published || null);
    } else if (siteId) {
      const found = siteRepository.getSiteById(siteId);
      setSite(found || null);
    }
  }, [slug, siteId, isDraftPreview]);

  // Update page title & meta dynamically (Must be before early returns)
  useEffect(() => {
    if (site && site.seo && site.seo.metaTitle) {
      document.title = site.seo.metaTitle;
    }
  }, [site]);

  if (site === undefined) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800" />
      </div>
    );
  }

  if (site === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-stone-200">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
            Sito non trovato o non ancora pubblicato
          </h2>
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            Il sito richiesto <code>"{slug || siteId}"</code> è attualmente in stato di bozza o non esiste. Per visualizzarlo pubblicamente, pubblicalo dalla dashboard amministrativa.
          </p>
          <button
            onClick={onNavigateToDashboard}
            className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Torna alla Dashboard CMS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Floating Admin Controls Bar (visible when navigating in development/preview) */}
      <aside aria-label="Controlli di amministrazione" className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-stone-900/90 hover:bg-stone-900 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-full shadow-2xl border border-white/20 transition-all">
        <button
          onClick={onNavigateToDashboard}
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard CMS</span>
        </button>

        {onNavigateToEditor && (
          <>
            <span className="text-white/30">|</span>
            <button
              onClick={() => onNavigateToEditor(site.id)}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modifica</span>
            </button>
          </>
        )}

        {isDraftPreview && (
          <>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1 text-amber-400 font-mono text-[10px] uppercase">
              <Eye className="w-3 h-3" />
              Bozza Preview
            </span>
          </>
        )}
      </aside>

      {/* Select template based on site configuration */}
      {site.templateId === 'atelier-minimal' ? (
        <AtelierMinimalTemplate site={site} isEditorPreview={isDraftPreview} />
      ) : (
        <GutkowskinoTemplate site={site} isEditorPreview={isDraftPreview} />
      )}
    </div>
  );
};
