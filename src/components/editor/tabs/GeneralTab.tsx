import React from 'react';
import { Site, SiteCategory } from '../../../types';
import { CATEGORY_PRESETS } from '../../../data/presets';
import { sanitizeSlug } from '../../../lib/validation';

interface GeneralTabProps {
  site: Site;
  onChange: (updated: Partial<Site>) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ site, onChange }) => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
          Informazioni Generali
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Configura i dati di base del progetto e il percorso URL pubblico.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Nome del Progetto *
          </label>
          <input
            type="text"
            value={site.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Slug URL Pubblico *
          </label>
          <div className="flex items-center">
            <span className="text-xs text-stone-500 px-3 py-2 bg-stone-100 border border-r-0 border-stone-300 rounded-l-lg font-mono">
              /site/
            </span>
            <input
              type="text"
              value={site.slug}
              onChange={(e) => onChange({ slug: sanitizeSlug(e.target.value) })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono text-stone-800"
            />
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Utilizzato per l'indirizzo web univoco della versione pubblicata.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Categoria Attività
          </label>
          <select
            value={site.category}
            onChange={(e) => onChange({ category: e.target.value as SiteCategory })}
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          >
            {CATEGORY_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SEO Section */}
      <div className="pt-6 border-t border-stone-200 space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Impostazioni SEO & Condivisione Social
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Metadati utilizzati dai motori di ricerca e dalle anteprime su WhatsApp e social network.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Meta Title (Titolo browser & Google)
          </label>
          <input
            type="text"
            value={site.seo.metaTitle}
            onChange={(e) =>
              onChange({
                seo: { ...site.seo, metaTitle: e.target.value },
              })
            }
            placeholder="Nome Attività | Sottotitolo e Città"
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Meta Description (Descrizione nei risultati di ricerca)
          </label>
          <textarea
            rows={3}
            value={site.seo.metaDescription}
            onChange={(e) =>
              onChange({
                seo: { ...site.seo, metaDescription: e.target.value },
              })
            }
            placeholder="Descrizione chiara ed accattivante del locale..."
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Immagine Social (OpenGraph URL)
          </label>
          <input
            type="url"
            value={site.seo.ogImage}
            onChange={(e) =>
              onChange({
                seo: { ...site.seo, ogImage: e.target.value },
              })
            }
            placeholder="https://..."
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>
      </div>
    </div>
  );
};
