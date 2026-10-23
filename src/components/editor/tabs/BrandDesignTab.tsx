import React from 'react';
import { Site, FontOption, CardStyleOption } from '../../../types';

interface BrandDesignTabProps {
  site: Site;
  onChange: (updated: Partial<Site>) => void;
}

const PRESET_PALETTES = [
  {
    name: 'Mediterraneo Caldo (Gutkowskino)',
    primary: '#8C3823',
    secondary: '#2D3E33',
    accent: '#D39E43',
    background: '#FAF7F2',
  },
  {
    name: 'Blu Cobalto & Onde Eolie',
    primary: '#2B4C5E',
    secondary: '#C28E5C',
    accent: '#D97736',
    background: '#F8F9FA',
  },
  {
    name: 'Oliva & Cotto d’Argilla',
    primary: '#9E472A',
    secondary: '#5C6348',
    accent: '#D8A04E',
    background: '#FBF8F3',
  },
  {
    name: 'Atelier Istituzionale & Ardesia',
    primary: '#1A2938',
    secondary: '#4A607A',
    accent: '#C49751',
    background: '#F8F9FA',
  },
  {
    name: 'Verde Bosco & Pietra Viva',
    primary: '#264639',
    secondary: '#5C7A68',
    accent: '#C49751',
    background: '#F9FBF9',
  },
];

export const BrandDesignTab: React.FC<BrandDesignTabProps> = ({ site, onChange }) => {
  const applyPalette = (palette: (typeof PRESET_PALETTES)[0]) => {
    onChange({
      theme: {
        ...site.theme,
        primaryColor: palette.primary,
        secondaryColor: palette.secondary,
        accentColor: palette.accent,
        backgroundColor: palette.background,
      },
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
          Brand & Identità Visiva
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Configura nome del brand, claim, palette colori e stile tipografico.
        </p>
      </div>

      {/* Brand Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Nome Brand Visibile *
          </label>
          <input
            type="text"
            value={site.brand.name}
            onChange={(e) =>
              onChange({
                brand: { ...site.brand, name: e.target.value },
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Tagline / Sottotitolo Brand
          </label>
          <input
            type="text"
            value={site.brand.tagline}
            onChange={(e) =>
              onChange({
                brand: { ...site.brand, tagline: e.target.value },
              })
            }
            placeholder="Es. Cucina di terra e mare dal 1984"
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Anno di Fondazione
          </label>
          <input
            type="text"
            value={site.brand.establishedYear || ''}
            onChange={(e) =>
              onChange({
                brand: { ...site.brand, establishedYear: e.target.value },
              })
            }
            placeholder="Es. 1984"
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Claim per Footer
          </label>
          <textarea
            rows={2}
            value={site.brand.footerClaim || ''}
            onChange={(e) =>
              onChange({
                brand: { ...site.brand, footerClaim: e.target.value },
              })
            }
            placeholder="Una breve frase che riassume la missione nel footer..."
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
          />
        </div>
      </div>

      {/* Palette Presets */}
      <div className="pt-6 border-t border-stone-200 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Palette Cromatiche Consigliate
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_PALETTES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPalette(p)}
              className="p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 bg-white text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="text-xs font-medium text-stone-800">{p.name}</span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.primary }} />
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.secondary }} />
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.accent }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="pt-4 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Personalizzazione Colori
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-stone-600 mb-1">Colore Primario</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={site.theme.primaryColor}
                onChange={(e) =>
                  onChange({
                    theme: { ...site.theme, primaryColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={site.theme.primaryColor}
                onChange={(e) =>
                  onChange({
                    theme: { ...site.theme, primaryColor: e.target.value },
                  })
                }
                className="w-full px-2 py-1 text-xs font-mono border border-stone-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-stone-600 mb-1">Colore Secondario</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={site.theme.secondaryColor}
                onChange={(e) =>
                  onChange({
                    theme: { ...site.theme, secondaryColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={site.theme.secondaryColor}
                onChange={(e) =>
                  onChange({
                    theme: { ...site.theme, secondaryColor: e.target.value },
                  })
                }
                className="w-full px-2 py-1 text-xs font-mono border border-stone-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-stone-600 mb-1">Colore Accento / Oro</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={site.theme.accentColor}
                onChange={(e) =>
                  onChange({
                    theme: { ...site.theme, accentColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={site.theme.accentColor}
                onChange={(e) =>
                  onChange({
                    theme: { ...site.theme, accentColor: e.target.value },
                  })
                }
                className="w-full px-2 py-1 text-xs font-mono border border-stone-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-stone-600 mb-1">Colore di Sfondo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={site.theme.backgroundColor}
                onChange={(e) =>
                  onChange({
                    theme: { ...site.theme, backgroundColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={site.theme.backgroundColor}
                onChange={(e) =>
                  onChange({
                    theme: { ...site.theme, backgroundColor: e.target.value },
                  })
                }
                className="w-full px-2 py-1 text-xs font-mono border border-stone-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography & Card Styling */}
      <div className="pt-6 border-t border-stone-200 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Font Titoli & Headings
          </label>
          <select
            value={site.theme.fontHeading}
            onChange={(e) =>
              onChange({
                theme: { ...site.theme, fontHeading: e.target.value as FontOption },
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          >
            <option value="editorial">Cormorant Garamond (Serif Editoriale Elegante)</option>
            <option value="display">Playfair Display (Serif Distintivo Autorevole)</option>
            <option value="sans">Plus Jakarta Sans (Sans-serif Moderno & Pulito)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Trattamento Grafico Card & Cornici
          </label>
          <select
            value={site.theme.cardStyle}
            onChange={(e) =>
              onChange({
                theme: { ...site.theme, cardStyle: e.target.value as CardStyleOption },
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          >
            <option value="editorial-framed">Cornici Fotografiche Editoriali (con ombra calda e offset)</option>
            <option value="bordered">Bordi Sottili Minimali (stile moderno istituzionale)</option>
            <option value="elevated">Ombre Morbide Elevate (stile SaaS contemporaneo)</option>
            <option value="minimal">Minimal Flat Essenziale</option>
          </select>
        </div>
      </div>
    </div>
  );
};
