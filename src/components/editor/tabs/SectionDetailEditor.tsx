import React from 'react';
import { ArrowLeft, Sparkles, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Site, SectionConfig } from '../../../types';

interface SectionDetailEditorProps {
  site: Site;
  sectionId: string;
  onBack: () => void;
  onChange: (updated: Partial<Site>) => void;
}

export const SectionDetailEditor: React.FC<SectionDetailEditorProps> = ({
  site,
  sectionId,
  onBack,
  onChange,
}) => {
  const section = site.sections.find((s) => s.id === sectionId);

  if (!section) {
    return (
      <div className="p-6 text-center text-stone-500">
        <p>Sezione non trovata.</p>
        <button onClick={onBack} className="mt-4 px-3 py-1.5 bg-stone-900 text-white rounded text-xs">
          Torna all'elenco
        </button>
      </div>
    );
  }

  const updateSectionData = (newData: any) => {
    const updatedSections = site.sections.map((s) =>
      s.id === sectionId ? { ...s, data: { ...s.data, ...newData } } : s
    );
    onChange({ sections: updatedSections });
  };

  const updateSectionMeta = (meta: Partial<SectionConfig>) => {
    const updatedSections = site.sections.map((s) =>
      s.id === sectionId ? { ...s, ...meta } : s
    );
    onChange({ sections: updatedSections });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Torna all'Elenco Sezioni</span>
        </button>
        <span className="text-[11px] font-mono px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
          Tipo: {section.type}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
          Modifica: {section.title}
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Personalizza testi, immagini e parametri specifici di questa sezione.
        </p>
      </div>

      {/* Common Meta */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Titolo Sezione (Amministrativo)
          </label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => updateSectionMeta({ title: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-900"
          />
        </div>
      </div>

      {/* SECTION TYPE SPECIFIC FIELDS */}

      {/* 1. HERO */}
      {section.type === 'hero' && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Badge Sovratitolo
            </label>
            <input
              type="text"
              value={section.data.badge || ''}
              onChange={(e) => updateSectionData({ badge: e.target.value })}
              placeholder="Es. Osteria di Mare & Vigna • Dal 1984"
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Headline Principale (Supporta &lt;em&gt; per corsivo elegante) *
            </label>
            <textarea
              rows={2}
              value={section.data.headline || ''}
              onChange={(e) => updateSectionData({ headline: e.target.value })}
              placeholder="Il tempo rallenta, <em>il mare incontra la tavola</em>..."
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg resize-none"
            />
            <span className="text-[10px] text-stone-400">
              Suggerimento: Racchiudi una parola tra &lt;em&gt; e &lt;/em&gt; per applicare il corsivo editoriale.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Sottotitolo / Paragrafo
            </label>
            <textarea
              rows={3}
              value={section.data.subheadline || ''}
              onChange={(e) => updateSectionData({ subheadline: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Testo CTA Primaria
              </label>
              <input
                type="text"
                value={section.data.primaryCtaText || ''}
                onChange={(e) => updateSectionData({ primaryCtaText: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Azione CTA Primaria
              </label>
              <select
                value={section.data.primaryCtaAction || 'booking'}
                onChange={(e) => updateSectionData({ primaryCtaAction: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              >
                <option value="booking">Apre Modal Prenotazione</option>
                <option value="custom">URL / Anchor Personalizzato</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Immagine Principale Hero (URL)
            </label>
            <input
              type="url"
              value={section.data.heroImage || ''}
              onChange={(e) => updateSectionData({ heroImage: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Didascalia Immagine (Scritta sulla cornice)
            </label>
            <input
              type="text"
              value={section.data.heroImageCaption || ''}
              onChange={(e) => updateSectionData({ heroImageCaption: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Tag Riconoscimento / Certificazione
            </label>
            <input
              type="text"
              value={section.data.decorativeTag || ''}
              onChange={(e) => updateSectionData({ decorativeTag: e.target.value })}
              placeholder="Es. Guida Michelin 2024 / 2 Forchette Gambero Rosso"
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* 2. MANIFESTO */}
      {section.type === 'manifesto' && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Citazione Filosofica (Quote)
            </label>
            <textarea
              rows={3}
              value={section.data.quote || ''}
              onChange={(e) => updateSectionData({ quote: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Autore Citazione
            </label>
            <input
              type="text"
              value={section.data.quoteAuthor || ''}
              onChange={(e) => updateSectionData({ quoteAuthor: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Descrizione Narrativa
            </label>
            <textarea
              rows={3}
              value={section.data.description || ''}
              onChange={(e) => updateSectionData({ description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Firma (Nome)
              </label>
              <input
                type="text"
                value={section.data.signatureName || ''}
                onChange={(e) => updateSectionData({ signatureName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Ruolo Firma
              </label>
              <input
                type="text"
                value={section.data.signatureRole || ''}
                onChange={(e) => updateSectionData({ signatureRole: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. KITCHEN / GALLERY / REVIEWS / SPACES lead texts */}
      {['kitchen', 'gallery', 'reviews', 'spaces', 'services'].includes(section.type) && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Testo Introduttivo (Lead Text)
            </label>
            <textarea
              rows={2}
              value={(section.data as any).leadText || ''}
              onChange={(e) => updateSectionData({ leadText: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg resize-none"
            />
          </div>
          <p className="text-xs text-stone-500">
            Gli elementi di dettaglio (piatti, foto, recensioni, sale) possono essere modificati anche nella scheda <strong>"Elementi Ripetibili"</strong>.
          </p>
        </div>
      )}

      {/* 4. CUSTOM COMPONENT (AI Generated or Stored Module) */}
      {section.type === 'custom_component' && (
        <div className="space-y-5 pt-4 border-t border-stone-200">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <strong>Modulo Personalizzato AI</strong>
            </span>
            <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white rounded border border-amber-300">
              {(section.data as any).layoutType || 'feature-grid'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Badge / Sopratitolo
            </label>
            <input
              type="text"
              value={(section.data as any).badge || ''}
              onChange={(e) => updateSectionData({ badge: e.target.value })}
              placeholder="Es. Esperienza Esclusiva • In Cantina"
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Titolo della Sezione (supporta &lt;em&gt;)
            </label>
            <input
              type="text"
              value={(section.data as any).title || ''}
              onChange={(e) => updateSectionData({ title: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Sottotitolo / Descrizione
            </label>
            <textarea
              rows={3}
              value={(section.data as any).subtitle || ''}
              onChange={(e) => updateSectionData({ subtitle: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tipo di Layout
              </label>
              <select
                value={(section.data as any).layoutType || 'feature-grid'}
                onChange={(e) => updateSectionData({ layoutType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              >
                <option value="feature-grid">Griglia Card (feature-grid)</option>
                <option value="split-card">Card Asimmetrica con Foto (split-card)</option>
                <option value="stats-bar">Barra Metriche & Numeri (stats-bar)</option>
                <option value="banner-cta">Banner Immersivo con CTA (banner-cta)</option>
                <option value="interactive-list">Lista Interattiva (interactive-list)</option>
                <option value="timeline">Timeline Narrativa (timeline)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Testo Pulsante CTA
              </label>
              <input
                type="text"
                value={(section.data as any).primaryCtaText || ''}
                onChange={(e) => updateSectionData({ primaryCtaText: e.target.value })}
                placeholder="Es. Prenota Esperienza"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Destinazione CTA (URL o #anchor)
              </label>
              <input
                type="text"
                value={(section.data as any).primaryCtaUrl || ''}
                onChange={(e) => updateSectionData({ primaryCtaUrl: e.target.value })}
                placeholder="#section-contact oppure URL esterno"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Foto Laterale o Copertina (Unsplash URL)
              </label>
              <input
                type="text"
                value={(section.data as any).sideImage || (section.data as any).backgroundImage || ''}
                onChange={(e) => updateSectionData({ sideImage: e.target.value, backgroundImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Items / Cards in the Custom Component */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Elementi del Modulo ({((section.data as any).items || []).length})
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentItems = (section.data as any).items || [];
                  const newItem = {
                    title: 'Nuovo Elemento',
                    description: 'Descrizione dell’elemento...',
                    tag: 'In Evidenza',
                    value: '100%',
                  };
                  updateSectionData({ items: [...currentItems, newItem] });
                }}
                className="text-xs font-semibold px-2 py-1 bg-stone-900 text-white rounded hover:bg-stone-800 cursor-pointer"
              >
                + Aggiungi Elemento
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {((section.data as any).items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-stone-400 font-bold">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentItems = [...((section.data as any).items || [])];
                        currentItems.splice(idx, 1);
                        updateSectionData({ items: currentItems });
                      }}
                      className="text-stone-400 hover:text-red-600 text-xs cursor-pointer"
                    >
                      Elimina
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Titolo elemento"
                      value={item.title || ''}
                      onChange={(e) => {
                        const currentItems = [...((section.data as any).items || [])];
                        currentItems[idx] = { ...currentItems[idx], title: e.target.value };
                        updateSectionData({ items: currentItems });
                      }}
                      className="px-2 py-1 text-xs bg-white border border-stone-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Tag o Valore (es. € 45 o 42)"
                      value={item.value || item.tag || ''}
                      onChange={(e) => {
                        const currentItems = [...((section.data as any).items || [])];
                        currentItems[idx] = { ...currentItems[idx], value: e.target.value, tag: e.target.value };
                        updateSectionData({ items: currentItems });
                      }}
                      className="px-2 py-1 text-xs bg-white border border-stone-300 rounded font-mono text-[11px]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Descrizione..."
                    value={item.description || ''}
                    onChange={(e) => {
                      const currentItems = [...((section.data as any).items || [])];
                      currentItems[idx] = { ...currentItems[idx], description: e.target.value };
                      updateSectionData({ items: currentItems });
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
