import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Site, SiteCategory } from '../../types';
import { CATEGORY_PRESETS } from '../../data/presets';
import { TEMPLATES } from '../../lib/templates';
import { sanitizeSlug } from '../../lib/validation';

interface NewSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSite: (newSite: Site) => void;
}

export const NewSiteModal: React.FC<NewSiteModalProps> = ({
  isOpen,
  onClose,
  onCreateSite,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SiteCategory>('restaurant');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('gutkowskino-editorial');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(sanitizeSlug(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Find the category preset
    const preset = CATEGORY_PRESETS.find((p) => p.id === selectedCategory) || CATEGORY_PRESETS[0];
    const baseSite = preset.defaultSiteFactory();

    const createdSite: Site = {
      ...baseSite,
      id: `site-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || `sito-${Date.now().toString().slice(-4)}`,
      category: selectedCategory,
      templateId: selectedTemplateId as 'gutkowskino-editorial' | 'atelier-minimal',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined,
      hasUnsavedChanges: true,
    };

    if (createdSite.brand) {
      createdSite.brand.name = name.trim();
    }
    if (createdSite.seo) {
      createdSite.seo.metaTitle = `${name.trim()} | Sito Ufficiale`;
    }

    onCreateSite(createdSite);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
      <div className="relative w-full max-w-2xl bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
              Generatore di Siti
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-0.5">
              Crea un Nuovo Sito Vetrina
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi finestra modale"
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Site Name and Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Nome del Progetto / Attività *
              </label>
              <input
                type="text"
                required
                placeholder="Es. Bistrot Bellavista"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Slug URL (Identificativo pubblico) *
              </label>
              <div className="flex items-center">
                <span className="text-xs text-stone-400 px-2.5 py-2.5 bg-stone-100 border border-r-0 border-stone-300 rounded-l-lg font-mono">
                  /site/
                </span>
                <input
                  type="text"
                  required
                  placeholder="bistrot-bellavista"
                  value={slug}
                  onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-stone-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono text-stone-700"
                />
              </div>
            </div>
          </div>

          {/* Business Category Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              1. Seleziona Tipologia Attività & Preset Contenuti
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORY_PRESETS.map((preset) => {
                const isSelected = selectedCategory === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSelectedCategory(preset.id);
                      setSelectedTemplateId(preset.recommendedTemplate);
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-stone-900">
                        {preset.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-stone-900" />}
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              2. Scegli il Template Visivo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`rounded-xl border overflow-hidden cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50/50 ring-2 ring-stone-900/10'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="h-28 overflow-hidden relative bg-stone-100">
                      <img
                        src={tmpl.thumbnail}
                        alt={tmpl.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900 text-white shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 text-left">
                      <h4 className="text-sm font-bold text-stone-900">{tmpl.name}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                        {tmpl.tagline}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg shadow-md hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Genera Progetto & Apri Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
