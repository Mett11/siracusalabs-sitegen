import React, { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Tablet, Smartphone, Edit3, Globe } from 'lucide-react';
import { Site } from '../../types';
import { siteRepository } from '../../lib/storage';
import { GutkowskinoTemplate } from '../renderer/gutkowskino/GutkowskinoTemplate';
import { AtelierMinimalTemplate } from '../renderer/atelier/AtelierMinimalTemplate';

interface PreviewScreenProps {
  siteId: string;
  onNavigateToDashboard: () => void;
  onNavigateToEditor: (siteId: string) => void;
  onNavigateToPublic: (slug: string) => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  siteId,
  onNavigateToDashboard,
  onNavigateToEditor,
  onNavigateToPublic,
}) => {
  const [site, setSite] = useState<Site | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const loaded = siteRepository.getSiteById(siteId);
    if (loaded) setSite(loaded);
  }, [siteId]);

  if (!site) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center">
        <p>Caricamento anteprima...</p>
      </div>
    );
  }

  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col">
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="p-1.5 hover:text-amber-400 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <span className="text-stone-700">|</span>
          <span className="font-bold text-stone-200 truncate">{site.name}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-800 text-stone-400 rounded hidden sm:inline">
            Anteprima Progetto
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-lg border border-stone-700">
          <button
            onClick={() => setViewport('desktop')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'desktop' ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'tablet' ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'mobile' ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToEditor(site.id)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Apri Editor</span>
          </button>
          {site.status === 'published' && (
            <button
              onClick={() => onNavigateToPublic(site.slug)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vedi Online</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Viewport Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-stone-900/40">
        <div
          className={`${getContainerWidth()} min-h-screen transition-all duration-300 bg-white text-stone-900 rounded-xl shadow-2xl overflow-hidden border border-stone-800`}
        >
          {site.templateId === 'atelier-minimal' ? (
            <AtelierMinimalTemplate site={site} isEditorPreview={true} />
          ) : (
            <GutkowskinoTemplate site={site} isEditorPreview={true} />
          )}
        </div>
      </div>
    </div>
  );
};
