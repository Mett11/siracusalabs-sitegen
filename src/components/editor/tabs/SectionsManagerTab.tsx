import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Edit2,
  Copy,
  Layers,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import { Site, SectionConfig, SectionType, CustomComponentData } from '../../../types';
import { TEMPLATES, getTemplateById } from '../../../lib/templates';
import { siteRepository } from '../../../lib/storage';
import { AiComponentAssistantModal } from '../../ai/AiComponentAssistantModal';

interface SectionsManagerTabProps {
  site: Site;
  onChange: (updated: Partial<Site>) => void;
  onSelectSectionToEdit: (sectionId: string) => void;
}

export const SectionsManagerTab: React.FC<SectionsManagerTabProps> = ({
  site,
  onChange,
  onSelectSectionToEdit,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'template' | 'custom'>('template');
  const template = getTemplateById(site.templateId);

  const toggleSectionEnabled = (id: string) => {
    const sections = site.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    onChange({ sections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const sorted = [...site.sections].sort((a, b) => a.order - b.order);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    // reindex order
    sorted.forEach((sec, i) => {
      sec.order = i + 1;
    });

    onChange({ sections: sorted });
  };

  const deleteSection = (id: string) => {
    if (site.sections.length <= 1) {
      alert('Il sito deve mantenere almeno una sezione.');
      return;
    }
    const sections = site.sections.filter((s) => s.id !== id);
    onChange({ sections });
  };

  const duplicateSection = (section: SectionConfig) => {
    const copy: SectionConfig = JSON.parse(JSON.stringify(section));
    copy.id = `section-${section.type}-${Date.now().toString().slice(-4)}`;
    copy.title = `${section.title} (Copia)`;
    copy.order = site.sections.length + 1;

    onChange({ sections: [...site.sections, copy] });
  };

  const addCustomComponentToSite = (comp: CustomComponentData) => {
    const newId = `section-custom-${Date.now().toString().slice(-4)}`;
    const newSection: SectionConfig<'custom_component'> = {
      id: newId,
      type: 'custom_component',
      title: comp.name || 'Componente Personalizzato',
      enabled: true,
      order: site.sections.length + 1,
      data: comp,
    };

    onChange({ sections: [...site.sections, newSection] });
    setIsAddModalOpen(false);
  };

  const addSectionFromCatalog = (type: SectionType, title: string) => {
    if (type === 'custom_component') {
      setIsAiAssistantOpen(true);
      setIsAddModalOpen(false);
      return;
    }

    const newId = `section-${type}-${Date.now().toString().slice(-4)}`;

    let defaultData: any = {};
    if (type === 'hero') {
      defaultData = {
        badge: 'Nuova Sezione',
        headline: 'Titolo Editoriale Nuovo',
        subheadline: 'Sottotitolo descrittivo...',
        primaryCtaText: 'Scopri di Più',
        primaryCtaAction: 'custom',
        heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      };
    } else if (type === 'manifesto') {
      defaultData = {
        quote: '«Una citazione che ispira fiducia e racconta la visione autentica.»',
        description: 'Descrizione della filosofia aziendale...',
        sideImage: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80',
        pillars: [
          { id: 'p1', numeral: 'I', title: 'Qualità Senza Compromessi', description: 'Cura minuziosa in ogni singolo dettaglio.' },
        ],
      };
    } else if (type === 'reviews') {
      defaultData = {
        leadText: 'Cosa dicono i nostri clienti ed ospiti.',
        averageScore: '5.0',
        totalReviewsCount: 'Recensioni verificate',
        items: [
          { id: 'r1', author: 'Ospite Felice', source: 'Google', rating: 5, quote: 'Esperienza davvero impeccabile.' },
        ],
      };
    } else if (type === 'gallery') {
      defaultData = {
        leadText: 'I momenti più belli.',
        categories: ['Tutti', 'Momenti'],
        items: [
          { id: 'g1', title: 'Scorcio Panoramico', category: 'Momenti', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', aspectRatio: 'square' },
        ],
      };
    } else if (type === 'contact_info') {
      defaultData = site.contact;
    } else {
      defaultData = { leadText: 'Dettagli della sezione' };
    }

    const newSection: SectionConfig = {
      id: newId,
      type,
      title,
      enabled: true,
      order: site.sections.length + 1,
      data: defaultData,
    };

    onChange({ sections: [...site.sections, newSection] });
    setIsAddModalOpen(false);
  };

  const sortedSections = [...site.sections].sort((a, b) => a.order - b.order);
  const storedCustomComponents = siteRepository.getCustomComponents();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
            Struttura & Ordine Sezioni
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Trascina, riordina, attiva/nascondi o crea sezioni con l'assistente AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Assistant Button */}
          <button
            type="button"
            onClick={() => setIsAiAssistantOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
            <span>Crea con AI</span>
          </button>

          {/* Add Section Button */}
          <button
            type="button"
            onClick={() => {
              setModalTab('template');
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg shadow-sm hover:bg-stone-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Aggiungi Sezione</span>
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-2.5">
        {sortedSections.map((section, index) => (
          <div
            key={section.id}
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              section.enabled
                ? 'bg-white border-stone-200 shadow-2xs'
                : 'bg-stone-100/80 border-dashed border-stone-300 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="font-mono text-xs text-stone-400 font-bold w-4 shrink-0">
                {index + 1}.
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {section.title}
                  </h4>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-mono uppercase rounded ${
                      section.type === 'custom_component'
                        ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {section.type === 'custom_component' ? 'AI / Custom' : section.type}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 font-mono truncate">
                  ID: #{section.id}
                </div>
              </div>
            </div>

            {/* Actions: Visibility Toggle, Up/Down, Edit, Duplicate, Delete */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onSelectSectionToEdit(section.id)}
                title="Modifica contenuti specifici"
                className="px-2 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors inline-flex items-center gap-1 mr-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-stone-600" />
                <span className="hidden sm:inline">Modifica</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSectionEnabled(section.id)}
                title={section.enabled ? 'Nascondi Sezione' : 'Mostra Sezione'}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  section.enabled
                    ? 'text-emerald-700 hover:bg-emerald-50'
                    : 'text-stone-400 hover:bg-stone-200'
                }`}
              >
                {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveSection(index, 'up')}
                title="Sposta in alto"
                className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={index === sortedSections.length - 1}
                onClick={() => moveSection(index, 'down')}
                title="Sposta in basso"
                className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => duplicateSection(section)}
                title="Duplica Sezione"
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => deleteSection(section.id)}
                title="Elimina Sezione"
                className="p-1 text-stone-400 hover:text-red-600 ml-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Section Modal with Tabs: Template vs Custom Catalog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                Aggiungi Sezione al Sito
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Category Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalTab('template')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  modalTab === 'template' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Moduli Template ({template.name})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('custom')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalTab === 'custom' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Moduli Salvati ({storedCustomComponents.length})</span>
              </button>
            </div>

            {modalTab === 'template' ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {template.supportedSections
                  .filter((sec) => sec !== 'custom_component')
                  .map((secType) => (
                    <button
                      key={secType}
                      type="button"
                      onClick={() =>
                        addSectionFromCatalog(
                          secType,
                          secType.charAt(0).toUpperCase() + secType.slice(1)
                        )
                      }
                      className="w-full p-3 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 text-left transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-stone-900 capitalize">
                          {secType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-mono">
                          Modulo base di {template.name}
                        </span>
                      </div>
                      <Plus className="w-4 h-4 text-stone-700" />
                    </button>
                  ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {storedCustomComponents.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500">
                    Nessun componente personalizzato ancora salvato.
                  </div>
                ) : (
                  storedCustomComponents.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3 rounded-xl border border-stone-200 hover:border-stone-900 text-left transition-colors flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900 truncate">
                            {comp.name}
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                            {comp.layoutType}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {comp.subtitle || comp.title}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addCustomComponentToSite(comp)}
                        className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Aggiungi</span>
                      </button>
                    </div>
                  ))
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsAiAssistantOpen(true);
                    }}
                    className="w-full py-2.5 px-3 border border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-semibold text-amber-900 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Genera un nuovo componente con l'Assistente AI</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsAiAssistantOpen(true);
                }}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apri Assistente AI</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Component Assistant Modal */}
      <AiComponentAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        currentSite={site}
        onInsertToSite={addCustomComponentToSite}
      />
    </div>
  );
};
