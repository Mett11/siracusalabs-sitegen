import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { Site } from '../../types';
import { GutkowskinoTemplate } from '../renderer/gutkowskino/GutkowskinoTemplate';
import { AtelierMinimalTemplate } from '../renderer/atelier/AtelierMinimalTemplate';

interface LivePreviewPanelProps {
  site: Site;
  onOpenExternalPreview: () => void;
}

export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  site,
  onOpenExternalPreview,
}) => {
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

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
    <div className="flex-1 flex flex-col h-full bg-stone-900 border-l border-stone-800 text-stone-200 overflow-hidden">
      {/* Top Device Toolbar */}
      <div className="px-4 py-2.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-lg border border-stone-800">
          <button
            onClick={() => setViewport('desktop')}
            title="Desktop (100% responsive)"
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-stone-800 text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setViewport('tablet')}
            title="Tablet (768px)"
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-stone-800 text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setViewport('mobile')}
            title="Mobile (375px)"
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-stone-800 text-white font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Preview (Tempo reale)
          </div>

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            title="Ricarica Anteprima"
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenExternalPreview}
            title="Apri Anteprima a Schermo Intero"
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Viewport Frame Container */}
      <div className="flex-1 overflow-auto p-3 sm:p-6 flex items-start justify-center bg-stone-900/60">
        <div
          key={refreshKey}
          className={`${getContainerWidth()} min-h-full transition-all duration-300 bg-white text-stone-900 rounded-lg shadow-2xl overflow-hidden border border-stone-800`}
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
